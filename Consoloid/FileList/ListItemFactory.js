defineClass('Consoloid.FileList.ListItemFactory', 'Consoloid.Ui.List.Factory.Collapsing',
  {
    __constructor: function(options)
    {
      this.__base(options);

      this.registrations = this.container.getAllTagged(["file-opener-registration"]);
    },

    render: function(data)
    {
      data.additionalActions = this.__getAdditionalActions(data);

      return this.__base(data);
    },

    __getAdditionalActions: function(data)
    {
      if (!data.isFile) {
        return [];
      }

      var additionalActions = [];

      this.registrations.forEach(function(registration) {
        var extensions = registration.getFileExtensions();
        for (var i = 0; i < extensions.length; i++) {
          if (data.name.indexOf("." + extensions[i]) == data.name.length - extensions[i].length - 1) {
            var expression = this.__cloneArray(registration.getExpression());
            $.each(expression[1], function(key, value) {
              if (value == "!target!") {
                expression[1][key] = data.name;
              }
            });
            additionalActions.push(expression);
            break;
          }
        };
      }.bind(this));

      return additionalActions;
    },

    __cloneArray: function(arr)
    {
      return $.extend(true, [], arr);
    }
  }
);
