import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});

  app.enableShutdownHooks();

  const swaggerConfig = new DocumentBuilder()
    .setTitle('AM BigBank Transfers Microservice API')
    .setDescription('The BigBank Transfers Microservice API description')
    .setVersion('1.0')
    .addTag('transfers', 'Transfers')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  const configService = app.get(ConfigService);

  const port = configService.get('port');
  await app.listen(port);

  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
