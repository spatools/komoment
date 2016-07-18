(function (factory) {
    if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
        var target = module.exports || exports;
        factory(require("knockout"), require("moment"), target);
    }
    else if (typeof define === "function" && define.amd) {
        define(["knockout", "moment", "exports"], factory);
    }
    else {
        ko.moment = {};
        factory(ko, moment, ko.moment);
    }
}(function (ko, moment, exports) {
    var handlers = ko.bindingHandlers, extenders = ko.extenders;
    function getMoment(date, options) {
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
    function getValue(moment, options) {
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
    function getMomentDuration(timeSpan) {
        var litRegex = /((\d*)\.)?(\d{2}):(\d{2}):(\d{2})(\.(\d{0,3}))?/, isoRegex = /^P(([\d\.]+)Y)?(([\d\.]+)M)?(([\d\.]+)D)?T(([\d\.]+)H)?(([\d\.]+)M)?(([\d\.]+)S)?$/, matches, options;
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
    handlers.moment = handlers.date = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var value = valueAccessor(), options = ko.toJS(value);
            if (options === Object(options))
                value = options.value;
            else
                options = {};
            if (ko.isWriteableObservable(value) && options.attr === "value") {
                element.addEventListener("change", function (event) {
                    var _moment = getMoment(element.value, options), opts = options;
                    if (value.momentOptions)
                        opts = value.momentOptions;
                    value(getValue(_moment, opts));
                }, false);
            }
        },
        update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var value = valueAccessor(), options = ko.toJS(value);
            if (options === Object(options))
                value = options.value;
            else
                options = {};
            if (value && ko.unwrap(value)) {
                var _moment = (value.date && moment.isMoment(value.date)) ? value.date : getMoment(ko.unwrap(value), options), text = getValue(_moment, options);
                switch (options.attr || "text") {
                    case "value":
                        element.value = text;
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
    var getSetsFunctions = ["milliseconds", "seconds", "minutes", "hours", "date", "day", "month", "year"], manipFunctions = ["add", "substract", "startOf", "endOf", "sod", "eod", "local", "utc"], displayFunctions = ["format", "from", "fromNow", "diff", "toDate", "valueOf", "unix", "isLeapYear", "zone", "daysInMonth", "isDST"], durationFunctions = ["humanize", "milliseconds", "asMilliseconds", "seconds", "asSeconds", "minutes", "asMinutes", "hours", "asHours", "days", "asDays", "months", "asMonths", "years", "asYears"];
    function registerGetSetFunction(target, fn, options) {
        target[fn] = function () {
            var val = target.date[fn].apply(target.date, arguments);
            if (arguments.length > 0)
                target(getValue(target.date, options));
            return val;
        };
    }
    function registerManipFunction(target, fn, options) {
        target[fn] = function () {
            var val = target.date[fn].apply(target.date, arguments);
            target(getValue(target.date, options));
            return val;
        };
    }
    function registerDisplayFunction(target, fn) {
        target[fn] = function () {
            return target.date[fn].apply(target.date, arguments);
        };
    }
    function registerDurationFunction(target, fn) {
        target[fn] = function () {
            return target.duration ? target.duration[fn].apply(target.duration, arguments) : null;
        };
    }
    function registerMomentFunctions(target, options) {
        var i, len;
        i = 0;
        len = getSetsFunctions.length;
        for (; i < len; i++) {
            registerGetSetFunction(target, getSetsFunctions[i], options);
        }
        i = 0;
        len = manipFunctions.length;
        for (; i < len; i++) {
            registerManipFunction(target, manipFunctions[i], options);
        }
        i = 0;
        len = displayFunctions.length;
        for (; i < len; i++) {
            registerDisplayFunction(target, displayFunctions[i]);
        }
    }
    function registerDurationFunctions(target) {
        var i = 0, len = durationFunctions.length, fn;
        for (; i < len; i++) {
            registerDurationFunction(target, durationFunctions[i]);
        }
    }
    ko.extenders.moment = function (target, options) {
        options = options || {};
        function setDate(newValue) {
            if (newValue === void 0) { newValue = null; }
            target.date = getMoment(newValue, options);
        }
        setDate(target());
        target.subscribe(setDate);
        registerMomentFunctions(target, options);
        target.now = function () {
            setDate();
            target(getValue(target.date, options));
        };
        return target;
    };
    ko.extenders.momentDuration = function (target, options) {
        function setDuration(newValue) {
            if (newValue === void 0) { newValue = null; }
            target.duration = getMomentDuration(newValue);
        }
        setDuration(target());
        target.subscribe(setDuration);
        registerDurationFunctions(target);
        return target;
    };
}));
