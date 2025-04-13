import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { StudentFilesService } from './student-files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('students/:id/files')
export class StudentFilesController {
  constructor(private service: StudentFilesService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, unique + extname(file.originalname));
        },
      }),
    }),
  )
  async uploadFile(
    @Param('id') studentId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const url = `/uploads/${file.filename}`;
    return this.service.saveFile(file.originalname, url, studentId);
  }

  @Get()
  getFiles(@Param('id') studentId: string) {
    return this.service.getFilesForStudent(studentId);
  }

  @Delete('/:fileId')
  deleteFile(@Param('fileId') fileId: string) {
    return this.service.deleteFile(fileId);
  }
}
