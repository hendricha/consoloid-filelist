defineClass('Consoloid.FileList.Server.BasicOperations', 'Consoloid.Server.Service',
  {
    __constructor: function(options)
    {
      this.__base($.extend({
        fsModule: require("fs"),
      }, options));
    },

    unlink: function(res, path)
    {
      this.fsModule.unlink(path, function(err) {
        if (err) {
          this.sendError(res, err);
          return;
        }
        
        this.sendResult(res, true);
      }.bind(this));
    },

  }
);
