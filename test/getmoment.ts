/// <reference path="_test.d.ts" />

import knockout = require("knockout");
import moment = require("moment");
import komoment = require("komoment");

describe("komoment.getMoment", () => {

    it("should return a correct Moment if no options specified", () => {
        var date = new Date(),

            result = komoment.getMoment(date.toISOString(), {}),
            expected = date.getTime();

        moment.isMoment(result).should.be.ok;
        result.valueOf().should.equal(expected);
    });

    it("should return a correct Moment if format option is specified", () => {
        var result = komoment.getMoment("2014-01-01 00:00:00", { utc: true, format: "YYYY-MM-DD HH:mm:ss" }),
            expected = "2014-01-01T00:00:00.000Z";

        moment.isMoment(result).should.be.ok;
        result.toISOString().should.equal(expected);
    });

    it("should return a correct Moment from unix timestam if unix is specified", () => {
        var result = komoment.getMoment(1391209200000, { unix: true }),
            expected = 1391209200000;

        moment.isMoment(result).should.be.ok;
        result.unix().should.equal(1391209200000);
    });

});
