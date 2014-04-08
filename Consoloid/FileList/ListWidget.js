defineClass('Consoloid.FileList.ListWidget', 'Consoloid.Ui.List.Widget',
  {
    setPath: function(path)
    {
      this.dataSource.setPath(path);
      return this;
    }
  }
);
