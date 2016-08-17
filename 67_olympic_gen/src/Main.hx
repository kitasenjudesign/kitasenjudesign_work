package;

import jp.nabe.utils.PCChecker;
import js.Browser;
import js.JQuery;
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
		
		
		if (!PCChecker.isPC()) {
			new JQuery("#container").css( {
				transform: "scale(1,1)",
				"-webkit-transform":"scale(1,1)",
				"-moz-transform":"scale(1,1)" 
	
			});
		}
		
		Browser.window.onresize = untyped _onResize;
		_onResize();		

	}
	
	static private function _onResize() 
	{
		var scale:Float = PCChecker.isPC() ? 0.7 : 1;
		new JQuery("#container").css( {
			top:"0px",
			left:(Browser.window.innerWidth/2 - (1024*scale)*0.5 )+"px"			
		});
		
		var hh:Float = new JQuery("#first").height();
		new JQuery("#first").css( {
			top: ((1024-hh)/2) +"px",
			//left:(Browser.window.innerWidth/2 - (1024*0.7)*0.5 )+"px"			
		});
		
	}
	
	
}