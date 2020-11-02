import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '@core/config/config.service';

@Injectable()
export class StartupService {
  constructor(private httpClient: HttpClient, private injector: Injector) {}

  async load(): Promise<any> {
    const configService: ConfigService = this.injector.get(ConfigService);
    await configService.onLoad.toPromise();
  }
}
