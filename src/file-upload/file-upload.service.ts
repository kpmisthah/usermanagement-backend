import { BadRequestException, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as mime from 'mime-types';
@Injectable()
export class FileUploadService {
  handleFileUpload(file: Express.Multer.File) {
    if(!file){
      throw new BadRequestException('no file uploaded')
    }
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'application/pdf'
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('invalid file type');
    }
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('file is too large!');
    }
    
    // Convert buffer to base64
    const base64Image = file.buffer.toString('base64');
    const dataUrl = `data:${file.mimetype};base64,${base64Image}`;
    
    return {
      message: 'File uploaded successfully',
      filePath: null, 
      base64: dataUrl, 
    };
  }
}
//The service processes the file and returns a response with the file’s path.