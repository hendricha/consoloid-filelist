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
      setPath: sinon.stub()
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
});