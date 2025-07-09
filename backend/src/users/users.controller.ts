import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AnswerQuestion, CreateUserDto } from './dto/create-user.dto';
import { PasswordUpdate, UpdateUserDto } from './dto/update-user.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/auth/roles/role.enum';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('resend-code')
  async reSendCode(@Body() body: { email: string }) {
    return this.usersService.sendCode(body.email);
  }

  @Post('verify-code')
  async verifyCode(@Body() body: { email: string; code: string }) {
    return this.usersService.verifyCode(body.email, body.code);
  }

  @Auth([Role.USER])
  @Patch('change-password/:id')
  async changePassword(
    @Param('id') id: number,
    @Body() updatePass: PasswordUpdate,
  ) {
    return this.usersService.updatePassword(+id, updatePass);
  }

  @Post('recover-password')
  async recoverPassword(@Body() body: { email: string }) {
    return this.usersService.recoverPassword(body.email);
  }

  @Post('reset-password/:token')
  async restorePassword(
    @Param('token') token: string,
    @Body() body: { password: string },
  ) {
    return this.usersService.restorePassword(body.password, token);
  }

  @Auth([Role.ADMIN])
  @Post('lock')
  async lockUser(@Body() body: { days: number; email: string }) {
    return this.usersService.blockUser(body.days, body.email);
  }
  @Post('verifyUserExist')
  async findOne(@Body() body: { email: string }) {
    return this.usersService.findOne(body.email);
  }

  @Auth([Role.USER])
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Auth([Role.USER])
  @Patch('update-answer/:id')
  async updateAnswer(
    @Param('id') id: number,
    @Body() updateAnswer: AnswerQuestion,
  ) {
    return this.usersService.updateAnswerQuestion(+id, updateAnswer);
  }

  @Post('compare-answer')
  async compareAnswer(@Body() updateAnswer: AnswerQuestion) {
    return this.usersService.compareAnswer(updateAnswer);
  }
  @Auth([Role.ADMIN])
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }
  @Auth([Role.USER])
  @Put('/address/:userId')
  async upsertUserAddress(
    @Param('userId') userId: number,
    @Body()
    body: {
      street: string;
      city: string;
      state: string;
      country: string;
      postalCode: string;
      colony: string;
      isDefault?: boolean;
    },
  ) {
    return this.usersService.upsertUserAddress(
      +userId,
      {
        street: body.street,
        city: body.city,
        state: body.state,
        country: body.country,
        postalCode: body.postalCode,
        colony: body.colony,
      },
      body.isDefault,
    );
  }

  @Auth([Role.USER])
  @Put('user/:userId/address/:addressId')
  async updateUserAddress(
    @Param('userId') userId: number,
    @Param('addressId') addressId: number,
    @Body()
    body: {
      street?: string;
      city?: string;
      state?: string;
      country?: string;
      postalCode?: string;
      colony?: string;
      isDefault?: boolean;
    },
  ) {
    return this.usersService.updateUserAddress(
      +userId,
      +addressId,
      {
        street: body.street,
        city: body.city,
        state: body.state,
        country: body.country,
        postalCode: body.postalCode,
        colony: body.colony,
      },
      body.isDefault,
    );
  }

  // @Auth([Role.USER])
  @Get(':userId/addresses')
  async getUserAddresses(@Param('userId') userId: number) {
    return this.usersService.findAddresses(+userId);
  }

  @Auth([Role.USER])
  @Delete('user/:userId/address/:addressId')
  async removeUserAddress(
    @Param('userId') userId: number,
    @Param('addressId') addressId: number,
  ) {
    return this.usersService.unlinkUserAddress(+userId, +addressId);
  }

  @Auth([Role.USER])
  @Patch('user/:userId/address/:addressId/set-default')
  async setDefaultUserAddress(
    @Param('userId') userId: number,
    @Param('addressId') addressId: number,
  ) {
    return this.usersService.setDefaultAddress(+userId, +addressId);
  }

  @Post('generate-smartwatch-code/:id')
  async generateSmartWatchCode(@Param('id') id: number) {
    const code = await this.usersService.generateSmartWatchCode(+id);
    return { code };
  }
  @Post('get-smartwatch-code/:id')
  async getSmartWatchCode(@Param('id') id: number) {
    const code = await this.usersService.getSmartWatchCode(+id);
    return { code };
  }
}
