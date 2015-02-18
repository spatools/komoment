/// <reference path="../typings/requirejs/require.d.ts" />
/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../typings/should/should.d.ts" />
/// <reference path="../typings/sinon/sinon.d.ts" />

requirejs.config({
    //baseUrl: "../",

    paths: {
        "knockout": "../bower_components/knockoutjs/dist/knockout.debug",
        "moment": "../bower_components/moment/moment",
        "komoment": "../src/komoment",

        "mocha": "../bower_components/mocha/mocha",
        "should": "../bower_components/should/should",
        "sinon": "../bower_components/sinon/lib/sinon"
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
    "getvalue",
    "getmoment"
];

require(tests, function () {
    mocha.run();
});
