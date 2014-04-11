defineClass('Consoloid.FileList.Context.File', 'Consoloid.Context.Object',
  {
  },
  {
    fromString: function(str, container)
    {
      return new Consoloid.FileList.Context.File({
        name: container.get("file.list.path.absolutifier").absolutifyFile(str),
        container: container
      });
    }
  }
);
