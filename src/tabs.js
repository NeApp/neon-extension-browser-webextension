/* global browser */
import {Tabs} from 'eon.extension.browser.base/tabs';


export class WebExtensionsTabs extends Tabs {
    static get supported() {
        return true;
    }

    get api() {
        return browser.tabs;
    }

    update(tabId, properties) {
        return this.api.update(tabId, properties);
    }
}
