// ==UserScript==
// @name         Chun, AITD forum
// @namespace    http://your.homepage/
// @version      1.0
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
    checkNewMessages();
    $(".bodyline").find("table").first().css("display","none");
    $("body").attr("bgcolor","");
    $("body").attr("style","background: none ; background-color: transparent");
    $("body").find("table").first().attr("width","100%");
    $("td.gensmall").append('<br /><a href="http://chun-alone-in-the-dark.xooit.org/privmsg.php?folder=inbox" \
							class="gensmall">Boite de réception</a>');
    $("body#check").css("color","#EBEBEC");
    //setInterval(checkNewMessages, 30000);
}

             
function checkNewMessages(){
    $.ajax({
      type:     "GET",
      url:      "http://chun-alone-in-the-dark.xooit.org/search.php?search_id=egosearch",
      dataType: "html",
      success: function(data){
          localStorage.removeItem('Xooit');
          parsedElements = $(data);
          var nbrNotif = 0;
          parsedElements.find(".bodyline").find(".forumline").find("tr").each(function(){
              if ($(this).find("td").first().find("img").attr("alt") == "Nouveaux messages"){
                  nbrNotif++;
                  if (localStorage.getItem('Xooit') !== null){
                      localStorage.setItem('Xooit',localStorage.getItem('Xooit') + ';' + $(this).find("td").eq(1).find('span').find('a').text() + 'µ' +$(this).find("td").eq(2).find("span").find('a').eq(1).text() + 'µ' + $(this).find("td").eq(6).find('a').eq(1).attr('href'));
                  }
                  else{
                    localStorage.setItem('Xooit',$(this).find("td").eq(1).find('span').find('a').text() + 'µ' +$(this).find("td").eq(2).find("span").find('a').eq(1).text() + 'µ' + $(this).find("td").eq(6).find('a').eq(1).attr('href'));  
                  }
              }
          });
          
          if (localStorage.getItem('Xooit') !== null){
              localStorage.setItem('Xooit',localStorage.getItem('Xooit') + ';' +nbrNotif);
          }
          else{
              localStorage.setItem('Xooit',nbrNotif);  
          }
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
        this._iframe.id = 'iFrameNotif';

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
            this._iframe.src = '';
        }
    }

};
$(document).ready(function(){
    setTimeout(showNotif, 4000);
});

function newNotifClick(event){
    alert($(event).attr('class'));
}

function showNotif(){	
    var remoteStorage = new CrossDomainStorage("http://chun-alone-in-the-dark.xooit.org", "/search.php?search_id=egosearch");

	remoteStorage.requestValue("Xooit", function(key, value){
        var res = value.split(';');
        var treeModify = 0;
        
        $(".tid_sidePanel").bind("DOMSubtreeModified", function() {
            if ($('.tid_events').find('.tid_eventList').length > 0){
                var addXooit = '<div id = "xooitNotifMess">';
                for (var i = 0; i < res.length-1; i++){
                    var split = res[i].split('µ');
                    addXooit = addXooit + '<a class="tid_eventItem tid_read_false" target="_blank" href="http://chun-alone-in-the-dark.xooit.org/' + split[2] + '">'
            + '<div class="tid_icon"><img width="32px" src="http://imgup.motion-twin.com/twinoid/e/6/10e87e1a_124312.jpg"></div>'
                    + '<div style="display:inline-flex;margin-top: 4px; font-weight: 900">' + split[0] + '</div><div class="tid_eventContent">'
			+ '<div class="tid_title">'
			+ '<div class="tid_title">"'+ split[1] +'"</div>'
			+ '<div class="tid_site"> Chun, Alone in the dark <img src="http://mush.vg/favicon.ico" alt="[?]" class="tid_favicon"> </div>'
			+ '</div>'
		    + '</div>'
			+ '</a>';  
                }
                if ($('.tid_events').find('.tid_eventList').find('#xooitNotifMess').length){}
                else{
                    addXooit = addXooit + '</div>';
                	$(this).find('.tid_events').find('.tid_eventList').prepend(addXooit);
                }
            }
        });        
        
        if (res[res.length-1] != 0){
            $(".tid_topBar").find('.tid_userNotif').css("display","inherit");
            var nbrNotifXooit = parseInt($(".tid_topBar").find(".tid_userNotif").find(".tid_counter").text()) + parseInt(res[res.length-1]);
            $(".tid_topBar").find(".tid_userNotif").find(".tid_counter").text(nbrNotifXooit);
        }
         
	});
    
    
    $("#iframeNotif").remove();
};
//http://chun-alone-in-the-dark.xooit.org/' + split[2] + '

/*
  
 */


