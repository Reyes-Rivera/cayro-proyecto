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
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-auth.dto';
import { Request, Response } from 'express';
import * as cookie from 'cookie';
import { AuthGuard } from './auth.guard';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private jwtSvc: JwtService,
    private readonly authService: AuthService,
  ) {}

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

    // Guardar refreshToken en cookie segura
    res.setHeader(
      'Set-Cookie',
      cookie.serialize('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 60 * 60 * 24 * 7, // 7 días
        path: '/',
      }),
    );

    // Retornar accessToken en el cuerpo
    return {
      accessToken: result.accessToken,
      user: result.user,
    };
  }
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies['refreshToken'];

    if (!refreshToken) {
      throw new UnauthorizedException('No se encontró el refresh token');
    }

    let userId: number;
    let email: string;
    try {
      const payload = this.jwtSvc.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      userId = payload.sub;
      email = payload.email;
    } catch (err) {
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }

    const result = await this.authService.refresh(userId, refreshToken,email);

    // Renovar la cookie con nuevo refreshToken
    // res.setHeader(
    //   'Set-Cookie',
    //   cookie.serialize('refreshToken', result.refreshToken, {
    //     httpOnly: true,
    //     secure: process.env.NODE_ENV === 'production',
    //     sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    //     maxAge: 60 * 60 * 24 * 30,
    //     path: '/',
    //   }),
    // );

    return {
      accessToken: result.accessToken,
    };
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

  // @Post('logout')
  // logout(@Res() res: Response) {
  //   res.clearCookie('token', {
  //     httpOnly: true,
  //     secure: process.env.NODE_ENV === 'production', // Usar "secure" en producción
  //     sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  //     path: '/',
  //   });

  //   return res.status(200).json({ message: 'Sesión cerrada exitosamente' });
  // }
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies['refreshToken'];

    if (refreshToken) {
      try {
        const payload = this.jwtSvc.verify(refreshToken, {
          secret: process.env.JWT_REFRESH_SECRET,
        });
        await this.authService.logout(payload.sub); // Borra el refreshToken de DB
      } catch (err) {
        // Silenciar error si token ya expiró
      }
    }

    // Borrar cookie
    res.setHeader(
      'Set-Cookie',
      cookie.serialize('refreshToken', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 0,
        path: '/',
      }),
    );

    return { message: 'Sesión cerrada correctamente' };
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
