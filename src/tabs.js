import IsNil from 'lodash-es/isNil';

import {Tabs} from 'neon-extension-browser-base/tabs';


export class WebExtensionsTabs extends Tabs {
    constructor() {
        super();

        this._listeners = [];

        // Bind to tab events
        this.bind();
    }

    static get api() {
        return browser.tabs;
    }

    static get key() {
        return 'tabs';
    }

    bind() {
        if(!this.supported) {
            return false;
        }

        // Bind to tab events
        this._bind(this.api.onRemoved, (tabId, removeInfo) => {
            this.emit('removed', tabId, removeInfo);
            this.emit('removed#' + tabId, removeInfo);
        });

        // Successfully bound to tab events
        return true;
    }

    create(properties) {
        return this.api.create(properties);
    }

    update(tabId, properties) {
        return this.api.update(tabId, properties);
    }

    dispose() {
        // Unbind listeners
        this._listeners.forEach((entry) => {
            try {
                entry.unbind();
            } catch(e) {
                console.warn('Unable to unbind %o from event %o', entry.callback, entry.event);
            }
        });

        // Reset state
        this._listeners = [];
    }

    // region Private Methods

    _bind(event, callback) {
        callback = callback.bind(this);

        // Ensure event exists
        if(IsNil(event)) {
            return;
        }

        // Bind to event
        try {
            event.addListener(callback);
        } catch(e) {
            console.warn('Unable to bind %o to event %o:', callback, event, e.stack);
            return;
        }

        // Store reference (for future disposal)
        this._listeners.push({
            event: event,
            callback: callback,

            unbind: () => {
                event.removeListener(callback);
            }
        });
    }

    // endregion
}
