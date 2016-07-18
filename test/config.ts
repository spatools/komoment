/// <reference path="_test.d.ts" />

requirejs.config({
    //baseUrl: "../",

    paths: {
        "knockout": "../bower_components/knockout/dist/knockout.debug",
        "moment": "../bower_components/moment/moment",
        "komoment": "../src/komoment",

        "mocha": "../bower_components/mocha/mocha",
        "should": "../bower_components/should/should"
    },

    shim: {
        mocha: {
            exports: "mocha"
        }
    }
});

(<any>window).console = window.console || function () { return; };
(<any>window).notrack = true;

var tests = [
    "./getvalue",
    "./getmoment"
];

require(tests, function () {
    mocha.run();
});
