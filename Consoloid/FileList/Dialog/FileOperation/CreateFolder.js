defineClass('Consoloid.FileList.Dialog.FileOperation.CreateFolder', 'Consoloid.FileList.Dialog.FileOperation.Abstract',
  {
    setup: function()
    {
      this.__base();

      this.describe(this.arguments.path.value, function() {
        this.get("server_operations").callAsync("mkdir", [ this.arguments.path.value ], {
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
