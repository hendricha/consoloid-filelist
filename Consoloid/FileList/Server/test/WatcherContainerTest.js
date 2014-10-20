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
      asyncRpcHandler.callAsyncOnSharedService.calledWith("client_file_watcher_container", ["foo_bar", "rename", "/some/path/file"]),should.be.ok;
    });

    it("should not send envets that often");
  });

  describe("#close(res, id)", function() {
    it("should close the watcher", function() {
      service.watch(res, "/some/path", "foo_bar");
      service.close(res, "foo_bar");
      watcher.close.calledOnce.should.be.ok;
    });
  });
});
