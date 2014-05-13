/// <reference path="../../../typings/knockout/knockout.d.ts" />
/// <reference path="../../../typings/moment/moment.d.ts" />

interface MomentExtenderOptions {
    format?: string;
    unix?: boolean;
    utc?: boolean;
}

interface KnockoutMoment {
    getMoment(date: any, options: MomentExtenderOptions): Moment;
    getValue(moment: Moment, options: MomentExtenderOptions): any;
    getMomentDuration(timeSpan: string): Duration;
}

interface KnockoutStatic {
    moment: KnockoutMoment;
}

interface KnockoutBindingHandlers {
    date: KnockoutBindingHandler;
    moment: KnockoutBindingHandler;
}

interface KnockoutExtenders {
    moment: (target: any, options: Object) => any;
    momentDuration: (target: any, options: any) => any;
}

declare module "komoment" {
    var __komoment: KnockoutMoment;

    export = __komoment;
}
