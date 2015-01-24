// ==UserScript==
// @name         Chun, AITD forum
// @namespace    http://your.homepage/
// @version      0.00001AlphaOmegaDeltaTetaZetaMeta
// @description  Such a useful description aiiight mah nigga
// @author       Infection
// @include      http://mush.vg/g/chun-alone-in-the-dark/forum/*
// @include		 http://chun-alone-in-the-dark.xooit.org/*
// @require http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// ==/UserScript==


function createIframe(){
  var i = document.createElement("iframe");
  i.src = "http://chun-alone-in-the-dark.xooit.org/index.php";
  i.scrolling = "auto";
  i.id = "chunXooit"
  i.width = "100%";
  i.style.minHeight = "900px";
  i.style.display = "none";
  var a = document.createAttribute("frameborder");
  a.value = "0";
  i.setAttributeNode(a);
  document.getElementById("mush_content").appendChild(i);
};
	
// Check for browser support of event handling capability
if (window.addEventListener)
window.addEventListener("load", createIframe, false);
else if (window.attachEvent)
window.attachEvent("onload", createIframe);
else window.onload = createIframe;

$("#chunXooit").attr("frameborder","0");

if (window.top === window.self) {
    // main site...
}
else {
    //iframe...

}

$("#maincontainer").append('<img id="icoCXooit" src="http://imgup.motion-twin.com/twinoid/e/6/10e87e1a_124312.jpg" style="position: fixed;bottom:0; right: 0">');

$(document).on("click", "#icoCXooit", function(e) {
	$("#maincontainer").find('.tid_module').slideToggle("slow");
	$("iframe").slideToggle("slow");
});

$('#icoCXooit').hover(function() {
    $(this).css('cursor','pointer');
});




