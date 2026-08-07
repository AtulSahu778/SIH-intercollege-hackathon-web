import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "app", "images", "SIH2025-IDEA-Presentation-Format.pptx");

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "Template file not found" }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "Content-Disposition": 'attachment; filename="SIH2025-IDEA-Presentation-Format.pptx"',
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error("Failed to serve presentation template:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
