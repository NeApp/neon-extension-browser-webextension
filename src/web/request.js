import {WebRequest} from 'neon-extension-browser-base/web/request';

import {WebExtensionsWebRequestEvent} from './requestEvent';


export class WebExtensionsWebRequest extends WebRequest {
    static get api() {
        return browser.webRequest;
    }

    static get key() {
        return 'webRequest';
    }

    createEvent(name) {
        return new WebExtensionsWebRequestEvent(name);
    }
}
