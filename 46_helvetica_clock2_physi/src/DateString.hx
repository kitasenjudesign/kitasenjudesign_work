package ;

/**
 * ...
 * @author nab
 */
class DateString
{

	public function new() 
	{
		
	}
	
	public static function getString():String {
		
		var date:Date = Date.now();
		
		return _getString( date.getHours() ) + 
		_getString( date.getMinutes() ) +
		_getString( date.getSeconds() );
		
	}
	
	static private function _getString(t:Int):String
	{
		if(t < 10) {
			return "0" + t;
		}
		return Std.string(t);
	}
}