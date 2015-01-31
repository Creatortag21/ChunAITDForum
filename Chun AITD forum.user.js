// ==UserScript==
// @name         Chun, AITD forum
// @namespace    http://your.homepage/
// @version      0.00008
// @description  Such a useful description aiiight mah nigga
// @author       Infection
// @include      http://mush.vg/*
// @grant        XMlHttpRequest
// @include		 http://chun-alone-in-the-dark.xooit.org/*
// @require http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// ==/UserScript==



function makeIco(){
    $("#maincontainer").append('<div id="notifXooit"><img id="icoCXooit" src="http://imgup.motion-twin.com/twinoid/e/6/10e87e1a_124312.jpg" style="position: fixed;bottom:0; right: 0"></div>');
    	$(document).on("click", "#icoCXooit", function(e) {
		$("#maincontainer").find('.tid_module').slideToggle("slow");
		$("iframe").slideToggle("slow");
	});

	$('#icoCXooit').hover(function() {
    	$(this).css('cursor','pointer');
	});
}

function createIframe(){
  var i = document.createElement("iframe");
  i.src = "http://chun-alone-in-the-dark.xooit.org/index.php";
  i.scrolling = "auto";
  i.id = "chunXooit"
  i.width = "100%";
  i.style.minHeight = "1350px";
  i.style.display = "none";
  var a = document.createAttribute("frameborder");
  a.value = "0";
  i.setAttributeNode(a);
  document.getElementById("mush_content").appendChild(i);
};


if ((window.top === window.self) && (window.location.href.indexOf("118711") > -1)) {
	// Check for browser support of event handling capability
    
	if (window.addEventListener)
		window.addEventListener("load", createIframe, false);
	else if (window.attachEvent)
		window.attachEvent("onload", createIframe);
	else window.onload = createIframe;
    
	$("#chunXooit").attr("frameborder","0");
	makeIco();
}
else {
    //iframe...	
    if ((window.location.href.indexOf("xooit") > -1) && !(window.top === window.self)){
        
    if (window.addEventListener)
        window.addEventListener("load", hideUselessStuff, false);
	else if (window.attachEvent)
        window.attachEvent("onload", hideUselessStuff);
    else window.onload = hideUselessStuff;
    }
    
    (function(){

    //allowed domains
    var whitelist = ["mush.vg", "chun-alone-in-the-dark.xooit.org"];

    function verifyOrigin(origin){
        var domain = origin.replace(/^https?:\/\/|:\d{1,4}$/g, "").toLowerCase(),
            i = 0,
            len = whitelist.length;

        while(i < len){
            if (whitelist[i] == domain){
                return true;
            }
            i++;
        }

        return false;
    }

    function handleRequest(event){
        if (verifyOrigin(event.origin)){
            var data = JSON.parse(event.data),
                value = localStorage.getItem(data.key);
            event.source.postMessage(JSON.stringify({id: data.id, key:data.key, value: value}), event.origin);
        }
    }

    if(window.addEventListener){
        window.addEventListener("message", handleRequest, false);
    } else if (window.attachEvent){
        window.attachEvent("onmessage", handleRequest);
    }
	})();

}

function hideUselessStuff(){
    $(".bodyline").find("table").first().css("display","none");
    $("body").attr("bgcolor","");
    $("body").attr("style","background: none ; background-color: transparent");
    $("body").find("table").first().attr("width","100%");
    $("td.gensmall").append('<br /><a href="http://chun-alone-in-the-dark.xooit.org/privmsg.php?folder=inbox" \
							class="gensmall">Boite de réception</a>');
    $("body#check").css("color","#EBEBEC");
    checkNewMessages();
}

             
function checkNewMessages(){
    $.ajax({
      type:     "GET",
      url:      "http://chun-alone-in-the-dark.xooit.org/search.php?search_id=egosearch",
      dataType: "html",
      success: function(data){
          parsedElements = $(data);
          var nbrNotif = 0;
          parsedElements.find(".bodyline").find(".forumline").find("tr").each(function(){
              if ($(this).find("td").first().find("img").attr("alt") == "Nouveaux messages"){
                  localStorage.setItem('1',$(this).find("td").eq(1).find("a").text());
              }
          });
      }
    });
}


$(window).on('hashchange', function(e){
    if (window.location.href.indexOf("118711") > -1){
        if ($("#notifXooit").length == 0){
        makeIco();
        createIframe();
        }
    }
});

function CrossDomainStorage(origin, path){
    this.origin = origin;
    this.path = path;
    this._iframe = null;
    this._iframeReady = false;
    this._queue = [];
    this._requests = {};
    this._id = 0;
}

CrossDomainStorage.prototype = {

    //restore constructor
    constructor: CrossDomainStorage,

    //public interface methods

    init: function(){

        var that = this;

        if (!this._iframe){
            if (window.postMessage && window.JSON && window.localStorage){
                this._iframe = document.createElement("iframe");
                this._iframe.style.cssText = "position:absolute;width:1px;height:1px;left:-9999px;";
                document.body.appendChild(this._iframe);

                if (window.addEventListener){
                    this._iframe.addEventListener("load", function(){ that._iframeLoaded(); }, false);
                    window.addEventListener("message", function(event){ that._handleMessage(event); }, false);
                } else if (this._iframe.attachEvent){
                    this._iframe.attachEvent("onload", function(){ that._iframeLoaded(); }, false);
                    window.attachEvent("onmessage", function(event){ that._handleMessage(event); });
                }
            } else {
                throw new Error("Unsupported browser.");
            }
        }

        this._iframe.src = this.origin + this.path;

    },

    requestValue: function(key, callback){
        var request = {
                key: key,
                id: ++this._id
            },
            data = {
                request: request,
                callback: callback
            };

        if (this._iframeReady){
            this._sendRequest(data);
        } else {
            this._queue.push(data);
        }   

        if (!this._iframe){
            this.init();
        }
    },

    //private methods

    _sendRequest: function(data){
        this._requests[data.request.id] = data;
        this._iframe.contentWindow.postMessage(JSON.stringify(data.request), this.origin);
    },

    _iframeLoaded: function(){
        this._iframeReady = true;

        if (this._queue.length){
            for (var i=0, len=this._queue.length; i < len; i++){
                this._sendRequest(this._queue[i]);
            }
            this._queue = [];
        }
    },

    _handleMessage: function(event){
        if (event.origin == this.origin){
            var data = JSON.parse(event.data);
            this._requests[data.id].callback(data.key, data.value);
            delete this._requests[data.id];
        }
    }

};

var remoteStorage = new CrossDomainStorage("http://chun-alone-in-the-dark.xooit.org", "/search.php?search_id=egosearch");

remoteStorage.requestValue("1", function(key, value){
    alert("The value for '" + key + "' is '" + value + "'");
});
