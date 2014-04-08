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
      setPath: sinon.stub()
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
});