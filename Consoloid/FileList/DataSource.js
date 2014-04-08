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
              this.__generateFilteredIndexes(filterValues);
              callback(undefined);
            }.bind(this),
            error: function(error) {
              callback(error);
            }
          }
        );
        return;
      }

      this.__generateFilteredIndexes(filterValues);
      callback(undefined);
    },

    __generateFilteredIndexes: function(filterValues)
    {
      this.filteredDataIndexes = [];
      this.data.forEach(function(file, index) {
        if (filterValues.showHidden || file.name[0] != ".") {
          this.filteredDataIndexes.push(index);
        }
      }.bind(this));

      var sortedFolderIndexes = this.__sortFileOrFolderIndexes(false);
      var sortedFileIndexes = this.__sortFileOrFolderIndexes(true);

      this.filteredDataIndexes = sortedFolderIndexes.concat(sortedFileIndexes);
    },

    __sortFileOrFolderIndexes: function(sortFiles)
    {
      return this.filteredDataIndexes
        .filter(function(index) {
          if (sortFiles) {
            return this.data[index].isFile;
          } else {
            return !this.data[index].isFile;
          }
        }.bind(this))
        .sort(function(a, b) {
          return this.data[a].name < this.data[b].name ? -1 : +1;
        }.bind(this));
    }
  }
);