defineClass('Consoloid.FileList.Server.FileGetter', 'Consoloid.Server.Service',
  {
    __constructor: function(options)
    {
      this.__base($.extend({
        dataUriModule: require("datauri"),
      }, options));
    },

    getFile: function(res, path)
    {
      try {
        this.sendResult(res, { result: new this.dataUriModule(path).content });
      } catch (err) {
        this.sendError(res, err);
      }
    },
  }
);
