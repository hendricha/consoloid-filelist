require('consoloid-framework/Consoloid/Test/UnitTest');
require('consoloid-console/Consoloid/Ui/List/DataSource/Base');
require('consoloid-console/Consoloid/Ui/List/DataSource/Array');
require('../DataSource.js');
describeUnitTest('Consoloid.FileList.DataSource', function() {
  var
    dataSource,
    listFiles,
    callback;

  describe("#__constructor(options)", function() {
    it("should require a path", function() {
      (function() {
        env.create(Consoloid.FileList.DataSource, {});
      }).should.throwError();

      (function() {
        env.create(Consoloid.FileList.DataSource, { path: "/something/something" });
      }).should.not.throwError();
    });
  });

  describe("#setFilterValues(callback, filterValues, fromIndex, toIndex)", function() {
    beforeEach(function() {
      callback = sinon.stub();

      listFiles = {
        callAsync: sinon.stub()
      };
      env.addServiceMock("server_listfiles", listFiles);

      dataSource = env.create(Consoloid.FileList.DataSource, { path: "/something/something" });

      dataSource.setFilterValues(callback, {}, 0, 3);
    });

    it("should get data from server if it isn't ready yet", function() {
      listFiles.callAsync.calledOnce.should.be.ok;
      listFiles.callAsync.calledWith('listFiles', ["/something/something"]);

      listFiles.callAsync.args[0][2].success([{ name: "some.file" }, { name: "some.other.file" }]);

      callback.calledWith(undefined, { data: [{ name: "some.file" }, { name: "some.other.file" }], count: 2 }).should.be.ok;

      dataSource.setFilterValues(callback, {}, 0, 1);

      listFiles.callAsync.calledOnce.should.be.ok;
      callback.calledTwice.should.be.ok;
      callback.calledWith(undefined, { data: [{ name: "some.file" }, { name: "some.other.file" }], count: 2 }).should.be.ok;
    });

    it("should work with remote error", function() {
      listFiles.callAsync.args[0][2].error("OMG, THE ERRORS! THEY ARE MULTIPLYING!");

      callback.calledWith("OMG, THE ERRORS! THEY ARE MULTIPLYING!").should.be.ok;
    });

    it("should hide dot files by default", function() {
       listFiles.callAsync.args[0][2].success([{ name: ".some.hidden.file" }, { name: "some.file" }]);

       callback.calledWith(undefined, { data: [{ name: "some.file" }], count: 1 }).should.be.ok;

       dataSource.setFilterValues(callback, { showHidden: true }, 0, 1);

       callback.calledWith(undefined, { data: [{ name: ".some.hidden.file" }, { name: "some.file" }], count: 2 }).should.be.ok;
    });

    it("should sort data in alphabetical order separating folders from files", function() {
      listFiles.callAsync.args[0][2].success([{ name: "b.file", isFile: true }, { name: "b.folder", isFile: false }, { name: "a.folder", isFile: false }, { name: "a.file", isFile: true }]);

      callback.calledWith(undefined, { data: [{ name: "a.folder", isFile: false }, { name: "b.folder", isFile: false }, { name: "a.file", isFile: true }, { name: "b.file", isFile: true }], count: 4 }).should.be.ok;
    });
  });
});