defineClass('Consoloid.FileList.DataSource', 'Consoloid.Ui.List.DataSource.Array',
  {
    __constructor: function(options)
    {
      this.__base($.extend({
        data: [],
        dataReady: false
      }, options));
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
              this.__addContextObjects();
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

    __addContextObjects: function()
    {
      var
        context = this.container.get('context');
      this.data.forEach(function(item) {
        context.add(this.create(item.isFile ? 'Consoloid.FileList.Context.File' : 'Consoloid.FileList.Context.Folder', {
          name: this.path + "/" + item.name,
          container: this.container
        }));
      }.bind(this));
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
          return this.data[a].name.toLowerCase() < this.data[b].name.toLowerCase() ? -1 : +1;
        }.bind(this));
    },

    setPath: function(path)
    {
      this.path = path;
      return this;
    },

    hasFile: function(file)
    {
      return this.data.some(function(item) {
        return (item.name == file) && item.isFile;
      });
    },

    hasFolder: function(folder)
    {
      return this.data.some(function(item) {
        return (item.name == folder) && !item.isFile;
      });
    }
  }
);