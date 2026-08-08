import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(
      process.cwd(),
      "app",
      "images",
      "College-Authorization-letter-SIH2026.docx"
    );

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "Authorization letter template not found" }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition":
          'attachment; filename="College-Authorization-letter-SIH2026.docx"',
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error("Failed to serve authorization letter template:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
