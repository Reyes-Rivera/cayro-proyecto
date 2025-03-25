import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-auth.dto';
import { Request, Response } from 'express';
import * as cookie from 'cookie';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('csrf-token')
  getCsrfToken(@Req() request: Request) {
    return { csrfToken: request.csrfToken() };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(loginDto);
    res.setHeader(
      'Set-Cookie',
      cookie.serialize('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      }),
    );
    return result;
   
  }
  
  @Post('verify-code')
  async verifyCode(
    @Body() body: { email: string; code: string },
    @Res() res: Response,
  ) {
    const { email, code } = body;
    const result = await this.authService.verifyCode(email, code);
    res.setHeader(
      'Set-Cookie',
      cookie.serialize('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      }),
    );
    return res.json(result.user);
  }

  @Post('logout')
  logout(@Res() res: Response) {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Usar "secure" en producción
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
    });

    return res.status(200).json({ message: 'Sesión cerrada exitosamente' });
  }

  @Get('verifyToken')
  @UseGuards(AuthGuard)
  async verifyUser(@Req() request) {
    return this.authService.verifyToken(request.user);
  }

  @Post('resend-code')
  async reSendCode(@Body() body: { email: string }) {
    const { email } = body;
    return this.authService.sendCode(email);
  }
}
