defineClass('Consoloid.FileList.Dialog.FileOperation.Delete', 'Consoloid.FileList.Dialog.FileOperation.Abstract',
  {
    setup: function()
    {
      this.__base();

      this.describe(function() {
        this.showError("Path did not exist.");
      }.bind(this), function() {
        if (this.arguments.recursively && this.arguments.recursively.value) {
          this.showError("This is not a folder.");
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
  }
);
