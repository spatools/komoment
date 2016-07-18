
declare module ko {
    export interface BindingHandlers {
        date: {
            init(element: Node, valueAccessor: () => MaybeSubscribable<any[] | Object>, allBindingsAccessor: AllBindingsAccessor, viewModel: any, bindingContext: BindingContext<any>): void;
            update(element: Node, valueAccessor: () => MaybeSubscribable<any[] | Object>, allBindingsAccessor: AllBindingsAccessor, viewModel: any, bindingContext: BindingContext<any>): void;
        };

        moment: {
            init(element: Node, valueAccessor: () => MaybeSubscribable<any[] | Object>, allBindingsAccessor: AllBindingsAccessor, viewModel: any, bindingContext: BindingContext<any>): void;
            update(element: Node, valueAccessor: () => MaybeSubscribable<any[] | Object>, allBindingsAccessor: AllBindingsAccessor, viewModel: any, bindingContext: BindingContext<any>): void;
        };
    }

    export interface Extenders {
        moment: (target: any, options: Object) => any;
        momentDuration: (target: any, options: any) => any;
    }

    export namespace moment {
        export interface ExtenderOptions {
            format?: string;
            unix?: boolean;
            utc?: boolean;
        }

        export function getMoment(date: any, options: ExtenderOptions): Moment;
        export function getValue(moment: Moment, options: ExtenderOptions): any;
        export function getMomentDuration(timeSpan: string): Duration;
    }
}

declare module "komoment" {
    export interface ExtenderOptions {
        format?: string;
        unix?: boolean;
        utc?: boolean;
    }

    export function getMoment(date: any, options: ExtenderOptions): Moment;
    export function getValue(moment: Moment, options: ExtenderOptions): any;
    export function getMomentDuration(timeSpan: string): Duration;
}
