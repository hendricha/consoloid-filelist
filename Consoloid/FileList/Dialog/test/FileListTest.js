require("consoloid-framework/Consoloid/Widget/JQoteTemplate");
require('consoloid-framework/Consoloid/Widget/jquery.jqote2.min.js');
require("consoloid-framework/Consoloid/Widget/Widget");
require("consoloid-console/Consoloid/Ui/Dialog");
require("consoloid-console/Consoloid/Ui/List/Dialog/Dialog");
require("../FileList");
require('consoloid-framework/Consoloid/Test/UnitTest');

describeUnitTest('Consoloid.FileList.Dialog.FileList', function() {
  var
    dialog,
    list;

  beforeEach(function() {
    env.addServiceMock('translator', {
      trans: function(str) {
        return str;
      }
    });

    env.addServiceMock('css_loader', {
      load: sinon.stub()
    });

    env.addServiceMock('resource_loader', {
      getParameter: sinon.stub()
    });

    list = {
      getEventDispatcher: sinon.stub().returns({
        bind: sinon.stub()
      }),
      setPath: sinon.stub(),
      getPath: sinon.stub().returns("/something/something"),
      hasFile: sinon.stub().returns(true),
      hasFolder: sinon.stub().returns(true)
    };

    dialog = env.create(Consoloid.FileList.Dialog.FileList, {
      name: "Foo File List Dialog",
      list: list,
      defaultFolder: "/default/path",
      create: sinon.stub()
    });
  });

  describe("#handleArguments(args, expression)", function() {
    it("should set list widget's path from arguments", function() {
      dialog.handleArguments({
        folder: {
          value: "/something/something"
        }
      }, {});

      list.setPath.calledWith("/something/something").should.be.ok;
    });

    it("should set list widget's path from default path if it was not in the arguments", function() {
      dialog.handleArguments({}, {});

      list.setPath.calledWith("/default/path").should.be.ok;
    });
  });

  describe("#hasFile(file)", function() {
    it("should check if list widget has this file or not", function() {
      dialog.hasFile("something.txt").should.be.ok;
      list.hasFile.calledWith("something.txt").should.be.ok;

      list.hasFile.returns(false);

      dialog.hasFile("something.txt").should.not.be.ok;
    });
  });

  describe("#hasFolder(folder)", function() {
    it("should check if list widget has this folder or not", function() {
      dialog.hasFolder("something_folder").should.be.ok;
      list.hasFolder.calledWith("something_folder").should.be.ok;

      list.hasFolder.returns(false);

      dialog.hasFolder("something_folder").should.not.be.ok;
    });
  });

  describe("#getPath()", function() {
    it("should get path of the list widget", function() {
      dialog.getPath().should.equal("/something/something");

      list.getPath.calledOnce.should.be.ok;
    });
  });
});