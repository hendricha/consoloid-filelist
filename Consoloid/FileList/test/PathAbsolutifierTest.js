require("../PathAbsolutifier");
require('consoloid-framework/Consoloid/Test/UnitTest');

describeUnitTest('Consoloid.FileList.PathAbsolutifier', function() {
  var
    validator,
    context;

  beforeEach(function() {
    context = {
      findByClass: sinon.stub().returns([{
        entity: {
          getList: sinon.stub().returns({
            hasFile: sinon.stub().returns(true),
            hasFolder: sinon.stub().returns(true),
            getPath: sinon.stub().returns("/something/something"),
            getFiles: sinon.stub().returns([{
              name: "foobar"
            }])
          })
        }
      }])
    };
    env.addServiceMock("context", context);
    validator = env.create("Consoloid.FileList.PathAbsolutifier", {});
    global.__ = function(str) { return str; };
  });

  describe("#absolutifyFile(file)", function() {
    it("should return with the same absolute path it was called with", function() {
      validator.absolutifyFile("/etc/passwd").should.equal("/etc/passwd");
    });

    it("should not accept more than one deep relative paths (eg. 'Images/Something.JPG')", function() {
      (function() {
        validator.absolutifyFile("Images/Something.JPG");
      }).should.throwError();
    });

    it("should accept one deep relative paths if last file list dialog has that item", function() {
      validator.absolutifyFile("foobar").should.equal("/something/something/foobar");
      context.findByClass.alwaysCalledWith('Consoloid.FileList.Context.List');

      context.findByClass()[0].entity.getList().hasFile.returns(false);

      (function() {
        validator.absolutifyFile("something");
      }).should.throwError();
    });
  });

  describe("#absolutifyFileDoesNotNeedToExist(file)", function() {
    it("should accept one deep relative paths even if last file list dialog does not have that item", function() {
      context.findByClass()[0].entity.getList().hasFile.returns(false);

      validator.absolutifyFileDoesNotNeedToExist("foobar").should.equal("/something/something/foobar");
      context.findByClass.alwaysCalledWith('Consoloid.FileList.Context.List');
    });
  });

  describe("#absolutifyFolder(folder)", function() {
    it("should do everything validateFile does", function() {
      validator.absolutifyFolder("/etc/passwd").should.equal("/etc/passwd");
      validator.absolutifyFolder("foobar").should.equal("/something/something/foobar");
      context.findByClass.alwaysCalledWith('Consoloid.FileList.Context.List');

      (function() {
        validator.absolutifyFolder("Images/Something.JPG");
      }).should.throwError();
    });

    it("should accept only folders", function() {
      context.findByClass()[0].entity.getList().hasFolder.returns(false);

      (function() {
        validator.absolutifyFolder("something");
      }).should.throwError();
    });
  });

  describe("#absolutifyFolderDoesNotNeedToExist(folder)", function() {
    it("should accept one deep relative paths even if last file list dialog does not have that item", function() {
      context.findByClass()[0].entity.getList().hasFolder.returns(false);

      validator.absolutifyFolderDoesNotNeedToExist("foobar").should.equal("/something/something/foobar");
      context.findByClass.alwaysCalledWith('Consoloid.FileList.Context.List');
    });
  });

  describe("#absolutify(path)", function() {
    it("should accept one deep relative paths no matter if they are files or folder", function() {
      context.findByClass()[0].entity.getList().hasFolder.returns(false);
      context.findByClass()[0].entity.getList().hasFile.returns(true);

      validator.absolutify("foobar").should.equal("/something/something/foobar");

      context.findByClass()[0].entity.getList().hasFolder.returns(true);
      context.findByClass()[0].entity.getList().hasFile.returns(false);

      validator.absolutify("foobar").should.equal("/something/something/foobar");
      context.findByClass.alwaysCalledWith('Consoloid.FileList.Context.List');
    });

    it("should return first match that starts with name if there is no direct match", function() {
      context.findByClass()[0].entity.getList().hasFolder.returns(false);
      context.findByClass()[0].entity.getList().hasFile.returns(false);

      validator.absolutify("foo").should.equal("/something/something/foobar");
    });

    it("should return first match that starts with name case insensitively if there is no direct match", function() {
      context.findByClass()[0].entity.getList().hasFolder.returns(false);
      context.findByClass()[0].entity.getList().hasFile.returns(false);

      validator.absolutify("fOO").should.equal("/something/something/foobar");
    });
  });

  afterEach(function() {
    delete global.__;
  })
});
