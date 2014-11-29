defineClass('Consoloid.FileList.Server.MockAccessAuthorizer', 'Consoloid.Server.Service',
  {
    authorize: function(operation, path, socket)
    {
    }
  },
  {
    OPERATION_FILE_READ: 0,
    OPERATION_FILE_WRITE: 1
  }
);
