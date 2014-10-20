require("consoloid-framework/Consoloid/Widget/JQoteTemplate");
require('consoloid-framework/Consoloid/Widget/jquery.jqote2.min.js');
require("consoloid-framework/Consoloid/Widget/Widget");
require("consoloid-console/Consoloid/Ui/Dialog");
require("consoloid-console/Consoloid/Ui/Expression");
require("consoloid-console/Consoloid/Ui/MultiStateDialog");
require("consoloid-console/Consoloid/Ui/Volatile/Dialog");
require("../Abstract");
require("../Move");
require("../Copy");

require('consoloid-server/Consoloid/Server/Service');
require('../../../Server/AuthorizingService.js');
require("../../../Server/BasicOperations");

require('consoloid-framework/Consoloid/Test/UnitTest');

describeUnitTest('Consoloid.FileList.Dialog.FileOperation.Copy', function() {
  var
    dialog,
    expr,
    remoteOperations;

  beforeEach(function() {
    global.__s = function(str) {
      return str;
    }

    expr = {
      getTextWithArguments: sinon.stub()
    };

    env.addServiceMock('translator', {
      trans: __s
    });

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

    dialog = env.create(Consoloid.FileList.Dialog.FileOperation.Copy, {
      __addToVolatileContainer: sinon.stub(),
      render: sinon.stub(),
    });
  });

  describe("#handleArguments(args, expression)", function() {
    it("should copy the file", function() {
      dialog.handleArguments({ source: { value: "/file/exists" }, target: { value: "/file/doesnotexist" } }, expr);
      dialog.setup();

      remoteOperations.callAsync.firstCall.calledWith('describe', ['/file/exists']).should.be.true;

      remoteOperations.callAsync.args[0][2].success({ result: Consoloid.FileList.Server.BasicOperations.IS_FILE });

      remoteOperations.callAsync.secondCall.calledWith('describe', ['/file/doesnotexist']).should.be.true;

      remoteOperations.callAsync.args[1][2].success({ result: Consoloid.FileList.Server.BasicOperations.DOES_NOT_EXIST });

      remoteOperations.callAsync.thirdCall.calledWith('copy', ['/file/exists', '/file/doesnotexist', false]).should.be.true;

      remoteOperations.callAsync.args[2][2].success({ result: true });

      remoteOperations.callAsync.calledThrice.should.be.true;

      dialog.activeState.should.equal("success");
    });

    it("should not copy the file if it does not exist", function() {
      dialog.handleArguments({ source: { value: "/file/doesnotexist" }, target: { value: "/file/irrelevant" } }, expr);
      dialog.setup();

      remoteOperations.callAsync.firstCall.calledWith('describe', ['/file/doesnotexist']).should.be.true;

      remoteOperations.callAsync.args[0][2].success({ result: Consoloid.FileList.Server.BasicOperations.DOES_NOT_EXIST });

      remoteOperations.callAsync.calledOnce.should.be.true;
      dialog.activeState.should.equal("error");
    });

    it("should not copy the file if target exists and is a file", function() {
      dialog.handleArguments({ source: { value: "/file/irrelevant" }, target: { value: "/file/exists" } }, expr);
      dialog.setup();

      remoteOperations.callAsync.firstCall.calledWith('describe', ['/file/irrelevant']).should.be.true;

      remoteOperations.callAsync.args[0][2].success({ result: Consoloid.FileList.Server.BasicOperations.IS_FILE });

      remoteOperations.callAsync.secondCall.calledWith('describe', ['/file/exists']).should.be.true;

      remoteOperations.callAsync.args[1][2].success({ result: Consoloid.FileList.Server.BasicOperations.IS_FILE })

      remoteOperations.callAsync.calledTwice.should.be.true;
      dialog.activeState.should.equal("error");
    });

    it("should copy the file if target exists and is a folder", function() {
      dialog.handleArguments({ source: { value: "/file/exists" }, target: { value: "/file/alsoexists" } }, expr);
      dialog.setup();

      remoteOperations.callAsync.firstCall.calledWith('describe', ['/file/exists']).should.be.true;

      remoteOperations.callAsync.args[0][2].success({ result: Consoloid.FileList.Server.BasicOperations.IS_FILE });

      remoteOperations.callAsync.secondCall.calledWith('describe', ['/file/alsoexists']).should.be.true;

      remoteOperations.callAsync.args[1][2].success({ result: Consoloid.FileList.Server.BasicOperations.IS_FOLDER });

      remoteOperations.callAsync.thirdCall.calledWith('copy', ['/file/exists', '/file/alsoexists/exists', false]).should.be.true;

      remoteOperations.callAsync.args[2][2].success({ result: true });

      remoteOperations.callAsync.calledThrice.should.be.true;

      dialog.activeState.should.equal("success");
    });

    it("should copy the file if target exists, is a file, but overwrite is set", function() {
      dialog.handleArguments({ source: { value: "/file/irrelevant" }, target: { value: "/file/exists" }, overwrite: { value: true } }, expr);
      dialog.setup();

      remoteOperations.callAsync.firstCall.calledWith('describe', ['/file/irrelevant']).should.be.true;

      remoteOperations.callAsync.args[0][2].success({ result: Consoloid.FileList.Server.BasicOperations.IS_FILE });

      remoteOperations.callAsync.secondCall.calledWith('describe', ['/file/exists']).should.be.true;

      remoteOperations.callAsync.args[1][2].success({ result: Consoloid.FileList.Server.BasicOperations.IS_FILE });

      remoteOperations.callAsync.thirdCall.calledWith('copy', ['/file/irrelevant', '/file/exists', true]).should.be.true;

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
