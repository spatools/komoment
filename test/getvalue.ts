/// <reference path="_test.d.ts" />

import knockout = require("knockout");
import moment = require("moment");
import komoment = require("komoment");

describe("komoment.getValue", () => {

    it("should return a correct ISO datetime if no format specified", () => {
        var date = new Date(),
            mom = moment(date),

            result = komoment.getValue(mom, {});

        result.should.be.a.string;
        result.should.equal(date.toISOString());
    });

    it("should return a correct formatted date if format is specified", () => {
        var date = new Date(),
            mom = moment(date).utc(),

            result = komoment.getValue(mom, { format: "YYYY-MM-DDTHH:mm:ss" }),
            expected = date.toISOString().replace("Z", "").replace(/\.\d+$/, "");

        result.should.be.a.string;
        result.should.equal(expected);
    });

    it("should return a correct utc formatted date if utc and format are specified", () => {
        var date = new Date(),
            mom = moment(date),

            result = komoment.getValue(mom, { utc: true, format: "YYYY-MM-DDTHH:mm:ss" }),
            expected = date.toISOString().replace("Z", "").replace(/\.\d+$/, "");

        result.should.be.a.string;
        result.should.equal(expected);
    });

    it("should return a unix timestamp if unix options is specified", () => {
        var date = new Date(),
            mom = moment(date),

            result = komoment.getValue(mom, { unix: true }),
            expected = date.getTime();

        result.should.be.a.number;
        result.should.equal(expected);
    });

});
