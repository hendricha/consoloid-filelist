require('consoloid-framework/Consoloid/Test/UnitTest');
require('consoloid-console/Consoloid/Ui/List/DataSource/Base');
require('consoloid-console/Consoloid/Ui/List/DataSource/Array');
require('consoloid-console/Consoloid/Interpreter/Token');
require('consoloid-console/Consoloid/Interpreter/Tokenizable');
require('consoloid-console/Consoloid/Context/Object');
require('../Context/File.js');
require('../Context/Folder.js');
require('../DataSource.js');
describeUnitTest('Consoloid.FileList.DataSource', function() {
  var
    dataSource,
    listFiles,
    callback,
    context;

  beforeEach(function() {
    context = {
      add: sinon.stub()
    };
    env.addServiceMock("context", context);

    listFiles = {
      callAsync: sinon.stub()
    };
    env.addServiceMock("server_listfiles", listFiles);

    dataSource = env.create(Consoloid.FileList.DataSource, { path: "/something/something" });

    callback = sinon.stub();
  });

  describe("#setFilterValues(callback, filterValues, fromIndex, toIndex)", function() {
    beforeEach(function() {
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

    it("should add all files and folder with absolute path to context", function() {
      listFiles.callAsync.args[0][2].success([{ name: "some.file", isFile: true }, { name: "some.folder", isFile: false }]);

      context.add.args[0][0].name.should.equal("/something/something/some.file");
      (context.add.args[0][0] instanceof(Consoloid.FileList.Context.File)).should.be.ok;

      context.add.args[1][0].name.should.equal("/something/something/some.folder");
      (context.add.args[1][0] instanceof(Consoloid.FileList.Context.Folder)).should.be.ok;
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

    it("should sort data in case insensitive alphabetical order separating folders from files", function() {
      listFiles.callAsync.args[0][2].success([{ name: "b.file", isFile: true }, { name: "B.FOLDER", isFile: false }, { name: "a.folder", isFile: false }, { name: "a.file", isFile: true }]);

      callback.calledWith(undefined, { data: [{ name: "a.folder", isFile: false }, { name: "B.FOLDER", isFile: false }, { name: "a.file", isFile: true }, { name: "b.file", isFile: true }], count: 4 }).should.be.ok;
    });
  });

  describe("#setPath(path)", function() {
    it("should set path", function() {
      dataSource.setPath("/something/else");
      dataSource.setFilterValues(callback, {}, 0, 3);
      listFiles.callAsync.calledWith('listFiles', ["/something/else"]);
    });
  });

  describe("#getPath(path)", function() {
    it("should get path", function() {
      dataSource.setPath("/something/else");
      dataSource.getPath().should.equal("/something/else");
    });
  });

  describe("checking if it has files or folders", function() {
    beforeEach(function() {
      dataSource.setFilterValues(callback, {}, 0, 3);
      listFiles.callAsync.args[0][2].success([{ name: "some.file", isFile: true }, { name: "some.folder", isFile: false }]);
    });

    describe("#hasFile(file)", function() {
      it("should check if data source has this file or not", function() {
        dataSource.hasFile("some.file").should.be.ok;

        dataSource.hasFile("something.txt").should.not.be.ok;
      });
    });

    describe("#hasFolder(folder)", function() {
      it("should check if data source has this folder or not", function() {
        dataSource.hasFolder("some.folder").should.be.ok;

        dataSource.hasFolder("something_folder").should.not.be.ok;
      });
    });
  });
});