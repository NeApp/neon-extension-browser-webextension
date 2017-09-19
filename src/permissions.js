import Deferred from 'eon.extension.framework/core/deferred';
import {Permissions} from 'eon.extension.browser.base/permissions';
import {isDefined} from 'eon.extension.framework/core/helpers';


export class WebExtensionsPermissions extends Permissions {
    constructor() {
        super();

        this._listeners = [];

        // Bind to permission events
        this.bind();
    }

    static get supported() {
        return isDefined(browser.permissions);
    }

    get api() {
        return browser.permissions;
    }

    bind() {
        if(!this.constructor.supported) {
            return false;
        }

        // Bind to permission events
        this._bind(this.api.onAdded, (permissions) =>
            this.emit('added', permissions)
        );

        this._bind(this.api.onRemoved, (permissions) =>
            this.emit('removed', permissions)
        );

        // Successfully bound to permission events
        return true;
    }

    // region Public methods

    all() {
        // Create deferred promise (required so that the method is called in the correct context)
        let deferred = Deferred();

        // Remove permissions and/or origins
        this.api.getAll(deferred.resolve);

        // Return promise
        return deferred.promise();
    }

    contains(options) {
        // Validate parameters
        if(!isDefined(options)) {
            return Promise.reject(new Error(
                'Invalid value provided for the "options" parameter, expected an object matching {permissions, origins}'
            ));
        }

        // Create deferred promise (required so that the method is called in the correct context)
        let deferred = Deferred();

        // Remove permissions and/or origins
        this.api.contains({
            permissions: isDefined(options.permissions) ? options.permissions : [],
            origins: isDefined(options.origins) ? options.origins : []
        }, deferred.resolve);

        // Return promise
        return deferred.promise();
    }

    request(options) {
        // Validate parameters
        if(!isDefined(options)) {
            return Promise.reject(new Error(
                'Invalid value provided for the "options" parameter, expected an object matching {permissions, origins}'
            ));
        }

        // Create deferred promise (required so that the method is called in the correct context)
        let deferred = Deferred();

        // Request permissions and/or origins
        this.api.request({
            permissions: isDefined(options.permissions) ? options.permissions : [],
            origins: isDefined(options.origins) ? options.origins : []
        }, (granted) => {
            if(!granted) {
                deferred.reject(new Error(
                    'Unable to request permissions (rejected by user)'
                ));
                return;
            }

            deferred.resolve();
        });

        // Return promise
        return deferred.promise();
    }

    remove(options) {
        // Validate parameters
        if(!isDefined(options)) {
            return Promise.reject(new Error(
                'Invalid value provided for the "options" parameter, expected an object matching {permissions, origins}'
            ));
        }

        // Create deferred promise (required so that the method is called in the correct context)
        let deferred = Deferred();

        // Remove permissions and/or origins
        this.api.remove({
            permissions: isDefined(options.permissions) ? options.permissions : [],
            origins: isDefined(options.origins) ? options.origins : []
        }, (removed) => {
            if(!removed) {
                deferred.reject(new Error(
                    'Unable to remove permissions'
                ));
                return;
            }

            deferred.resolve();
        });

        // Return promise
        return deferred.promise();
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

    // endregion

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
