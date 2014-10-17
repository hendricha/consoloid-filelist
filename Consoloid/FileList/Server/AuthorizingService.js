defineClass('Consoloid.FileList.Server.AuthorizingService', 'Consoloid.Server.Service',
  {
    __constructor: function(options)
    {
      this.__base(options);

      this.authorizer = this.get("file.access.authorizer");
    },

    _authorize: function(operation, path)
    {
      try {
        this.authorizer.authorize(operation, path);
        return true;
      } catch (err) {
        this._respond(err);
        return false;
      }
    },

    _respond: function(err, result) {
      if (err) {
        this.sendError(this.res, err);
        return;
      }

      this.sendResult(this.res, result);
    },
  }
);
