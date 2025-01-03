import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PasswordUpdate, UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/User.Schema';
import { Model } from 'mongoose';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';
import axios from 'axios';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/auth/roles/role.enum';
import { UserActivity } from 'src/user-activity/schema/UserActivitySchema';
import { Configuration } from 'src/configuration/schema/schemaconfig';
@Injectable()
export class UsersService {
  private codes = new Map<string, { code: string; expires: number }>();
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(UserActivity.name) private userActivityModel: Model<UserActivity>,
    @InjectModel(Configuration.name) private configuration: Model<Configuration>,
    private jwtSvc: JwtService
  ) {

  }
  async sendEmail(correo, subject, html) {
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'cayrouniformes38@gmail.com',
        pass: 'qewd ahzb vplo arua'
      },

    });

    var mailOptions = {
      from: 'cayrouniformes38@gmail.com',
      to: correo,
      subject: subject,
      html: html
    };
    try {
      await transporter.sendMail(mailOptions);
      console.log("codigo enviado")
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException("Error al enviar el correo de recuperación,");
    }

  }
  async sendCode(email: string) {
    try {
      const configInfo = await this.configuration.find();
      const timeToken = parseInt(configInfo[0].timeTokenEmail);
      const expirationTime = Date.now() + timeToken * 60000;
      const verificationCode = crypto.randomInt(100000, 999999).toString();
      //5 minutes 
      this.codes.set(email, { code: verificationCode, expires: expirationTime });
      const currentYear = new Date().getFullYear(); // Obtener el año actual
      const html = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verificación de Cuenta Cayro</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
                <tr>
                    <td align="center" >
                        <img src="https://res.cloudinary.com/dhhv8l6ti/image/upload/v1728748461/logo.png" alt="Cayro Uniformes" style="display: block; width: 150px; max-width: 100%; height: auto;">
                    </td>
                </tr>
                <tr>
                    <td style="padding: 0px 30px;">
                        <h1 style="color: #333333; font-size: 24px; margin-bottom: 20px; text-align: center;">
                         ${configInfo[0].emailVerificationInfo.title} 
                        </h1>
                        <p style="color: #666666; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                            ${configInfo[0].emailVerificationInfo.greeting} 
                        </p>
                        <p style="color: #666666; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                            ${configInfo[0].emailVerificationInfo.maininstruction} 
                        </p>
                        <div style="background-color: #f0f0f0; border-radius: 4px; padding: 20px; text-align: center; margin-bottom: 20px;">
                            <span style="font-size: 32px; font-weight: bold; color: #0099FF; letter-spacing: 5px;">${verificationCode}</span>
                        </div>
                        <p style="color: #666666; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                            ${configInfo[0].emailVerificationInfo.secondaryinstruction} 
                        </p>
                        <p style="color: #666666; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                            ${configInfo[0].emailVerificationInfo.expirationtime} 
                        </p>
                        <p style="color: #666666; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                            ${configInfo[0].emailVerificationInfo.finalMessage} 
                        </p>
                        <p style="color: #666666; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                           ${configInfo[0].emailVerificationInfo.signature} 
                        </p>
                    </td>
                </tr>
                <tr>
                    <td style="background-color: #27272A; padding: 20px 30px;">
                        <p style="color: #ffffff; font-size: 14px; line-height: 1.5; margin: 0; text-align: center;">
                            © ${currentYear} Cayro Uniformes. Todos los derechos reservados.
                        </p>
                        <p style="color: #ffffff; font-size: 14px; line-height: 1.5; margin: 10px 0 0; text-align: center;">
                            <a href="#" style="color: #ffffff; text-decoration: none;">Política de Privacidad</a> | 
                            <a href="#" style="color: #ffffff; text-decoration: none;">Términos de Servicio</a>
                        </p>
                    </td>
                </tr>
            </table>
        </body>
        </html>
      `
      await this.sendEmail(email, "Codigo de verificación", html);
      return { message: "Codigo de verificación enviado." }
    } catch (error) {
      console.log(error)
    }
  }
  async isPasswordCompromised(password: string): Promise<boolean> {
    const hashedPassword = crypto.createHash('sha1').update(password).digest('hex').toUpperCase();
    const prefix = hashedPassword.slice(0, 5);
    const suffix = hashedPassword.slice(5);
    try {
      const response = await axios.get(`https://api.pwnedpasswords.com/range/${prefix}`);
      const breachedPasswords = response.data.split('\n');

      for (let entry of breachedPasswords) {
        const [hashSuffix, count] = entry.split(':');
        if (hashSuffix === suffix) {
          return true; // Contraseña comprometida
        }
      }
      return false; // Contraseña segura
    } catch (error) {
      console.error('Error verificando contraseña comprometida:', error);
      return false; // Por precaución, devolver que no está comprometida en caso de error
    }
  }
  async create(createUserDto: CreateUserDto) {
    try {
      const userFound = await this.userModel.findOne({ email: createUserDto.email });
      if (userFound) {
        throw new ConflictException("El correo ya esta en uso.");
      }
      const compromised = await this.isPasswordCompromised(createUserDto.password);
      if (compromised) {
        throw new ConflictException("Esta contraseña ha sido comprometida. Por favor elige una diferente.");
      }
      const hashPassword = await bcrypt.hash(createUserDto.password, 10);

      const res = new this.userModel({ ...createUserDto, password: hashPassword, active: false });
      res.passwordsHistory.push({ password: hashPassword, createdAt: new Date() });
      await this.sendCode(createUserDto.email);
      await res.save();
      return res;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error interno del servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async verifyCode(userEmail: string, code: string) {

    const record = this.codes.get(userEmail);
    const userFound = await this.userModel.findOne({ email: userEmail, active: false });
    if (!userFound) throw new NotFoundException("El usuario no se encuentra registrado o su cuenta ya esta activa.");

    if (!record || record.expires < Date.now()) {
      throw new ConflictException('El codigo ha expirado o es invalido.');
    }

    if (record.code !== code) {
      throw new ConflictException('Codigo invalido.');
    }

    // Código verificado, remover el código de la memoria
    this.codes.delete(userEmail);

    // Proceder con el registro o login
    await this.userModel.findOneAndUpdate({ email: userEmail, active: false }, { active: true });
    return { message: 'Codigo verificado exitosamente!' };

  }
  async updatePassword(id: string, updatePasswordDto: PasswordUpdate) {
    try {
      const userFound = await this.userModel.findById(id);

      if (!userFound) throw new NotFoundException("El usuario no se encuentra registrado.");

      const compromised = await this.isPasswordCompromised(updatePasswordDto.password);
      if (compromised) {
        throw new ConflictException("Esta contraseña ha sido comprometida. Por favor elige una diferente.");
      };
      const isMatch = bcrypt.compareSync(updatePasswordDto.currentPassword, userFound.password);

      if (!isMatch) {
        throw new ConflictException("La contraseña actual es incorrecta, por favor intenta de nuevo.");
      }

      const isInHistory = userFound.passwordsHistory.some(entry =>
        bcrypt.compareSync(updatePasswordDto.password, entry.password)
      );
      if (isInHistory) {
        throw new ConflictException('No puedes reutilizar contraseñas anteriores.');
      }

      const hashPassword = await bcrypt.hash(updatePasswordDto.password, 10);

      const currentDate = new Date();
      const newPasswordExpiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);

      userFound.password = hashPassword;
      userFound.passwordSetAt = currentDate;
      userFound.passwordExpiresAt = newPasswordExpiresAt;

      userFound.passwordsHistory.push({
        password: hashPassword,
        createdAt: currentDate
      });


      if (userFound.passwordsHistory.length > 5) {
        userFound.passwordsHistory.shift();
      }
      await userFound.save();
      const res = new this.userActivityModel({
        email: userFound.email,
        action: "Cambio de contraseña.",
      })
      await res.save();
      return { message: "Contraseña actualizada." };
    } catch (error) {
      console.log(error)
    }
  }
  async recoverPassword(email: string) {
    try {
        const configInfo = await this.configuration.find();
        const userFound = await this.userModel.findOne({ email });
        if (!userFound) throw new NotFoundException(`El correo ${email} no se encuentra registrado.`);

        // Crear payload y generar token con tiempo de expiración
        const payload = { sub: userFound._id, role: Role.USER };
        const expirationTime = configInfo[0]?.timeTokenEmail || 10; // Tiempo en minutos o valor predeterminado
        const token = this.jwtSvc.sign(payload, { expiresIn: `${expirationTime}m` });

        // Contenido del correo de recuperación
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
                          <img src="https://res.cloudinary.com/dhhv8l6ti/image/upload/v1728748461/logo.png" alt="Cayro Uniformes" style="display: block; width: 150px; max-width: 100%; height: auto;">
                      </td>
                  </tr>
                  <tr>
                      <td style="padding: 0px 30px;">
                          <h1 style="color: #333333; font-size: 24px; margin-bottom: 20px; text-align: center;">
                          ${configInfo[0]?.emailResetPass?.title || "Recuperación de Contraseña"} 
                          </h1>
                          <p style="color: #666666; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                              ${configInfo[0]?.emailResetPass?.greeting || "Hola,"}
                          </p>
                          <p style="color: #666666; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                          ${configInfo[0]?.emailResetPass?.maininstruction || "Para recuperar tu contraseña, haz clic en el enlace siguiente:"}
                          </p>

                          <div style="background-color: #f0f0f0; border-radius: 4px; padding: 20px; text-align: center; margin-bottom: 20px;">
                              <a href="https://cayro.netlify.app/reset-password/${token}" style="font-size: 32px; font-weight: bold; color: #0099FF;">Recuperar contraseña</a>
                          </div>
                          <p style="color: #666666; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                          ${configInfo[0]?.emailResetPass?.secondaryinstruction || "Si no solicitaste esta acción, ignora este mensaje."}
                          </p>
                          <p style="color: #666666; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                          ${configInfo[0]?.emailResetPass?.expirationtime || "Este enlace expira en 10 minutos."}
                          </p>
                          <p style="color: #666666; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                          ${configInfo[0]?.emailResetPass?.finalMessage || "Gracias, Cayro Uniformes"}
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

        // Enviar el correo electrónico
        await this.sendEmail(email, "Recuperar contraseña", html);
        return { message: "Correo de recuperación enviado." };
    } catch (error) {
        console.log(error);
        if (error instanceof HttpException) {
            throw error;
        }
        throw new HttpException('Error interno del servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
}


  async restorePassword(password: string, token: any) {
    try {
      const decoded = this.jwtSvc.verify(token, { secret: process.env.JWT_SECRET_REST_PASS });
      const hashedPassword = await bcrypt.hash(password, 10);
      const userFound = await this.userModel.findById(decoded.sub);
      if (!userFound) throw new NotFoundException("El usuario no existe.");
      // Extraer nombre, apellido y año de nacimiento
      const validatePasswordContent = (password: string, name: string, lastname: string, birthdate: Date): boolean => {
        const lowercasePassword = password.toLowerCase();
        const lowercaseName = name.toLowerCase();
        const lowercaseLastname = lastname.toLowerCase();

        // Extraer el año de nacimiento si existe
        const birthYear = birthdate ? new Date(birthdate).getFullYear().toString() : '';

        return (
          !lowercasePassword.includes(lowercaseName) &&  // Verificar si el nombre no está en la contraseña
          !lowercasePassword.includes(lowercaseLastname) &&  // Verificar si el apellido no está en la contraseña
          (birthYear ? !lowercasePassword.includes(birthYear) : true)  // Verificar el año si está presente
        );
      };

      const isValidPassword = validatePasswordContent(password, userFound.name, userFound.surname, userFound.birthday);
      if (!isValidPassword) {
        throw new ConflictException("La contraseña no puede contener el nombre, apellido o año de nacimiento.");
      }
      if (userFound._id == decoded.sub) {
        const compromised = await this.isPasswordCompromised(password);
        if (compromised) {
          throw new ConflictException("Esta contraseña ha sido comprometida. Por favor elige una diferente.");
        };

        const isInHistory = userFound.passwordsHistory.some(entry =>
          bcrypt.compareSync(password, entry.password)
        );
        if (isInHistory) {
          throw new ConflictException('No puedes reutilizar contraseñas anteriores.');
        }

        const currentDate = new Date();
        const newPasswordExpiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);

        userFound.password = hashedPassword;
        userFound.passwordSetAt = currentDate;
        userFound.passwordExpiresAt = newPasswordExpiresAt;

        userFound.passwordsHistory.push({
          password: hashedPassword,
          createdAt: currentDate
        });

        if (userFound.passwordsHistory.length > 5) {
          userFound.passwordsHistory.shift();
        }
        await userFound.save();
        const res = new this.userActivityModel({
          email: userFound.email,
          action: "Recuperación de contraseña.",
        })
        await res.save();
        return { message: "Contraseña actualizada." };
      }
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new ConflictException('El token ha expirado. Solicita un nuevo enlace para restablecer tu contraseña.');
      }
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error interno del servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async blockUser(days: number, email: string) {
    const userFound = await this.userModel.findOne({ email });
    if (!userFound) {
      throw new NotFoundException('Usuario no encontrado.');
    }
    userFound.lockUntil = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    const res = await userFound.save();
    return res;
  }
  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
