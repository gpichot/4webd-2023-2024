import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});

  const config = new DocumentBuilder()
    .setTitle('AM BigBank API')
    .setDescription('The AM BigBank API description')
    .setVersion('1.0')
    .addTag('transfers', 'Banking operations & transactions')
    .addTag('bank-accounts', 'Banking Accounts')
    .addTag('users', 'Users')
    .addTag('auth', 'Authentication')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();