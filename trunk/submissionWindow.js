//<![CDATA[
			
	//Open login page in new tab
	function goToDebridMax(){
		chrome.tabs.create({url:DM_ROOT + '?lang=' + chrome.i18n.getMessage("background_countrycode")});
	}
	
	function showCachedLinks(){
		$("#link").val(localStorage["subwin_links"]);
		countLinks();
	}
	
	function countLinks(){
		var str = $.trim($("#link").val());
		var total;
		if(str.length == 0)
			total = 0;
		else
			total = str.split("\n").length;
			
		$("#line_counter").html(chrome.i18n.getMessage("submissionWindow_linkcount") + " " + total + " " + chrome.i18n.getMessage("submissionWindow_link"));
	}
	
	$(document).ready(function(){
	   
		$("#link").keyup(countLinks);
		$("#link").focus(countLinks);
		$("img#loader").attr('src', chrome.extension.getURL('/load.gif'));
		//Draw generate/GO buttons
		$("#generate").click(function(){
			
			localStorage["subwin_links"] = "";
		
			var links = $.trim($("#link").val());
		
			if($("#pass").val() != "")
				links = links + "&" + $("#pass").val();
			else
				links = links + "&" + "";
			
			
			$("img#loader").show();
			chrome.extension.sendRequest({requestType:"dl", the_links:links},function(){
				$("img#loader").hide();
			});	
		});
		
		$("#clearlinks").click(function(){
			$("#link").val("");
			localStorage["subwin_links"] = "";
			countLinks();
		});
		
		showCachedLinks();
		countLinks();
		
		//set the text based on internationalization
		$("#text1").html(chrome.i18n.getMessage("submissionWindows_note"));
		$("#text2").html(chrome.i18n.getMessage("submissionWindows_title"));
		$("#pass_note").html(chrome.i18n.getMessage("submissionWindow_mu_password"));
		$("#logo").html("<a href='#' id='gotodebrid'><img src='logo.png' height='100' /></a>");
		$("a#donatelink").attr('href','#');
		
		$("a#donatelink").click(function(){
			chrome.tabs.create({url:"https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=VPJ5YQHBG7L36"});
		});
		
		$("a#gotodebrid").click(function(){
			goToDebridMax();
		});
	});
	//]]>