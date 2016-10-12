/* global browser */
import Messaging from 'eon.extension.browser.base/messaging';

import {isDefined} from 'eon.extension.framework/core/helpers';

import merge from 'lodash-es/merge';

import WebExtensionsPort from './port';


export default class WebExtensionsMessaging extends Messaging {
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

    get supportsExternalMessaging() {
        return true;
    }

    bind() {
        if(!this.constructor.supported) {
            console.warn('Messaging is not supported, not binding to any events');
            return false;
        }

        // Bind to extension messaging events
        this._bind(browser.runtime.onConnect, (port) =>
            this.emit('connect', this.createPortWrapper(port))
        );

        this._bind(browser.runtime.onMessage, (data, sender, sendResponse) =>
            this.emit('message', data, null, sendResponse)
        );

        // Bind to external messaging events (if enabled)
        if(this.constructor.supportsExternalMessaging) {
            this._bind(browser.runtime.onConnectExternal, (port) =>
                this.emit('connectExternal', this.createPortWrapper(port))
            );

            this._bind(browser.runtime.onMessageExternal, (data, sender, sendResponse) =>
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

    connect(extensionId, options) {
        let port = browser.runtime.connect(extensionId, options);

        if(!isDefined(port)) {
            return null;
        }

        return this.createPortWrapper(port);
    }

    sendMessage(extensionId, message, options) {
        return this._sendMessage(
            browser.runtime.sendMessage,
            extensionId, message, options
        );
    }

    // endregion

    // region Native

    connectNative(application) {
        let port = browser.runtime.connectNative(application);

        if(!isDefined(port)) {
            return null;
        }

        return this.createPortWrapper(port);
    }

    sendNativeMessage(application, message, options) {
        return this._sendMessage(
            browser.runtime.sendNativeMessage,
            application, message, options
        );
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

    _sendMessage(method, target, message, options) {
        options = isDefined(options) ? options : {};

        // Set default options
        options = merge({
            awaitResponse: true,
            timeout: 5
        }, options);

        // Return promise
        return new Promise((resolve, reject) => {
            // Build method parameters
            let parameters = {
                includeTlsChannelId: options.includeTlsChannelId
            };

            // Send message and resolve instantly
            if(!options.awaitResponse) {
                method(target, message, parameters);

                // Resolve promise
                resolve();
                return;
            }

            // Send message and await response
            let cancelTimeout = null;

            method(target, message, parameters, (response) => {
                // Cancel timeout callback
                if(cancelTimeout !== null) {
                    cancelTimeout();
                }

                // Reject promise with runtime error
                if(typeof response === 'undefined') {
                    reject(new Error(browser.runtime.lastError));
                    return;
                }

                // Resolve promise
                resolve(response);
            });

            // Timeout promise in `options.timeout` seconds (if timeout has been defined)
            if(isDefined(options.timeout)) {
                cancelTimeout = setTimeout(() => {
                    // Reject promise with timeout error
                    reject(new Error('No response returned within ' + options.timeout + ' second(s)'));
                }, options.timeout);
            }
        });
    }
}
