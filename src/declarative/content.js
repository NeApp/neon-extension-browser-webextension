/* global chrome */
import DeclarativeContent, {
    PageStateMatcher,
    RequestContentScript,
    SetIcon,
    ShowPageAction
} from 'eon.extension.browser.base/declarative/content';

import Deferred from 'eon.extension.framework/core/deferred';
import {NotImplementedError} from 'eon.extension.framework/core/exceptions';
import {isDefined} from 'eon.extension.framework/core/helpers';


export {
    PageStateMatcher,
    RequestContentScript,
    SetIcon,
    ShowPageAction
};

export default class WebExtensionsDeclarativeContent extends DeclarativeContent {
    static get supported() {
        return true;
    }

    addRules(rules) {
        let deferred = Deferred();

        // Construct rules
        rules = rules.map((rule) => {
            return {
                ...rule,

                actions: rule.actions.map((action) =>
                    this._createAction(action)
                ),
                conditions: rule.conditions.map((condition) =>
                    this._createCondition(condition)
                )
            };
        });

        // Add rules
        chrome.declarativeContent.onPageChanged.addRules(rules, (registeredRules) => {
            deferred.resolve(registeredRules);
        });

        return deferred.promise();
    }

    removeRules(ruleIdentifiers) {
        let deferred = Deferred();

        // Remove rules
        chrome.declarativeContent.onPageChanged.removeRules(ruleIdentifiers, () => {
            deferred.resolve();
        });

        return deferred.promise();
    }

    getRules(ruleIdentifiers) {
        let deferred = Deferred();

        // Get rules
        chrome.declarativeContent.onPageChanged.getRules(ruleIdentifiers, (rules) => {
            deferred.resolve([
                ...rules.map((rule) => {
                    return {
                        ...rule,

                        actions: rule.actions.map((action) =>
                            this._parseAction(action)
                        ),
                        conditions: rule.conditions.map((condition) =>
                            this._parseCondition(condition)
                        )
                    };
                })
            ]);
        });

        return deferred.promise();
    }

    // region Private methods

    _createAction(action) {
        if(!isDefined(action)) {
            return null;
        }

        if(action instanceof RequestContentScript) {
            return new chrome.declarativeContent.RequestContentScript(action.options);
        }

        if(action instanceof SetIcon) {
            return new chrome.declarativeContent.SetIcon(action.options);
        }

        if(action instanceof ShowPageAction) {
            return new chrome.declarativeContent.ShowPageAction();
        }

        throw new NotImplementedError('Unsupported action: ' + action);
    }

    _createCondition(condition) {
        if(!isDefined(condition)) {
            return null;
        }

        if(condition instanceof PageStateMatcher) {
            return new chrome.declarativeContent.PageStateMatcher(condition.options);
        }

        throw new NotImplementedError('Unsupported condition: ' + condition);
    }

    _parseAction(action) {
        if(!isDefined(action)) {
            return null;
        }

        if(action instanceof chrome.declarativeContent.RequestContentScript) {
            return new RequestContentScript({
                css: action.css,
                js: action.js,

                allFrames: action.allFrames,
                matchAboutBlank: action.matchAboutBlank
            });
        }

        if(action instanceof chrome.declarativeContent.SetIcon) {
            return new SetIcon({
                imageData: action.imageData
            });
        }

        if(action instanceof chrome.declarativeContent.ShowPageAction) {
            return new ShowPageAction();
        }

        throw new NotImplementedError('Unsupported action: ' + action);
    }

    _parseCondition(condition) {
        if(!isDefined(condition)) {
            return null;
        }

        if(condition instanceof chrome.declarativeContent.PageStateMatcher) {
            return new PageStateMatcher({
                pageUrl: condition.pageUrl,
                css: condition.css,

                isBookmarked: condition.isBookmarked
            });
        }

        throw new NotImplementedError('Unsupported condition: ' + condition);
    }

    // endregion
}
