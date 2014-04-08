defineClass('Consoloid.FileList.Context.Folder', 'Consoloid.FileList.Context.File',
  {
  },
  {
    fromString: function(str, container)
    {
      return new Consoloid.FileList.Context.Folder({name:str, container:container});
    }
  }
);
