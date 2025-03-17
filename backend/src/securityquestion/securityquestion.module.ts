import { Module } from '@nestjs/common';
import { SecurityquestionService } from './securityquestion.service';
import { SecurityquestionController } from './securityquestion.controller';

@Module({
  controllers: [SecurityquestionController],
  providers: [SecurityquestionService],
})
export class SecurityquestionModule {}
