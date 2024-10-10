import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/User.Schema';
import { Model } from 'mongoose';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';

@Injectable()
export class UsersService {
  private codes = new Map<string, { code: string; expires: number }>();
  private transporter;
  constructor(
    @InjectModel(User.name) private userModel: Model<User>

  ) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: "cayrouniformes38@gmail.com",
        pass: "ciol fhqh hvgx smt",
      },
    });
  }

  async sendVerificationCode(email: string, code: string) {
    const mailOptions = {
      from: "cayrouniformes38@gmail.com",
      to: email,
      subject: 'Verification Code',
      text: `Your verification code is: ${code}`,
    };

    return await this.transporter.sendMail(mailOptions);
  }
  async create(createUserDto: CreateUserDto) {
    const userFound = await this.userModel.findOne({email:createUserDto.email});
    if(userFound) throw new ConflictException("El correo ya esta en uso.");

    const hashPassword = await bcrypt.hash(createUserDto.password, 10);
    const res = new this.userModel({ ...createUserDto, password: hashPassword, active: false });
    // const verificationCode = crypto.randomInt(100000, 999999).toString();
    // this.codes.set(createUserDto.email, { code: verificationCode, expires: Date.now() + 300000 });
    // await this.sendVerificationCode(createUserDto.email, verificationCode);
    await res.save();
    return res;
  }

  async verifyCode(userEmail: string, code: string) {

    const record = this.codes.get(userEmail);

    if (!record || record.expires < Date.now()) {
      return { message: 'Code expired or invalid.' };
    }

    if (record.code !== code) {
      return { message: 'Invalid code.' };
    }

    // Código verificado, remover el código de la memoria
    this.codes.delete(userEmail);

    // Proceder con el registro o login
    return { message: 'Code verified successfully!' };
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
