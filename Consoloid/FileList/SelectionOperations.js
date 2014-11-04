defineClass('Consoloid.FileList.SelectionOperations', 'Consoloid.Base.Object',
  {
    __constructor: function(options)
    {
      this.__base($.extend({
        sourceText: "from <value>",
        targetText: "to <value>",
        deleteSourceText: "path <value>"
      }, options));

    },

    copy: function(args) {
      this.text = "Copy";
      this.__startDialogs(args);
    },

    __startDialogs: function(args) {
      this.arguments = args;
      this.__getSelection();
      this.selection.forEach(function(item) {
        var text = "";
        switch (this.text) {
          case "Delete":
            text += __(this.text) + ", " + __(this.deleteSourceText, {"<value>": '"' + item + '"'});
            break;
          case "Move":
            args.target.value = this.container.get("file.list.path.absolutifier").absolutifyFolder(args.target.value) + "/" + item.replace(/^.*[\\\/]/, '');
          default:
            text += __(this.text) + ", " + __(this.sourceText, {"<value>": '"' + item + '"'}) + ", " + __(this.targetText, {"<value>": '"' + args.target.value + '"'});
            if (args.overwrite && args.overwrite.value == true) {
              text += ", " + __("overwrite");
            }
        }
        this.container.get("dialogLauncher").startFromText(text);
      }.bind(this));
    },

    __getSelection: function() {
      var fileList = ('fileList' in this.arguments && this.arguments.fileList) ?
                           this.arguments.fileList :
                           this.__lookupContextObject(
                               'Consoloid.FileList.Context.List',
                               0,
                               "There isn't any active file list dialog to submit");
      this.selection = fileList.entity.list.getSelection();
    },

    __lookupContextObject: function(cls, index, errorMessage)
    {
      var contextObjects = this.container.get('context').findByClass(cls);

      if (contextObjects.length == 0) {
        throw this.create('Consoloid.Error.UserMessage', { message: this.get('translator').trans(errorMessage || "Can't find object.") });
      }

      return contextObjects[index || 0];
    },

    move: function(args) {
      this.text = "Move";
      this.__startDialogs(args);
    },

    delete: function(args) {
      this.text = "Delete";
      this.__startDialogs(args);
    },
  }
);
