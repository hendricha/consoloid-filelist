defineClass('Consoloid.FileList.DataSource', 'Consoloid.Ui.List.DataSource.Array',
  {
    __constructor: function(options)
    {
      this.__base($.extend({
        data: [],
        dataReady: false
      }, options));

      this.requireProperty('path');
    },

    _setFilterValues: function(callback, filterValues)
    {
      if (!this.dataReady) {
        this.get("server_listfiles").callAsync(
          "listFiles",
          [this.path],
          {
            success: function(data) {
              this.data = data;
              this.dataReady = true;
              this._clearFilters();
              callback(undefined);
            }.bind(this),
            error: function(error) {
              callback(error);
            }
          }
        );
        return;
      }

      callback(undefined);
    },
  }
);