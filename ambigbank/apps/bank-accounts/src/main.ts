import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  console.log(process.env.DATABASE_URL);
  const app = await NestFactory.create(AppModule, {});

  const config = new DocumentBuilder()
    .setTitle('AM BigBank Bank Accounts Microservice API')
    .setDescription('The BigBank Bank Accounts Microservice API description')
    .setVersion('1.0')
    .addTag('accounts', 'Bank Accounts')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const configService = app.get(ConfigService);
  const port = configService.get('port');

  await app.listen(port);

  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
