import {Platform, Platforms, PlatformTypes} from 'eon.extension.browser.base/platform';


export {
    Platforms,
    PlatformTypes
};

export class WebExtensionsPlatform extends Platform {
    get type() {
        return PlatformTypes.WebExtensions;
    }
}
