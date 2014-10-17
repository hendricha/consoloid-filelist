defineClass('Consoloid.FileList.Server.MockAccessAuthorizer', 'Consoloid.Server.Service',
  {
    authorize: function(operation, path)
    {
    }
  },
  {
    OPERATION_READ: 0,
    OPERATION_WRITE: 1
  }
);
