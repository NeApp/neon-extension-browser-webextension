/* global browser */
import {Extension} from 'eon.extension.browser.base/extension';


export class WebExtensionsExtension extends Extension {
    static get supported() {
        return true;
    }

    get api() {
        return browser.runtime;
    }

    get id() {
        return this.api.id;
    }

    getUrl(path) {
        return this.api.getURL(path);
    }
}
