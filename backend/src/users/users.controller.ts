import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { PasswordUpdate, UpdateUserDto } from './dto/update-user.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/auth/roles/role.enum';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post("resend-code")
  async reSendCode(@Body() body: {email:string}) {
    const {email} = body;
    return this.usersService.sendCode(email);
  }

  @Post("verify-code")
  async verifyCode(@Body() body:{email:string,code:string}) {
    const {email,code} = body;
    return this.usersService.verifyCode(email,code)
  }
  @Auth([Role.USER])
  @Patch("change-password/:id")
  async changePassword(@Param("id")id:string, @Body()updatePass:PasswordUpdate ) {
    return this.usersService.updatePassword(id,updatePass);
  }

  @Post("recover-password")
  async recoverPassword( @Body() body:{email:string}) {
    const {email} = body;
    return this.usersService.recoverPassword(email);
  }

  @Post("reset-password/:token")
  async restorePassword(@Param("token")token:any, @Body() body:{password:string}) {
    const {password} = body;
    return this.usersService.restorePassword(password,token);
  }

  @Post('lock')
async lockUser(@Body() body: {  days: number,email: string; }){
  const { email, days } = body;
  const res = await this.usersService.blockUser(days,email);
  return res;
}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
