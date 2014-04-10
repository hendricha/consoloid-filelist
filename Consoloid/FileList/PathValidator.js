defineClass('Consoloid.FileList.PathValidator', 'Consoloid.Base.Object',
  {
    validateFile: function(file)
    {
      return this.__isAbsolutePath(file) || (this.__notDeepRelativePath(file) && this.get("console").getLastDialog().hasFile(file));
    },

    __isAbsolutePath: function(path)
    {
      return (path[0] == "/") ? true : false;
    },

    __notDeepRelativePath: function(path)
    {
      return (path.indexOf("/") == -1) ? true : false;
    },

    validateFolder: function(folder)
    {
      return this.__isAbsolutePath(folder) || (this.__notDeepRelativePath(folder) && this.get("console").getLastDialog().hasFolder(folder));
    },
  }
);
