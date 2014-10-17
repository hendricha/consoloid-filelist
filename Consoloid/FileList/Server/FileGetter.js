defineClass('Consoloid.FileList.Server.FileGetter', 'Consoloid.FileList.Server.AuthorizingService',
  {
    __constructor: function(options)
    {
      this.__base($.extend({
        dataUriModule: require("datauri"),
      }, options));
    },

    getFile: function(res, path)
    {
      this.res = res;
      if (!this._authorize(this.authorizer.__self.OPERATION_READ, path)) {
        return;
      }

      try {
        this.sendResult(res, { result: new this.dataUriModule(path).content });
      } catch (err) {
        this.sendError(res, err);
      }
    },
  }
);
