defineClass('Consoloid.FileList.Server.BasicOperations', 'Consoloid.FileList.Server.AuthorizingService',
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
      if (!this._authorize(this.authorizer.__self.OPERATION_FILE_WRITE, path)) return;
      this.fsModule.unlink(path, this._respond.bind(this));
    },

    _respond: function(err) {
      this.__base(err, { result: true });
    },

    rename: function(res, oldPath, newPath, overwrite)
    {
      this.res = res;
      if (!this._authorize(this.authorizer.__self.OPERATION_FILE_WRITE, oldPath)) return;
      if (!this._authorize(this.authorizer.__self.OPERATION_FILE_WRITE, newPath)) return;
      if (!overwrite && this.fsModule.existsSync(newPath)) {
        this.sendError(this.res, "FILEEXISTS");
        return;
      }
      this.fsModule.rename(oldPath, newPath, this._respond.bind(this));
    },

    rmdir: function(res, path, recursive)
    {
      this.res = res;
      if (!this._authorize(this.authorizer.__self.OPERATION_FILE_WRITE, path)) return;

      if (recursive) {
        this.rimrafModule(path, this._respond.bind(this));
      } else {
        this.fsModule.rmdir(path, this._respond.bind(this));
      };
    },

    mkdir: function(res, path)
    {
      this.res = res;
      if (!this._authorize(this.authorizer.__self.OPERATION_FILE_WRITE, path)) return;
      this.fsModule.mkdir(path, this._respond.bind(this));
    },

    copy: function(res, oldPath, newPath, overWrite)
    {
      this.res = res;
      if (!this._authorize(this.authorizer.__self.OPERATION_FILE_READ, oldPath)) return;
      if (!this._authorize(this.authorizer.__self.OPERATION_FILE_WRITE, newPath)) return;
      this.copyModule(oldPath, newPath, { clobber: overWrite ? true : false, stopOnErr: true }, this._respond.bind(this));
    },

    describe: function(res, path)
    {
      this.res = res;
      if (!this._authorize(this.authorizer.__self.OPERATION_FILE_READ, path)) return;
      if (!this.fsModule.existsSync(path)) {
        return this.sendResult(res, { result: this.__self.DOES_NOT_EXIST });
      }

      var stat = this.fsModule.lstatSync(path);
      if (stat.isFile() || stat.isSymbolicLink()) {
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
