require("consoloid-framework/Consoloid/Widget/JQoteTemplate");
require('consoloid-framework/Consoloid/Widget/jquery.jqote2.min.js');
require("consoloid-framework/Consoloid/Widget/Widget");
require("consoloid-console/Consoloid/Ui/Dialog");
require("consoloid-console/Consoloid/Ui/Expression");
require("consoloid-console/Consoloid/Ui/MultiStateDialog");
require("consoloid-console/Consoloid/Ui/Volatile/Dialog");
require("../Abstract");
require("../CreateFolder");

require('consoloid-server/Consoloid/Server/Service');
require('../../../Server/AuthorizingService.js');
require("../../../Server/BasicOperations");

require('consoloid-framework/Consoloid/Test/UnitTest');

describeUnitTest('Consoloid.FileList.Dialog.FileOperation.CreateFolder', function() {
  var
    dialog,
    expr,
    remoteOperations;

  beforeEach(function() {
    env.addServiceMock('translator', {
      trans: function(str) {
        return str;
      }
    });

    expr = {
      getTextWithArguments: sinon.stub()
    };

    env.addServiceMock('resource_loader', {
      getParameter: sinon.stub()
    });

    env.addServiceMock('file.list.path.absolutifier', {
      absolutifyFolderDoesNotNeedToExist: sinon.spy(function(path) { return path; })
    });

    remoteOperations = {
      callAsync: sinon.stub()
    };
    env.addServiceMock('server_operations', remoteOperations);

    dialog = env.create(Consoloid.FileList.Dialog.FileOperation.CreateFolder, {
      __addToVolatileContainer: sinon.stub(),
      render: sinon.stub()
    });
  });

  describe("#handleArguments(args, expression)", function() {
    it("should create a folder if path does not exist", function() {
      dialog.handleArguments({ path: { value: "/something/something" } }, expr);
      dialog.setup();

      remoteOperations.callAsync.firstCall.calledWith('describe', ['/something/something']).should.be.true;

      remoteOperations.callAsync.args[0][2].success({ result: Consoloid.FileList.Server.BasicOperations.DOES_NOT_EXIST });

      remoteOperations.callAsync.secondCall.calledWith('mkdir', ['/something/something']).should.be.true;

      remoteOperations.callAsync.args[1][2].success({ result: true });

      remoteOperations.callAsync.calledTwice.should.be.true;

      dialog.activeState.should.equal("success");
    });

    it("should be able to handle existing path", function() {
      dialog.handleArguments({ path: { value: "/something/somefolder" }, recursively: { value: false } }, expr);
      dialog.setup();

      remoteOperations.callAsync.firstCall.calledWith('describe', ['/something/somefolder']).should.be.true;

      remoteOperations.callAsync.args[0][2].success({ result: Consoloid.FileList.Server.BasicOperations.IS_FILE });

      remoteOperations.callAsync.calledOnce.should.be.true;

      dialog.activeState.should.equal("error");
    });
  });

});
