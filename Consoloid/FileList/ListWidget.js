defineClass('Consoloid.FileList.ListWidget', 'Consoloid.Ui.List.Widget',
  {
    setPath: function(path)
    {
      this.dataSource.setPath(path);
      return this;
    },

    hasFile: function(file)
    {
      return this.dataSource.hasFile(file);
    },

    hasFolder: function(folder)
    {
      return this.dataSource.hasFolder(folder);
    }
  }
);
