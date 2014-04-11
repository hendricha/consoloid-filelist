defineClass('Consoloid.FileList.Dialog.FileList', 'Consoloid.Ui.List.Dialog.Dialog',
  {
    __constructor: function(options)
    {
      this.__base($.extend({
        contextObjectClass: 'Consoloid.FileList.Context.List'
      }, options));
      this.requireProperty('defaultFolder');

      this.get('css_loader').load("Consoloid-FileList-Dialog-filelist");
    },

    handleArguments: function(args, expression)
    {
      this.__base(args, expression);
      this.path = this.arguments.folder ? this.arguments.folder.value : this.defaultFolder;
      this.list.setPath(this.path);
    },

    getPath: function()
    {
      return this.list.getPath();
    },

    hasFile: function(file)
    {
      return this.list.hasFile(file);
    },

    hasFolder: function(folder)
    {
      return this.list.hasFolder(folder);
    }
  }
);
