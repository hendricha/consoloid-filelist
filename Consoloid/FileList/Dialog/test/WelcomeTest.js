require('consoloid-framework/Consoloid/Test/UnitTest');
require("consoloid-framework/Consoloid/Widget/JQoteTemplate");
require("consoloid-framework/Consoloid/Widget/Widget");
require("consoloid-console/Consoloid/Ui/Dialog");
require("../Welcome");

describeUnitTest('Consoloid.FileList.Dialog.Welcome', function() {
  var
    dialog,
    dialogLauncher;

  beforeEach(function() {
    dialog = env.create(Consoloid.FileList.Dialog.Welcome, {});
    
    dialogLauncher = {
      startFromText: sinon.stub()
    };
    env.addServiceMock("dialogLauncher", dialogLauncher);
  });
  
  describe("#setup()", function() {
    it("should show some stats about the file system (drive sizes, how much is used etc);")
    it("should start the default file list view", function() {
      dialog.setup();
      dialogLauncher.startFromText.calledWith("Show file view").should.be.ok;
    });
  });
});