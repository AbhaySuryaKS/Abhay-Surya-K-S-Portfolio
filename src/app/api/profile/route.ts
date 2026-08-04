import { NextRequest, NextResponse } from "next/server"
import { sql } from "../../../lib/db"

export async function GET() {
  try {
    const profileRows = await sql`SELECT * FROM profile WHERE id = 1 LIMIT 1`
    const statsRows = await sql`SELECT * FROM stats ORDER BY sort_order ASC`
    const linksRows = await sql`SELECT * FROM links`

    const p = profileRows[0] || {}

    return NextResponse.json({
      greeting: p.greeting || "",
      name: p.name || "",
      role: p.role || "",
      location: p.location || "",
      availability: p.availability || "",
      profileImage: p.profile_image || "",
      resumePdf: p.resume_pdf || "",
      bio: p.bio || "",
      links: linksRows.map((l: any) => ({
        id: l.id,
        name: l.name,
        value: l.value,
        icon_svg: l.icon_svg || "",
      })),
      stats: statsRows.map((s: any) => ({
        id: s.id,
        value: s.value,
        label: s.label,
        sort_order: s.sort_order,
      })),
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json()

    await sql`
      INSERT INTO profile (id, greeting, name, role, location, bio, availability, profile_image, resume_pdf, updated_at)
      VALUES (1, ${data.greeting}, ${data.name}, ${data.role}, ${data.location}, ${data.bio}, ${data.availability}, ${data.profileImage}, ${data.resumePdf}, NOW())
      ON CONFLICT (id) DO UPDATE SET
        greeting = EXCLUDED.greeting,
        name = EXCLUDED.name,
        role = EXCLUDED.role,
        location = EXCLUDED.location,
        bio = EXCLUDED.bio,
        availability = EXCLUDED.availability,
        profile_image = EXCLUDED.profile_image,
        resume_pdf = EXCLUDED.resume_pdf,
        updated_at = NOW()
    `

    await sql`DELETE FROM links`
    for (const link of data.links) {
      if (link.name && link.value) {
        await sql`INSERT INTO links (name, value, icon_svg) VALUES (${link.name}, ${link.value}, ${link.icon_svg})`
      }
    }

    await sql`DELETE FROM stats`
    for (let i = 0; i < data.stats.length; i++) {
      const s = data.stats[i]
      if (s.value && s.label) {
        await sql`INSERT INTO stats (value, label, sort_order) VALUES (${s.value}, ${s.label}, ${i})`
      }
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}