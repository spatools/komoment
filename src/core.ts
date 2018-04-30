import * as moment from "moment";

export type Moment = moment.Moment;
export type MomentInput = moment.MomentInput;
export type MomentInputObject = moment.MomentInputObject;

export type Duration = moment.Duration;
export type DurationInputArg1 = moment.DurationInputArg1;
export type DurationInputArg2 = moment.DurationInputArg2;
export type DurationInputObject = moment.DurationInputObject;

export interface ExtenderOptions {
    format?: string;
    unix?: boolean;
    utc?: boolean;
}


export function getMoment(date: MomentInput, options: ExtenderOptions): Moment {
    if (options.unix) {
        return moment.unix(date as number);
    }
    else if (options.utc) {
        return moment.utc(date, options.format);
    }
    else {
        return moment(date, options.format);
    }
}

export function getValue(moment: null | undefined, options: ExtenderOptions): null;
export function getValue(moment: Moment, options: { unix: true }): number;
export function getValue(moment: Moment, options: ExtenderOptions): string;
export function getValue(moment: Moment | null | undefined, options: ExtenderOptions): string | number | null {
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

export function getMomentDuration(timeSpan: string): Duration | null {
    const
        litRegex = /((\d*)\.)?(\d{2}):(\d{2}):(\d{2})(\.(\d{0,3}))?/,
        isoRegex = /^P(([\d\.]+)Y)?(([\d\.]+)M)?(([\d\.]+)D)?T(([\d\.]+)H)?(([\d\.]+)M)?(([\d\.]+)S)?$/;

    let matches: RegExpMatchArray | null,
        options: DurationInputObject | undefined;

    if (matches = timeSpan.match(isoRegex)) {
        options = {
            years: matches[1] ? parseFloat(matches[2]) : 0,
            months: matches[3] ? parseFloat(matches[4]) : 0,
            days: matches[5] ? parseFloat(matches[6]) : 0,
            hours: matches[7] ? parseFloat(matches[8]) : 0,
            minutes: matches[9] ? parseFloat(matches[10]) : 0,
            seconds: matches[11] ? parseFloat(matches[12]) : 0
        };
    }
    else if (matches = timeSpan.match(litRegex)) {
        options = {
            milliseconds: matches[7] ? parseInt(matches[7], 10) : 0,
            seconds: matches[5] ? parseInt(matches[5], 10) : 0,
            minutes: matches[4] ? parseInt(matches[4], 10) : 0,
            hours: matches[3] ? parseInt(matches[3], 10) : 0,
            days: matches[2] ? parseInt(matches[2], 10) : 0
        };
    }

    return options ?
        moment.duration(options) :
        null;
}
