defineClass('Consoloid.FileList.Server.ListFiles', 'Consoloid.FileList.Server.AuthorizingService',
  {
    __constructor: function(options)
    {
      this.__base($.extend({
        fsModule: require("fs"),
        pathModule: require("path"),
        result: []
      }, options));
    },

    listFiles: function(res, path)
    {
      this.res = res;
      if (!this._authorize(this.authorizer.__self.OPERATION_FILE_READ, path)) return;

      this.fsModule.readdir(path, function(err, files) {
        if (err) {
          if (err.toString().indexOf("Error: ENOENT") == 0) {
            err = __('Folder does not exist');
          }
          this.sendError(res, err);
          return;
        }

        if (files.length == 0) {
          return this._respond();
        }

        this.queue = this.get("async_function_queue");

        this.queue.setDrain(this._respond.bind(this));

        files.forEach(function(filename) {
          this.queue.add(undefined, this.__getFileStats.bind(this), path + "/" + filename);
        }.bind(this));
      }.bind(this));
    },

    __getFileStats: function(callback, path)
    {
      this.fsModule.stat(path, function(err, stats) {
        if (err) {
          this.sendError(this.res, err);
          this.queue.killQueue();
          callback();
          return;
        }

        this.result.push({
          name: this.pathModule.basename(path),
          isFile: stats.isFile(),
          size: stats.size,
          mtime: stats.mtime.getTime(),
          fullPath: path
        });
        callback();
      }.bind(this));
    },

    _respond: function(err)
    {
      this.__base(err, this.result);
    }
  }
);
