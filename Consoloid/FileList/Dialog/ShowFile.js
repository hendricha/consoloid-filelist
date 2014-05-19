defineClass('Consoloid.FileList.Dialog.ShowFile', 'Consoloid.Ui.Dialog',
  {
    __constructor: function(options)
    {
      this.__base($.extend({
        responseTemplateId: 'Consoloid-FileList-Dialog-ShowFile'
      }, options));
    },

    setup: function()
    {
      this.get("download.file.getter").callAsync("getFile", [ this.arguments.path.value ], {
        success: function(data) {
          this.node.find("iframe.show.file").attr('src', data.result);
        }.bind(this),
        error: this.showError.bind(this)
      });
    },

    showError: function(err)
    {
      alert(err);
    }
  }
);
