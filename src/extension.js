import IsNil from 'lodash-es/isNil';

import {Extension} from 'neon-extension-browser-base/extension';


export class WebExtensionsExtension extends Extension {
    constructor() {
        super();

        this._listeners = [];

        // Bind to runtime events
        this.bind();
    }

    static get api() {
        return browser.runtime;
    }

    get id() {
        return this.api.id;
    }

    bind() {
        if(!this.supported) {
            return false;
        }

        // Bind to runtime events
        this._bind(this.api.onInstalled, (details) =>
            this.emit('installed', details)
        );

        // Successfully bound to runtime events
        return true;
    }

    getUrl(path) {
        return this.api.getURL(path);
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

    // region Private methods

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
