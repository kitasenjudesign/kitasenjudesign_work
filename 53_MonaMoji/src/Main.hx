package;

import js.Browser;
import js.Lib;

/**
 * ...
 * @author nabe
 */

class Main 
{
	
	private static var _mosaic:Mosaic;
	
	static function main() 
	{
		Browser.window.onload = untyped initialize;	
	}
	
	private static function initialize(e):Void
	{
		_mosaic = new Mosaic();
		_mosaic.init();
	}
	
}