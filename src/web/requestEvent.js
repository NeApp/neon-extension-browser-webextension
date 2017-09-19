import {NotImplementedError} from 'eon.extension.framework/core/exceptions';
import {WebRequestEvent} from 'eon.extension.browser.base/web/requestEvent';
import {isDefined} from 'eon.extension.framework/core/helpers';


export class WebExtensionsWebRequestEvent extends WebRequestEvent {
    static get supported() {
        return true;
    }

    get api() {
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
