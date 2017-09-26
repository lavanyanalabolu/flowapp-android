window.viewConstructors.SetClientView = Backbone.View.extend({
  __name__: 'window.viewConstructors.SetClientView',
  el: '#nebulousContainer',
  initialize: function () {
    this.render();
  },

  render: function () {
    var currentPage = this;
    $.getPageHtmlAsync('selectClient.html', false, function (tmp) {
      var pageBody = tmp({
        currentPage: currentPage
      });
      this.$el.html(pageBody);
      //this.downloadClients();
      this.displayClients();
    }.bind(this));
    return this;
  },

  events: {
    "tap #btnUpdateClients": "downloadClients2",
    "tap .btnSelectClient": "downloadClientData",
    "tap .btnHome": "home"
  },

  cleanup: function () {
    this.undelegateEvents();
    $(this.el).empty();
  },

  home: function () {
    window.location = '#home';
  },

  displayClients: function () {
    $.getPageHtmlAsync('availableClients.html', false, function (tmp) {
      window.footerView.footer(this, 'availableClients.html', {});
      this.$el.html(tmp());
    }.bind(this));
    return this;
  },
  downloadClients: function () {
    var wsRootAdmin = 'https://admin.icloudfm.net';
    sessionStorage.wsRootAdmin = wsRootAdmin;
    var currentPage = this;
    $.ajax({
      type: "POST",
      async: true,
      timeout: 8000,
      contentType: "application/json; charset=utf-8",
      url: wsRootAdmin + "/jsonPortal.asmx/clientList?" + (new Date()).getTime(),
      data: '{"mobileGUID": "' + localStorage_a.getItem('token') + '"}',
      dataType: "json",
      success: function (msg) {
        localStorage_a.setItem('clients', msg.d.clients);
        currentPage.render();
      },
      error: function (msg) {
        console.log(msg);
        alert('Error retrieving client list');
      }
    });
    return (false);
  },
  downloadClients2: function () {

    var currentPage = this;
    var data = {
      auth: localStorage_a.getItem('token'),
      dsName: 'CIRRUSMODE_availableClients',
      i: 0,
      j: 0,
      k: 0,
      t: '',
      p1: {}
    }
    $.jAdminWorking('Downloading Available Clients', data,
      function (msg) {
        var myData = JSON.parse(msg.d);
        localStorage_a.setItem('clients', myData.data);
        currentPage.render();
      },
      function (msg) {
        console.log(msg);
        window.location = '#home';
      }
    );
    return (false);
  },
  downloadClientData: function (event) {
    $('.btnSelectClient').not($(event.currentTarget)).hide();
    var clientID = $(event.currentTarget).attr('data-clientID');
    var clients = localStorage_a.getItem('clients');
    var client = _.filter(clients, function (c) {
      return (c.clientID == clientID);
    });
    localStorage_a.setItem('client', client[0]);;

    this.downloadQrCodes();
    return (false);

  },
  downloadQrCodes: function () {
    $('#divClientList, #divUpdateClients').hide();
    $('#divLoadingQRList').show();
    console.log('$.parseClient().clientGuid', $.parseClient().clientGuid)
    var currentPage = this;
    $.setClient(
      $.parseClient().clientGuid,
      function(){
        window.location = '#home';
      }
    );
  }

});
