import { Body, Controller, Delete, Get, Param, Post, Put, Query, Search, UseGuards } from '@nestjs/common';
import { AdminGuard } from 'src/guard/admin.guard';
import { AdminService } from './admin.service';
import { JwtGuard } from 'src/guard/jwt.guard';
import { CreateuserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('admin')
export class AdminController {
    constructor(private adminService:AdminService){}
    @UseGuards(JwtGuard,AdminGuard)
    @Get('/get-users')
    async getUsers(@Query('search') search:string){
        console.log('get search query:',search);
        
        return this.adminService.viewUsers(search)
    }
    @Post('/create-user')
    async createUsers(@Body() createUser:CreateuserDto){
        return this.adminService.create(createUser)
    }

    @Put('/update-user/:id')
    async updateUsers(@Param('id') id:number, @Body() updateUser:UpdateUserDto){
        return this.adminService.updateUser(id,updateUser)
    }
    @Delete('/delete/:id')
    async deleteUser(@Param('id') id:number){
        return this.adminService.deleteUser(id)
    }
}
