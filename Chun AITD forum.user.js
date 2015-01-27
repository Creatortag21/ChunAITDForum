// ==UserScript==
// @name         Chun, AITD forum
// @namespace    http://your.homepage/
<<<<<<< HEAD
// @version      0.00006
=======
// @version      0.00005
>>>>>>> origin/master
// @description  Such a useful description aiiight mah nigga
// @author       Infection
// @include      http://mush.vg/*
// @grant        XMlHttpRequest
// @include		 http://chun-alone-in-the-dark.xooit.org/*
// @require http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// ==/UserScript==

var notifXooit = [];

function makeIco(){
    $("#notifXooit").remove();
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

}

function hideUselessStuff(){
    $(".bodyline").find("table").first().css("display","none");
    $("body").attr("bgcolor","");
    $("body").attr("style","background: none ; background-color: transparent");
    $("body").find("table").first().attr("width","100%");
    $("td.gensmall").append('<br /><a href="http://chun-alone-in-the-dark.xooit.org/privmsg.php?folder=inbox" \
							class="gensmall">Boite de réception</a>');
    $("body#check").css("color","#EBEBEC");
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
                  nbrNotif++;
                  notifXooit[nbrNotif] = $(this).find("td").eq(1).find("a").text();
              }
          });
      }
    });
}


$(window).on('hashchange', function(e){
    if(window.location.href.indexOf("118711") > -1){
        makeIco();
        createIframe();
    }
});

