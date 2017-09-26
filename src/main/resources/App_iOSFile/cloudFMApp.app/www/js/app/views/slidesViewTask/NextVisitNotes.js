App.SlideConstructors.NextVisitNotesSlide = Backbone.View.extend({
  __name__: 'App.SlideConstructors.NextVisitNotesSlide',
  render: function () {
    var tmp = window.App.viewTaskSlides['viewTaskSlides/NextVisitNotes.html'];
    console.log('renderNevist');
      //$.getPageHtmlAsync('viewTaskSlides/NextVisitNotes.html', false, function(tmp){

    var params = {
      headerTmp: $.headerTmp
    };
    var pageBody = tmp(params);

    this.$el.html(pageBody);

    this.$('.nextVisitNote').val(localStorage_a.getItem('nextVisitNote'))

    //}.bind(this));

  },
  events: {
    'tap .saveNote': 'saveNote'
  },
  renderFooter: function () {
    window.footerView.footer(this, 'NextVisitNotes.html', {});
  },
  saveNote: function () {
    var note = this.$('.nextVisitNote').val()
    localStorage_a.setItem('nextVisitNote', note)
    $.jSuccess('Note Saved')
  }
});
