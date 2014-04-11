require('consoloid-server/Consoloid/Server/Service');
require('../BasicOperations.js');
require('consoloid-framework/Consoloid/Test/UnitTest');
describeUnitTest('Consoloid.FileList.Server.BasicOperations', function() {
  var
    service,
    fs,
    rimraf,
    ncp,
    res;

  beforeEach(function() {
    fs = {
      unlink: sinon.stub().yields(null),
      rename: sinon.stub().yields(null),
      rmdir: sinon.stub().yields(null),
      mkdir: sinon.stub().yields(null)
    };

    rimraf = sinon.stub().yields(null);

    ncp = sinon.stub().yields(null);

    res = {};

    service = env.create(Consoloid.FileList.Server.BasicOperations, { fsModule: fs, rimrafModule: rimraf, copyModule: ncp });

    service.sendResult = sinon.stub();
    service.sendError = sinon.stub();
  });

  describe("#unlink(res, path)", function() {
    it("should unlink the file and call the callback", function() {
      service.unlink(res, "/some/path");

      fs.unlink.calledWith("/some/path").should.be.ok;
      service.sendResult.calledWith(res, true).should.be.ok;
    });

    it("should send the error if something happens", function() {
      fs.unlink.yields("This is an error message");
      service.unlink(res, "/some/path");

      service.sendError.calledWith(res, "This is an error message").should.be.ok;
    });
  });

  describe("#rename(res, oldPath, newPath)", function() {
    it("should rename the file and call the callback", function() {
      service.rename(res, "/some/path", "/some/other/path");
      
      fs.rename.calledWith("/some/path", "/some/other/path").should.be.ok;
      service.sendResult.calledWith(res, true).should.be.ok;
    });

    it("should send the error if something happens", function() {
      fs.rename.yields("This is an error message");
      service.rename(res, "/some/path", "/some/other/path");

      service.sendError.calledWith(res, "This is an error message").should.be.ok;
    });
  });

  describe("#rmdir(res, path)", function() {
    it("should remove the folder and call the callback", function() {
      service.rmdir(res, "/some/path");

      fs.rmdir.calledWith("/some/path").should.be.ok;
      service.sendResult.calledWith(res, true).should.be.ok;
    });

    it("should send the error if something happens", function() {
      fs.rmdir.yields("This is an error message");
      service.rmdir(res, "/some/path");

      service.sendError.calledWith(res, "This is an error message").should.be.ok;
    });
  });

  describe("#rimraf(res, path)", function() {
    it("should remove the folder recursively and call the callback", function() {
      service.rimraf(res, "/some/path");

      rimraf.calledWith("/some/path").should.be.ok;
      service.sendResult.calledWith(res, true).should.be.ok;
    });

    it("should send the error if something happens", function() {
      rimraf.yields("This is an error message");
      service.rimraf(res, "/some/path");

      service.sendError.calledWith(res, "This is an error message").should.be.ok;
    });
  });

  describe("#mkdir(res, path)", function() {
    it("should create the folder and call the callback", function() {
      service.mkdir(res, "/some/path");

      fs.mkdir.calledWith("/some/path").should.be.ok;
      service.sendResult.calledWith(res, true).should.be.ok;
    });

    it("should send the error if something happens", function() {
      fs.mkdir.yields("This is an error message");
      service.mkdir(res, "/some/path");

      service.sendError.calledWith(res, "This is an error message").should.be.ok;
    });
  });

  describe("#copy(res, oldPath, newPath, overWrite)", function() {
    it("should copy the file or folder and call the callback", function() {
      service.copy(res, "/some/path", "/some/other/path");

      ncp.calledWith("/some/path", "/some/other/path", { clobber: false, stopOnErr: true }).should.be.ok;
      service.sendResult.calledWith(res, true).should.be.ok;
    });

    it("should send the error if something happens", function() {
      ncp.yields("This is an error message");
      service.copy(res, "/some/path", "/some/other/path");;

      service.sendError.calledWith(res, "This is an error message").should.be.ok;
    });

    it("should obbey overWrite argument", function() {
      service.copy(res, "/some/path", "/some/other/path", true);

      ncp.calledWith("/some/path", "/some/other/path", { clobber: true, stopOnErr: true }).should.be.ok;
      service.sendResult.calledWith(res, true).should.be.ok;
    });
  });

});