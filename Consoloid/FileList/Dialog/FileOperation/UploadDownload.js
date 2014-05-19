defineClass('Consoloid.FileList.Dialog.FileOperation.UploadDownload', 'Consoloid.FileList.Dialog.FileOperation.Abstract',
  {
    __constructor: function(options)
    {
      this.__base($.extend({
        percentage: 0
      }, options));

      this.requireProperty('type');
      this.requireProperty('name');

      getClass("Consoloid.FileList.UploadDownloadStatusContainer");
    },

    start: function()
    {
      this.expression = this.create('Consoloid.Widget.Widget', {
        templateId: 'Consoloid-FileList-FakeExpression',
        text: this.__getText(),
        container: this.container
      });
      this.startWithoutExpression();
    },

    __getText: function()
    {
      var message = "Downloading <name>"
      if (this.type == Consoloid.FileList.UploadDownloadStatusContainer.UPLOAD) {
        message = "Uploading <name>"
      }

      return this.get("translator").trans(message, { "<name>": this.name });
    },

    setTransferStatus: function(status, percentage)
    {
      switch (status) {
        case Consoloid.FileList.UploadDownloadStatusContainer.FAILED:
          this.showError(this.get("translator").trans("File transfer failed."), percentage);
          break;
        case Consoloid.FileList.UploadDownloadStatusContainer.SUCCESS:
          this.showSuccess();
          break;
        default:
          this.showActive(percentage);
      }
    }
  }
);
