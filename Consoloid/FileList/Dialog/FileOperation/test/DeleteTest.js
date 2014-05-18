require("consoloid-framework/Consoloid/Widget/JQoteTemplate");
require('consoloid-framework/Consoloid/Widget/jquery.jqote2.min.js');
require("consoloid-framework/Consoloid/Widget/Widget");
require("consoloid-console/Consoloid/Ui/Dialog");
require("consoloid-console/Consoloid/Ui/MultiStateDialog");
require("consoloid-console/Consoloid/Ui/Volatile/Dialog");
require("../Abstract");
require("../Delete");

require('consoloid-server/Consoloid/Server/Service');
require("../../../Server/BasicOperations");

require('consoloid-framework/Consoloid/Test/UnitTest');

describeUnitTest('Consoloid.FileList.Dialog.FileOperation.Delete', function() {
  var
    dialog,
    remoteOperations;

  beforeEach(function() {
    env.addServiceMock('translator', {
      trans: function(str) {
        return str;
      }
    });

    env.addServiceMock('resource_loader', {
      getParameter: sinon.stub()
    });

    remoteOperations = {
      callAsync: sinon.stub()
    };
    env.addServiceMock('server_operations', remoteOperations);

    dialog = env.create(Consoloid.FileList.Dialog.FileOperation.Delete, {
      __addToVolatileContainer: sinon.stub(),
      render: sinon.stub()
    });
  });

  describe("#setup()", function() {
    it("should delete remote file", function() {
      dialog.arguments = { path: { value: "/something/somefile" } };
      dialog.setup();

      remoteOperations.callAsync.firstCall.calledWith('describe', ['/something/somefile']).should.be.true;

      remoteOperations.callAsync.args[0][2].success({ result: Consoloid.FileList.Server.BasicOperations.IS_FILE });

      remoteOperations.callAsync.secondCall.calledWith('unlink', ['/something/somefile']).should.be.true;

      remoteOperations.callAsync.args[1][2].success({ result: true });

      remoteOperations.callAsync.calledTwice.should.be.true;

      dialog.activeState.should.equal("success");
    });

    it("should delete remote directory", function() {
      dialog.arguments = { path: { value: "/something/somefolder" }};
      dialog.setup();

      remoteOperations.callAsync.firstCall.calledWith('describe', ['/something/somefolder']).should.be.true;

      remoteOperations.callAsync.args[0][2].success({ result: Consoloid.FileList.Server.BasicOperations.IS_FOLDER });

      remoteOperations.callAsync.secondCall.calledWith('rmdir', ['/something/somefolder', false]).should.be.true;

      remoteOperations.callAsync.args[1][2].success({ result: true });

      remoteOperations.callAsync.calledTwice.should.be.true;

      dialog.activeState.should.equal("success");
    });

    it("should be able to handle non existing path", function() {
      dialog.arguments = { path: { value: "/something/somefolder" }, recursively: { value: false } };
      dialog.setup();

      remoteOperations.callAsync.firstCall.calledWith('describe', ['/something/somefolder']).should.be.true;

      remoteOperations.callAsync.args[0][2].success({ result: Consoloid.FileList.Server.BasicOperations.DOES_NOT_EXIST });

      remoteOperations.callAsync.calledOnce.should.be.true;

      dialog.activeState.should.equal("error");
    });

    it("should be able to handle recursive deletion of a folder", function() {
      dialog.arguments = { path: { value: "/something/somefolder" }, recursively: { value: true } };
      dialog.setup();

      remoteOperations.callAsync.firstCall.calledWith('describe', ['/something/somefolder']).should.be.true;

      remoteOperations.callAsync.args[0][2].success({ result: Consoloid.FileList.Server.BasicOperations.IS_FOLDER });

      remoteOperations.callAsync.secondCall.calledWith('rmdir', ['/something/somefolder', true]).should.be.true;

      remoteOperations.callAsync.args[1][2].success({ result: true });

      remoteOperations.callAsync.calledTwice.should.be.true;

      dialog.activeState.should.equal("success");
    });

    it("should show error if recursive deletion was called on a file", function() {
      dialog.arguments = { path: { value: "/something/somefile" }, recursively: { value: true } };
      dialog.setup();

      remoteOperations.callAsync.firstCall.calledWith('describe', ['/something/somefile']).should.be.true;

      remoteOperations.callAsync.args[0][2].success({ result: Consoloid.FileList.Server.BasicOperations.IS_FILE });

      remoteOperations.callAsync.calledOnce.should.be.true;

      dialog.activeState.should.equal("error");
    });
  });

});
