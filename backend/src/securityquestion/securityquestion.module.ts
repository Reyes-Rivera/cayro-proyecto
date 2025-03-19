import { Module } from '@nestjs/common';
import { SecurityquestionService } from './securityquestion.service';
import { SecurityquestionController } from './securityquestion.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SecurityquestionController],
  providers: [SecurityquestionService],
})
export class SecurityquestionModule {}
