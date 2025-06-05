import {
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Role } from './roles/role.enum';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';
import { PrismaService } from 'src/prisma/prisma.service';
import { JsonValue } from '@prisma/client/runtime/library';
import { AppLogger } from 'src/utils/logger.service';

type UserOrEmployee = {
  id: number;
  name: string;
  surname: string;
  email: string;
  phone: string;
  birthdate: Date;
  password: string;
  passwordSetAt: Date;
  passwordExpiresAt: Date | null;
  passwordsHistory: JsonValue | null;
  role: string;
  lockUntil: Date | null;
  loginAttempts: number;
};

@Injectable()
export class AuthService {
  private codes = new Map<string, { code: string; expires: number }>();

  constructor(
    private jwtSvc: JwtService,
    private prismaService: PrismaService,
    private readonly logger: AppLogger,
  ) {
    this.logger.log({
      message: 'Servicio de autenticación inicializado',
      context: 'AuthService',
    });
  }

  async sendEmail(
    correo: string,
    subject: string,
    html: string,
  ): Promise<void> {
    try {
      this.logger.log({
        message: 'Preparando envío de correo electrónico',
        email: correo,
      });

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'cayrouniformes38@gmail.com',
          pass: 'qewd ahzb vplo arua',
        },
      });

      const mailOptions = {
        from: 'cayrouniformes38@gmail.com',
        to: correo,
        subject: subject,
        html: html,
      };

      await transporter.sendMail(mailOptions);
      this.logger.log({
        message: 'Correo electrónico enviado con éxito',
        email: correo,
        subject: subject,
      });
    } catch (error) {
      this.logger.error({
        message: 'Error al enviar el correo electrónico',
        error: error.message,
        stack: error.stack,
        email: correo,
      });
      throw new InternalServerErrorException(
        'Error al enviar el correo electrónico',
      );
    }
  }

  async verifyCode(
    userEmail: string,
    code: string,
  ): Promise<{ user: any; token: string }> {
    try {
      this.logger.log({
        message: 'Iniciando verificación de código',
        email: userEmail,
      });

      const record = this.codes.get(userEmail);
      if (!record) {
        this.logger.warn({
          message: 'No se encontró código de verificación para el usuario',
          email: userEmail,
        });
        throw new ConflictException('Código no encontrado o expirado');
      }

      let userFound: UserOrEmployee | null =
        await this.prismaService.user.findUnique({
          where: { email: userEmail, active: true },
        });

      if (!userFound) {
        userFound = await this.prismaService.employee.findUnique({
          where: { email: userEmail },
        });
        if (!userFound) {
          this.logger.warn({
            message: 'Usuario no encontrado en la base de datos',
            email: userEmail,
          });
          throw new NotFoundException('Usuario no registrado');
        }
      }

      if (record.expires < Date.now()) {
        this.logger.warn({
          message: 'Código de verificación expirado',
          email: userEmail,
          expiration: new Date(record.expires),
        });
        throw new ConflictException('El código ha expirado');
      }

      if (record.code !== code) {
        this.logger.warn({
          message: 'Código de verificación incorrecto',
          email: userEmail,
        });
        throw new ConflictException('Código incorrecto');
      }

      this.codes.delete(userEmail);
      this.logger.log({
        message: 'Código verificado correctamente',
        email: userEmail,
      });

      let expiresIn: string;
      switch (userFound.role) {
        case Role.ADMIN:
          expiresIn = '8h';
          break;
        case Role.USER:
          expiresIn = '1d';
          break;
        case Role.EMPLOYEE:
          expiresIn = '4h';
          break;
        default:
          expiresIn = '1h';
      }

      const payload = {
        sub: userFound.id,
        role: userFound.role,
        email: userFound.email,
      };

      const token = this.jwtSvc.sign(payload, { expiresIn });
      this.logger.log({
        message: 'Token JWT generado exitosamente',
        userId: userFound.id,
        role: userFound.role,
      });

      return {
        user: {
          id: userFound.id,
          name: userFound.name,
          surname: userFound.surname,
          email: userFound.email,
          phone: userFound.phone,
          birthdate: userFound.birthdate,
          role: userFound.role,
        },
        token,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error({
        message: 'Error durante la verificación del código',
        error: error.message,
        stack: error.stack,
        email: userEmail,
      });
      throw new InternalServerErrorException('Error interno del servidor');
    }
  }

  async sendCode(email: string): Promise<{ message: string }> {
    try {
      this.logger.log({
        message: 'Solicitud de envío de código de verificación',
        email,
      });

      const configInfo = await this.prismaService.configuration.findFirst();
      if (!configInfo) {
        this.logger.error({
          message: 'Configuración del sistema no encontrada',
        });
        throw new InternalServerErrorException(
          'Configuración del sistema no disponible',
        );
      }

      const timeToken = configInfo.timeTokenEmail;
      const dataConfig = configInfo.emailVerificationInfo?.[0];
      const expirationTime = Date.now() + timeToken * 60000;
      const verificationCode = crypto.randomInt(100000, 999999).toString();

      this.codes.set(email, {
        code: verificationCode,
        expires: expirationTime,
      });

      this.logger.log({
        message: 'Código de verificación generado',
        email,
        expiration: new Date(expirationTime),
      });

      const companyInfo = await this.prismaService.companyProfile.findFirst();
      if (!companyInfo) {
        this.logger.error({
          message: 'Información de la compañía no encontrada',
        });
        throw new InternalServerErrorException(
          'Información de la compañía no disponible',
        );
      }

      const currentYear = new Date().getFullYear();
      const html = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verificación de Cuenta</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <img src="${companyInfo.logoUrl}" alt="Logo" style="max-width: 150px;">
                </div>
                <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px;">
                    <h1 style="color: #333;">${dataConfig?.title || 'Verificación de cuenta'}</h1>
                    <p>${dataConfig?.greeting || 'Estimado usuario,'}</p>
                    <p>${dataConfig?.maininstruction || 'Utilice el siguiente código para verificar su cuenta:'}</p>
                    <div style="background-color: #e9e9e9; padding: 10px; text-align: center; margin: 20px 0; font-size: 24px; font-weight: bold;">
                        ${verificationCode}
                    </div>
                    <p>${dataConfig?.secondaryinstruction || 'Este código es válido por un tiempo limitado.'}</p>
                    <p>${dataConfig?.expirationtime || `Expira en ${timeToken} minutos.`}</p>
                    <p>${dataConfig?.finalMessage || 'Si no solicitó este código, por favor ignore este mensaje.'}</p>
                    <p style="margin-top: 30px;">${dataConfig?.signature || 'Atentamente, el equipo de soporte'}</p>
                </div>
                <div style="margin-top: 20px; padding: 10px; background-color: #333; color: #fff; text-align: center;">
                    <p>© ${currentYear} ${companyInfo.title || 'Cayro Uniformes'}. Todos los derechos reservados.</p>
                </div>
            </div>
        </body>
        </html>
      `;

      await this.sendEmail(email, 'Código de verificación', html);
      this.logger.log({
        message: 'Correo con código de verificación enviado',
        email,
      });

      return { message: 'Código de verificación enviado correctamente' };
    } catch (error) {
      this.logger.error({
        message: 'Error al enviar el código de verificación',
        error: error.message,
        stack: error.stack,
        email,
      });
      throw new InternalServerErrorException('Error al procesar la solicitud');
    }
  }



  async logout(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: +userId },
    });
    const employee = !user
      ? await this.prismaService.employee.findUnique({ where: { id: +userId } })
      : null;

    if (!user && !employee) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const entity = user || employee;
    const updateData = { refreshToken: null };

    if (entity.role === Role.USER) {
      await this.prismaService.user.update({
        where: { id: entity.id },
        data: updateData,
      });
    } else {
      await this.prismaService.employee.update({
        where: { id: entity.id },
        data: updateData,
      });
    }

    return { message: 'Sesión cerrada correctamente' };
  }
  async refresh(userId: number, refreshToken: string,email:string) {
    // Buscar usuario o empleado
    const user = await this.prismaService.user.findUnique({ where: { id: +userId, email } });
    const employee = !user
      ? await this.prismaService.employee.findUnique({ where: { id: +userId,email } })
      : null;

    const entity = user || employee;
    if (!entity || !entity.refreshToken) {
      throw new UnauthorizedException('Refresh token inválido.');
    }

    // Comparar refresh token
    const isMatch = await bcrypt.compare(refreshToken, entity.refreshToken);
    if (!isMatch) {
      throw new UnauthorizedException('Refresh token inválido.');
    }

    const payload = {
      sub: entity.id,
      email: entity.email,
      role: entity.role,
    };

    // Generar nuevos tokens
    const accessToken = this.jwtSvc.sign(payload, {
      expiresIn: '15m',
      secret: process.env.JWT_ACCESS_SECRET,  
    });
    return {
      accessToken,
    };
  }
  async login(
    loginDto: LoginDto,
  ): Promise<{ user: any; accessToken: string; refreshToken: string }> {
    try {
      const configInfo = await this.prismaService.configuration.findFirst();
      if (!configInfo)
        throw new InternalServerErrorException(
          'Configuración del sistema no disponible',
        );

      const user = await this.prismaService.user.findFirst({
        where: {
          OR: [{ email: loginDto.identifier }, { phone: loginDto.identifier }],
        },
      });

      let userFound: UserOrEmployee | null = user;

      if (!userFound) {
        const employee = await this.prismaService.employee.findFirst({
          where: {
            OR: [
              { email: loginDto.identifier },
              { phone: loginDto.identifier },
            ],
            active: true,
          },
        });
        userFound = employee;
        if (!userFound) throw new NotFoundException('Credenciales inválidas');
      }

      if (userFound.lockUntil && userFound.lockUntil > new Date()) {
        const timeDiff = userFound.lockUntil.getTime() - new Date().getTime();
        const minutes = Math.floor(timeDiff / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        const formattedTime =
          minutes > 0
            ? `${minutes} minutos y ${seconds} segundos`
            : `${seconds} segundos`;
        throw new ForbiddenException(
          `Cuenta bloqueada temporalmente. Inténtalo en ${formattedTime}`,
        );
      }

      const isPasswordValid = await bcrypt.compare(
        loginDto.password,
        userFound.password,
      );
      if (!isPasswordValid) {
        const updateData = {
          loginAttempts: (userFound.loginAttempts || 0) + 1,
        };
        const condition = { email: userFound.email, active: true };

        userFound.role === Role.USER
          ? await this.prismaService.user.update({
              where: { email: userFound.email },
              data: updateData,
            })
          : await this.prismaService.employee.update({
              where: condition,
              data: updateData,
            });

        if (updateData.loginAttempts >= configInfo.attemptsLogin) {
          const lockUntil = new Date(Date.now() + 5 * 60 * 1000);
          const lockData = { ...updateData, lockUntil };
          userFound.role === Role.USER
            ? await this.prismaService.user.update({
                where: { email: userFound.email },
                data: lockData,
              })
            : await this.prismaService.employee.update({
                where: condition,
                data: lockData,
              });
        }

        throw new UnauthorizedException('Credenciales inválidas');
      }

      // Reset de intentos
      const resetData = { loginAttempts: 0, lockUntil: null };
      userFound.role === Role.USER
        ? await this.prismaService.user.update({
            where: { email: userFound.email },
            data: resetData,
          })
        : await this.prismaService.employee.update({
            where: { email: userFound.email, active: true },
            data: resetData,
          });

      // Tokens
      const payload = {
        sub: userFound.id,
        email: userFound.email,
        role: userFound.role,
      };

      let tokenExpiry = '1h';
      switch (userFound.role) {
        case Role.ADMIN:
          tokenExpiry = '4h';
          break;
        case Role.USER:
          tokenExpiry = '30d';
          break;
        case Role.EMPLOYEE:
          tokenExpiry = '4h';
          break;
      }

      const accessToken = this.jwtSvc.sign(payload, {
        expiresIn: "15m",
        secret: process.env.JWT_ACCESS_SECRET,
      });
      const refreshToken = this.jwtSvc.sign(payload, {
        expiresIn: tokenExpiry,
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

      userFound.role === Role.USER
        ? await this.prismaService.user.update({
            where: { id: userFound.id },
            data: { refreshToken: hashedRefreshToken },
          })
        : await this.prismaService.employee.update({
            where: { id: userFound.id },
            data: { refreshToken: hashedRefreshToken },
          });

      return {
        user: {
          id: userFound.id,
          name: userFound.name,
          surname: userFound.surname,
          email: userFound.email,
          phone: userFound.phone,
          birthdate: userFound.birthdate,
          role: userFound.role,
        },
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw new InternalServerErrorException('Error durante el login');
    }
  }
  async verifyToken(@Request() request): Promise<any> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id: request.sub, email: request.email },
      });

      const admin = !user
        ? await this.prismaService.employee.findUnique({
            where: { id: request.sub, email: request.email },
          })
        : null;

      const entity = user || admin;
      return {
        id: entity.id,
        name: entity.name,
        surname: entity.surname,
        email: entity.email,
        phone: entity.phone,
        birthdate: entity.birthdate,
        role: entity.role,
        gender: entity.gender,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
