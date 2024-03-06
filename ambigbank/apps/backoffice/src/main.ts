import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import config from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});

  const swaggerConfig = new DocumentBuilder()
    .setTitle('AM BigBank API')
    .setDescription('The AM BigBank API description')
    .setVersion('1.0')
    .addTag('transfers', 'Banking operations & transactions')
    .addTag('bank-accounts', 'Banking Accounts')
    .addTag('users', 'Users')
    .addTag('auth', 'Authentication')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(config.port);
}
bootstrap();
