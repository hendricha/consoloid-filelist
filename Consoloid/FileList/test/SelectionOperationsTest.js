require("../SelectionOperations");
require('consoloid-framework/Consoloid/Test/UnitTest');

describeUnitTest('Consoloid.FileList.SelectionOperations', function() {
  var
    selectionOperations,
    dialogLauncher,
    context;

  beforeEach(function() {
    context = {
      findByClass: sinon.stub().returns([{
        entity: {
          list: {
            getSelection: sinon.stub().returns([ "foo" ]),
            clearSelection: sinon.stub()
          }
        }
      }])
    };
    env.addServiceMock("context", context);

    env.addServiceMock("file.list.path.absolutifier", {
      absolutifyFolder: function(str) { return str; }
    });

    dialogLauncher = {
      startFromText: sinon.stub()
    }
    env.addServiceMock("dialogLauncher", dialogLauncher);

    selectionOperations = env.create("Consoloid.FileList.SelectionOperations", {});

    global.__ = function(str, parameters) {
      if (parameters != null) {
        $.each(parameters, function (key, value) {
          str = str.replace(key, value);
        });
      }
      return str;
    };
  });

  describe("#copy(args)", function() {
    it("should start copy dialog for each selected item", function() {
      selectionOperations.copy({ target: { value: "bar" } });
      dialogLauncher.startFromText.calledWith('Copy, from "foo", to "bar"').should.be.ok;
      context.findByClass()[0].entity.list.clearSelection.calledOnce.should.be.ok;
    });
  });

  describe("#move(args)", function() {
    it("should start move dialog for each selected item", function() {
      selectionOperations.move({ target: { value: "bar" } });
      dialogLauncher.startFromText.calledWith('Move, from "foo", to "bar/foo"').should.be.ok;
      context.findByClass()[0].entity.list.clearSelection.calledOnce.should.be.ok;
    });
  });

  describe("#delete(args)", function() {
    it("should start delete dialog for each selected item", function() {
      selectionOperations.delete({});
      dialogLauncher.startFromText.calledWith('Delete, path "foo"').should.be.ok;
      context.findByClass()[0].entity.list.clearSelection.calledOnce.should.be.ok;
    });
  });

  afterEach(function() {
    delete global.__;
  })
});
