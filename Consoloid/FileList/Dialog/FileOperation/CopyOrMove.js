defineClass('Consoloid.FileList.Dialog.FileOperation.CopyOrMove', 'Consoloid.FileList.Dialog.FileOperation.Abstract',
  {
    __constructor: function(options)
    {
      this.__base($.extend({
        remoteMethod: "copy",
        sentenceText: "Copy"
      }, options));

      getClass("Consoloid.FileList.Server.BasicOperations");
    },

    setup: function()
    {
      this.__base();

      this.source = this.get("file.list.path.absolutifier").absolutifyFile(this.arguments.source.value);
      this.target = this.get("file.list.path.absolutifier").absolutifyFileDoesNotNeedToExist(this.arguments.target.value);

      if (this.source == this.target) {
        this.showError(this.get("translator").trans("Target is source."));
        return;
      }

      this.describe(this.source, function() {
        this.showError(this.get("translator").trans("Source did not exist."));
      }.bind(this), function() {
        this.describe(this.target, this.doMethod.bind(this), function() {
          if (this.arguments.overwrite && this.arguments.overwrite.value) {
            this.doMethod();
            return;
          }

          this.showError(
            this.get("translator").trans("Target exists.") +
            " " +
            __s(this.sentenceText, {
              "source <value>": this.source,
              "target <value>": this.target,
              "overwrite": true
            }, "Overwrite", true)
          );
        }.bind(this));
      }.bind(this));
    },

    doMethod: function() {
      this.get("server_operations").callAsync(this.remoteMethod, [
        this.source,
        this.target,
        this.arguments.overwrite ? this.arguments.overwrite.value : false
      ], {
        success: function(data) {
          this.showSuccess();
        }.bind(this),
        error: this.showError.bind(this)
      });
    }
  }
);
