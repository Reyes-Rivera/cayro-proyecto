import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
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
    const { password, ...rest } = userFound.toObject();
    const isPasswordValid = await bcrypt.compare(loginDto.password, userFound.password);
    if (!isPasswordValid) {
      throw new HttpException("La contraseña es incorrecta.", HttpStatus.UNAUTHORIZED);
    }
    const payload = { sub: userFound._id, role:Role.USER };
    const token = this.jwtSvc.sign(payload);
    return { user: { ...rest, role: Role.USER },token }
  }
}
