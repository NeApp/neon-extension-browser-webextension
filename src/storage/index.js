import Storage from 'eon.extension.browser.base/storage';

import WebExtensionsStorageContext from './context';


export default class WebExtensionsStorage extends Storage {
    context(name) {
        return new WebExtensionsStorageContext(this, name);
    }
}
