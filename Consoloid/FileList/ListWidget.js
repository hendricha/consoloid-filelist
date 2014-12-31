defineClass('Consoloid.FileList.ListWidget', 'Consoloid.Ui.List.Widget',
  {
    __constructor: function(options)
    {
      this.__base($.extend({
        selection: []
      }, options));
    },

    setPath: function(path)
    {
      this.dataSource.setPath(path);
      return this;
    },

    getPath: function()
    {
      return this.dataSource.getPath();
    },

    hasFile: function(file)
    {
      return this.dataSource.hasFile(file);
    },

    hasFolder: function(folder)
    {
      return this.dataSource.hasFolder(folder);
    },

    render: function()
    {
      this.dataSource.clearData();
      this.__base();
    },

    __elementsRenderedEvent: function()
    {
      this.node.find('.ui.checkbox').checkbox();
    },

    clearSelection: function()
    {
      this.node.find('.ui.checkbox').each(function() {
        $(this).checkbox('disable');
      });
    },

    getSelection: function()
    {
      return this.selection;
    },

    getFiles: function(callback)
    {
      try {
        return this.dataSource.getData();
      } catch(e) {
        if (e.message == "Data is not yet ready") {
          return [];
        }

        throw e;
      }
    }
  }
);
