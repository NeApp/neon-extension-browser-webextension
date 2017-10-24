import {NotImplementedError} from 'neon-extension-framework/core/exceptions';
import {WebRequestEvent} from 'neon-extension-browser-base/web/requestEvent';
import {isDefined} from 'neon-extension-framework/core/helpers';


export class WebExtensionsWebRequestEvent extends WebRequestEvent {
    static get api() {
        return browser.webRequest;
    }

    addListener(callback, options) {
        if(!isDefined(options)) {
            throw new Error('Invalid value provided for the "options" parameter');
        }

        if(!isDefined(options.urls)) {
            throw new Error('Missing the required "options.urls" parameter');
        }

        this.api[this.name].addListener(callback, {
            urls: options.urls
        });
    }

    removeListener(callback) {
        throw new NotImplementedError();
    }
}
