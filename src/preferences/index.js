import {Preferences} from 'eon.extension.browser.base/preferences';

import {WebExtensionsPreferencesContext} from './context';


export class WebExtensionsPreferences extends Preferences {
    context(name) {
        return new WebExtensionsPreferencesContext(this, name);
    }
}
