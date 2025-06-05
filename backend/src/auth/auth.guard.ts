import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import * as cookie from 'cookie';
import { AppLogger } from 'src/utils/logger.service';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private readonly logger: AppLogger
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    // Intenta extraer accessToken de header Authorization o cookies
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('Token no encontrado');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_ACCESS_SECRET, // usa el secreto del access token
      });
      request['user'] = payload;
      return true;
    } catch (error) {
      this.logger.error('Token no válido', error.stack);
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }

  private extractToken(request: Request): string | undefined {
    // Buscar token en header Authorization Bearer
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.split(' ')[1];
    }

    // Si no está en header, buscar en cookies (puede que uses cookie para accessToken)
    const cookies = request.headers.cookie;
    if (!cookies) return undefined;

    const parsedCookies = cookie.parse(cookies);
    return parsedCookies['accessToken']; // o 'token' si usas ese nombre
  }
}
