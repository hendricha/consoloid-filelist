defineClass('Consoloid.FileList.Dialog.FileOperation.Abstract', 'Consoloid.Ui.Volatile.Dialog',
  {
    __constructor: function(options)
    {
      this.__base($.extend({
        states: {
          'active': 'Consoloid-FileList-Dialog-DialogActive',
          'error': 'Consoloid-FileList-Dialog-DialogError',
          'success': 'Consoloid-FileList-Dialog-DialogSuccess'
        },
        activeState: 'active',
        percentage: 100
      }, options));

      getClass("Consoloid.FileList.Server.BasicOperations");
    },

    describe: function(doesNotExist, isFile, isFolder)
    {
      isFolder = isFolder || isFile;

      this.get("server_operations").callAsync("describe", [ this.arguments.path.value ], {
        success: function(data) {
          switch (data.result) {
            case Consoloid.FileList.Server.BasicOperations.IS_FILE:
              isFile();
              break;
            case Consoloid.FileList.Server.BasicOperations.IS_FOLDER:
              isFolder();
              break;
            case Consoloid.FileList.Server.BasicOperations.DOES_NOT_EXIST:
              doesNotExist();
              break;
            default:
              this.showError("Error: " + JSON.stringify(data));
          }
        }.bind(this),
        error: this.showError.bind(this)
      });
    },

    showActive: function(percentage)
    {
      this.activeState = "active";
      this.percentage = percentage;
      this.render();
    },

    showError: function(message, percentage)
    {
      this.activeState = "error";
      this.percentage = this.percentage || percentage;
      this.message = message;
      this.render();
    },

    showSuccess: function()
    {
      this.activeState = "success";
      this.percentage = 100;
      this.render();
    },

  }
);
