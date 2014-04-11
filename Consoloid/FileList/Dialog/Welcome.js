defineClass('Consoloid.FileList.Dialog.Welcome', 'Consoloid.Ui.Dialog',
  {
    __constructor: function(options)
    {
      this.__base($.extend({
        responseTemplateId: 'Consoloid-FileList-Dialog-Welcome'
      }, options));
    },
    
    setup: function()
    {
      this.get("dialogLauncher").startFromText("Show file view");
    }
  }
);