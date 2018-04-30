import * as ko from "knockout";
import * as moment from "moment";

import {
    getMoment,
    getMomentDuration,
    getValue,

    Moment,
    MomentInput,
    Duration,

    ExtenderOptions
} from "./core";


export type MomentObservable<T extends MomentInput> = ko.Observable<T> & Moment & MomentObservableExtensions;
export interface MomentObservableExtensions {
    now(): void;
    date: Moment;
}

export type DurationObservable = ko.Observable<string> & Duration & DurationObservableExtensions;
export interface DurationObservableExtensions {
    duration: Duration;
}

declare module "knockout" {
    export interface Extenders {
        moment<T = any>(target: ko.Subscribable<T>, options?: ExtenderOptions | null): MomentObservable<T>;
        duration<T = any>(target: ko.Subscribable<T>, options?: any): DurationObservable;
    }

    export interface SubscribableFunctions<T = any> {
        extend(requestedExtenders: { moment?: ExtenderOptions | null }): MomentObservable<T>;
        extend(requestedExtenders: { duration?: any }): DurationObservable;
    }

    export interface ObservableExtenderOptions {
        moment?: ExtenderOptions | null;
        duration?: any;
    }
}

ko.extenders.moment = function (target: any, options?: ExtenderOptions | null): MomentObservable<any> {
    const opts = options || {};

    setDate(target());
    target.subscribe(setDate);

    registerMomentFunctions(target, opts);

    target.now = now;

    return target;

    function now() {
        setDate();
        target(getValue(target.date, opts));
    }

    function setDate(newValue?: MomentInput): void {
        target.date = getMoment(newValue, opts);
    }
};

ko.extenders.momentDuration = function (target: any): any {
    setDuration(target());
    target.subscribe(setDuration);

    registerDurationFunctions(target);

    return target;

    function setDuration(newValue: string): void {
        target.duration = getMomentDuration(newValue);
    }
};

//#region Private Methods

const
    getSetsFunctions = ["milliseconds", "seconds", "minutes", "hours", "date", "day", "month", "year"],
    manipFunctions = ["add", "substract", "startOf", "endOf", "sod", "eod", "local", "utc"],
    displayFunctions = ["format", "from", "fromNow", "diff", "toDate", "valueOf", "unix", "isLeapYear", "zone", "daysInMonth", "isDST"],
    durationFunctions = ["humanize", "milliseconds", "asMilliseconds", "seconds", "asSeconds", "minutes", "asMinutes", "hours", "asHours", "days", "asDays", "months", "asMonths", "years", "asYears"];

function registerGetSetFunction(target: any, fn: string, options: ExtenderOptions) {
    target[fn] = function () {
        const val = target.date[fn].apply(target.date, arguments);

        if (arguments.length > 0)
            target(getValue(target.date, options));

        return val;
    };
}
function registerManipFunction(target: any, fn: string, options: ExtenderOptions) {
    target[fn] = function () {
        const val = target.date[fn].apply(target.date, arguments);

        target(getValue(target.date, options));

        return val;
    };
}
function registerDisplayFunction(target: any, fn: string) {
    target[fn] = function () {
        return target.date[fn].apply(target.date, arguments);
    };
}
function registerDurationFunction(target: any, fn: string) {
    target[fn] = function () {
        return target.duration ? target.duration[fn].apply(target.duration, arguments) : null;
    };
}

function registerMomentFunctions(target: any, options: ExtenderOptions) {
    let i: number, len: number;

    i = 0; len = getSetsFunctions.length;
    for (; i < len; i++) {
        registerGetSetFunction(target, getSetsFunctions[i], options);
    }

    i = 0; len = manipFunctions.length;
    for (; i < len; i++) {
        registerManipFunction(target, manipFunctions[i], options);
    }

    i = 0; len = displayFunctions.length;
    for (; i < len; i++) {
        registerDisplayFunction(target, displayFunctions[i]);
    }
}

function registerDurationFunctions(target: any) {
    var i = 0, len = durationFunctions.length, fn;
    for (; i < len; i++) {
        registerDurationFunction(target, durationFunctions[i]);
    }
}

//#endregion
