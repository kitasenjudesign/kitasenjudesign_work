package;
import js.Browser;
import js.html.Element;
import js.html.rtc.LocalMediaStream;
import js.html.rtc.NavigatorUserMediaSuccessCallback;
import js.html.VideoElement;
import js.JQuery;

/**
 * ...
 * @author nabe
 */
class Webcam
{
	
	private var _callback:Void->Void;
	public var video:VideoElement;

	public function new() 
	{
		
	}

	public function init(callback:Void->Void):Void {
		
		_callback = callback;
		video = cast Browser.document.getElementById("vi");	
		video.style.display = "none";
		var nav:Dynamic = Browser.navigator;
		
		new JQuery("#info").show();
		
		nav.getMedia = (  nav.getUserMedia ||
                            nav.webkitGetUserMedia ||
                            nav.mozGetUserMedia ||
                            nav.msGetUserMedia );
		
		
		nav.getMedia( { video:true, audio:false }, _onHoge,_onErr);
		
	}
	
	function _onErr(err) 
	{
		Browser.window.alert("ウェブカムが検出できませんでした。");
	}
	
	function _onHoge(stream:LocalMediaStream):Bool 
	{
		new JQuery("#info").hide();

		var win:Dynamic = Browser.window;
		video.src = win.URL.createObjectURL(stream);
		
		_callback();
		
		return true;
	}
}