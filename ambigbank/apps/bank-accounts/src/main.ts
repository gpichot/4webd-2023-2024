import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});

  const config = new DocumentBuilder()
    .setTitle('AM BigBank Bank Accounts Microservice API')
    .setDescription('The BigBank Bank Accounts Microservice API description')
    .setVersion('1.0')
    .addTag('accounts', 'Bank Accounts')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3003);

  console.log(`Application is running on: http://localhost:3003`);
}
bootstrap();
