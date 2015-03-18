/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../typings/node/node.d.ts" />
require('source-map-support').install();

import assert = require("assert");

describe("simple test case", () => {
    it("simple test", () => {
        assert.equal(true, true);
    })
});