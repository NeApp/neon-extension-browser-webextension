/* global browser */
import Tabs from 'eon.extension.browser.base/tabs';


export default class WebExtensionsTabs extends Tabs {
    static get supported() {
        return true;
    }

    update(tabId, properties) {
        return browser.tabs.update(tabId, properties);
    }
}
