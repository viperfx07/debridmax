/*
* Source: adapted from http://code.google.com/p/contextsearch/source/browse/trunk/context_search.js?spec=svn11&r=11
* Modified by: viperfx07
*/

const SITENAME =  "Multi Debrid";
const DM_ROOT = 'http://www.multi-debrid.com/';
const MD_DM = 'http://www.multi-debrid.com/downloader/';
const TIMEOUT_TIME = 30000;

var _linkFounds = [];
var selectedText = '';
var buttonIcon = 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAIAAAD9MqGbAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAALCSURBVHjanJPPbltVEMZ/c+5NkUOu7ebaTptEDg2hQUpYlIJoAy+AhFhV0AViS3cgXoANKyqQeAUEAha0YlWp0AJSRQXij1KUNJVQwLHd1HEc994ktmJfz7C4TlSJXT+NdL5zZr5zzmhm5NU/NE4wA0PVUJxihhmmGKJqNjxRzExNjKzv/J2DZDcR1IZKMzdADUEGaqbO1NQwM4YMjMQT55wIiAgiIgLgxIRDk+HWCZIaCM7hEFIMVxEVEFFI41SGvpQoGJiIn95Nv697u6oqowHeiPa6g4OOKW6saEYSt0jzxGRsHMMEH0OTfv7OD+cn82bcXm83irMLe9W5/JPAla3OYD++EHQNwwz4amXVL5Tt5Aznfu3PXVn/5PqfZmZm7319a/ryte24Y2aVZjT50Y3SB1ftEVS2orMffrtwNXKA7sfzpRyHeP+5E2GQAf6qtrxsePF0Cfhptfbu57d+XKmWi9l3XjrVb9acGIOotThdOFK+vTSfknuNSJ4YXTyZA27e3fxGpy9/twq88uxk0m4M3yyHwdr9HeDcTDEMMmv1HeDO/Ycat86UC8Bv9bZ3bDQcHQHWG5Gfybokal2YLQHXVjaA18/Mtna7jbgDXK+3tROdKmW7veT39kHSrL7xwlPA2mbkjeXcYC9emMgByw8iIHPM/+zne4vT4Vp9x8uGU94gDDLNuPvm0+Mfnw1ee352oxl/uVzzj0+4ZD+aK+WAG/U20O0lN//ZCoPMcnXbZceXpvJAuRB8+tbLF5dO3621Ln1xe7M4L96IvPh9c3vj36RR80/M9DYr4jw/nOo/qPgTM/7UM/2Nv3ubFSPtW5Ng3C+UveOTeR85/0v/YY+0zmnF5GhWDAZO1Y5cZoYaJnkfR9ruAAZgw7gjyv9hmJnjceHUHkc2MPwxP/35YW4CkvY26kCxR9I2AwUl6/PfAJO6qxL3+U6nAAAAAElFTkSuQmCC)';

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
	/http:\/\/dl\.free\.fr\/[^\"\r\n< ]+/g,
	/http:\/\/(\w+\.)?uploadstation\.com\/file\/[^\"\r\n< ]+/g,
	/http:\/\/(\w+\.)?duckload\.com\/(download|dl|play)\/[^\/\"\r\n< ]+/g,
	/http:\/\/(\w+\.)?netload\.in\/[^\"\r\n< ]+/g,
	/http:\/\/(\w+\.)?wupload\.com\/file\/[^\"\r\n< ]+/g,
	/http:\/\/(\w+\.)?4shared\.com\/[a-z]+\/[^( |"|>|<|\r\n\|\n|$)]+/g,
	/http:\/\/(\w+\.)?filefactory\.com\/file\/[0-9a-zA-Z]+\//g,
	/http:\/\/(\w+\.)?oron\.com\/[^\"\r\n< ]+/g,
	/http:\/\/(\w+\.)?megashares\.com\/(dl\/[0-9a-zA-Z]+\/[^( |"|>|<|\r\n\|\n|$)]+|[0-9a-zA-Z?\/=]+)/g,   
	/http:\/\/(\w+\.)?transitfiles.com\/dl\/[0-9a-zA-Z]{8}/g,
	/http:\/\/(\w+\.)?bitshare\.com\/(files\/[^( |"|>|<|\r\n\|\n|$)]+|\?f=[^( |"|>|<|\r\n\|\n|$)]+)/g,
	/http:\/\/(\w+\.)?(easy-share|crocko)\.com\/[0-9]{10}\//g,
	/http:\/\/(\w+\.)?uploadbox\.com\/([a-zA-Z]+\/)?files\/[0-9a-z]+[^( |"|>|<|\r\n\|\n|$)]+/g,
	/http:\/\/(www\.)?purevid\.com\/v\/[^( |"|>|<|\r\n\|\n|$)]+/g,
	/http:\/\/(www\.)?(uploadhere|uploadking|jumbofiles)\.com\/[^( |"|>|<|\r\n\|\n|$)]+/g	,
	/http:\/\/(\w+\.)?freakshare\.(net|com)\/files\/[0-9a-zA-Z]+\/[^( |"|>|<|\r\n\|\n|$)]+/g,
	/http:\/\/(www\.)?uptobox\.com\/[^( |"|>|<|\r\n\|\n|$)]+/g,
	/(http):\/\/(([0-9a-zA-Z]+)\.)?1fichier\.com\//g,
	/http:\/\/(\w+\.)?bayfiles\.com\/([a-zA-Z]+\/)?file\/[^\"\r\n< ]+/g,
	/http:\/\/(\w+\.)?extabit\.com\/file\/[0-9a-zA-Z]+/g,
	/(http):\/\/(\w+\.)?filepost\.com\/(files\/[^\"\r\n< ]+|#!download[^\"\r\n< ]+)/g,
	/http:\/\/(\w+\.)?gigasize\.com\/(get)\/[^\/\"\r\n< ]+/g,
	/http:\/\/(\w+\.)?letitbit\.net\/(download)\/[^\/\"\r\n< ]+/g,
	/http:\/\/(\w+\.)?purevid\.com\/(v)\/[^\/\"\r\n< ]+/g,
	/http:\/\/(\w+\.)?(turbobit.net|uploadboost.com|queenshare.com)\/[0-9a-zA-Z]+/g
	);

function checkMultiLink(link) {
    if(!link) return 0;
    var result = new Array();
    var i;
    for(i=0;i<hostFilter.length;i++) {
            var res = link.match(hostFilter[i]);
            if(res)
                result = result.concat(res);
    }
	return (result.length) ? result : 0;
}

var ContextButton = function()
{
	this._button;
	this._isAppended = false;
	this._hova = false;

	this._init = function()
	{
        _linkFounds = "";
		this._button = document.createElement('button');
		with (this._button.style)
		{
			margin = '0px';
			padding = '0px';
			width = '19px';
			height = '19px';
			position = 'absolute';
			cursor = 'pointer';
			border = 'none';
			display = 'none';
			background = buttonIcon + ' no-repeat';
			zIndex = 4294967296;
			opacity = 1;
		}

		this._button.addEventListener('mouseup', function(e) { e.stopPropagation(); }, false);
		this._button.addEventListener('mousedown', function(e) { e.stopPropagation(); }, false);
		this._button.addEventListener('dblclick', function(e) { e.stopPropagation(); }, false);
		this._button.addEventListener('click',
			function(e)
			{
				thelinks = ((_linkFounds.toString()).split(",")).join("\n");
				chrome.extension.sendMessage({'requestType' : 'dl', 'the_links' : thelinks	});
                e.stopPropagation();
			},
			false);
	}

	this._init();

	this.isActive = false;
	this.isFrozen = false;
	this.pos = { x: NaN, y: NaN };

	this.updateButtonStyle = function(topPxs, leftPxs, displayStyle)
	{
		with (this._button.style)
		{
			if (topPxs != NaN) top = topPxs + 'px';
			if (leftPxs != NaN) left = leftPxs + 'px';
			display = displayStyle;
		}
	}

	this.setOpacity = function(opacity)
	{
		this._button.style.opacity = opacity;
	}

	this.open = function(pos)
	{
        _linkFounds = checkMultiLink(viewPartialSourceForSelection());
        if(!_linkFounds)
            return;

		if (!this._isAppended)
		{
			document.body.appendChild(this._button);
			this._isAppended = true;
		}
		this.pos = pos;
		this.updateButtonStyle(this.pos.y, this.pos.x, 'block');
		this.isActive = true;
		this.isFrozen = false;
	}


	this.show = function()
	{
		this.updateButtonStyle(this.pos.y, this.pos.x, 'block');
		this.isActive = true;
		this.isFrozen = false;
	}

	this.hide = function()
	{
		this.updateButtonStyle(NaN, NaN, 'none');
		this.isActive = true;
		this.isFrozen = false;
	}

	this.close = function()
	{
		this._button.style.opacity = 1;
		this.pos = { x: NaN, y: NaN };
		this.updateButtonStyle(NaN, NaN, 'none');
		this.isActive = false;
		this.isFrozen = false;
        this._linkFounds = "";
	}

}

function viewPartialSourceForSelection(){
    var selection = document.getSelection();
	if(selection.rangeCount != 0)
	{
		var range = selection.getRangeAt(0);
		if (range) {
			var div = range.startContainer.ownerDocument.createElement('div');
			div.appendChild(range.cloneContents());
			return(div.innerHTML);
		}
		return selection.toString();
	}
}

var btn = new ContextButton();
var mouseStatus = { pressed: false, pressedEventArgs: {}, pressedAndMoved: false };

document.addEventListener('mouseup',
	function(e)
	{
		if (e.button == 0)
		{
			updateContextButton(e, true);
		}
		mouseStatus.pressed = false;
		mouseStatus.pressedAndMoved = false;
	},
	false);

document.addEventListener('mousedown',
        function(e)
        {
                if (btn.isActive)
                {
                        btn.close();
                }
                mouseStatus.pressed = true;
                mouseStatus.pressedEventArgs = e;
                mouseStatus.pressedAndMoved = false;
        },
        false);

document.addEventListener('dblclick',
	function(e)
	{
		updateContextButton(e, false);
		mouseStatus.pressed = false;
		mouseStatus.pressedAndMoved = false;
	},
	false);

document.addEventListener('mousemove',
	function(e)
	{
		if (btn.isActive && !btn.isFrozen)
		{
			var distance = Math.sqrt(Math.pow(e.pageX - btn.pos.x, 2) + Math.pow(e.pageY - btn.pos.y, 2));
			if (distance < 30)
				btn.setOpacity(1);
			else if (30 < distance && distance < 530)
				btn.setOpacity(-7.0 * distance / 5000 + 1.042);
			else
				btn.setOpacity(0.3);
		}
		if (mouseStatus.pressed && !mouseStatus.pressedAndMoved)
		{
			mouseStatus.pressedAndMoved = true;
		}
	},
	false);

document.addEventListener('keydown',
	function(e)
	{
		if ((e.keyCode == 27 && e.shiftKey == false && e.ctrlKey == false && e.altKey == false) ||
			((window.getSelection().toString()).trim() == ''))
		{
			if (btn.isActive) btn.close();
		}
	},
	false);


function updateContextButton(eventArgs, checkMouseStatus)
{
	var target = eventArgs.target;
	var pressedTarget = mouseStatus.pressedEventArgs.target;
	var selection = window.getSelection();
	selectedText = selection.toString();

	if (target.nodeName != 'TEXTAREA' && target.nodeName != 'INPUT' &&
		pressedTarget.nodeName != 'TEXTAREA' && pressedTarget.nodeName != 'INPUT')
	{
		if (selectedText.trim() != '' && (!checkMouseStatus || mouseStatus.pressedAndMoved))
		{
			var buttonShift;
			if (checkMouseStatus)
			{
				var d = 20;
				var horShift = eventArgs.pageX - mouseStatus.pressedEventArgs.pageX;
				var verShift = eventArgs.pageY - mouseStatus.pressedEventArgs.pageY;
				buttonShift = (verShift > d) ? { x: 5, y: 5 } :
					(verShift < -d || horShift < 0) ? { x: -15, y: -20 } : { x: 5, y: 5 };
			}
			else
			{
				buttonShift = { x: 5, y: 10 };
			}
			btn.open({ x: eventArgs.pageX + buttonShift.x, y: eventArgs.pageY + buttonShift.y });
		}
		else
		{
			btn.close();
		}
	}
}


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

//Draw Download and Download All for tag that contains download links.
$("td.code, pre, blockquote, div.code").each(function() {
		setButtons($(this));
});

//"Download Selected" button on page
$('.downloadSelected').click(
	function(){
		var _linkFounds = checkMultiLink(viewPartialSourceForSelection());
		thelinks = ((_linkFounds.toString()).split(",")).join("\n");
		chrome.extension.sendMessage({'requestType' : 'dl', 'the_links' : thelinks	});
});
	
//BEGIN Direct Download Functions

//change the link element's class for certain filehosts into class directlyDownloaded
//It enables users to directly generate the link the users click.

chrome.extension.sendMessage({requestType:"getAutoGenVal"}, function(response){
	if(response){
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
				chrome.extension.sendMessage({requestType:"dl", the_links: $(this).attr('href')});
				return false;
			});
		}
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
		chrome.extension.sendMessage({requestType:"dl", the_links:thelinks});
	
});

