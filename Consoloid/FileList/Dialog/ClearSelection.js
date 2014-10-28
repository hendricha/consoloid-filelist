defineClass('Consoloid.FileList.Dialog.ClearSelection', 'Consoloid.Ui.Volatile.Dialog',
  {

    setup: function()
    {
      var contextObject = ('name' in this.arguments && this.arguments.name) ?
                           this.arguments.name :
                           this.__lookupContextObject(
                               'Consoloid.FileList.Context.List',
                               0,
                               "There isn't any active file list dialog to submit");

      contextObject.entity.list.clearSelection();
      this.__base();
      this.render();
    },
  }
);
