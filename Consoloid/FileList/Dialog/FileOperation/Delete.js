defineClass('Consoloid.FileList.Dialog.FileOperation.Delete', 'Consoloid.FileList.Dialog.FileOperation.Abstract',
  {
    setup: function()
    {
      this.__base();

      this.describe(this.arguments.path.value, function() {
        this.showError("Path did not exist.");
      }.bind(this), function() {
        if (this.arguments.recursively && this.arguments.recursively.value) {
          this.showError(this.get("translator").trans("This is not a folder."));
          return;
        }
        this.get("server_operations").callAsync("unlink", [ this.arguments.path.value ], {
          success: function(data) {
            this.showSuccess();
          }.bind(this),
          error: this.showError.bind(this)
        });
      }.bind(this), function() {
        this.get("server_operations").callAsync("rmdir", [ this.arguments.path.value, this.arguments.recursively ? this.arguments.recursively.value : false ], {
          success: function(data) {
            this.showSuccess();
          }.bind(this),
          error: this.showError.bind(this)
        });
      }.bind(this));
    },

    showError: function(message, percentage)
    {
      if (message.indexOf("Error: ENOTEMPTY") === 0) {
        message = this.get("translator").trans("Folder was not empty.") + " " + __s("Delete", { "path <value>": this.arguments.path.value, "recursively": true }, "Delete recursively", true);
      }
      this.__base(message, percentage);
    },
  }
);
