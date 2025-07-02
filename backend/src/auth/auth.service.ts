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
          <style>
              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
              
              * {
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
              }
              
              body {
                  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                  line-height: 1.6;
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  min-height: 100vh;
                  padding: 20px 0;
              }
              
              .email-container {
                  max-width: 600px;
                  margin: 0 auto;
                  background: #ffffff;
                  border-radius: 16px;
                  overflow: hidden;
                  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
              }
              
              .header {
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  padding: 40px 30px;
                  text-align: center;
                  position: relative;
              }
              
              .header::before {
                  content: '';
                  position: absolute;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="10" cy="60" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
              }
              
              .logo-container {
                  position: relative;
                  z-index: 1;
                  margin-bottom: 20px;
              }
              
              .logo {
                  max-width: 120px;
                  height: auto;
                  filter: brightness(0) invert(1);
              }
              
              .header-title {
                  color: #ffffff;
                  font-size: 28px;
                  font-weight: 700;
                  margin: 0;
                  position: relative;
                  z-index: 1;
              }
              
              .content {
                  padding: 50px 40px;
                  background: #ffffff;
              }
              
              .verification-card {
                  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
                  border-radius: 12px;
                  padding: 30px;
                  text-align: center;
                  margin: 30px 0;
                  border: 1px solid #e2e8f0;
              }
              
              .verification-icon {
                  width: 60px;
                  height: 60px;
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  margin: 0 auto 20px;
                  box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
              }
              
              .verification-code {
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  color: #ffffff;
                  padding: 20px 30px;
                  border-radius: 12px;
                  font-size: 32px;
                  font-weight: 700;
                  letter-spacing: 8px;
                  margin: 25px 0;
                  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
                  position: relative;
                  overflow: hidden;
              }
              
              .verification-code::before {
                  content: '';
                  position: absolute;
                  top: 0;
                  left: -100%;
                  width: 100%;
                  height: 100%;
                  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                  animation: shimmer 2s infinite;
              }
              
              @keyframes shimmer {
                  0% { left: -100%; }
                  100% { left: 100%; }
              }
              
              .main-text {
                  color: #334155;
                  font-size: 18px;
                  font-weight: 500;
                  margin-bottom: 15px;
              }
              
              .secondary-text {
                  color: #64748b;
                  font-size: 16px;
                  margin-bottom: 12px;
              }
              
              .warning-box {
                  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
                  border: 1px solid #f59e0b;
                  border-radius: 8px;
                  padding: 20px;
                  margin: 25px 0;
                  display: flex;
                  align-items: flex-start;
                  gap: 12px;
              }
              
              .warning-icon {
                  width: 20px;
                  height: 20px;
                  background: #f59e0b;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  flex-shrink: 0;
                  margin-top: 2px;
              }
              
              .timer-container {
                  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
                  border: 1px solid #f87171;
                  border-radius: 8px;
                  padding: 15px 20px;
                  margin: 20px 0;
                  text-align: center;
              }
              
              .timer-text {
                  color: #dc2626;
                  font-weight: 600;
                  font-size: 14px;
              }
              
              .signature {
                  margin-top: 40px;
                  padding-top: 30px;
                  border-top: 2px solid #e2e8f0;
                  color: #475569;
                  font-weight: 500;
              }
              
              .footer {
                  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
                  padding: 30px;
                  text-align: center;
                  color: #cbd5e1;
              }
              
              .copyright {
                  font-size: 14px;
                  opacity: 0.8;
              }
              
              /* Responsive Design */
              @media (max-width: 640px) {
                  .email-container {
                      margin: 10px;
                      border-radius: 12px;
                  }
                  
                  .header {
                      padding: 30px 20px;
                  }
                  
                  .header-title {
                      font-size: 24px;
                  }
                  
                  .content {
                      padding: 30px 20px;
                  }
                  
                  .verification-card {
                      padding: 20px;
                  }
                  
                  .verification-code {
                      font-size: 24px;
                      letter-spacing: 4px;
                      padding: 15px 20px;
                  }
                  
                  .main-text {
                      font-size: 16px;
                  }
                  
                  .footer {
                      padding: 20px;
                  }
              }
          </style>
      </head>
      <body>
          <div class="email-container">
              <!-- Header -->
              <div class="header">
                  <div class="logo-container">
                      <img src="${companyInfo.logoUrl}" alt="Logo" class="logo">
                  </div>
                  <h1 class="header-title">${dataConfig?.title || 'Verificación de Cuenta'}</h1>
              </div>
              
              <!-- Main Content -->
              <div class="content">
                  <p class="main-text">${dataConfig?.greeting || 'Estimado usuario,'}</p>
                  
                  <p class="secondary-text">${dataConfig?.maininstruction || 'Utilice el siguiente código para verificar su cuenta:'}</p>
                  
                  <!-- Verification Card -->
                  <div class="verification-card">
                      <div class="verification-icon">
                          <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
                              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                              <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" fill="none"/>
                          </svg>
                      </div>
                      
                      <div class="verification-code">
                          ${verificationCode}
                      </div>
                      
                      <p style="color: #64748b; font-size: 14px; margin: 0;">
                          Código de verificación
                      </p>
                  </div>
                  
                  <!-- Timer Warning -->
                  <div class="timer-container">
                      <div class="timer-text">
                          ⏰ ${dataConfig?.expirationtime || `Este código expira en ${timeToken} minutos`}
                      </div>
                  </div>
                  
                  <p class="secondary-text">${dataConfig?.secondaryinstruction || 'Este código es válido por un tiempo limitado.'}</p>
                  
                  <!-- Warning Box -->
                  <div class="warning-box">
                      <div class="warning-icon">
                          <svg width="12" height="12" fill="white" viewBox="0 0 24 24">
                              <path d="M12 2L2 22h20L12 2zm0 6v6m0 2v2"/>
                          </svg>
                      </div>
                      <div>
                          <p style="color: #92400e; font-size: 14px; margin: 0;">
                              <strong>Importante:</strong> ${dataConfig?.finalMessage || 'Si no solicitó este código, por favor ignore este mensaje.'}
                          </p>
                      </div>
                  </div>
                  
                  <!-- Signature -->
                  <div class="signature">
                      <p>${dataConfig?.signature || 'Atentamente, el equipo de soporte'}</p>
                  </div>
              </div>
              
              <!-- Footer -->
              <div class="footer">
                  <div class="copyright">
                      © ${currentYear} ${companyInfo.title || 'Cayro Uniformes'}. Todos los derechos reservados.
                  </div>
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
  async refresh(userId: number, refreshToken: string, email: string) {
    // Buscar usuario o empleado
    const user = await this.prismaService.user.findUnique({
      where: { id: +userId, email },
    });
    const employee = !user
      ? await this.prismaService.employee.findUnique({
          where: { id: +userId, email },
        })
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
          active: true,
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
        expiresIn: '15m',
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
      if (error instanceof HttpException) {
        throw error;
      }
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
