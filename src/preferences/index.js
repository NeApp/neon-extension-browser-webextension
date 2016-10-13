import {Preferences} from 'eon.extension.browser.base/preferences';

import {PreferencesContext} from './context';


export class WebExtensionsPreferences extends Preferences {
    context(name) {
        return new PreferencesContext(this, name);
    }
}
