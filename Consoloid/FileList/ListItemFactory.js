defineClass('Consoloid.FileList.ListItemFactory', 'Consoloid.Ui.List.Factory.Collapsing',
{
  __constructor: function(options)
  {
    this.__base(options);

    this.registrations = this.container.getAllTagged(["file-opener-registration"]);
  },

  render: function(data)
  {
    data.additionalActions = [];

    this.registrations.forEach(function(registration) {
      var extensions = registration.getFileExtensions();
      for (var i = 0; i < extensions.length; i++) {
        if (data.name.indexOf("." + extensions[i]) == data.name.length - extensions[i].length - 1) {
          data.additionalActions.push(registration.getExpression());
          break;
        }
      };
    });

    return this.__base(data);
  }
}
);
