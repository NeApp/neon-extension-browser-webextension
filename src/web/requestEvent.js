/* global browser */
import WebRequestEvent from 'eon.extension.browser.base/web/requestEvent';

import {NotImplementedError} from 'eon.extension.framework/core/exceptions';
import {isDefined} from 'eon.extension.framework/core/helpers';


export default class WebExtensionsWebRequestEvent extends WebRequestEvent {
    static get supported() {
        return true;
    }

    addListener(callback, options) {
        if(!isDefined(options)) {
            throw new Error('Invalid value provided for the "options" parameter');
        }

        if(!isDefined(options.urls)) {
            throw new Error('Missing the required "options.urls" parameter');
        }

        browser.webRequest[this.name].addListener(callback, {
            urls: options.urls
        });
    }

    removeListener(callback) {
        throw new NotImplementedError();
    }
}
