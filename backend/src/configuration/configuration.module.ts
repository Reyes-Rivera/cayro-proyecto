import { Module } from '@nestjs/common';
import { ConfigurationService } from './configuration.service';
import { ConfigurationController } from './configuration.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Configuration, ConfigurationSchema } from './schema/schemaconfig';

@Module({
  imports:[MongooseModule.forFeature([{
    name:Configuration.name,
    schema:ConfigurationSchema
  },
])],
  controllers: [ConfigurationController],
  providers: [ConfigurationService],
  exports:[ConfigurationService]
})
export class ConfigurationModule {}
