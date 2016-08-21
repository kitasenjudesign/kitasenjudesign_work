package ;
import haxe.Http;
import haxe.Json;

/**
 * ...
 * @author nab
 */
class InstaRequest
{

	public function new() 
	{
		
	}

	public function request():Void {
		
		//trace("request");
		//var r:Http = new haxe.Http("https://api.instagram.com/v1/media/popular?client_id=6c9575c5cf4c4555921a757fd1261d22");
		
		var r:Http = new haxe.Http("./hoge.json");
		r.onError = js.Lib.alert;
		r.onData = _onData; 
		r.request(false);
		
	}
	
	function _onData(data):Void
	{
		var o = Json.parse(data);
		trace(o);
	}
	
}