import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const config = {
  port: parseInt(process.env.PORT, 10) || 3004,
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});

  const swaggerConfig = new DocumentBuilder()
    .setTitle('AM BigBank Users Microservice API')
    .setDescription('The BigBank Users Microservice API description')
    .setVersion('1.0')
    .addTag('users', 'Users')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(config.port);

  console.log(`Application is running on: http://localhost:${config.port}`);
}
bootstrap();
