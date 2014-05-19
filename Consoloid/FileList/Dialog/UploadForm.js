defineClass('Consoloid.FileList.Dialog.UploadForm', 'Consoloid.Ui.Form.FormDialog',
  {
    _renderForm: function()
    {
      this.form.setFieldValue("path", this.arguments.folder.value);
      this.__base();
    },
  }
);
