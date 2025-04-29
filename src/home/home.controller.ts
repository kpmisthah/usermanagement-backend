import { Controller, Get } from '@nestjs/common';

@Controller('home')
export class HomeController {
    @Get('/')
    async getHomePage(){
        return "Welcome to home page"
    }
}
