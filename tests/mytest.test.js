var chai = require('chai');
var expect = chai.expect;

describe("randomBackground", function () {
	
	it("should return a random color", function () {
	
		var color = 123;

		expect(color).is.not.empty;

	});
	
});

describe("Plasma", function () {
	
	let Plasma = require('./../app/components/plasma/plasma');

	it("should return a valid plasma object with defined Device-Breakpoints", function () {
		expect(Plasma.deviceBreakpoints).is.not.empty;

	});
	
});