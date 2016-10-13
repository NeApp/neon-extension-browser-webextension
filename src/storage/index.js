import {Storage} from 'eon.extension.browser.base/storage';

import {WebExtensionsStorageContext} from './context';


export class WebExtensionsStorage extends Storage {
    context(name) {
        return new WebExtensionsStorageContext(this, name);
    }
}
