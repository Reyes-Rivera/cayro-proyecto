import { Injectable } from '@nestjs/common';
import { CreateUserActivityDto } from './dto/create-user-activity.dto';
import { UpdateUserActivityDto } from './dto/update-user-activity.dto';
import { Model } from 'mongoose';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserActivityService {
  constructor(private prismaService:PrismaService) { }
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
    const result = await this.prismaService.userActivity.groupBy({
      by: ['email'], // Agrupamos por el campo 'email'
      where: {
        action: 'Cuenta bloqueada por 5 minutos.',
        date: {
          gte: startDate, // startDate es la fecha de inicio del período
        },
      },
      _count: {
        email: true, // Contamos las ocurrencias de bloqueos por email
      },
    });
    
    // Mapear el resultado al formato esperado
    const formattedResult = result.map((item) => ({
      email: item.email,
      count: item._count.email,
    }));
    
    return formattedResult;
    
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
