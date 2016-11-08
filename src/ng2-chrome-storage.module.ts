import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChromeStorage, ChromeStorageResolver } from './ng2-chrome-storage.service';
import { SettingsConfig } from './../settings.class';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [ChromeStorage, ChromeStorageResolver]
})
export class Ng2ChromeStorageModule {

  static forRoot(config: SettingsConfig): ModuleWithProviders {
    return {
      ngModule: Ng2ChromeStorageModule,
      providers: [
        {provide: SettingsConfig, useValue: config }
      ]
    };
  }
}
