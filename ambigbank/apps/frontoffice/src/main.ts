import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AxiosErrorFilter } from './exceptions';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});

  app.useGlobalFilters(new AxiosErrorFilter());

  const config = new DocumentBuilder()
    .setTitle('AM BigBank FrontOffice API')
    .setDescription('The AM BigBank API description')
    .setVersion('1.0')
    .addTag('transfers', 'Banking operations & transactions')
    .addTag('bank-accounts', 'Banking Accounts')
    .addTag('users', 'Users')
    .addTag('auth', 'Authentication')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const configService = app.get(ConfigService);
  const port = configService.get('port');

  await app.listen(port);

  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
