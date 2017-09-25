import {WebRequest} from 'neon-extension-browser-base/web/request';

import {WebExtensionsWebRequestEvent} from './requestEvent';


export class WebExtensionsWebRequest extends WebRequest {
    static get supported() {
        return true;
    }

    createEvent(name) {
        return new WebExtensionsWebRequestEvent(name);
    }
}
