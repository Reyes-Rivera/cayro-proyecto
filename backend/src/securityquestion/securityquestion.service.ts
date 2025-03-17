import { Injectable } from '@nestjs/common';
import { CreateSecurityquestionDto } from './dto/create-securityquestion.dto';
import { UpdateSecurityquestionDto } from './dto/update-securityquestion.dto';

@Injectable()
export class SecurityquestionService {
  create(createSecurityquestionDto: CreateSecurityquestionDto) {
    return 'This action adds a new securityquestion';
  }

  findAll() {
    return `This action returns all securityquestion`;
  }

  findOne(id: number) {
    return `This action returns a #${id} securityquestion`;
  }

  update(id: number, updateSecurityquestionDto: UpdateSecurityquestionDto) {
    return `This action updates a #${id} securityquestion`;
  }

  remove(id: number) {
    return `This action removes a #${id} securityquestion`;
  }
}
