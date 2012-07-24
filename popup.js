	//<![CDATA[
	var myWindow;
	//Get backgroundpage
	bg = chrome.extension.getBackgroundPage();

	function openSubWindow() {
		bg.openNewWindow("submissionWindow.html");
	}
	
	//Open login page in new tab
	function openLoginForm(host) {
		$.get(DM_ROOT + "index.php?lang=en",function(){
			chrome.tabs.create({url:host});
		});
	}

	//Set login, credit, and server load html;
	function setDetails(isLoggedIn) {
	
	if(isLoggedIn)
	{
		$("#user").text("Welcome, " + bg.login_details.user);
		$("#type").text("Account Type: " + bg.login_details.type);
		$("#point").text("Reward Point(s): " + bg.login_details.point.replace(/&nbsp;/g,''));
		if(bg.login_details.premium != '')
				$("#premium").text("Premium: " + bg.login_details.premium);
		$(".login_details").show();
	}
	else
		$("#dm_details").html(bg.login_details.user);
	}

	$(document).ready(function(){
	   
		//Initiate refresh button for login/server details
		var notloggedin_text = chrome.i18n.getMessage("background_notloggedin") + '(<a href=javascript:openLoginForm("' + DM_ROOT + "login.php" + '")>'+chrome.i18n.getMessage("background_login_link")+'</a>).';
		$("img#loader").attr('src', chrome.extension.getURL('/load.gif'));
		
		bg.init(function(isLoggedIn){
			$(".login_details").hide();
			if(isLoggedIn)
				$("#subWindow").show();
			else
				$("#subWindow").hide();
			
			//Write login, credit, and server load;
			setDetails(isLoggedIn);
			
			//Add root server url prior to the img src 
			$("img").each(function(){
				$(this).attr({src:DM_ROOT + $(this).attr('src')});
			});
			
			$("#subWindow").text(chrome.i18n.getMessage("popup_downloader_text"));
			$(".loader").hide();
		});
		
		$("#subWindow").click(function(){
			openSubWindow();
		});
	});
	//]]>