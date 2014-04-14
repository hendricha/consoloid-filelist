defineClass('Consoloid.FileList.Server.BasicOperations', 'Consoloid.Server.Service',
  {
    __constructor: function(options)
    {
      this.__base($.extend({
        fsModule: require("fs"),
        rimrafModule: require("rimraf"),
        copyModule: require("ncp")
      }, options));
    },

    unlink: function(res, path)
    {
      this.res = res;
      this.fsModule.unlink(path, this.__respond.bind(this));
    },

    __respond: function(err) {
      if (err) {
        this.sendError(this.res, err);
        return;
      }

      this.sendResult(this.res, true);
    },

    rename: function(res, oldPath, newPath)
    {
      this.res = res;
      this.fsModule.rename(oldPath, newPath, this.__respond.bind(this));
    },

    rmdir: function(res, path, recursive)
    {
      this.res = res;
      if (recursive) {
        this.rimrafModule(path, this.__respond.bind(this));
      } else {
        this.fsModule.rmdir(path, this.__respond.bind(this));
      };
    },

    mkdir: function(res, path)
    {
      this.res = res;
      this.fsModule.mkdir(path, this.__respond.bind(this));
    },

    copy: function(res, oldPath, newPath, overWrite)
    {
      this.res = res;
      this.copyModule(oldPath, newPath, { clobber: overWrite ? true : false, stopOnErr: true }, this.__respond.bind(this));
    }
  }
);
