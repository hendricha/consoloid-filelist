defineClass('Consoloid.FileList.Server.WatcherContainer', 'Consoloid.Server.Service',
  {
    __constructor: function(options)
    {
      this.__base($.extend({
        fsModule: require("fs"),
        watchers: {}
      }, options));
    },

    watch: function(res, path, id)
    {
      try {
        this.watchers[id] = {
          watcher: this.fsModule.watch(path, function(event, filename) {
            this.__callClientWatcherContainer(id, event, filename);
          }.bind(this)),
          reportingChangeAllowed: true
        }
        this.sendResult(res, { result: true });
      } catch (err) {
        this.sendError(res, err);
      }
    },

    __callClientWatcherContainer: function(id, event, filename)
    {
      if (event == "change") {
        if (!this.watchers[id].reportingChangeAllowed) {
          return;
        }

        this.watchers[id].reportingChangeAllowed = false;
        setTimeout(function() {
          this.watchers[id].reportingChangeAllowed = true;
        }.bind(this), 30000);
      }
      this.get('async_rpc_handler_server').callAsyncOnSharedService(
        "client_file_watcher_container",
        "eventHappened",
        [ id, event, filename ],
        function() {
          this.container.get('logger').log('info', 'Messaged client about file watcher event', {id: id, event: event, fileName: filename});
        }.bind(this),
        function(err) {
          this.container.get('logger').log('info', 'Could not message client about file watcher event', {id: id, event: event, fileName: filename, err: err});
        }.bind(this),
        function() {
          this.container.get('logger').log('info', 'Messaging client about file watcher event timed out', {id: id, event: event, fileName: filename});
        }.bind(this)
      );
    },

    close: function(res, id)
    {
      try {
        this.watchers[id].watcher.close();
        delete this.watchers[id];
        this.sendResult(res, { result: true });
      } catch (err) {
        this.sendError(res, err);
      }
    },
  }
);
