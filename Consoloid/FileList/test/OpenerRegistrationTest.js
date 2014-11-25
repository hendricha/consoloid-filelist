require("../OpenerRegistration");
require('consoloid-framework/Consoloid/Test/UnitTest');

describeUnitTest('Consoloid.FileList.OpenerRegistration', function() {
  var
    registration;

  beforeEach(function() {
    registration = env.create("Consoloid.FileList.OpenerRegistration", {
      fileExtensions: ["exe", "com"],
      expression: ["Tottaly execute", {"file <name>": "@target"}, "Run", true]
    });
  });

  describe("#getFileExtensions()", function() {
    it("should return configured file extensions", function() {
      registration.getFileExtensions()[0].should.equal("exe");
      registration.getFileExtensions()[1].should.equal("com");
    });
  });

  describe("#getExpression()", function() {
    it("should return configured expression", function() {
      registration.getExpression()[0].should.equal("Tottaly execute");
      registration.getExpression()[1]["file <name>"].should.equal("@target");
      registration.getExpression()[2].should.equal("Run");
      registration.getExpression()[3].should.equal(true);
    });
  });

});
