package common;
import js.Browser;

/**
 * ...
 * @author watanabe
 */
class WSocket
{

	private var _socket:Dynamic;
	
	public function new() 
	{
		
	}
	
	/**
	 * hash ga aruka naika de handan
	 */
	public function init():Void {
		
		var win:Dynamic = Browser.window;
		if(win.io != null){
		
			_socket = untyped __js__("io.connect()");
			_socket.on("server_to_client", _onRecieve);
		
		}else {
			
			
			
		}
	}
	
	
	public function send(msg:String):Void {
		//Tracer.log("msg " + msg);
		if (_socket != null) {
			_socket.emit("client_to_server", { value : msg } );
		}
		//socket.broadcast.emit
		//_socket.broadcast.emit("client_to_server", { value : msg } );
	}
	
	
	private function _onRecieve(data:Dynamic):Void {
		
		//Browser.window.alert( data.value );
		
	}
	
}