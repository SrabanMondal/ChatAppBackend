import { Controller, Get, Inject, VERSION_NEUTRAL } from '@nestjs/common';
import { AppService } from './app.service';
import { DataSource } from 'typeorm';
import { getDataSourceToken } from '@nestjs/typeorm';

@Controller({
  version: VERSION_NEUTRAL,
})
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(getDataSourceToken()) private datasource: DataSource,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('/health')
  async checkHealth() {
    await this.datasource.query('SELECT 1');
    try {
      return { status: 'ok', message: 'Database connected' };
    } catch (error) {
      return {
        status: 'error',
        message: 'Database connection error',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
