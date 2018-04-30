import * as should from "should";

import * as ko from "knockout";
import * as moment from "moment";
import * as komoment from "../src/index";

const
    NOW = new Date(),
    NOW_STR = NOW.toJSON(),
    NOW_NUM = NOW.valueOf();

describe("komoment.extender.date", () => {

    it("should add date attribute to observable", () => {
        const obs = ko.observable(NOW_STR).extend({ moment: null });

        should(obs.date).not.be.empty;
        moment.isMoment(obs.date).should.be.true;
    });

    it("should add now method which sets date to now", () => {
        const obs = ko.observable(NOW_STR).extend({ moment: null });

        should(obs.now).be.a.Function;

        obs.now();
        obs.date.isSame(moment()).should.be.true;
    });

    it("should add all getter methods from moment", () => {
        const obs = ko.observable(NOW_STR).extend({ moment: null });

        obs.milliseconds().should.equal(obs.date.milliseconds());
        obs.seconds().should.equal(obs.date.seconds());
        obs.minutes().should.equal(obs.date.minutes());
        obs.hours().should.equal(obs.date.hours());
        obs.day().should.equal(obs.date.day());
        obs.month().should.equal(obs.date.month());
        obs.year().should.equal(obs.date.year());
    });

});
