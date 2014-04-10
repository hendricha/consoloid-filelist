require("../PathValidator");
require('consoloid-framework/Consoloid/Test/UnitTest');

describeUnitTest('Consoloid.FileList.PathValidator', function() {
  var
    validator,
    consoleService;

  beforeEach(function() {
    consoleService = {
      getLastDialog: sinon.stub().returns({
        hasFile: sinon.stub().returns(true),
        hasFolder: sinon.stub().returns(true)
      })
    };
    env.addServiceMock("console", consoleService);
    validator = env.create("Consoloid.FileList.PathValidator", {});
  });

  describe("#validateFile(file)", function() {
    it("should accept absolute paths", function() {
      validator.validateFile("/etc/passwd").should.be.ok;
    });

    it("should not accept more than one deep relative paths (eg. 'Images/Something.JPG')", function() {
      validator.validateFile("Images/Something.JPG").should.not.be.ok;
    });

    it("should accept one deep relative paths if last file list dialog has that item", function() {
      validator.validateFile("foobar").should.be.ok;

      consoleService.getLastDialog().hasFile.returns(false);

      validator.validateFile("foobar").should.not.be.ok;
    });
  });

  describe("#validateFolder(folder)", function() {
    it("should do everything validateFile does", function() {
      validator.validateFolder("/etc/passwd").should.be.ok;
      validator.validateFolder("Images/Something.JPG").should.not.be.ok;
      validator.validateFolder("foobar").should.be.ok;
    });

    it("should accept only folders", function() {
      consoleService.getLastDialog().hasFolder.returns(false);

      validator.validateFolder("foobar").should.not.be.ok;
    });
  });
});