import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Client } from 'pg';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

async function testDatabaseConnection() {
  const client = new Client({
    host: '172.22.224.1',
    port: 5432,
    user: 'postgres',
    password: 'eventpass123',
    database: 'event_scheduler',
  });

  try {
    await client.connect();
    console.log('Database connected successfully!');
    await client.end();
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}

testDatabaseConnection();
