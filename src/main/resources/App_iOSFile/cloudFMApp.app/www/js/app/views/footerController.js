window.viewConstructors.footerController = Backbone.View.extend({ __name__:'window.viewConstructors.footerController',
  el: '.divFooter',
  initialize: function (opts) {
    _.bindAll(this, 'enable');
    this.emptyFooterClone = this.$el.clone(false);
    this.templates = opts.t;
  },
  wait: false,
  enable: function () {
    this.el.style.pointerEvents = 'auto';
  },
  disable: function () {
    this.el.style.pointerEvents = 'none';
  },
  render: function (id, params) {
    var tmp = this.templates[id];
    var compiled = tmp(params);
    this.footerElement = this.el.firstElementChild;
    this.el.style.pointerEvents = 'none';
    this.footerElement.style.transform =
      this.footerElement.style.webkitTransform = 'translate3d(0,0,0)';

    this.footerElement.innerHTML = compiled;
    setTimeout(this.enable, 400);
    this.wait = false;
  },
  hideFooter: function () {
    this.footerElement.style.transform =
      this.footerElement.style.webkitTransform = 'translate3d(0,200px, 0)';
  },
  footer: function (parent, id, params) {
    this.publisher = parent;
    this.events = parent.events;
    var clone = this.emptyFooterClone.clone(false);
    this.$el.replaceWith(clone);
    this.remove();
    this.naughtySetElement(clone).render(id, params);
  }
});
