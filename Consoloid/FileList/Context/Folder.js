defineClass('Consoloid.FileList.Context.Folder', 'Consoloid.FileList.Context.File',
  {
  },
  {
    fromString: function(str, container)
    {
      return new Consoloid.FileList.Context.File({
        name: container.get("file.list.path.absolutifier").absolutifyFolder(str),
        container: container
      });
    }
  }
);
