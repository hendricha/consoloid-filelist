defineClass('Consoloid.FileList.Dialog.FileList', 'Consoloid.Ui.List.Dialog.Dialog',
  {
    __constructor: function(options)
    {
      this.__base($.extend({
        contextObjectClass: 'Consoloid.FileList.Context.List',
      }, options));
      this.requireProperty('defaultFolder');

      this.get('css_loader').load("Consoloid-FileList-Dialog-filelist");
      this.get('css_loader').load("Consoloid-FileList-Dialog-vanda");

      this.list.getEventDispatcher().bind("error", this.__closeWatcher.bind(this));
    },

    __closeWatcher: function()
    {
      this.get("client_file_watcher_container").close(this.name);
    },

    handleArguments: function(args, expression)
    {
      this.__base(args, expression);
      this.path = this.arguments.folder ? this.arguments.folder.value : this.defaultFolder;
      this.path = this.__normalizePath(this.path);
      this.list.setPath(this.path);
    },

    __normalizePath: function(path)
    {
      path = (path[path.length - 1] == "/" && path.length > 1) ? path.substring(0, path.length - 1) : path
      var normalizedPath = path[0];
      for (var i = 1; i < path.length; i++) {
        if (path[i] != "/" || path[i-1] != "/") {
          normalizedPath += path[i];
        }
      }

      return normalizedPath;
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

      var $this = this
      this.node.on("change", ".ui.checkbox", function() {
        var checkbox = $(this).find("input:checkbox")[0];
        var name = $this.__normalizePath($this.path + "/" + $(this).find(".file.name").text());
        if (checkbox.checked) {
          $this.list.getSelection().push(name);
        } else {
          $this.list.getSelection().splice($this.list.getSelection().indexOf(name), 1);
        }

        console.log($this.list.getSelection());

        if ($this.list.getSelection().length == 0) {
          $this.node.find(".selection.sidebar").animate({width:'hide'});
        } else {
          $this.node.find(".selection.sidebar").animate({width:'show'});
        }
      });
    }
  }
);
