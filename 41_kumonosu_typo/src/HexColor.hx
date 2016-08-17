package ;

/**
 * ...
 * @author nab
 */
class HexColor
{

	public function new() 
	{
		
	}

	public static function getColor(color:Float):String {
		
		var colStr:String = untyped __js__("color.toString(16)");
		
		return "#"+_addZero(colStr, 6);
	}
	
	
	
	private static function _addZero(colStr:String,keta:Int):String
	{
		var out:String = colStr;
		
		while (out.length < keta) {
			
			out = "0" + out;

		}
		
		return out;
	}

	
}