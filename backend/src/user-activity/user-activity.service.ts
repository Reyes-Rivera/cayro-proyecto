import { Injectable } from '@nestjs/common';
import { CreateUserActivityDto } from './dto/create-user-activity.dto';
import { UpdateUserActivityDto } from './dto/update-user-activity.dto';
import { UserActivity } from './schema/UserActivitySchema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserActivityService {
  constructor(@InjectModel(UserActivity.name) private userActivityModel: Model<UserActivity>) { }
  async getBlockedUsersByPeriod(period: 'day' | 'week' | 'month'): Promise<{ email: string; count: number }[]> {
    const now = new Date();
    let startDate: Date;

    if (period === 'day') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // Hoy
    } else if (period === 'week') {
      const startOfWeek = now.getDate() - now.getDay();
      startDate = new Date(now.setDate(startOfWeek)); // Inicio de semana
    } else {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1); // Inicio de mes
    }

    // Realizar la agregación para agrupar por email y contar los bloqueos
    return this.userActivityModel.aggregate([
      {
        $match: {
          action: 'Cuenta bloqueada por 5 minutos.',
          date: { $gte: startDate }, // Filtrar por fecha de inicio del periodo
        },
      },
      {
        $group: {
          _id: '$email', // Agrupar por correo electrónico
          count: { $sum: 1 }, // Contar las ocurrencias de bloqueo
        },
      },
      {
        $project: {
          _id: 0, // No mostrar el campo _id
          email: '$_id', // Renombrar _id a email
          count: 1, // Mostrar el conteo
        },
      },
    ]).exec();
  }

  create(createUserActivityDto: CreateUserActivityDto) {
    return 'This action adds a new userActivity';
  }

  findAll() {
    return `This action returns all userActivity`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userActivity`;
  }

  update(id: number, updateUserActivityDto: UpdateUserActivityDto) {
    return `This action updates a #${id} userActivity`;
  }

  remove(id: number) {
    return `This action removes a #${id} userActivity`;
  }
}
