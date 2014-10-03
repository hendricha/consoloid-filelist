defineClass('Consoloid.FileList.Dialog.FileList', 'Consoloid.Ui.List.Dialog.Dialog',
  {
    __constructor: function(options)
    {
      this.__base($.extend({
        contextObjectClass: 'Consoloid.FileList.Context.List'
      }, options));
      this.requireProperty('defaultFolder');

      this.get('css_loader').load("Consoloid-FileList-Dialog-filelist");
      this.get('css_loader').load("Consoloid-FileList-Dialog-vanda");
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
    },

    watcherEventHappened: function(event, filename)
    {
      this.list.render();
    },

    render: function()
    {
      this.__base();
      this.get("client_file_watcher_container").watch(this, this.path, this.name);
      this.get("filelist.dropzone_controller").register(this.node);
    }
  }
);
