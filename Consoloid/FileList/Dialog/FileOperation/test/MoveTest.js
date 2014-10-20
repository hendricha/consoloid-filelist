require("consoloid-framework/Consoloid/Widget/JQoteTemplate");
require('consoloid-framework/Consoloid/Widget/jquery.jqote2.min.js');
require("consoloid-framework/Consoloid/Widget/Widget");
require("consoloid-console/Consoloid/Ui/Dialog");
require("consoloid-console/Consoloid/Ui/Expression");
require("consoloid-console/Consoloid/Ui/MultiStateDialog");
require("consoloid-console/Consoloid/Ui/Volatile/Dialog");
require("../Abstract");
require("../Move");

require('consoloid-server/Consoloid/Server/Service');
require('../../../Server/AuthorizingService.js');
require("../../../Server/BasicOperations");

require('consoloid-framework/Consoloid/Test/UnitTest');

describeUnitTest('Consoloid.FileList.Dialog.FileOperation.Move', function() {
  var
    dialog,
    expr,
    remoteOperations;

  beforeEach(function() {
    global.__s = function(str) {
      return str;
    }

    env.addServiceMock('translator', {
      trans: __s
    });

    expr = {
      getTextWithArguments: sinon.stub()
    };

    env.addServiceMock('resource_loader', {
      getParameter: sinon.stub()
    });

    env.addServiceMock('file.list.path.absolutifier', {
      absolutifyFile: sinon.spy(function(path) { return path; }),
      absolutifyFileDoesNotNeedToExist: sinon.spy(function(path) { return path; })
    });

    remoteOperations = {
      callAsync: sinon.stub()
    };
    env.addServiceMock('server_operations', remoteOperations);

    dialog = env.create(Consoloid.FileList.Dialog.FileOperation.Move, {
      __addToVolatileContainer: sinon.stub(),
      render: sinon.stub(),
    });
  });

  describe("#setup()", function() {
    it("should move the file", function() {
      dialog.handleArguments({ source: { value: "/file/exists" }, target: { value: "/file/doesnotexist" } }, expr);
      dialog.setup();

      remoteOperations.callAsync.firstCall.calledWith('describe', ['/file/exists']).should.be.true;

      remoteOperations.callAsync.args[0][2].success({ result: Consoloid.FileList.Server.BasicOperations.IS_FILE });

      remoteOperations.callAsync.secondCall.calledWith('describe', ['/file/doesnotexist']).should.be.true;

      remoteOperations.callAsync.args[1][2].success({ result: Consoloid.FileList.Server.BasicOperations.DOES_NOT_EXIST });

      remoteOperations.callAsync.thirdCall.calledWith('rename', ['/file/exists', '/file/doesnotexist', false]).should.be.true;

      remoteOperations.callAsync.args[2][2].success({ result: true });

      remoteOperations.callAsync.calledThrice.should.be.true;

      dialog.activeState.should.equal("success");
    });

    it("should not move the file if it does not exist", function() {
      dialog.handleArguments({ source: { value: "/file/doesnotexist" }, target: { value: "/file/irrelevant" } }, expr);
      dialog.setup();

      remoteOperations.callAsync.firstCall.calledWith('describe', ['/file/doesnotexist']).should.be.true;

      remoteOperations.callAsync.args[0][2].success({ result: Consoloid.FileList.Server.BasicOperations.DOES_NOT_EXIST });

      remoteOperations.callAsync.calledOnce.should.be.true;
      dialog.activeState.should.equal("error");
    });

    it("should not move the file if target exists", function() {
      dialog.handleArguments({ source: { value: "/file/irrelevant" }, target: { value: "/file/exists" } }, expr);
      dialog.setup();

      remoteOperations.callAsync.firstCall.calledWith('describe', ['/file/irrelevant']).should.be.true;

      remoteOperations.callAsync.args[0][2].success({ result: Consoloid.FileList.Server.BasicOperations.IS_FILE });

      remoteOperations.callAsync.secondCall.calledWith('describe', ['/file/exists']).should.be.true;

      remoteOperations.callAsync.args[1][2].success({ result: Consoloid.FileList.Server.BasicOperations.IS_FILE })

      remoteOperations.callAsync.calledTwice.should.be.true;
      dialog.activeState.should.equal("error");
    });

    it("should move the file if target exists, but overwrite is set", function() {
      dialog.handleArguments({ source: { value: "/file/irrelevant" }, target: { value: "/file/exists" }, overwrite: { value: true } }, expr);
      dialog.setup();

      remoteOperations.callAsync.firstCall.calledWith('describe', ['/file/irrelevant']).should.be.true;

      remoteOperations.callAsync.args[0][2].success({ result: Consoloid.FileList.Server.BasicOperations.IS_FILE });

      remoteOperations.callAsync.secondCall.calledWith('describe', ['/file/exists']).should.be.true;

      remoteOperations.callAsync.args[1][2].success({ result: Consoloid.FileList.Server.BasicOperations.IS_FILE });

      remoteOperations.callAsync.thirdCall.calledWith('rename', ['/file/irrelevant', '/file/exists', true]).should.be.true;

      remoteOperations.callAsync.args[2][2].success({ result: true });

      remoteOperations.callAsync.calledThrice.should.be.true;

      dialog.activeState.should.equal("success");
    });

    it("should not do a thing if both paths are the same", function() {
      dialog.handleArguments({ source: { value: "/file/irrelevant" }, target: { value: "/file/irrelevant" } }, expr);
      dialog.setup();

      remoteOperations.callAsync.callCount.should.equal(0);
      dialog.activeState.should.equal("error");
    });
  });

  afterEach(function() {
    delete global.__s;
  })
});
