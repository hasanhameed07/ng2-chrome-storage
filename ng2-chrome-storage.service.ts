import { Injectable, NgZone, Optional } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { SettingsConfig } from './settings.class';


@Injectable()
export class ChromeStorage {
  storeKey = 'hhappsettings'; // chrome storage key
  config: SettingsConfig;     // holds settings

  constructor(private zone: NgZone, @Optional() _settings: SettingsConfig) {
    if (_settings) {
      this.config = _settings;
    } else {
      this.config = new SettingsConfig();
    }
  }

  // to be used inside a resolver
  load() {
    return this.getChrome(this.storeKey, this.config).then((data: SettingsConfig) => {
      this.config = data;
      return data;
    });
  }

  // save an object
  setAll(settings: Object, key = this.storeKey): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (chrome !== undefined && chrome.storage !== undefined) {
        let saveObj = {};
        saveObj[key] = settings;
        chrome.storage.sync.set(/* String or Array */saveObj, () => this.zone.run(() => {
          resolve(true);
        }));
      } else {
        // Put the object into storage
        localStorage.setItem(key, JSON.stringify(settings));
        // hack to resolve storage change event on the same window
        window.dispatchEvent( new Event('storage') );
        resolve(true);
      }
    });
  }

  // remove a key
  remove(key: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (chrome !== undefined && chrome.storage !== undefined) {
        chrome.storage.sync.remove(/* String or Array */key, () => this.zone.run(() => {
          resolve(true);
        }));
      } else {
        localStorage.removeItem(key);
        resolve(true);
      }
    });
  }

  // clears the storage
  clear(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (chrome !== undefined && chrome.storage !== undefined) {
        chrome.storage.sync.clear(/* String or Array */key, () => this.zone.run(() => {
          resolve(true);
        }));
      } else {
        localStorage.clear();
        resolve(true);
      }
    });
  }

  getChrome(key: string, defaults = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      if (chrome !== undefined && chrome.storage !== undefined) {
        let saveObj = {};
        saveObj[key] = defaults;
        chrome.storage.sync.get(/* String or Array */saveObj, (data) => this.zone.run(() => {
         resolve(data[key]);
        }));
      } else {
        let object =  (localStorage.getItem(key) === null) ? defaults : JSON.parse(localStorage.getItem(key));
        resolve(object);
      }
    });
  }

  //  change detection
  onChange(key = this.storeKey): Observable<any> {
    return Observable.create(observer => {
      if (chrome !== undefined && chrome.storage !== undefined) {
        chrome.storage.onChanged.addListener((changes, namespace) => this.zone.run(() => {
          if (!key) {
            // give all changes
            observer.next(changes);
          } else {
            for (let tkey in changes) {
              if ( changes.hasOwnProperty( tkey ) ) {
                let storageChange = changes[tkey];
                if (tkey === key) {
                  this.config = storageChange.newValue;
                  observer.next(storageChange.newValue);
                }
              }
            }
          }
        }));
      } else {
        window.addEventListener('storage', () => this.zone.run(() => {
           let object = JSON.parse(localStorage.getItem(key));
           this.config = object;
           observer.next(object);
        }), false);
      }
    });
  }

}

@Injectable()
export class ChromeStorageResolver implements Resolve<any> {
  constructor(private _settings: ChromeStorage) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    return this._settings.load();
  }
}
