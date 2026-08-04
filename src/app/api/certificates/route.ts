import { NextRequest, NextResponse } from "next/server"
import { sql } from "../../../lib/db"

export async function GET() {
  try {
    const categories = await sql`SELECT * FROM certificate_category ORDER BY id ASC`
    
    // Fetch certificates with their assigned category IDs and Names aggregated into arrays
    const certificates = await sql`
      SELECT 
        c.id, 
        c.name, 
        c.description, 
        c.image, 
        c.issued_by, 
        c.date, 
        c.credential_url,
        COALESCE(ARRAY_AGG(cat.id) FILTER (WHERE cat.id IS NOT NULL), '{}') AS category_ids,
        COALESCE(ARRAY_AGG(cat.name) FILTER (WHERE cat.name IS NOT NULL), '{}') AS category_names
      FROM certificates c
      LEFT JOIN certificate_category_junction ccj ON c.id = ccj.certificate_id
      LEFT JOIN certificate_category cat ON ccj.category_id = cat.id
      GROUP BY c.id
      ORDER BY c.id DESC
    `
    return NextResponse.json({ categories, certificates })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Handle Category Actions
    if (body.type === "category") {
      const [newCat] = await sql`
        INSERT INTO certificate_category (name) 
        VALUES (${body.name}) 
        ON CONFLICT (name) DO NOTHING 
        RETURNING *
      `
      return NextResponse.json({ success: true, category: newCat })
    }

    // Handle Certificate Creation
    const [cert] = await sql`
      INSERT INTO certificates (name, description, image, issued_by, date, credential_url)
      VALUES (${body.name}, ${body.description}, ${body.image}, ${body.issued_by}, ${body.date}, ${body.credential_url})
      RETURNING id
    `

    // Insert Category Junction Links
    if (body.category_ids && body.category_ids.length > 0) {
      for (const catId of body.category_ids) {
        await sql`
          INSERT INTO certificate_category_junction (certificate_id, category_id)
          VALUES (${cert.id}, ${catId})
        `
      }
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()

    // Handle Editing Category Name
    if (body.type === "category") {
      await sql`
        UPDATE certificate_category 
        SET name = ${body.name} 
        WHERE id = ${body.id}
      `
      return NextResponse.json({ success: true })
    }

    // Handle Updating Certificate
    await sql`
      UPDATE certificates SET 
        name = ${body.name},
        description = ${body.description},
        image = ${body.image},
        issued_by = ${body.issued_by},
        date = ${body.date},
        credential_url = ${body.credential_url}
      WHERE id = ${body.id}
    `

    // Reset Junction Links for this certificate
    await sql`DELETE FROM certificate_category_junction WHERE certificate_id = ${body.id}`

    if (body.category_ids && body.category_ids.length > 0) {
      for (const catId of body.category_ids) {
        await sql`
          INSERT INTO certificate_category_junction (certificate_id, category_id)
          VALUES (${body.id}, ${catId})
        `
      }
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
      await sql`DELETE FROM certificate_category WHERE id = ${id}`
    } else {
      await sql`DELETE FROM certificates WHERE id = ${id}`
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}