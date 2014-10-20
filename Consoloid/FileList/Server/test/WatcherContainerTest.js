require('consoloid-server/Consoloid/Server/Service');
require('../WatcherContainer.js');
require('consoloid-framework/Consoloid/Test/UnitTest');
describeUnitTest('Consoloid.FileList.Server.WatcherContainer', function() {
  var
    service,
    fs,
    watcher,
    asyncRpcHandler,
    res;

  beforeEach(function() {
    watcher = {
      close: sinon.stub()
    }

    fs = {
      watch: sinon.stub().returns(watcher)
    };

    res = {};

    asyncRpcHandler = {
      callAsyncOnSharedService: sinon.stub()
    };
    env.addServiceMock("async_rpc_handler_server", asyncRpcHandler);

    service = env.create(Consoloid.FileList.Server.WatcherContainer, { fsModule: fs });

    service.sendResult = sinon.stub();
    service.sendError = sinon.stub();
  });

  describe("#watch(res, path, id)", function() {
    it("should start watching that path, and message back if something happened", function() {
      service.watch(res, "/some/path", "foo_bar");
      fs.watch.calledWith("/some/path").should.be.ok;

      fs.watch.args[0][1]("rename", "/some/path/file");
      asyncRpcHandler.callAsyncOnSharedService.calledWith("client_file_watcher_container", 'eventHappened', ["foo_bar", "rename", "/some/path/file"]).should.be.ok;
    });

    it("should not send change envets that often", function() {
      var clock = sinon.useFakeTimers();
      service.watch(res, "/some/path", "foo_bar");
      fs.watch.calledWith("/some/path").should.be.ok;

      fs.watch.args[0][1]("change", "/some/path/file");
      fs.watch.args[0][1]("change", "/some/path/file");
      asyncRpcHandler.callAsyncOnSharedService.calledWith("client_file_watcher_container", 'eventHappened', ["foo_bar", "change", "/some/path/file"]).should.be.ok;
      asyncRpcHandler.callAsyncOnSharedService.calledOnce.should.be.ok;

      clock.tick(30000);
      fs.watch.args[0][1]("change", "/some/path/file");
      asyncRpcHandler.callAsyncOnSharedService.calledTwice.should.be.ok;

      clock.restore();
    });
  });

  describe("#close(res, id)", function() {
    it("should close the watcher", function() {
      service.watch(res, "/some/path", "foo_bar");
      service.close(res, "foo_bar");
      watcher.close.calledOnce.should.be.ok;
    });
  });
});
