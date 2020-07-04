# ngx-chrome-storage
Chrome extensions storage API simplified for Angular 2.

- The [storage API](https://developer.chrome.com/extensions/storage) is mostly used for providing app settings to extensions's end users. 
*e.g. In your weather extension, ask user for his location etc.*
- **ngx-chrome-storage** makes settings available to your components by a simple API, they are loaded before anything is initialized.
- Developer friendly: Your extensions will work on your local environment as well by making use of browser's `localStorage`.



## Setup

```
npm install ngx-chrome-storage
```

Create your own `settings.class.ts` file to represent the default settings:


```typescript
import { Settings } from 'ngx-chrome-storage';

export class SettingsConfig extends Settings {
  storeKey:string = 'myappstoragekey';  // identifier to be used as a key for storage
  data = {
    backgroundImage: true,
    // .. more settings
  };
};
```

In you main app module add `NgxChromeStorageModule` and pass your default settings to it:

```typescript
import { NgxChromeStorageModule } from 'ngx-chrome-storage';
import { SettingsConfig } from './settings.class';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    NgxChromeStorageModule.forRoot(new SettingsConfig())
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

That is it! Rest is handled by the module.

## Usage

Now simply use `NgxChromeStorageService` service. It's `config` property holds the settings.
Example component:
```typescript
import { Component, OnInit } from '@angular/core';
import { NgxChromeStorageService } from 'ngx-chrome-storage';

@Component({
  selector: 'app-root-container',
  templateUrl: './root.component.html'
})
export class RootComponent implements OnInit {

  backgroundImage: boolean;

  constructor(private _settings: NgxChromeStorageService) {
    // loaded settings also available here
    // good practice to keep this clean
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

Example form component:
```typescript
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgxChromeStorageService } from 'ngx-chrome-storage';

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

  constructor(private fb: FormBuilder, private _settings: NgxChromeStorageService) {
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

- `setAll(settings: Object, key = this.storeKey): Promise<boolean>`
  Save an object to the storage.

- `getChrome(key: string, defaults = {}): Promise<any>`
  Get object with a specific key and defaults.

- `onChange(key = this.storeKey): Observable<any>`
  Change detection on storage. Changes will be availabe in the `data` param of the subscribe method.

- `remove(key: string): Promise<boolean>`
  Remove a specific object by key.

- `clear(): Promise<boolean>`
  Clear all the storage.


### Contributions are welcome!

**hasan.hameed07@gmail.com**
**saadqamar01@gmail.com**
