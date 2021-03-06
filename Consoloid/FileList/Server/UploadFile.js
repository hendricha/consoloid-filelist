defineClass('Consoloid.FileList.Server.UploadFile', 'Consoloid.Server.Service',
  {
    __constructor: function(options)
    {
      this.__base($.extend({
        fsModule: require('fs'),
      }, options));

      this.asyncRPCPear = this.get('async_rpc_handler_server');
    },

    process: function(res, values)
    {
      this.path = values.path + "/";
      try {
        var authorizer = this.get("file.access.authorizer");
        authorizer.authorize(authorizer.__self.OPERATION_FILE_WRITE, this.path, res.socket);
      } catch (e) {
        this.sendResult(res, {
          result: 'error',
          errors: { path: e.toString() }
        });
        return;
      }

      this.sendResult(res, {
        result: 'ok',
        message: this.get('translator').trans("File upload started.")
      });

      this.__startProcessingFiles(values.files.catalogueName, values.files.fileInfos);
    },

    __startProcessingFiles: function(catalogueName, fileInfos) {
      getClass("Consoloid.FileList.UploadDownloadStatusContainer");
      fileInfos.forEach(function(info, index) {
        this.__messageClientAboutFile(catalogueName + index, info.name, Consoloid.FileList.UploadDownloadStatusContainer.ACTIVE, 0);
        this.__processFile(catalogueName, index, info);
      }.bind(this));
    },

    __messageClientAboutFile: function(id, fileName, status, percentage) {
      this.asyncRPCPear.callAsyncOnSharedService(
        "file.upload_download_status_container",
        "message",
        [ id, fileName, Consoloid.FileList.UploadDownloadStatusContainer.UPLOAD, status, percentage ],
        function() {
          this.container.get('logger').log('info', 'Messaged client about transfer', {id: id, fileName: fileName});
        }.bind(this),
        function(err) {
          this.container.get('logger').log('info', 'Could not message client about transfer', {id: id, fileName: fileName, err: err});
        }.bind(this),
        function() {
          this.container.get('logger').log('info', 'Messaging client about transfer failed', {id: id, fileName: fileName});
        }.bind(this)
      );
    },

    __processFile: function(catalogueName, index, info) {
      var remoteClientFile = this.create("Consoloid.OS.File.RemoteClientFile", {
        catalogue: catalogueName,
        container: this.container
      });

      remoteClientFile.open(index, "r", function(err) {
        if (err) {
          return this.__messageClientAboutFile(catalogueName + index, info.name, Consoloid.FileList.UploadDownloadStatusContainer.FAILED);
        }
        remoteClientFile.read(info.size, function(err, buffer, length) {
          if (err) {
            return this.__messageClientAboutFile(catalogueName + index, info.name, Consoloid.FileList.UploadDownloadStatusContainer.FAILED);
          }
          this.fsModule.writeFile(this.path + info.name, buffer,function() {
            if (err) {
              return this.__messageClientAboutFile(catalogueName + index, info.name, Consoloid.FileList.UploadDownloadStatusContainer.FAILED);
            }
            remoteClientFile.close(function(err) {
              if (err) {
                return this.__messageClientAboutFile(catalogueName + index, info.name, Consoloid.FileList.UploadDownloadStatusContainer.FAILED);
              }
              this.__messageClientAboutFile(catalogueName + index, info.name, Consoloid.FileList.UploadDownloadStatusContainer.SUCCESS);
            }.bind(this));
          }.bind(this));
        }.bind(this));
      }.bind(this))
    }
  }
);
