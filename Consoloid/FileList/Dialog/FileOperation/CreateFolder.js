defineClass('Consoloid.FileList.Dialog.FileOperation.CreateFolder', 'Consoloid.FileList.Dialog.FileOperation.Abstract',
  {
    handleArguments: function(args, expression)
    {
      this.__base(args, expression);

      var path = this.get("file.list.path.absolutifier").absolutifyFolderDoesNotNeedToExist(this.arguments.path.value);

      this.describe(path, function() {
        this.get("server_operations").callAsync("mkdir", [ path ], {
          success: function(data) {
            this.showSuccess();
          }.bind(this),
          error: this.showError.bind(this)
        });
      }.bind(this), function() {
        this.showError(this.get("translator").trans("Path already exists."));
      }.bind(this));
    },

    showError: function(message, percentage)
    {
      this.__base(message, percentage);
    },
  }
);
