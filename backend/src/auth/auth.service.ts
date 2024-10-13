import { ForbiddenException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { LoginDto } from './dto/login-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/schemas/User.Schema';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Role } from './roles/role.enum';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtSvc: JwtService
  ) { }
  async login(loginDto: LoginDto) {
    const userFound = await this.userModel.findOne({ email: loginDto.email });
    if (!userFound) throw new NotFoundException("Usuario no registrado.");

    if (userFound.lockUntil > new Date()) {
      const now = new Date();
      const timeDifference = userFound.lockUntil.getTime() - now.getTime(); // Diferencia en milisegundos

      // Calcular los minutos y segundos restantes
      const minutesRemaining = Math.floor(timeDifference / (1000 * 60)); // Convertir a minutos
      const secondsRemaining = Math.floor((timeDifference % (1000 * 60)) / 1000); // Restante en segundos

      // Construir el mensaje dinámico
      let formattedMessage = '';
      if (minutesRemaining > 0) {
        formattedMessage = `${minutesRemaining} minutos y ${secondsRemaining} segundos`;
      } else {
        formattedMessage = `${secondsRemaining} segundos`; // Solo mostrar segundos si los minutos son 0
      }
      throw new ForbiddenException('Cuenta bloqueada temporalmente. Inténtalo de nuevo en ' + formattedMessage);
    }
    const isPasswordValid = await bcrypt.compare(loginDto.password, userFound.password);

    if (!isPasswordValid) {
      userFound.loginAttempts = (userFound.loginAttempts || 0) + 1;

      if (userFound.loginAttempts === 3) userFound.lockUntil = new Date(Date.now() + 5 * 60 * 1000);

      if (userFound.loginAttempts === 5) {
        userFound.lockUntil = new Date(Date.now() + 10 * 60 * 1000);
        userFound.loginAttempts = 0;
      }

      await userFound.save();

      throw new HttpException("La contraseña es incorrecta.", HttpStatus.UNAUTHORIZED);
    }

    userFound.loginAttempts = 0;
    const { password, ...rest } = userFound.toObject();
    const payload = { sub: userFound._id, role: Role.USER };
    const token = this.jwtSvc.sign(payload);
    return { user: { ...rest, role: Role.USER }, token }
  }
}
