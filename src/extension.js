/* global browser */
import Extension from 'eon.extension.browser.base/extension';


export default class WebExtensionsExtension extends Extension {
    static get supported() {
        return true;
    }

    get id() {
        return browser.runtime.id;
    }

    getUrl(path) {
        return browser.runtime.getURL(path);
    }
}
