//BEGIN copy of const.js
const DM_ROOT = 'http://www.debridmax.com/';
const RS_DM = 'http://www.debridmax.com/rapidshare/';
const MD_DM = 'http://www.debridmax.com/multimax/';
const TIMEOUT_TIME = 30000;
//END copy of const.js

var hostFilter = new Array(
    /(http|https):\/\/(\w+\.)?rapidshare\.com\/(files\/[^\"\r\n< ]+|#!download[^\"\r\n< ]+)/g,
    /http:\/\/(\w+\.)?megaupload\.com\/([a-zA-Z]+\/)?\?[a-zA-Z]=[0-9a-zA-Z]{8}/g,
    /http:\/\/(\w+\.)?megavideo\.com\/([a-zA-Z]+\/)?\?[a-zA-Z]=[0-9a-zA-Z]{8}/g,
    /http:\/\/(\w+\.)?depositfiles\.com\/([a-zA-Z]+\/)?files\/[^\"\r\n< ]+/g,
    /http:\/\/(\w+\.)?hotfile\.com\/dl\/[0-9a-zA-Z]+\/[\/[0-9a-zA-Z]+\//g,
    /http:\/\/(\w+\.)?u(ploaded|l)\.to\/(file\/|\?id=|)[0-9a-zA-Z]{6}/g,  
    /http:\/\/(\w+\.)?uploading\.com\/files\/[a-zA-Z0-9]+\//g,    
    /http:\/\/(\w+\.)?filesonic\.(com|fr|de|it|net|org)\/file\/[^\"\r\n< ]+/g,
    /http:\/\/(\w+\.)?fileserve\.com\/file\/[^\"\r\n< ]+/g,
	/http:\/\/(\w+\.)?videobb.com\/video\/[^\"\r\n< ]+/g,
	/http:\/\/dl\.free\.fr\/[^\"\r\n< ]+/g
	);

//Draw buttons near the code tag
function setButtons(theControl)
{
	if(filterTheLink(theControl.html())>=0)
		theControl.before(
				"<input type='button' class='downloadAll' value='" + chrome.i18n.getMessage("content_download_all") + "' />"+
				"<input type='button' class='downloadSelected' value='" + chrome.i18n.getMessage("content_download") + "' />"
		);
}

//filter link for respective host
function filterTheLink(link) {
    if(!link) return -1;
	var filterIndex = -1;
    for(var i=0;i<hostFilter.length;i++) {
        var res = link.match(hostFilter[i]);
		if(res)
		{
			filterIndex = i;
			break;
		}
	}
	return filterIndex;
}

//set the host (rapidshare/megaupload/hotfile/etc)
function setHost(theString)
{
	return MD_DM;
}

//Draw Download and Download All for tag that contains download links.
$("td.code, pre, blockquote").each(function() {
		setButtons($(this));
});

//"Download Selected" button on page
$('.downloadSelected').click(
	function(){
		var selectedText = window.getSelection().toString();
		if(selectedText == "")
			alert(chrome.i18n.getMessage("content_warning_download_selected"));
		else
		{
			var thelinks = selectedText.split("\n");
			chrome.extension.sendRequest({requestType:"dl", the_links:selectedText, the_host:setHost(thelinks[0])});
		}
});
	
//BEGIN Direct Download Functions
function requestLink(thelink){
	chrome.extension.sendRequest({requestType:"dl", the_links:thelink, the_host:setHost(thelink)});
}

//change the link element's class for certain filehosts into class directlyDownloaded
//It enables users to directly generate the link the users click.
chrome.extension.sendRequest({requestType:"getAutoGenVal"}, function(response){
	if(response.auto_gen_val==1)
	{
		$("a[href]").each(
			function()
			{
				var ori_link = $(this).attr('href');
				if(filterTheLink(ori_link)>=0)
					$(this).attr({class:"directlyDownload"});
			}
		);

		$("a.directlyDownload").click(function(){
			requestLink($(this).attr('href'));
			return false;
		});
	}
});


//END Direct Download Functions

//"Download" button on page
$('.downloadAll').click(
	function(){
		var unparsedlinks = $.trim($(this).next().next().html());//get the text next to the button
		var result = new Array();
		
		for(var i=0;i<hostFilter.length;i++) {
			var res = unparsedlinks.match(hostFilter[i]);
			if(res)
			{
				result = result.concat(res);
				break;
			}
		}
				
		thelinks = $.trim(result.join("\n"));
		chrome.extension.sendRequest({requestType:"dl", the_links:thelinks, the_host:setHost(result[0])});
	
});




