/* global chrome */
import Extension from 'eon.extension.browser.base/extension';


export default class WebExtensionsExtension extends Extension {
    static get supported() {
        return true;
    }

    get id() {
        return chrome.runtime.id;
    }

    getUrl(path) {
        return chrome.runtime.getURL(path);
    }
}
