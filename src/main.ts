import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger(bootstrap.name);
  const app = await NestFactory.create(AppModule);
  await app.listen(5000, () => {
    logger.debug('Server is running at http://localhost:3000');
  });
}
bootstrap();
