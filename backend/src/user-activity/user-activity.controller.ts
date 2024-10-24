import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UserActivityService } from './user-activity.service';
import { CreateUserActivityDto } from './dto/create-user-activity.dto';
import { UpdateUserActivityDto } from './dto/update-user-activity.dto';

@Controller('user-activity')
export class UserActivityController {
  constructor(private readonly userActivityService: UserActivityService) { }

  @Post()
  create(@Body() createUserActivityDto: CreateUserActivityDto) {
    return this.userActivityService.create(createUserActivityDto);
  }
  @Get('blocked')
  async getBlockedUsers(@Query('period') period: 'day' | 'week' | 'month') {
    return this.userActivityService.getBlockedUsersByPeriod(period);
  }
  @Get()
  findAll() {
    return this.userActivityService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userActivityService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserActivityDto: UpdateUserActivityDto) {
    return this.userActivityService.update(+id, updateUserActivityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userActivityService.remove(+id);
  }
}
