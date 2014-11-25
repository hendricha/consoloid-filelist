defineClass('Consoloid.FileList.OpenerRegistration', 'Consoloid.Base.Object',
  {
    __constructor: function(options)
    {
      this.__base($.extend({
        fileExtensions: [],
        expression: []
      }, options));
    },

    getFileExtensions: function()
    {
      return this.fileExtensions;
    },

    getExpression: function()
    {
      return this.expression;
    }
  }
);
