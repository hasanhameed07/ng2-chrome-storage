import { ModuleWithProviders, NgModule, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChromeStorage } from './ng2-chrome-storage.service';
import { Settings } from './settings.class';


@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
  ChromeStorage,
  { provide: APP_INITIALIZER, useFactory: (config: ChromeStorage) => () => config.load(), deps: [ChromeStorage], multi: true }  ]
})
export class Ng2ChromeStorageModule {

  static forRoot(config: Settings): ModuleWithProviders {
    return {
      ngModule: Ng2ChromeStorageModule,
      providers: [
        {provide: Settings, useValue: config }
      ]
    };
  }
}
