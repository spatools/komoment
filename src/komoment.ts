/// <reference path="../_definitions.d.ts" />

type KnockoutStatic = typeof ko;

(function (factory) {
    // Support three module loading scenarios
    if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
        // [1] CommonJS/Node.js
        var target = module.exports || exports; // module.exports is for Node.js
        factory(require("knockout"), require("moment"), target);
    }
    else if (typeof define === "function" && define.amd) {
        // [2] AMD anonymous module
        define(["knockout", "moment", "exports"], factory);
    }
    else {
        // [3] No module loader (plain <script> tag) - put directly in global namespace
        ko.moment = <any>{};
        factory(ko, moment, ko.moment);
    }
}
    (function (ko: KnockoutStatic, moment: MomentStatic, exports: typeof ko.moment) {
        var handlers = ko.bindingHandlers,
            extenders = ko.extenders;

        //#region Public Methods

        function getMoment(date: string, options: ko.moment.ExtenderOptions): Moment;
        function getMoment(date: number, options: ko.moment.ExtenderOptions): Moment;
        function getMoment(date: any, options: ko.moment.ExtenderOptions): Moment {
            if (options.unix) {
                return moment.unix(date);
            }
            else if (options.utc) {
                return moment.utc(date, options.format);
            }
            else {
                return moment(date, options.format);
            }
        }
        exports.getMoment = getMoment;

        function getValue(moment: Moment, options: ko.moment.ExtenderOptions): any {
            if (!moment) {
                return null;
            }

            if (options.unix) {
                return moment.valueOf();
            }

            if (options.utc) {
                moment = moment.utc();
            }

            return options.format ? moment.format(options.format) : moment.toISOString();
        }
        exports.getValue = getValue;

        function getMomentDuration(timeSpan: string): Duration {
            var litRegex = /((\d*)\.)?(\d{2}):(\d{2}):(\d{2})(\.(\d{0,3}))?/,
                isoRegex = /^P(([\d\.]+)Y)?(([\d\.]+)M)?(([\d\.]+)D)?T(([\d\.]+)H)?(([\d\.]+)M)?(([\d\.]+)S)?$/,
                matches, options;

            if (isoRegex.test(timeSpan)) {
                matches = timeSpan.match(isoRegex);
                options = {
                    years: matches[1] ? parseFloat(matches[2]) : 0,
                    months: matches[3] ? parseFloat(matches[4]) : 0,
                    days: matches[5] ? parseFloat(matches[6]) : 0,
                    hours: matches[7] ? parseFloat(matches[8]) : 0,
                    minutes: matches[9] ? parseFloat(matches[10]) : 0,
                    seconds: matches[11] ? parseFloat(matches[12]) : 0
                };
            }
            else if (litRegex.test(timeSpan)) {
                matches = timeSpan.match(litRegex);
                options = {
                    milliseconds: parseInt(matches[7] || 0, 10),
                    seconds: parseInt(matches[5], 10),
                    minutes: parseInt(matches[4], 10),
                    hours: parseInt(matches[3], 10),
                    days: parseInt(matches[2] || 0, 10)
                };
            }

            if (options)
                return moment.duration(options);
        }
        exports.getMomentDuration = getMomentDuration;

        //#endregion

        //#region Binding handlers

        handlers.moment = handlers.date = {
            init: function (element: HTMLElement, valueAccessor: () => any, allBindingsAccessor: () => any, viewModel: any, bindingContext: ko.BindingContext<any>) {
                const
                    initial = valueAccessor(),
                    unwrapped = ko.unwrap(initial),
                    isOptions = typeof unwrapped === "object";

                let options, value;
                if (isOptions) {
                    value = unwrapped.value;
                    delete unwrapped.value;

                    options = ko.toJS(unwrapped);
                }
                else {
                    value = initial;
                    options = {};
                }

                if (ko.isWriteableObservable(value) && options.attr === "value") {
                    element.addEventListener("change", function (event) {
                        const 
                            _moment = getMoment((<HTMLInputElement>element).value, options),
                            opts = value.momentOptions || options;

                        value(getValue(_moment, opts));
                    }, false);
                }
            },
            update: function (element: HTMLElement, valueAccessor: () => any, allBindingsAccessor: () => any, viewModel: any, bindingContext: ko.BindingContext<any>) {
                const
                    initial = valueAccessor(),
                    unwrapped = ko.unwrap(initial),
                    isOptions = typeof unwrapped === "object";

                let options, value;
                if (isOptions) {
                    value = unwrapped.value;
                    delete unwrapped.value;

                    options = ko.toJS(unwrapped);
                }
                else {
                    value = initial;
                    options = {};
                }

                if (unwrapped) {
                    const
                        _moment = (value.date && moment.isMoment(value.date)) ? value.date : getMoment(unwrapped, options),
                        text = getValue(_moment, options);

                    switch (options.attr || "text") {
                        case "value":
                            (<HTMLInputElement>element).value = text;
                            break;
                        case "text":
                            element.innerText = text;
                            break;
                        default:
                            element[options.attr] = text;
                            break;
                    }
                }
            }
        };

        //#endregion

        //#region Extenders Methods

        const
            getSetsFunctions = ["milliseconds", "seconds", "minutes", "hours", "date", "day", "month", "year"],
            manipFunctions = ["add", "substract", "startOf", "endOf", "sod", "eod", "local", "utc"],
            displayFunctions = ["format", "from", "fromNow", "diff", "toDate", "valueOf", "unix", "isLeapYear", "zone", "daysInMonth", "isDST"],
            durationFunctions = ["humanize", "milliseconds", "asMilliseconds", "seconds", "asSeconds", "minutes", "asMinutes", "hours", "asHours", "days", "asDays", "months", "asMonths", "years", "asYears"];

        function registerGetSetFunction(target: any, fn: string, options: ko.moment.ExtenderOptions) {
            target[fn] = function () {
                const val = target.date[fn].apply(target.date, arguments);

                if (arguments.length > 0)
                    target(getValue(target.date, options));

                return val;
            };
        }
        function registerManipFunction(target: any, fn: string, options: ko.moment.ExtenderOptions) {
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

        function registerMomentFunctions(target: any, options: ko.moment.ExtenderOptions) {
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

        //#region Extenders

        ko.extenders.moment = function (target: any, options: ko.moment.ExtenderOptions): any {
            options = options || {};

            setDate(target());
            target.subscribe(setDate);

            registerMomentFunctions(target, options);

            target.now = function () {
                setDate();
                target(getValue(target.date, options));
            };

            return target;
            
            function setDate(newValue: any = null): void {
                target.date = getMoment(newValue, options);
            }
        };
        ko.extenders.momentDuration = function (target: any, options: any): any {
            setDuration(target());
            target.subscribe(setDuration);

            registerDurationFunctions(target);

            return target;
            
            function setDuration(newValue: string = null): void {
                target.duration = getMomentDuration(newValue);
            }
        };

        //#endregion
    })
);
