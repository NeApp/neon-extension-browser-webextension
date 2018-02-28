import IsNil from 'lodash-es/isNil';

import {Port} from 'neon-extension-browser-base/messaging/port';


export class WebExtensionsPort extends Port {
    constructor(port) {
        super();

        this._port = port;

        this._connected = true;
        this._error = null;

        this._listeners = [];

        // Bind to port events
        this._bind(this._port.onDisconnect, () => {
            let error = this.api.lastError;

            // Update state
            this._connected = false;
            this._error = error;

            // Emit event
            this.emit('disconnect', error, this);

            // Unbind event listeners
            this.dispose();
        });

        this._bind(this._port.onMessage, (message) =>
            this.emit('message', message, this)
        );
    }

    static get api() {
        return browser.runtime;
    }

    get connected() {
        return this._connected;
    }

    get error() {
        return this._error;
    }

    get name() {
        if(IsNil(this._port)) {
            return null;
        }

        return this._port.name;
    }

    get sender() {
        if(IsNil(this._port)) {
            return null;
        }

        return this._port.sender;
    }

    disconnect() {
        if(IsNil(this._port)) {
            throw new Error('No port available');
        }

        return this._port.disconnect();
    }

    postMessage(message) {
        if(IsNil(this._port)) {
            throw new Error('No port available');
        }

        return this._port.postMessage(message);
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
