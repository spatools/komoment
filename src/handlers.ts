import * as ko from "knockout";
import * as moment from "moment";

import {
    getMoment,
    getValue,

    Moment,
    MomentInput,

    ExtenderOptions
} from "./core";

const
    unwrap = ko.unwrap,
    handlers = ko.bindingHandlers;

export type DateBindingHandlerOptions = ko.MaybeSubscribable<string | number | DateBindingHandlerObjectOptions>;
export interface DateBindingHandlerObjectOptions extends ExtenderOptions {
    value?: ko.MaybeSubscribable<MomentInput>;
    attr?: string;
}

declare module "knockout" {
    export interface BindingHandlers {
        moment: {
            init(element: HTMLElement, valueAccessor: () => DateBindingHandlerOptions): void;
            update(element: HTMLElement, valueAccessor: () => DateBindingHandlerOptions): void;
        };

        date: {
            init(element: HTMLElement, valueAccessor: () => DateBindingHandlerOptions): void;
            update(element: HTMLElement, valueAccessor: () => DateBindingHandlerOptions): void;
        };
    }
}

handlers.moment = handlers.date = {
    init(element, valueAccessor) {
        const
            initial = valueAccessor(),
            unwrapped = unwrap(initial);

        let options: DateBindingHandlerObjectOptions,
            value: ko.MaybeSubscribable<MomentInput>;

        if (typeof unwrapped === "object") {
            value = unwrapped.value;
            delete unwrapped.value;

            options = ko.toJS(unwrapped);
        }
        else {
            value = initial as ko.MaybeSubscribable<string | number>;
            options = {};
        }

        if (ko.isWriteableObservable(value) && options.attr === "value") {
            element.addEventListener("change", onChange, false);
        }

        function onChange(this: HTMLInputElement, e: Event) {
            const
                _moment = getMoment(this.value, options),
                opts = (<any>value).momentOptions || options;

            if (ko.isWriteableObservable(value)) {
                value(getValue(_moment, opts));
            }
        }
    },
    update(element, valueAccessor) {
        const
            initial = valueAccessor(),
            unwrapped = unwrap(initial);

        let options: DateBindingHandlerObjectOptions,
            value: ko.MaybeSubscribable<MomentInput>;

        if (typeof unwrapped === "object") {
            value = unwrapped.value;
            delete unwrapped.value;

            options = ko.toJS(unwrapped);
        }
        else {
            value = initial as ko.MaybeSubscribable<string | number>;
            options = {};
        }

        if (unwrapped) {
            const
                date = (<any>value).date,
                _moment = (date && moment.isMoment(date)) ? date : getMoment(unwrap(value), options),
                text = getValue(_moment, options);

            switch (options.attr || "text") {
                case "value":
                    (<HTMLInputElement>element).value = text;
                    break;
                case "text":
                    element.innerText = text;
                    break;
                default:
                    element.setAttribute(options.attr as string, text);
                    break;
            }
        }
    }
};
