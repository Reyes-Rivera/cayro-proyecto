import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import * as cookie from 'cookie'; // Importar para leer cookies

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    // Extraer el token desde las cookies
    const token = this.extractTokenFromCookie(request);
    if (!token) {
      throw new UnauthorizedException('Token no encontrado');
    }

    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        {
          secret: "fhf fhslxo ahs", 
        }
      );
      
      // Guardar el payload en el request para su uso posterior
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('Token inválido');
    }

    return true;
  }

  private extractTokenFromCookie(request: Request): string | undefined {
    const cookies = request.headers.cookie;

    // Si no hay cookies, devuelve undefined
    if (!cookies) {
      return undefined;
    }

    // Parsear las cookies y buscar el token
    const parsedCookies = cookie.parse(cookies);
    return parsedCookies['token']; // El nombre de la cookie con el JWT
  }
}
