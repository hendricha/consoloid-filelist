require('consoloid-server/Consoloid/Server/Service');
require('../MockAccessAuthorizer.js');
require('../AuthorizingService.js');
require('../FileGetter.js');
require('consoloid-framework/Consoloid/Test/UnitTest');
describeUnitTest('Consoloid.FileList.Server.FileGetter', function() {
  var
    service,
    datauri,
    authorizer,
    res;

  beforeEach(function() {
    datauri = sinon.stub().returns({
      content: "foobar"
    });

    res = {};

    authorizer = {
      authorize: sinon.stub(),
      __self: {
        OPERATION_READ: 0,
        OPERATION_WRITE: 1
      }
    }
    env.addServiceMock("file.access.authorizer", authorizer);

    service = env.create(Consoloid.FileList.Server.FileGetter, { dataUriModule: datauri });

    service.sendResult = sinon.stub();
    service.sendError = sinon.stub();
  });

  describe("#getFile(res, path)", function() {
    it("should get the file through the data uri module", function() {
      service.getFile(res, "/some/path");

      datauri.calledWith("/some/path").should.be.ok;
      service.sendResult.calledWith(res, { result: "foobar" }).should.be.ok;
    });

    it("should send the error if something happens", function() {
      datauri.throws();
      service.getFile(res, "/some/path");

      service.sendError.calledWith(res).should.be.ok;
    });

    it("should send error if it isn't authorized", function() {
      authorizer.authorize.throws();
      service.getFile(res, "/some/path");

      authorizer.authorize.calledWith(Consoloid.FileList.Server.MockAccessAuthorizer.OPERATION_READ, "/some/path").should.be.ok;
      service.sendError.calledWith(res).should.be.ok;
    });
  });
});
