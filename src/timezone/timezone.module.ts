import { Module } from '@nestjs/common';
import { TimezoneService } from './timezone.service';
import { TimezoneController } from './timezone.controller';
import { UserModule } from '@/modules/user/user.module'; 
import { TimezoneResolver } from './timezone.resolver';

@Module({
  imports: [UserModule], 
  providers: [TimezoneService,TimezoneResolver],
  controllers: [TimezoneController],
  exports: [TimezoneService]  
})
export class TimezoneModule {}
