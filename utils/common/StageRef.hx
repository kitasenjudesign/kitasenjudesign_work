package common;
import js.Browser;

/**
 * ...
 * @author watanabe
 */
class StageRef
{

	public static var stageWidth(get, null)		:Int;
	public static var stageHeight(get, null)	:Int;
	
	public function new() 
	{
		//
	}
	
	static public function get_stageWidth():Int
	{
		return Browser.window.innerWidth;
	}
	static public function get_stageHeight():Int
	{
		return Math.floor( Browser.window.innerWidth * 576 / 1920 );
	}		
	
	
}