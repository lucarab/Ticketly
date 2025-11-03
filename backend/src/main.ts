import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SeederService } from './database/seeder.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const seederService = app.get(SeederService);
  await seederService.seedDefaultUsers();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
