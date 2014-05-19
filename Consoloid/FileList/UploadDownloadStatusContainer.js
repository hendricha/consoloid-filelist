defineClass('Consoloid.FileList.UploadDownloadStatusContainer', 'Consoloid.Base.Object',
  {
    __constructor: function(options)
    {
      this.__base($.extend({
        container: {}
      }, options));

      getClass("Consoloid.FileList.Dialog.FileOperation.UploadDownload");
    },

    message: function(callback, id, name, type, status, percentage) {
      try {
        this.__getDialog(id, name, type).setTransferStatus(status, percentage);
        callback({ result: "success" });
      } catch(e) {
        callback(e);
      }
    },

    __getDialog: function(id, name, type) {
      if (id in this.container) {
        return this.container[id];
      }
      var dialog = this.create("Consoloid.FileList.Dialog.FileOperation.UploadDownload", {
        container: this.container,
        name: name,
        type: type
      });
      dialog.start();
      this.container[id] = dialog;
      return dialog;
    },

  }, {
    ACTIVE: 0,
    FAILED: 1,
    SUCCESS: 2,
    UPLOAD: 0,
    DOWNLOAD: 1
  }
);
