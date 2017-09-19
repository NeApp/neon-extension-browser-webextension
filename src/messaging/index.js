import {Messaging} from 'eon.extension.browser.base/messaging';
import {isDefined, isFunction} from 'eon.extension.framework/core/helpers';

import {WebExtensionsPort} from './port';


export class WebExtensionsMessaging extends Messaging {
    constructor() {
        super();

        this._listeners = [];

        // Bind to messaging events
        this.bind();
    }

    static get supported() {
        return true;
    }

    static get supportsExternalMessaging() {
        return true;
    }

    get api() {
        return browser.runtime;
    }

    get available() {
        return isFunction(this.api.connect);
    }

    get supportsExternalMessaging() {
        return true;
    }

    bind() {
        if(!this.constructor.supported) {
            console.warn('Messaging is not supported, not binding to any events');
            return false;
        }

        // Bind to extension messaging events
        this._bind(this.api.onConnect, (port) =>
            this.emit('connect', this.createPortWrapper(port))
        );

        this._bind(this.api.onMessage, (data, sender, sendResponse) =>
            this.emit('message', data, null, sendResponse)
        );

        // Bind to external messaging events (if enabled)
        if(this.constructor.supportsExternalMessaging) {
            this._bind(this.api.onConnectExternal, (port) =>
                this.emit('connectExternal', this.createPortWrapper(port))
            );

            this._bind(this.api.onMessageExternal, (data, sender, sendResponse) =>
                this.emit('messageExternal', data, null, sendResponse)
            );
        } else {
            console.debug('External messaging is not supported, not binding to external events');
        }

        // Successfully bound to messaging events
        return true;
    }

    createPortWrapper(port) {
        return new WebExtensionsPort(port);
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

    // region Web

    connect(...args) {
        if(!isFunction(this.api.connect)) {
            throw new Error('Extension "connect" method is not available');
        }

        let port = this.api.connect(...args);

        if(!isDefined(port)) {
            return null;
        }

        return this.createPortWrapper(port);
    }

    sendMessage(...args) {
        return this.api.sendMessage(...args);
    }

    // endregion

    // region Native

    connectNative(...args) {
        if(!isFunction(this.api.connectNative)) {
            throw new Error('Extension "connectNative" method is not available');
        }

        let port = this.api.connectNative(...args);

        if(!isDefined(port)) {
            return null;
        }

        return this.createPortWrapper(port);
    }

    sendNativeMessage(...args) {
        return this.api.sendNativeMessage(...args);
    }

    // endregion

    // Private methods

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
}
