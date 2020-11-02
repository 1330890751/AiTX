import { NgModule, ModuleWithProviders, APP_INITIALIZER, SkipSelf, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { ConfigService } from 'src/app/core/config/config.service';
import { EnvConfig } from 'src/app/core/config/env-config';

export function ConfigFactory(config: ConfigService, env: EnvConfig) {
  const res = () => config.load(env);
  return res;
}

@NgModule({
  imports: [CommonModule, HttpClientModule],
  providers: [
    ConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: ConfigFactory,
      deps: [ConfigService, EnvConfig],
      multi: true,
    },
  ],
  declarations: [],
})
export class ConfigModule {
  constructor(@Optional() @SkipSelf() parentModule: ConfigModule) {
    if (parentModule) {
      throw new Error('ConfigModule is already loaded. Import it in the AppModule only');
    }
  }

  static forRoot(env: EnvConfig): ModuleWithProviders<ConfigModule> {
    return {
      ngModule: ConfigModule,
      providers: [{ provide: EnvConfig, useValue: env }],
    };
  }
}
