import { NextRequest, NextResponse } from "next/server"
import { sql } from "../../../lib/db"

export async function GET() {
  try {
    const categories = await sql`SELECT * FROM skill_category ORDER BY name ASC`

    const skills = await sql`
      SELECT 
        s.id, 
        s.name, 
        s.icon_svg,
        COALESCE(ARRAY_AGG(DISTINCT scj.category_id) FILTER (WHERE scj.category_id IS NOT NULL), '{}') as category_ids,
        COALESCE(ARRAY_AGG(DISTINCT sc.name) FILTER (WHERE sc.name IS NOT NULL), '{}') as category_names
      FROM skills s
      LEFT JOIN skill_category_junction scj ON s.id = scj.skill_id
      LEFT JOIN skill_category sc ON scj.category_id = sc.id
      GROUP BY s.id
      ORDER BY s.id DESC
    `

    return NextResponse.json({ categories, skills })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Handle Category Creation
    if (body.type === "category") {
      await sql`INSERT INTO skill_category (name) VALUES (${body.name}) ON CONFLICT DO NOTHING`
      return NextResponse.json({ success: true })
    }

    // Handle Skill Creation
    const inserted = await sql`
      INSERT INTO skills (name, icon_svg)
      VALUES (${body.name}, ${body.icon_svg})
      RETURNING id
    `
    const skillId = inserted[0].id

    // Insert linked categories into junction table
    for (const catId of body.category_ids || []) {
      await sql`
        INSERT INTO skill_category_junction (skill_id, category_id) 
        VALUES (${skillId}, ${catId}) 
        ON CONFLICT DO NOTHING
      `
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()

    // Handle Category Update
    if (body.type === "category") {
      await sql`UPDATE skill_category SET name = ${body.name} WHERE id = ${body.id}`
      return NextResponse.json({ success: true })
    }

    // Handle Skill Update
    await sql`UPDATE skills SET name = ${body.name}, icon_svg = ${body.icon_svg} WHERE id = ${body.id}`

    // Re-sync Skill Categories Junction
    await sql`DELETE FROM skill_category_junction WHERE skill_id = ${body.id}`
    for (const catId of body.category_ids || []) {
      await sql`
        INSERT INTO skill_category_junction (skill_id, category_id) 
        VALUES (${body.id}, ${catId}) 
        ON CONFLICT DO NOTHING
      `
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    const type = searchParams.get("type")

    if (type === "category") {
      await sql`DELETE FROM skill_category WHERE id = ${id}`
    } else {
      await sql`DELETE FROM skills WHERE id = ${id}`
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}