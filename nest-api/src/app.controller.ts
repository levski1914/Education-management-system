import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { timestamp } from 'rxjs';

@Controller('health')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("status")
  getStatus(){
    return {
      status:"ok",
      message:"Сървърът е активен",
      timestamp:new Date().toISOString()
    }
  }
}
