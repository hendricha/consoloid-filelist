defineClass('Consoloid.FileList.PathAbsolutifier', 'Consoloid.Base.Object',
  {
    absolutifyFile: function(file)
    {
      if (this.__isAbsolutePath(file)) {
        return file;
      }

      if (this.__notDeepRelativePath(file) && this.__getLastFileList().hasFile(file)) {
        return this.__getLastFileList().getPath() + "/" + file;
      }

      throw new Error(__("File is either not referenced by absolute path, or not in last shown file list view."));
    },

    __isAbsolutePath: function(path)
    {
      return (path[0] == "/") ? true : false;
    },

    __notDeepRelativePath: function(path)
    {
      return (path.indexOf("/") == -1) ? true : false;
    },

    __getLastFileList: function()
    {
      var contextObjects = this.get("context").findByClass('Consoloid.FileList.Context.List');

      if (contextObjects.length) {
       return contextObjects[0].entity.getList();
      }

      throw new Error(__("No file list view to find this item, try absolute path."));
    },

    absolutifyFolder: function(folder)
    {
      if (this.__isAbsolutePath(folder)) {
        return folder;
      }

      if (this.__notDeepRelativePath(folder) && this.__getLastFileList().hasFolder(folder)) {
        return this.__getLastFileList().getPath() + "/" + folder;
      }

      throw new Error(__("Folder is either not referenced by absolute path, or not in last shown file list view."));
    },
  }
);
