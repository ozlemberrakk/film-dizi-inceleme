import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const POST = async (req) => {
  const data = await req.formData();
  const file = data.get('file');

  if (!file) {
    return NextResponse.json({ error: 'Dosya bulunamadı' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${Date.now()}-${file.name}`;
  
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filePath = path.join(uploadDir, filename);

  fs.writeFileSync(filePath, buffer);


  const url = `/uploads/${filename}`;

  return NextResponse.json({ url });
};
