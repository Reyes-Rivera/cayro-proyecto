import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-auth.dto';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(loginDto);
    return result;
  }

  @Post("verify-code")
  async verifyCode(@Body() body:{email:string,code:string}) {
    const {email,code} = body;
    return this.authService.verifyCode(email,code)
  }

  
  @Post("resend-code")
  async reSendCode(@Body() body: {email:string}) {
    const {email} = body;
    return this.authService.sendCode(email);
  }
  
}
