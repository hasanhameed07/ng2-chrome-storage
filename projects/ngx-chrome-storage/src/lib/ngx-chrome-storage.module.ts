import { ModuleWithProviders, NgModule, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Settings } from './settings.class';
import { NgxChromeStorageService } from './ngx-chrome-storage.service';


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    NgxChromeStorageService,
    {
      provide: APP_INITIALIZER,
      useFactory: (config: NgxChromeStorageService) => () => config.load(),
      deps: [NgxChromeStorageService],
      multi: true
    }
  ],
  exports: []
})
export class NgxChromeStorageModule {
  static forRoot(config: Settings): ModuleWithProviders {
    return {
      ngModule: NgxChromeStorageModule,
      providers: [
        {provide: Settings, useValue: config }
      ]
    };
  }
}
