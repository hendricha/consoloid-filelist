defineClass('Consoloid.FileList.DropzoneController', 'Consoloid.Base.Object',
  {
    register: function(node) {
      var $this = this;
      node.undelegate().delegate(".drop.zone", "click", function() {
        $this.container.get('type_writer').write(
          $("#prompt input").val() + ", to '" + $(this).data("path") + "'",
          true
        );
        $this.hide();
      });
      node.delegate(".dropper a", "click", this.show.bind(this));
    },

    show: function() {
      $(".drop.zone").fadeIn();
    },

    hide: function() {
      $(".drop.zone").fadeOut();
    }
  }
);
