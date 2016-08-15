package data;
import haxe.Http;
import haxe.Json;

/**
 * ...
 * @author nabe
 */
class MapDataList
{

	
	private var _http:Http;
	private var _list:Array<MapData>;
	private var _callback:Void->Void;
	
	public function new() 
	{
		
	}
	
	/**
	 * 
	 */
	public function load(callback:Void->Void):Void {
	
		_list = [];
		_callback = callback;
		_http = new Http("earthview.json");
		_http.onData = _onLoad;
		_http.request();
		
	}
	
	private function _onLoad(str:String):Void {

		var list:Array<Dynamic> = cast Json.parse(str);
		
		for (i in 0...list.length) {
			
			var data:MapData = new MapData( list[i] );
			_list.push(data);
			
		}
		
		if (_callback != null) {
			_callback();
		}
	}
	
	public function getRandom():MapData {
	
		return _list[Math.floor(Math.random() * _list.length)];
		
	}
	
}