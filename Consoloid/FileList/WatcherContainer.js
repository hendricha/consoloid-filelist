defineClass('Consoloid.FileList.WatcherContainer', 'Consoloid.Base.Object',
  {
    __constructor: function(options)
    {
      this.__base($.extend({
        dialogs: {}
      }, options));
    },

    watch: function(dialog, path, id) {
      this.get("server_file_watcher_container").callAsync("watch", [ path, id ], {
        success: function(data) {
          this.dialogs[id] = dialog;
        }.bind(this),
        error: function(data) {
          this.container.get('logger').log('info', 'Could not register remote watcher', {id: id, path: path, err: data});
        }.bind(this)
      });
    },

    eventHappened: function(callback, id, event, filename) {
      try {
        this.dialogs[id].watcherEventHappened(event, filename);
        callback({ result: true });
      } catch(e) {
        callback(e);
      }
    },

    close: function(id) {
      this.get("server_file_watcher_container").callAsync("close", [ id ], {
        success: function(data) {
          delete this.dialogs[id];
        }.bind(this),
        error: function(data) {
          this.container.get('logger').log('info', 'Could not unregister remote watcher', {id: id, err: data});
        }.bind(this)
      });
    },
  }
);
