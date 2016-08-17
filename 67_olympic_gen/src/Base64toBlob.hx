package;
import jp.nabe.utils.PCChecker;
import js.Browser;
import js.html.Blob;
import js.html.Uint8Array;

/**
 * ...
 * @author nabe
 */
class Base64toBlob
{

	public function new() 
	{
		
	}

	public static function getBlob(_base64:String):Blob {
	
		var tmp = _base64.split(',');
		var data = Browser.window.atob(tmp[1]);
		var mime = tmp[0].split(':')[1].split(';')[0];

		//var buff = new ArrayBuffer(data.length);
		//var arr = new Uint8Array(buff);
		var arr = new Uint8Array(data.length);
		for (i in 0...data.length)
			{arr[i] = data.charCodeAt(i);}
		var blob = new Blob([arr], { type: mime });
		return blob;

	}
	
	public static function saveBlob(_blob:Blob,_file:String):Void
	{
		if( PCChecker.isIE() )
		{	// IEの場合
			var nav = untyped Browser.window.navigator;
			nav.msSaveBlob(_blob, _file);
		}
		else    
		{
			
			var win = untyped Browser.window;
			var url:Dynamic = win.URL || win.webkitURL;
			var data = url.createObjectURL(_blob);
			var e:Dynamic = Browser.document.createEvent("MouseEvents");
			e.initMouseEvent("click", true, false, Browser.window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
			var a:Dynamic = Browser.document.createElementNS("http://www.w3.org/1999/xhtml", "a");
			a.href = data;
			a.download = _file;   
			a.dispatchEvent(e);
			
		}
	}	
}