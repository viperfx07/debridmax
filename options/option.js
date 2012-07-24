	
	  // When the document loads do everything inside here ...
	  $(document).ready(function(){
		
		//BEGIN Tabs functions
		// When a link is clicked
		$("a.tab").click(function () {
						
			// switch all tabs off
			$(".active").removeClass("active");
			
			// switch this tab on
			$(this).addClass("active");
			
			// slide all content up
			$(".content").slideUp();
			
			// slide this content up
			var content_show = $(this).attr("title");
			$("#"+content_show).slideDown();
		  
		});
		
		//END Tabs functions
				
		//--begin set auto generate
		if(localStorage["auto-generate-click"]==1)
			$('input#auto_generate').attr('checked',true);
		else
			$('input#auto_generate').attr('checked',false);
		
		$("input#auto_generate").change(function(){
			if(localStorage["auto-generate-click"]==1)
				localStorage["auto-generate-click"]=0;
			else
				localStorage["auto-generate-click"]=1;
					
		});
		//--end set auto generate
		
		$.getJSON('../manifest.json', function(json) {
			$("#version").html(json.version);
			});
			
				
		$("div#content_1 p").html(chrome.i18n.getMessage("option_autologin_premiumnote"));
		$("div#auto_generate p").html(document.write(chrome.i18n.getMessage("option_autogenerate_text") + ": "));	
		
	  });
	  
		