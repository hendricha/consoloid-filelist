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

      this.sendResult(this.res, { result: true });
    },

    rename: function(res, oldPath, newPath, overwrite)
    {
      this.res = res;
      if (!overwrite && this.fsModule.existsSync(newPath)) {
        this.sendError(this.res, "FILEEXISTS");
        return;
      }
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
    },

    describe: function(res, path)
    {
      if (!this.fsModule.existsSync(path)) {
        return this.sendResult(res, { result: this.__self.DOES_NOT_EXIST });
      }

      var stat = this.fsModule.statSync(path);
      if (stat.isFile()) {
        return this.sendResult(res, { result: this.__self.IS_FILE });
      }

      if (stat.isDirectory()) {
        return this.sendResult(res, { result: this.__self.IS_FOLDER });
      }

      return this.sendError(res, "PATHISNOTFILENORDIRECTORY");
    },
  }, {
    IS_FILE: 0,
    IS_FOLDER: 1,
    DOES_NOT_EXIST: 2
  }
);
