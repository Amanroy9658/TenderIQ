import { Injectable } from '@nestjs/common';
import { StorageProvider } from './storage.provider';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class LocalFileSystemStorage implements StorageProvider {
  private readonly storagePath: string;

  constructor() {
    this.storagePath = path.join(process.cwd(), 'uploads');
    // Ensure the uploads directory exists
    fs.mkdir(this.storagePath, { recursive: true }).catch(console.error);
  }

  async saveFile(filename: string, buffer: Buffer): Promise<string> {
    // Generate a unique filename to prevent collisions
    const uniqueFilename = `${Date.now()}-${filename}`;
    const filePath = path.join(this.storagePath, uniqueFilename);
    await fs.writeFile(filePath, buffer);
    // Return relative path for local development
    return `/uploads/${uniqueFilename}`;
  }

  async getFile(fileUrl: string): Promise<Buffer> {
    const filename = fileUrl.replace('/uploads/', '');
    const filePath = path.join(this.storagePath, filename);
    return fs.readFile(filePath);
  }
}
