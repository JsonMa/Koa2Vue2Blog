/**
 * Created by Mahao on 2017/1/3.
 */
require("should");
var name = "mahao";
describe("Name", function () {
	it("必须为马号", function () {
		name.should.eql("mahao")
	})
});