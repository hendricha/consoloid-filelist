require('consoloid-server/Consoloid/Server/Service');
require('../ListFiles.js');
require('consoloid-framework/Consoloid/Test/UnitTest');
describeUnitTest('Consoloid.FileList.Server.ListFiles', function() {
  var
    service,
    asnycQueue,
    fs,
    res;

  describe("#listFiles(res, path)", function() {
    beforeEach(function() {
      asyncQueue = {
        add: sinon.stub(),
        setDrain: sinon.stub(),
        killQueue: sinon.stub()
      };
      env.addServiceMock("async_function_queue", asyncQueue);

      fs = {
        readdir: sinon.stub().yields(null, ["foo", "bar", "foobar"]),
        stat: sinon.stub()
      };

      res = {};

      service = env.create(Consoloid.FileList.Server.ListFiles, { fsModule: fs });

      service.sendResult = sinon.stub();
      service.sendError = sinon.stub();

      service.listFiles(res, "/some/path");
    });

    it("should read the directory and then add one function to an async queue for each", function() {
      fs.readdir.calledOnce.should.be.ok;
      asyncQueue.add.calledThrice.should.be.ok;
      asyncQueue.setDrain.calledOnce.should.be.ok;
    });

    it("should add such functions to the queue, that they read basic stats, and then callback with them", function() {
      asyncQueue.add.args.forEach(function(arg) {
        arg[1](sinon.stub(), arg[2]);
      });

      fs.stat.calledThrice.should.be.ok;

      fs.stat.args[0][0].should.equal("/some/path/foo");
      fs.stat.args[0][1](null, {
        isFile: sinon.stub().returns(true),
        size: 9001,
        mtime: new Date("16 May 1986 10:24:11 GMT")
      });

      fs.stat.args[1][0].should.equal("/some/path/bar");
      fs.stat.args[1][1](null, {
        isFile: sinon.stub().returns(true),
        size: 42,
        mtime: new Date("22 March 1987 10:24:11 GMT")
      });

      fs.stat.args[2][0].should.equal("/some/path/foobar");
      fs.stat.args[2][1](null, {
        isFile: sinon.stub().returns(false),
        size: 13,
        mtime: new Date("4 Apr 2014 15:24:25 GMT+0200")
      });

      asyncQueue.setDrain.args[0][0]();

      service.sendResult.calledOnce.should.be.ok;
      service.sendResult.args[0][0].should.equal(res);
      var result = service.sendResult.args[0][1];

      result.foo.isFile.should.equal(true);
      result.foo.size.should.equal(9001);
      result.foo.mtime.should.equal(new Date("16 May 1986 10:24:11 GMT").getTime());

      result.bar.isFile.should.equal(true);
      result.bar.size.should.equal(42);
      result.bar.mtime.should.equal(new Date("22 March 1987 10:24:11 GMT").getTime());

      result.foobar.isFile.should.equal(false);
      result.foobar.size.should.equal(13);
      result.foobar.mtime.should.equal(new Date("4 Apr 2014 15:24:25 GMT+0200").getTime());
    });

    it("should kill the queue on an error and callback with the error", function() {
      asyncQueue.add.args[0][1](sinon.stub(), asyncQueue.add.args[0][2]);
      fs.stat.args[0][1]("something terrible");

      service.sendError.calledOnce.should.be.ok;
      service.sendError.args[0][0].should.equal(res);
      service.sendError.args[0][1].should.equal("something terrible");

      asyncQueue.killQueue.calledOnce.should.be.ok;
    });
  });
});