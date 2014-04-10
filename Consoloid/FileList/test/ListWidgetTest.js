require("consoloid-framework/Consoloid/Widget/Widget");
require("consoloid-console/Consoloid/Ui/List/Widget");
require('../ListWidget.js');
require('consoloid-framework/Consoloid/Test/UnitTest');

describeUnitTest('Consoloid.FileList.ListWidget', function() {
  var
    widget,
    dataSource,
    create;

  beforeEach(function() {
    dataSource = {
      setPath: sinon.stub(),
      getPath: sinon.stub().returns("/something/something"),
      hasFile: sinon.stub().returns(true),
      hasFolder: sinon.stub().returns(true)
    };

    create = sinon.stub();
    create.withArgs('Foo.Bar.DataSource').returns(dataSource);

    widget = env.create(Consoloid.FileList.ListWidget, {
      create: create,
      dataSourceClass: "Foo.Bar.DataSource",
      dataSourceOptions: {},
      factoryClass: "Foo.Bar.Factory",
      factoryOptions: {},
      listViewClass: "Foo.Bar.ListView",
      listViewOptions: {},
    });
  });

  describe("#setPath(path)", function() {
    it("should set path of data source", function() {
      widget.setPath("/something/something");

      dataSource.setPath.calledWith("/something/something").should.be.ok;
    });
  });

  describe("#getPath()", function() {
    it("should get path of data source", function() {
      widget.getPath().should.equal("/something/something");

      dataSource.getPath.calledOnce.should.be.ok;
    });
  });

  describe("#hasFile(file)", function() {
    it("should check if data source has this file or not", function() {
      widget.hasFile("something.txt").should.be.ok;
      dataSource.hasFile.calledWith("something.txt").should.be.ok;

      dataSource.hasFile.returns(false);

      widget.hasFile("something.txt").should.not.be.ok;
    });
  });

  describe("#hasFolder(folder)", function() {
    it("should check if data source has this folder or not", function() {
      widget.hasFolder("something_folder").should.be.ok;
      dataSource.hasFolder.calledWith("something_folder").should.be.ok;

      dataSource.hasFolder.returns(false);

      widget.hasFolder("something_folder").should.not.be.ok;
    });
  });
});