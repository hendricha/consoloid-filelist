require('consoloid-server/Consoloid/Server/Service');
require('../BasicOperations.js');
require('consoloid-framework/Consoloid/Test/UnitTest');
describeUnitTest('Consoloid.FileList.Server.BasicOperations', function() {
  var
    service,
    fs,
    res;

  beforeEach(function() {
    fs = {
      unlink: sinon.stub().yields(null)
    };

    res = {};

    service = env.create(Consoloid.FileList.Server.BasicOperations, { fsModule: fs });

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
      
      fs.unlink.calledWith("/some/path").should.be.ok;
      service.sendError.calledWith(res, "This is an error message").should.be.ok;
    });
  });
});