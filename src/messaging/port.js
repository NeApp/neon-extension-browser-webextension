import {Port} from 'eon.extension.browser.base/messaging/port';
import {isDefined} from 'eon.extension.framework/core/helpers';


export class WebExtensionsPort extends Port {
    constructor(port) {
        super();

        this._port = port;

        this._connected = true;
        this._listeners = [];

        // Bind to port events
        this._bind(this._port.onDisconnect, () => {
            // Update state
            this._connected = false;

            // Emit event
            this.emit('disconnect', this.api.lastError, this);

            // Unbind event listeners
            this.dispose();
        });

        this._bind(this._port.onMessage, (message) =>
            this.emit('message', message, this)
        );
    }

    static get supported() {
        return true;
    }

    get api() {
        return browser.runtime;
    }

    get connected() {
        return this._connected;
    }

    get name() {
        if(!isDefined(this._port)) {
            return null;
        }

        return this._port.name;
    }

    get sender() {
        if(!isDefined(this._port)) {
            return null;
        }

        return this._port.sender;
    }

    disconnect() {
        if(!isDefined(this._port)) {
            throw new Error('No port available');
        }

        return this._port.disconnect();
    }

    postMessage(message) {
        if(!isDefined(this._port)) {
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
        if(!isDefined(event)) {
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
