import WebRequest from 'eon.extension.browser.base/web/request';

import WebExtensionsWebRequestEvent from './requestEvent';


export default class WebExtensionsWebRequest extends WebRequest {
    static get supported() {
        return true;
    }

    createEvent(name) {
        return new WebExtensionsWebRequestEvent(name);
    }
}
