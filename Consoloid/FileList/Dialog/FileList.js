defineClass('Consoloid.FileList.Dialog.FileList', 'Consoloid.Ui.List.Dialog.Dialog',
  {
    __constructor: function(options)
    {
      this.__base(options);
      this.requireProperty('defaultFolder');

      this.get('css_loader').load("Consoloid-FileList-Dialog-filelist");
    },

    handleArguments: function(args, expression)
    {
      this.__base(args, expression);
      this.path = this.arguments.folder ? this.arguments.folder.value : this.defaultFolder;
      this.list.setPath(this.path);
    },
  }
);
