import fs from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

type ContentTypeImage = {
   [key: string]: string;
};

export async function GET(request: NextRequest) {
   const params = request.nextUrl.searchParams;
   const image = params.get("image");
   if (!image)
      return NextResponse.json({ error: "Image not found" }, { status: 400 });

   try {
      const filePath = path.join(process.cwd(), "public/uploads", image);
      const file = await fs.readFile(filePath);
      const contentTypeMap: ContentTypeImage = {
         ".txt": "text/plain",
         ".html": "text/html",
         ".css": "text/css",
         ".js": "application/javascript",
         ".json": "application/json",
         ".png": "image/png",
         ".jpg": "image/jpg",
         ".JPG": "image/jpeg",
         ".gif": "image/gif",
         ".svg": "image/svg+xml",
         // Add more content types as needed
      };
      const extension = path.extname(filePath).toLowerCase();
      const contentType =
         contentTypeMap[extension] || "application/octet-stream";
      return new Response(file, {
         status: 200,
         headers: { "Content-Type": contentType },
      });
   } catch (error) {
      return NextResponse.json(
         { error: "Failed to read file" },
         { status: 500 }
      );
   }
}
