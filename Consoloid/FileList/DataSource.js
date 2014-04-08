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

    getDataByRange: function(callback, fromIndex, toIndex)
    {
      if (!this.dataReady) {
        var
          $base = this.__base,
          $this = this;
        this.get("server_listfiles").callAsync(
          "listFiles",
          [this.path],
          {
            success: function(data) {
              this.data = data;
              this.dataReady = true;
              this._clearFilters();
              $base.apply($this, [callback, fromIndex, toIndex]);
            }.bind(this),
            error: function(error) {
              callback(error);
            }
          }
        );
        return;
      }

      this.__base(callback, fromIndex, toIndex);
    },
  }
);