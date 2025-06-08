import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AnswerQuestion, CreateUserDto } from './dto/create-user.dto';
import { PasswordUpdate, UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';
import axios from 'axios';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/auth/roles/role.enum';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppLogger } from 'src/utils/logger.service';

type PasswordHistoryEntry = {
  password: string;
  createdAt: string;
};

@Injectable()
export class UsersService {
  private codes = new Map<string, { code: string; expires: number }>();

  constructor(
    private jwtSvc: JwtService,
    private prismaService: PrismaService,
    private readonly logger: AppLogger,
  ) {
    this.logger.log({
      message: 'Servicio de usuarios inicializado',
      context: 'UsersService',
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
        subject: subject,
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

      const dataConfig = configInfo.emailVerificationInfo?.[0];
      const timeToken = configInfo.timeTokenEmail;
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

  async isPasswordCompromised(password: string): Promise<boolean> {
    try {
      this.logger.log({
        message: 'Verificando si la contraseña está comprometida',
      });

      const hashedPassword = crypto
        .createHash('sha1')
        .update(password)
        .digest('hex')
        .toUpperCase();
      const prefix = hashedPassword.slice(0, 5);
      const suffix = hashedPassword.slice(5);

      const response = await axios.get(
        `https://api.pwnedpasswords.com/range/${prefix}`,
      );
      const breachedPasswords = response.data.split('\n');

      for (let entry of breachedPasswords) {
        const [hashSuffix, count] = entry.split(':');
        if (hashSuffix === suffix) {
          this.logger.warn({
            message: 'Contraseña comprometida encontrada',
          });
          return true;
        }
      }
      return false;
    } catch (error) {
      this.logger.error({
        message: 'Error verificando contraseña comprometida',
        error: error.message,
        stack: error.stack,
      });
      return false;
    }
  }

  async verifyCode(userEmail: string, code: string) {
    try {
      this.logger.log({
        message: 'Verificando código de verificación',
        email: userEmail,
      });

      const record = this.codes.get(userEmail);
      const userFound = await this.prismaService.user.findUnique({
        where: { email: userEmail, active: false },
      });

      if (!userFound) {
        this.logger.warn({
          message: 'Usuario no encontrado o cuenta ya activa',
          email: userEmail,
        });
        throw new NotFoundException(
          'El usuario no se encuentra registrado o su cuenta ya esta activa.',
        );
      }

      if (!record || record.expires < Date.now()) {
        this.logger.warn({
          message: 'Código expirado o inválido',
          email: userEmail,
        });
        throw new ConflictException('El codigo ha expirado o es invalido.');
      }

      if (record.code !== code) {
        this.logger.warn({
          message: 'Código incorrecto',
          email: userEmail,
        });
        throw new ConflictException('Codigo invalido.');
      }

      this.codes.delete(userEmail);
      await this.prismaService.user.update({
        where: { email: userEmail, active: false },
        data: { active: true },
      });

      this.logger.log({
        message: 'Código verificado exitosamente',
        email: userEmail,
        userId: userFound.id,
      });

      return { message: 'Codigo verificado exitosamente!' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error({
        message: 'Error al verificar el código',
        error: error.message,
        stack: error.stack,
        email: userEmail,
      });
      throw new InternalServerErrorException('Error interno del servidor');
    }
  }

  async updatePassword(id: number, updatePasswordDto: PasswordUpdate) {
    try {
      this.logger.log({
        message: 'Actualizando contraseña de usuario',
        userId: id,
      });

      const userFound = await this.prismaService.user.findUnique({
        where: { id },
      });

      if (!userFound) {
        this.logger.warn({
          message: 'Usuario no encontrado al actualizar contraseña',
          userId: id,
        });
        throw new NotFoundException('El usuario no se encuentra registrado.');
      }

      const compromised = await this.isPasswordCompromised(
        updatePasswordDto.password,
      );
      if (compromised) {
        this.logger.warn({
          message: 'Contraseña comprometida detectada',
          userId: id,
        });
        throw new ConflictException(
          'Esta contraseña ha sido comprometida. Por favor elige una diferente.',
        );
      }

      const isMatch = bcrypt.compareSync(
        updatePasswordDto.currentPassword,
        userFound.password,
      );
      if (!isMatch) {
        this.logger.warn({
          message: 'Contraseña actual incorrecta',
          userId: id,
        });
        throw new ConflictException(
          'La contraseña actual es incorrecta, por favor intenta de nuevo.',
        );
      }

      const isInHistory = (
        userFound.passwordsHistory as PasswordHistoryEntry[]
      ).some((entry) =>
        bcrypt.compareSync(updatePasswordDto.password, entry.password),
      );
      if (isInHistory) {
        this.logger.warn({
          message: 'Intento de reutilizar contraseña anterior',
          userId: id,
        });
        throw new ConflictException(
          'No puedes reutilizar contraseñas anteriores.',
        );
      }

      const hashPassword = await bcrypt.hash(updatePasswordDto.password, 10);
      const currentDate = new Date();
      const newPasswordExpiresAt = new Date(
        Date.now() + 90 * 24 * 60 * 60 * 1000,
      );

      const passwordHistory = (userFound.passwordsHistory ||
        []) as PasswordHistoryEntry[];
      passwordHistory.push({
        password: hashPassword,
        createdAt: currentDate.toISOString(),
      });

      if (passwordHistory.length > 5) {
        passwordHistory.shift();
      }

      const resUser = await this.prismaService.user.update({
        where: { id },
        data: {
          password: hashPassword,
          passwordSetAt: currentDate,
          passwordExpiresAt: newPasswordExpiresAt,
          passwordsHistory: passwordHistory,
        },
      });

      await this.prismaService.userActivity.create({
        data: {
          email: userFound.email,
          action: 'Cambio de contraseña.',
          date: new Date(),
        },
      });

      this.logger.log({
        message: 'Contraseña actualizada exitosamente',
        userId: id,
      });

      const {
        password,
        passwordsHistory: history,
        passwordExpiresAt,
        passwordSetAt,
        securityAnswer,
        securityQuestionId,
        ...rest
      } = resUser;

      return { ...rest };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error({
        message: 'Error al actualizar contraseña',
        error: error.message,
        stack: error.stack,
        userId: id,
      });
      throw new HttpException(
        'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async recoverPassword(email: string) {
    try {
      this.logger.log({
        message: 'Iniciando recuperación de contraseña',
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

      const userFound = await this.prismaService.user.findUnique({
        where: { email },
      });

      if (!userFound) {
        this.logger.warn({
          message: 'Usuario no encontrado al recuperar contraseña',
          email,
        });
        throw new NotFoundException(
          `El correo ${email} no se encuentra registrado.`,
        );
      }

      const dataConfig = configInfo.emailResetPass?.[0];
      const companyInfo = await this.prismaService.companyProfile.findFirst();

      if (!companyInfo) {
        this.logger.error({
          message: 'Información de la compañía no encontrada',
        });
        throw new InternalServerErrorException(
          'Información de la compañía no disponible',
        );
      }

      const payload = { sub: userFound.id, role: Role.USER };
      const expirationTime = configInfo.timeTokenEmail || 10;
      const token = this.jwtSvc.sign(payload, {
        expiresIn: `${expirationTime}m`,
      });

      const currentYear = new Date().getFullYear();
      const html = `
          <!DOCTYPE html>
          <html lang="es">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Recupera tu contraseña de tu cuenta en Cayro</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
                  <tr>
                      <td align="center">
                          <img src=${companyInfo.logoUrl} alt="Cayro Uniformes" style="display: block; width: 150px; max-width: 100%; height: auto;">
                      </td>
                  </tr>
                  <tr>
                      <td style="padding: 0px 30px;">
                          <h1 style="color: #333333; font-size: 24px; margin-bottom: 20px; text-align: center;">
                          ${dataConfig?.title || 'Recuperación de Contraseña'} 
                          </h1>
                          <p style="color: #666666; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                              ${dataConfig?.greeting || 'Hola,'}
                          </p>
                          <p style="color: #666666; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                          ${dataConfig?.maininstruction || 'Para recuperar tu contraseña, haz clic en el enlace siguiente:'}
                          </p>

                          <div style="background-color: #f0f0f0; border-radius: 4px; padding: 20px; text-align: center; margin-bottom: 20px;">
                              <a href="http://localhost:5173/restaurar-password/${token}" style="font-size: 32px; font-weight: bold; color: #0099FF;">Recuperar contraseña</a>
                          </div>
                          <p style="color: #666666; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                          ${dataConfig?.secondaryinstruction || 'Si no solicitaste esta acción, ignora este mensaje.'}
                          </p>
                          <p style="color: #666666; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                          ${dataConfig?.expirationtime || 'Este enlace expira en 10 minutos.'}
                          </p>
                          <p style="color: #666666; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                          ${dataConfig?.finalMessage || 'Gracias, Cayro Uniformes'}
                          </p>
                      </td>
                  </tr>
                  <tr>
                      <td style="background-color: #27272A; padding: 20px 30px;">
                          <p style="color: #ffffff; font-size: 14px; line-height: 1.5; margin: 0; text-align: center;">
                              © ${currentYear} Cayro Uniformes. Todos los derechos reservados.
                          </p>
                      </td>
                  </tr>
              </table>
          </body>
          </html>
        `;

      await this.sendEmail(email, 'Recuperar contraseña', html);
      await this.prismaService.userActivity.create({
        data: {
          email: userFound.email,
          action: 'Solicitud de recuperación de contraseña.',
          date: new Date(),
        },
      });

      this.logger.log({
        message: 'Correo de recuperación enviado exitosamente',
        email,
        userId: userFound.id,
      });

      return { message: 'Correo de recuperación enviado.' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error({
        message: 'Error al solicitar recuperar contraseña',
        error: error.message,
        stack: error.stack,
        email,
      });
      throw new HttpException(
        'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async restorePassword(password: string, token: any) {
    try {
      this.logger.log({
        message: 'Restableciendo contraseña',
      });

      const decoded = this.jwtSvc.verify(token, {
        secret: process.env.JWT_SECRET_REST_PASS,
      });

      const userFound = await this.prismaService.user.findUnique({
        where: { id: decoded.sub },
      });

      if (!userFound) {
        this.logger.warn({
          message: 'Usuario no encontrado al restablecer contraseña',
          userId: decoded.sub,
        });
        throw new NotFoundException('El usuario no existe.');
      }

      const validatePasswordContent = (
        password: string,
        name: string,
        lastname: string,
        birthdate: Date,
      ): boolean => {
        const lowercasePassword = password.toLowerCase();
        const lowercaseName = name.toLowerCase();
        const lowercaseLastname = lastname.toLowerCase();
        const birthYear = birthdate
          ? new Date(birthdate).getFullYear().toString()
          : '';

        return (
          !lowercasePassword.includes(lowercaseName) &&
          !lowercasePassword.includes(lowercaseLastname) &&
          (birthYear ? !lowercasePassword.includes(birthYear) : true)
        );
      };

      const isValidPassword = validatePasswordContent(
        password,
        userFound.name,
        userFound.surname,
        userFound.birthdate,
      );

      if (!isValidPassword) {
        this.logger.warn({
          message: 'Contraseña contiene información personal',
          userId: userFound.id,
        });
        throw new ConflictException(
          'La contraseña no puede contener el nombre, apellido o año de nacimiento.',
        );
      }

      const compromised = await this.isPasswordCompromised(password);
      if (compromised) {
        this.logger.warn({
          message: 'Contraseña comprometida al restablecer',
          userId: userFound.id,
        });
        throw new ConflictException(
          'Esta contraseña ha sido comprometida. Por favor elige una diferente.',
        );
      }

      const isInHistory = (
        userFound.passwordsHistory as PasswordHistoryEntry[]
      ).some((entry) => bcrypt.compareSync(password, entry.password));

      if (isInHistory) {
        this.logger.warn({
          message: 'Contraseña reutilizada al restablecer',
          userId: userFound.id,
        });
        throw new ConflictException(
          'No puedes reutilizar contraseñas anteriores.',
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const currentDate = new Date();
      const newPasswordExpiresAt = new Date(
        Date.now() + 90 * 24 * 60 * 60 * 1000,
      );

      const passwordHistory = (userFound.passwordsHistory ||
        []) as PasswordHistoryEntry[];
      passwordHistory.push({
        password: hashedPassword,
        createdAt: currentDate.toISOString(),
      });

      if (passwordHistory.length > 5) {
        passwordHistory.shift();
      }

      await this.prismaService.user.update({
        where: { id: userFound.id },
        data: {
          password: hashedPassword,
          passwordSetAt: currentDate,
          passwordExpiresAt: newPasswordExpiresAt,
          passwordsHistory: passwordHistory,
        },
      });

      await this.prismaService.userActivity.create({
        data: {
          email: userFound.email,
          action: 'Restablecimiento de contraseña.',
          date: new Date(),
        },
      });

      this.logger.log({
        message: 'Contraseña restablecida exitosamente',
        userId: userFound.id,
      });

      return {
        status: 201,
        message: 'La contraseña se restableció con éxito.',
      };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        this.logger.warn({
          message: 'Token expirado al restablecer contraseña',
        });
        throw new ConflictException(
          'El token ha expirado. Solicita un nuevo enlace para restablecer tu contraseña.',
        );
      }
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error({
        message: 'Error al restaurar contraseña',
        error: error.message,
        stack: error.stack,
      });
      throw new HttpException(
        'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async blockUser(days: number, email: string) {
    try {
      this.logger.log({
        message: 'Bloqueando usuario',
        email,
        days,
      });

      const userFound = await this.prismaService.user.findUnique({
        where: { email },
      });

      if (!userFound) {
        this.logger.warn({
          message: 'Usuario no encontrado al intentar bloquear',
          email,
        });
        throw new NotFoundException('Usuario no encontrado.');
      }

      const lockUntil = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
      const res = await this.prismaService.user.update({
        where: { email },
        data: { lockUntil },
      });

      this.logger.log({
        message: 'Usuario bloqueado exitosamente',
        email,
        lockUntil,
      });

      const {
        password,
        passwordsHistory,
        passwordExpiresAt,
        passwordSetAt,
        ...rest
      } = res;

      return { ...rest };
    } catch (error) {
      this.logger.error({
        message: 'Error al bloquear usuario',
        error: error.message,
        stack: error.stack,
        email,
      });
      throw new InternalServerErrorException('Error al bloquear usuario');
    }
  }

  async findOne(email: string) {
    try {
      this.logger.log({
        message: 'Buscando usuario',
        email,
      });

      const user = await this.prismaService.user.findUnique({
        where: { email },
      });

      if (!user) {
        this.logger.warn({
          message: 'Usuario no encontrado',
          email,
        });
        throw new NotFoundException('Usuario no encontrado.');
      }

      const {
        password,
        passwordsHistory,
        passwordExpiresAt,
        passwordSetAt,
        securityAnswer,
        ...rest
      } = user;

      this.logger.log({
        message: 'Usuario encontrado',
        userId: user.id,
        email,
      });

      return { ...rest };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      this.logger.error({
        message: 'Error al encontrar usuario',
        error: error.message,
        stack: error.stack,
        email,
      });
      throw new HttpException(
        'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(createUserDto: CreateUserDto) {
    try {
      this.logger.log({
        message: 'Creando nuevo usuario',
        email: createUserDto.email,
      });

      const userFound = await this.prismaService.user.findFirst({
        where: {
          OR: [{ email: createUserDto.email }, { phone: createUserDto.phone }],
        },
      });

      if (userFound) {
        this.logger.warn({
          message: 'Correo o teléfono ya en uso',
          email: createUserDto.email,
          phone: createUserDto.phone,
        });
        throw new ConflictException('El correo o teléfono ya está en uso.');
      }

      const compromised = await this.isPasswordCompromised(
        createUserDto.password,
      );

      if (compromised) {
        this.logger.warn({
          message: 'Contraseña comprometida detectada al crear usuario',
          email: createUserDto.email,
        });
        throw new ConflictException(
          'Esta contraseña ha sido comprometida. Por favor elige una diferente.',
        );
      }

      const hashPassword = await bcrypt.hash(createUserDto.password, 10);
      const data = {
        ...createUserDto,
        password: hashPassword,
        birthdate: new Date(createUserDto.birthdate),
        passwordExpiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        passwordsHistory: [{ password: hashPassword, createdAt: new Date() }],
      };

      await this.sendCode(createUserDto.email);
      const newUser = await this.prismaService.user.create({ data });

      this.logger.log({
        message: 'Usuario creado exitosamente',
        userId: newUser.id,
        email: newUser.email,
      });

      return newUser;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error({
        message: 'Error al crear usuario',
        error: error.message,
        stack: error.stack,
        email: createUserDto.email,
      });
      throw new HttpException(
        'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      this.logger.log({
        message: 'Actualizando usuario',
        userId: id,
      });

      const currentUser = await this.prismaService.user.findUnique({
        where: { id },
      });

      if (!currentUser) {
        this.logger.warn({
          message: 'Usuario no encontrado al actualizar',
          userId: id,
        });
        throw new HttpException('Usuario no encontrado.', HttpStatus.NOT_FOUND);
      }

      if (updateUserDto.email) {
        const userWithEmail = await this.prismaService.user.findFirst({
          where: {
            email: updateUserDto.email,
            NOT: { id },
          },
        });

        if (userWithEmail) {
          this.logger.warn({
            message: 'Correo electrónico ya en uso por otro usuario',
            email: updateUserDto.email,
            userId: id,
          });
          throw new ConflictException(
            'El correo electrónico ya está en uso por otro usuario.',
          );
        }
      }

      const data = {
        ...updateUserDto,
        birthdate: updateUserDto.birthdate
          ? new Date(updateUserDto.birthdate)
          : currentUser.birthdate,
      };

      if (updateUserDto.email && currentUser.email !== updateUserDto.email) {
        await this.sendCode(updateUserDto.email);
        await this.prismaService.user.update({
          where: { id },
          data: { ...data, active: false },
        });

        this.logger.log({
          message: 'Correo actualizado, enviando código de verificación',
          userId: id,
          newEmail: updateUserDto.email,
        });

        return {
          message:
            'Correo actualizado. Se ha enviado un código de verificación.',
        };
      }

      await this.prismaService.user.update({
        where: { id },
        data,
      });

      this.logger.log({
        message: 'Usuario actualizado correctamente',
        userId: id,
      });

      return { message: 'Usuario actualizado correctamente.' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error({
        message: 'Error al actualizar usuario',
        error: error.message,
        stack: error.stack,
        userId: id,
      });
      throw new HttpException(
        'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateAnswerQuestion(id: number, updateAnswer: AnswerQuestion) {
    try {
      this.logger.log({
        message: 'Actualizando respuesta de seguridad',
        userId: id,
      });

      const currentUser = await this.prismaService.user.findUnique({
        where: { id },
      });

      if (!currentUser) {
        this.logger.warn({
          message: 'Usuario no encontrado al actualizar respuesta',
          userId: id,
        });
        throw new HttpException('Usuario no encontrado.', HttpStatus.NOT_FOUND);
      }

      const hashAnswer = await bcrypt.hash(updateAnswer.securityAnswer, 10);
      const answerUser = await this.prismaService.user.update({
        where: { id },
        data: {
          securityAnswer: hashAnswer,
          securityQuestionId: updateAnswer.securityQuestionId,
        },
      });

      this.logger.log({
        message: 'Respuesta de seguridad actualizada',
        userId: id,
      });

      const {
        password,
        passwordExpiresAt,
        passwordSetAt,
        passwordsHistory,
        securityAnswer,
        ...rest
      } = answerUser;

      return rest;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error({
        message: 'Error al actualizar la respuesta de seguridad',
        error: error.message,
        stack: error.stack,
        userId: id,
      });
      throw new HttpException(
        'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async compareAnswer(answer: AnswerQuestion) {
    try {
      this.logger.log({
        message: 'Comparando respuesta de seguridad',
        email: answer.email,
      });

      const currentUser = await this.prismaService.user.findUnique({
        where: { email: answer.email },
      });

      if (!currentUser) {
        this.logger.warn({
          message: 'Usuario no encontrado al comparar respuesta',
          email: answer.email,
        });
        throw new HttpException('Usuario no encontrado.', HttpStatus.NOT_FOUND);
      }

      const isAnswerValid = await bcrypt.compare(
        answer.securityAnswer,
        currentUser.securityAnswer,
      );

      if (
        !isAnswerValid ||
        currentUser.securityQuestionId !== answer.securityQuestionId
      ) {
        this.logger.warn({
          message: 'Respuesta de seguridad incorrecta',
          email: answer.email,
        });
        throw new HttpException(
          'Respuesta no válida.',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const companyInfo = await this.prismaService.companyProfile.findFirst();
      const configInfo = await this.prismaService.configuration.findFirst();

      if (!configInfo || !companyInfo) {
        this.logger.error({
          message: 'Configuración o información de compañía no encontrada',
        });
        throw new InternalServerErrorException('Configuración no disponible');
      }

      const dataConfig = configInfo.emailVerificationInfo?.[0];
      const payload = {
        sub: currentUser.id,
        role: Role.USER,
        email: currentUser.email,
      };
      const expirationTime = configInfo.timeTokenEmail || 10;
      const token = this.jwtSvc.sign(payload, {
        expiresIn: `${expirationTime}m`,
      });

      const currentYear = new Date().getFullYear();
      const html = `
          <!DOCTYPE html>
          <!-- Email template remains the same -->
      `;

      await this.sendEmail(currentUser.email, 'Recuperar contraseña', html);
      await this.prismaService.userActivity.create({
        data: {
          email: currentUser.email,
          action: 'Solicitud de recuperación de contraseña.',
          date: new Date(),
        },
      });

      this.logger.log({
        message: 'Correo de recuperación enviado después de respuesta correcta',
        email: currentUser.email,
        userId: currentUser.id,
      });

      return { message: 'Correo de recuperación enviado.' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error({
        message: 'Error al comparar respuesta de seguridad',
        error: error.message,
        stack: error.stack,
        email: answer.email,
      });
      throw new HttpException(
        'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async upsertUserAddress(
    userId: number,
    addressData: {
      street: string;
      city: string;
      state: string;
      country: string;
      postalCode: string;
      colony: string;
    },
    isDefault: boolean = false,
  ) {
    try {
      this.logger.log({
        message: 'Actualizando/creando dirección de usuario',
        userId,
      });

      const userExists = await this.prismaService.user.findUnique({
        where: { id: userId },
      });

      if (!userExists) {
        this.logger.warn({
          message: 'Usuario no encontrado al actualizar dirección',
          userId,
        });
        throw new Error(`El usuario con ID ${userId} no existe.`);
      }

      // Check if address exists
      let existingAddress = await this.prismaService.address.findFirst({
        where: {
          street: addressData.street,
          city: addressData.city,
          state: addressData.state,
          country: addressData.country,
          postalCode: addressData.postalCode,
          colony: addressData.colony,
        },
      });

      // If address exists, check if it's already linked to the user
      if (existingAddress) {
        const existingUserAddress =
          await this.prismaService.userAddress.findUnique({
            where: {
              userId_addressId: {
                userId,
                addressId: existingAddress.id,
              },
            },
          });

        if (existingUserAddress) {
          this.logger.warn({
            message: 'Dirección ya registrada para este usuario',
            userId,
            addressId: existingAddress.id,
          });
          throw new ConflictException(
            'Esta dirección ya está registrada para este usuario.',
          );
        }
      }

      // Reset other default addresses if this one is being set as default
      if (isDefault) {
        await this.prismaService.userAddress.updateMany({
          where: { userId, isDefault: true },
          data: { isDefault: false },
        });
      }

      // Create or connect the address
      const result = await this.prismaService.userAddress.upsert({
        where: {
          userId_addressId: {
            userId,
            addressId: existingAddress?.id || -1, // Will force create if no existing address
          },
        },
        create: {
          user: {
            connect: { id: userId },
          },
          address: {
            connectOrCreate: {
              where: {
                id: existingAddress?.id || -1,
              },
              create: {
                street: addressData.street,
                city: addressData.city,
                state: addressData.state,
                country: addressData.country,
                postalCode: addressData.postalCode,
                colony: addressData.colony,
              },
            },
          },
          isDefault,
        },
        update: {
          isDefault,
        },
      });

      this.logger.log({
        message: 'Dirección vinculada al usuario',
        userId,
        addressId: result.addressId,
        isDefault,
      });

      return {
        message: 'Dirección vinculada al usuario exitosamente.',
        address: await this.prismaService.address.findUnique({
          where: { id: result.addressId },
        }),
        isDefault: result.isDefault,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      this.logger.error({
        message: 'Error al registrar la dirección',
        error: error.message,
        stack: error.stack,
        userId,
      });
      throw new HttpException(
        'Error interno en el servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateUserAddress(
    userId: number,
    userAddressId: number,
    addressData: {
      street?: string;
      city?: string;
      state?: string;
      country?: string;
      postalCode?: string;
      colony?: string;
    },
    isDefault?: boolean,
  ) {
    try {
      this.logger.log({
        message: 'Actualizando dirección de usuario',
        userId,
        userAddressId,
      });

      // Verify the user address exists
      const existingUserAddress =
        await this.prismaService.userAddress.findUnique({
          where: { id: userAddressId },
          include: { address: true },
        });

      if (!existingUserAddress || existingUserAddress.userId !== userId) {
        this.logger.warn({
          message: 'Dirección no encontrada para este usuario',
          userId,
          userAddressId,
        });
        throw new NotFoundException(
          'No se encontró la dirección para este usuario.',
        );
      }

      // If changing default status
      if (isDefault === true) {
        await this.prismaService.userAddress.updateMany({
          where: { userId, isDefault: true },
          data: { isDefault: false },
        });
      }

      // Update the address fields if provided
      if (Object.values(addressData).some((val) => val !== undefined)) {
        await this.prismaService.address.update({
          where: { id: existingUserAddress.addressId },
          data: addressData,
        });
      }

      // Update the userAddress relationship if needed
      const updatedUserAddress = await this.prismaService.userAddress.update({
        where: { id: userAddressId },
        data: { isDefault },
        include: { address: true },
      });

      this.logger.log({
        message: 'Dirección actualizada exitosamente',
        userId,
        userAddressId,
      });

      return {
        message: 'Dirección actualizada exitosamente.',
        address: updatedUserAddress.address,
        isDefault: updatedUserAddress.isDefault,
      };
    } catch (error) {
      this.logger.error({
        message: 'Error al actualizar la dirección',
        error: error.message,
        stack: error.stack,
        userId,
        userAddressId,
      });
      throw new HttpException(
        'No se pudo actualizar la dirección.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAddresses(userId: number) {
    try {
      this.logger.log({
        message: 'Buscando direcciones del usuario',
        userId,
      });

      const userAddresses = await this.prismaService.userAddress.findMany({
        where: { userId },
        include: { address: true },
      });

      this.logger.log({
        message: 'Direcciones encontradas',
        userId,
        count: userAddresses.length,
      });

      return userAddresses.map((ua) => ({
        ...ua.address,
        isDefault: ua.isDefault,
        userAddressId: ua.id,
      }));
    } catch (error) {
      this.logger.error({
        message: 'Error al buscar direcciones del usuario',
        error: error.message,
        stack: error.stack,
        userId,
      });
      throw new InternalServerErrorException('Error al buscar direcciones');
    }
  }

  async unlinkUserAddress(userId: number, userAddressId: number) {
    try {
      this.logger.log({
        message: 'Desvinculando dirección de usuario',
        userId,
        userAddressId,
      });

      const existingUserAddress =
        await this.prismaService.userAddress.findUnique({
          where: { id: userAddressId },
        });

      if (!existingUserAddress || existingUserAddress.userId !== userId) {
        this.logger.warn({
          message: 'Dirección no vinculada al usuario',
          userId,
          userAddressId,
        });
        throw new NotFoundException(
          'No se encontró la dirección para este usuario.',
        );
      }

      await this.prismaService.userAddress.delete({
        where: { id: userAddressId },
      });

      this.logger.log({
        message: 'Dirección desvinculada exitosamente',
        userId,
        userAddressId,
      });

      return { message: 'Dirección desvinculada del usuario exitosamente.' };
    } catch (error) {
      this.logger.error({
        message: 'Error al desvincular la dirección',
        error: error.message,
        stack: error.stack,
        userId,
        userAddressId,
      });
      throw new HttpException(
        'No se pudo desvincular la dirección.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async setDefaultAddress(userId: number, userAddressId: number) {
    try {
      this.logger.log({
        message: 'Estableciendo dirección como predeterminada',
        userId,
        userAddressId,
      });

      // First reset all other default addresses
      await this.prismaService.userAddress.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });

      // Set the new default address
      const updatedAddress = await this.prismaService.userAddress.update({
        where: {
          id: userAddressId,
          userId: userId, // Ensure the address belongs to this user
        },
        data: { isDefault: true },
        include: { address: true },
      });

      this.logger.log({
        message: 'Dirección establecida como predeterminada',
        userId,
        userAddressId,
      });

      return {
        message: 'Dirección predeterminada actualizada exitosamente.',
        address: updatedAddress.address,
      };
    } catch (error) {
      this.logger.error({
        message: 'Error al establecer dirección predeterminada',
        error: error.message,
        stack: error.stack,
        userId,
        userAddressId,
      });
      throw new HttpException(
        'No se pudo establecer la dirección predeterminada.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
