defineClass('Consoloid.FileList.Dialog.FileOperation.Copy', 'Consoloid.FileList.Dialog.FileOperation.Move',
  {
    __constructor: function(options)
    {
      this.__base($.extend({
        remoteMethod: "copy",
        sentenceText: "Copy"
      }, options));

      getClass("Consoloid.FileList.Server.BasicOperations");
    },

    targetIsFolder: function() {
      this.target = this.target + "/" + this.source.split("/")[this.source.split("/").length - 1];
      this.doMethod();
    }
  }
);
