import mime from "mime";
import { join } from "path";
import { stat, mkdir, writeFile } from "fs/promises";
import * as dateFn from "date-fns";
import { NextRequest, NextResponse } from "next/server";
import { uuid } from "uuidv4";

interface File extends Blob {
  size: number;
  type: string | "application/pdf";
  name: string;
  lastModified: number;
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json(
      { error: "File blob is required." },
      { status: 400 }
    );
  }

  if (file.type !== "application/pdf") {
    return NextResponse.json(
      { error: "Just accept PDF file." },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const relativeUploadDir = `/uploads/${dateFn.format(Date.now(), "dd-MM-y")}`;
  const uploadDir = join(process.cwd(), "public", relativeUploadDir);

  try {
    await stat(uploadDir);
  } catch (e: any) {
    if (e.code === "ENOENT") {
      await mkdir(uploadDir, { recursive: true });
    } else {
      console.error(
        "Error while trying to create directory when uploading a file\n",
        e
      );
      return NextResponse.json(
        { error: "Something went wrong." },
        { status: 500 }
      );
    }
  }

  try {
    // const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    // const filename = `${file.name.replace(
    //   /\.[^/.]+$/,
    //   ""
    // )}-${uniqueSuffix}.${mime.getExtension(file.type)}`;
    const genUUID = uuid();
    const filename = `${genUUID}.${mime.getExtension(file.type)}`;
    await writeFile(`${uploadDir}/${filename}`, buffer);
    return NextResponse.json({
      uuid: genUUID,
      origin: file.name,
      fileUrl: `${relativeUploadDir}/${filename}`,
      type: mime.getExtension(file.type),
    });
  } catch (e) {
    console.error("Error while trying to upload a file\n", e);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
