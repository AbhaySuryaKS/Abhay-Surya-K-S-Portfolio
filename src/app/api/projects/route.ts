import { NextRequest, NextResponse } from "next/server"
import { sql } from "../../../lib/db"

export async function GET() {
  try {
    const categories = await sql`SELECT * FROM project_category ORDER BY name ASC`
    const skills = await sql`SELECT id, name FROM skills ORDER BY name ASC`

    const projects = await sql`
      SELECT 
        p.id, 
        p.title, 
        p.description, 
        p.full_description, 
        p.image, 
        p.github_url, 
        p.live_url,
        COALESCE(ARRAY_AGG(DISTINCT pcj.category_id) FILTER (WHERE pcj.category_id IS NOT NULL), '{}') as category_ids,
        COALESCE(ARRAY_AGG(DISTINCT pc.name) FILTER (WHERE pc.name IS NOT NULL), '{}') as category_names,
        COALESCE(ARRAY_AGG(DISTINCT st.skill_id) FILTER (WHERE st.skill_id IS NOT NULL), '{}') as selected_skill_ids
      FROM projects p
      LEFT JOIN project_category_junction pcj ON p.id = pcj.project_id
      LEFT JOIN project_category pc ON pcj.category_id = pc.id
      LEFT JOIN stack st ON p.id = st.project_id
      GROUP BY p.id
      ORDER BY p.id DESC
    `

    return NextResponse.json({ categories, projects, availableSkills: skills })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Handle Project Category Creation
    if (body.type === "category") {
      await sql`INSERT INTO project_category (name) VALUES (${body.name}) ON CONFLICT DO NOTHING`
      return NextResponse.json({ success: true })
    }

    // Handle Project Creation
    const inserted = await sql`
      INSERT INTO projects (title, description, full_description, image, github_url, live_url)
      VALUES (${body.title}, ${body.description}, ${body.full_description}, ${body.image}, ${body.github_url}, ${body.live_url})
      RETURNING id
    `
    const projectId = inserted[0].id

    // Insert linked project categories
    for (const catId of body.category_ids || []) {
      await sql`
        INSERT INTO project_category_junction (project_id, category_id) 
        VALUES (${projectId}, ${catId}) 
        ON CONFLICT DO NOTHING
      `
    }

    // Insert linked skill tech stack
    for (const skillId of body.selectedSkillIds || []) {
      await sql`
        INSERT INTO stack (project_id, skill_id) 
        VALUES (${projectId}, ${skillId}) 
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

    // Handle Project Category Update
    if (body.type === "category") {
      await sql`UPDATE project_category SET name = ${body.name} WHERE id = ${body.id}`
      return NextResponse.json({ success: true })
    }

    // Handle Project Update
    await sql`
      UPDATE projects 
      SET 
        title = ${body.title},
        description = ${body.description},
        full_description = ${body.full_description},
        image = ${body.image},
        github_url = ${body.github_url},
        live_url = ${body.live_url}
      WHERE id = ${body.id}
    `

    // Re-sync Project Categories Junction
    await sql`DELETE FROM project_category_junction WHERE project_id = ${body.id}`
    for (const catId of body.category_ids || []) {
      await sql`
        INSERT INTO project_category_junction (project_id, category_id) 
        VALUES (${body.id}, ${catId}) 
        ON CONFLICT DO NOTHING
      `
    }

    // Re-sync Tech Stack Junction
    await sql`DELETE FROM stack WHERE project_id = ${body.id}`
    for (const skillId of body.selectedSkillIds || []) {
      await sql`
        INSERT INTO stack (project_id, skill_id) 
        VALUES (${body.id}, ${skillId}) 
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
      await sql`DELETE FROM project_category WHERE id = ${id}`
    } else {
      await sql`DELETE FROM projects WHERE id = ${id}`
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}