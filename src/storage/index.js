import IsNil from 'lodash-es/isNil';

import {Storage} from 'neon-extension-browser-base/storage';
import {isSupported} from 'neon-extension-browser-base/base';


import {WebExtensionsStorageContext} from './context';


export class WebExtensionsStorage extends Storage {
    static get api() {
        if(IsNil(browser.storage)) {
            return null;
        }

        return browser.storage.local;
    }

    static get key() {
        return 'storage';
    }

    static get supportsStorageApi() {
        return isSupported(WebExtensionsStorage.key) && !IsNil(this.api);
    }

    context(name) {
        return new WebExtensionsStorageContext(this, name);
    }

    remove(key) {
        if(!this.constructor.supportsStorageApi) {
            return super.remove(key);
        }

        // Remove value from storage
        return this.api.remove(key);
    }

    get(key) {
        if(!this.constructor.supportsStorageApi) {
            return super.get(key);
        }

        // Try retrieve value from storage
        return this.api.get(key).then((items) => {
            let value = items[key];

            if(IsNil(value)) {
                return super.get(key);
            }

            return value;
        });
    }

    put(key, value) {
        if(!this.constructor.supportsStorageApi) {
            return super.put(key, value);
        }

        // Build item
        let item = {};

        item[key] = value;

        // Put value in storage
        return this.api.set(item);
    }
}
