defineClass('Consoloid.FileList.PathAbsolutifier', 'Consoloid.Base.Object',
  {
    absolutify: function(path, options)
    {
      options = options || { isFile: true, isFolder: true };

      if (this.__isAbsolutePath(path)) {
        return path;
      }

      if (this.__notDeepRelativePath(path) && this.__checkExistence(path, options)) {
        return this.__getLastFileListPath() + path;
      }

      var firstSimilarPath = this.__getFirstSimilarPath(path);
      if (firstSimilarPath) {
        return firstSimilarPath;
      }

      throw new Error(__("File or folder is either not referenced by absolute path, or not in last shown file list view."));
    },

    __isAbsolutePath: function(path)
    {
      return (path[0] == "/") ? true : false;
    },

    __notDeepRelativePath: function(path)
    {
      return (path.indexOf("/") == -1) ? true : false;
    },

    __checkExistence: function(path, options)
    {
      return options.doesNotNeedToExist || (options.isFile && this.__getLastFileList().hasFile(path)) ||  (options.isFolder && this.__getLastFileList().hasFolder(path))
    },

    __getLastFileList: function()
    {
      var contextObjects = this.get("context").findByClass('Consoloid.FileList.Context.List');

      if (contextObjects.length) {
       return contextObjects[0].entity.getList();
      }

      throw new Error(__("No file list view to find this item, try absolute path."));
    },

    __getLastFileListPath: function()
    {
      var path = this.__getLastFileList().getPath();
      return (path[path.length - 1] == "/") ? path : path + "/";
    },

    __getFirstSimilarPath: function(path)
    {
      var firstSimiliarFile;
      var files = this.__getLastFileList().getFiles().map(function(file) {
        return file.name;
      });
      for (var i = 0; i < files.length; i++) {
        if (files[i].toLowerCase().indexOf(path.toLowerCase()) == 0) {
          firstSimiliarFile = files[i];
          break;
        }
      }

      return firstSimiliarFile ? this.__getLastFileListPath() + firstSimiliarFile : undefined;
    },

    absolutifyFolder: function(folder)
    {
      return this.absolutify(folder, { isFolder: true });
    },

    absolutifyFile: function(file)
    {
      return this.absolutify(file, { isFile: true });
    },

    absolutifyFolderDoesNotNeedToExist: function(folder)
    {
      return this.absolutify(folder, { doesNotNeedToExist: true, isFolder: true });
    },

    absolutifyFileDoesNotNeedToExist: function(file)
    {
      return this.absolutify(file, { doesNotNeedToExist: true, isFile: true });
    }
  }
);
