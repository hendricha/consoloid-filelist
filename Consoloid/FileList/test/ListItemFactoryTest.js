require('consoloid-console/Consoloid/Ui/List/Factory/Collapsing');
require('../ListItemFactory.js');

require('consoloid-framework/Consoloid/Test/UnitTest');

describeUnitTest('Consoloid.FileList.ListItemFactory', function() {
  var
    eventDispatcher,
    factory,
    create,
    collapsingElement,
    registrationA,
    registrationB,
    createFactory;
  beforeEach(function() {
    eventDispatcher = {};
    collapsingElement = {
      render: sinon.stub(),
      node: {}
    };

    sinon.stub(env.container, "getAllTagged");
    env.container.getAllTagged.returns([]);


    createFactory = function() {
      factory = env.create(Consoloid.FileList.ListItemFactory, {
        collapsedTemplateId: 'collapsed-test-template',
        extendedTemplateId: 'extended-test-template',
        eventDispatcher: eventDispatcher,
      });

      create = sinon.stub().returns(collapsingElement);
      factory.create = create;
    };

    registrationA = {
      getFileExtensions: sinon.stub().returns(["exe", "com"]),
      getExpression: sinon.stub().returns(["Tottaly execute", {"file <name>": "@target"}, "Run", true])
    }

    registrationB = {
      getFileExtensions: sinon.stub().returns(["exe"]),
      getExpression: sinon.stub().returns(["Check with virus scanner", {"file <name>": "@target"}, "Check"])
    }
  });

  describe("__constructor(options)", function() {
    it("should get all registrations from the container", function() {
      createFactory();
      env.container.getAllTagged.calledWith(["file-opener-registration"]).should.be.ok;
    });
  });

  describe("render(data)", function() {
    it("should create a collapsing list element and return with its node, as an Collapsing Factory", function() {
      createFactory();
      var data = { name: "virus.exe, isFile: true" };
      factory.render(data).should.equal(collapsingElement.node);
      create.calledWith("Consoloid.Ui.List.Factory.CollapsingElement").should.be.ok;
      create.args[0][1].eventDispatcher.should.equal(eventDispatcher);
      create.args[0][1].extendedTemplateId.should.equal("extended-test-template");
      create.args[0][1].collapsedTemplateId.should.equal("collapsed-test-template");

      collapsingElement.render.calledOnce.should.be.ok;
    });

    it("should add empty additionalActions to data if no services were configured", function() {
      createFactory();
      factory.render({ name: "virus.exe", isFile: true });
      create.args[0][1].data.name.should.equal("virus.exe");
      create.args[0][1].data.additionalActions.length.should.equal(0);
    });

    it("should add empty additionalActions to data if no relevant services were configured", function() {
      env.container.getAllTagged.returns([registrationA]);
      createFactory();
      factory.render({ name: "virus.jpg", isFile: true });
      create.args[0][1].data.name.should.equal("virus.jpg");
      create.args[0][1].data.additionalActions.length.should.equal(0);
    });

    it("should add actions if they match the a registered extension", function() {
      env.container.getAllTagged.returns([registrationA]);
      createFactory();
      factory.render({ name: "virus.exe", isFile: true });
      create.args[0][1].data.additionalActions[0][0].should.equal("Tottaly execute");
      create.args[0][1].data.additionalActions[0][1]["file <name>"].should.equal("virus.exe");
      create.args[0][1].data.additionalActions[0][2].should.equal("Run");
      create.args[0][1].data.additionalActions[0][3].should.equal(true);
    });

    it("should add all actions if they match multiple registerations", function() {
      env.container.getAllTagged.returns([registrationA, registrationB]);
      createFactory();
      factory.render({ name: "virus.exe", isFile: true });
      create.args[0][1].data.additionalActions[0][0].should.equal("Tottaly execute");
      create.args[0][1].data.additionalActions[0][1]["file <name>"].should.equal("virus.exe");
      create.args[0][1].data.additionalActions[0][2].should.equal("Run");
      create.args[0][1].data.additionalActions[0][3].should.equal(true);
      create.args[0][1].data.additionalActions[1][0].should.equal("Check with virus scanner");
      create.args[0][1].data.additionalActions[1][1]["file <name>"].should.equal("virus.exe");
      create.args[0][1].data.additionalActions[1][2].should.equal("Check");
    });

    it("should add empty additionalActions to data if it's not a file", function() {
      env.container.getAllTagged.returns([registrationA]);
      createFactory();
      factory.render({ name: "virus.exe", isFile: false });
      create.args[0][1].data.name.should.equal("virus.exe");
      create.args[0][1].data.additionalActions.length.should.equal(0);
    });
  });

  afterEach(function() {
    env.container.getAllTagged.restore();
  });
});
