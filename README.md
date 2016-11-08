# ng2-chrome-storage
Chrome extensions storage API simplified for Angular 2.

- The [storage API](https://developer.chrome.com/extensions/storage) is mostly used for providing app settings to extensions's end users. 
*e.g. In your weather extension, ask user for his location etc.*
- **ng2-chrome-storage** makes settings available to your components by a simple API.
- **Developer friendly**: Your extensions will work on your local environment as well by making use of browser's `localStorage`.
-  

### Setup

In you main app module add `Ng2ChromeStorageModule` to imports with default settings defined in the class `SettingsConfig`:

```typescript
import { ChromeStorage, ChromeStorageResolver } from './ng2-chrome-storage/ng2-chrome-storage.service';
import { SettingsConfig } from './ng2-chrome-storage/settings.class';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    Ng2ChromeStorageModule.forRoot(new SettingsConfig())
  ],
  providers: [ChromeStorageResolver, ChromeStorage],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

Resolve the settings in your route configration using `ChromeStorageResolver`. This will make all settings available in your components:
Example routing module:
```typescript
const routes: Routes = [
  {
    path: '',
    redirectTo: 'app',
    pathMatch: 'full'
  },
  {
    path: 'app',
    component: RootComponent,
    resolve: {
      settings: ChromeStorageResolver
    }
  }
];
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
  providers: [{
      provide: 'settings',
      useValue: ChromeStorageResolver}]
})
export class AppRoutingModule {}
```

### Usage

Now simply use `ChromeStorage` service. It's `config` property holds the settings.
Example component:
```typescript
import { Component, OnInit } from '@angular/core';
import { ChromeStorage } from './../ng2-chrome-storage/ng2-chrome-storage.service';

@Component({
  selector: 'app-root-container',
  templateUrl: './root.component.html'
})
export class RootComponent implements OnInit {

  backgroundImage: boolean;

  constructor(private _settings: ChromeStorage) {
  }

  ngOnInit() {
    // Note: All app-wide settings are avaible in the config property
    this.backgroundImage = this._settings.config.backgroundImage;

    // Use any key you want to store & retrieve additional data
    this._settings.getChrome('additionalSettings', {}).then((data) => {
       console.log(data);
     });
  }

}
```
Subscribe to Change detection:
```typescript
  ngOnInit() {
    this.backgroundImage = this._settings.config.backgroundImage;
    this._settings.onChange().subscribe((data) => {
      this.backgroundImage = data.backgroundImage;
    });
  }
```

### Your App's Settings Page

Example component:
```typescript
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ChromeStorage } from './../ng2-chrome-storage/ng2-chrome-storage.service';

@Component({
  selector: 'app-settings',
  template: `
  <div class="text-container settings-container">
      <form [formGroup]="form" class="form-horizontal">
        <h2>Extension Settings</h2>
        <div class="form-group row">
          <label class="col-xs-4 text-left col-form-label">Background Image</label>
          <div class="col-sm-8">
              <input type="checkbox"  formControlName="backgroundImage">
          </div>
        </div>
        <div class="form-group row">
          <label class="col-xs-4 text-left col-form-label">Address</label>
          <div class="col-xs-8">
                <input type="text" class="form-control" formControlName="userLocation">
          </div>
        </div>
      </form>
  </div>
  `
})
export class SettingsComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder, private _settings: ChromeStorage) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      backgroundImage: [this._settings.config.backgroundImage], // load from storage
      userLocation: [this._settings.config.userLocation]
    });
    this.subcribeToFormChanges();
  }

  subcribeToFormChanges() {
    const myFormValueChanges$ = this.form.valueChanges;
    myFormValueChanges$.subscribe(settings => {
      // Save all settings to the storage
      this._settings.setAll(settings);
    });
  }
}
```

## API

### Properties:
`storeKey:` Set the key name to be used for main storage.

`config:` Holds the settings.

### Methods:

`setAll(settings: Object, key = this.storeKey): Promise<boolean>`

⋅⋅⋅Save an object to the storage.

`getChrome(key: string, defaults = {}): Promise<any>`

⋅⋅⋅Get object with a specific key and defaults.

`onChange(key = this.storeKey): Observable<any>`

⋅⋅⋅Change detection on storage. Changes will be availabe in the `data` param of the subscribe method.

`remove(key: string): Promise<boolean>`

⋅⋅⋅Remove a specific object by key.

`clear(): Promise<boolean>`

⋅⋅⋅Clear all the storage.


### Contributions are welcome!
