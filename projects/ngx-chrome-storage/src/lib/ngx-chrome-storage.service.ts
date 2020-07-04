import { Injectable, NgZone, Optional } from '@angular/core';
import { Settings } from './settings.class';
import { Observable } from 'rxjs/internal/Observable';
import { Observer } from 'rxjs/internal/types';

@Injectable({
  providedIn: 'root'
})
export class NgxChromeStorageService {
  storeKey = ''; // chrome storage key
  config: any;     // holds settings
  constructor(private zone: NgZone, @Optional() settings: Settings) {
    const usethisSettings = (settings) ? settings : new Settings();
    this.config = usethisSettings.data;
    this.storeKey = usethisSettings.storeKey;
  }

  // to be used inside a resolver
  load() {
    return this.getChrome(this.storeKey, this.config).then((data: any) => {
      this.config = data;
      return data;
    });
  }

  // save an object
  setAll(settings: object, key = this.storeKey): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (chrome !== undefined && chrome.storage !== undefined) {
        const saveObj = {};
        saveObj[key] = settings;
        chrome.storage.sync.set(/* String or Array */saveObj, () => resolve(true));
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
        chrome.storage.sync.remove(/* String or Array */key, () => resolve(true));
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
        chrome.storage.sync.clear(() => resolve(true));
      } else {
        localStorage.clear();
        resolve(true);
      }
    });
  }

  getChrome(key: string, defaults = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      if (chrome !== undefined && chrome.storage !== undefined) {
        const saveObj = {};
        saveObj[key] = defaults;
        chrome.storage.sync.get(/* String or Array */saveObj, (data) => resolve(data[key]));
      } else {
        const object =  (localStorage.getItem(key) === null) ? defaults : JSON.parse(localStorage.getItem(key));
        resolve(object);
      }
    });
  }

  //  change detection
  onChange(key = this.storeKey): Observable<any> {
    return new Observable((observer: Observer<any>) => {
      if (chrome !== undefined && chrome.storage !== undefined) {
        chrome.storage.onChanged.addListener((changes, namespace) => {
          if (!key) {
            // give all changes
            observer.next(changes);
          } else {
            for (const tkey in changes) {
              if ( changes.hasOwnProperty( tkey ) ) {
                const storageChange = changes[tkey];
                if (tkey === key) {
                  this.config = storageChange.newValue;
                  observer.next(storageChange.newValue);
                }
              }
            }
          }
        });
      } else {
        window.addEventListener('storage', () => {
           const object = JSON.parse(localStorage.getItem(key));
           this.config = object;
           observer.next(object);
        }, false);
      }
    });
  }

}
