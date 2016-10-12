/* global chrome */
import Tabs from 'eon.extension.browser.base/tabs';

import Deferred from 'eon.extension.framework/core/deferred';


export default class WebExtensionsTabs extends Tabs {
    static get supported() {
        return true;
    }

    update(tabId, properties) {
        let deferred = Deferred();

        // Update tab
        chrome.tabs.update(tabId, properties, (tab) => {
            deferred.resolve(tab);
        });

        // Return promise
        return deferred.promise();
    }
}
