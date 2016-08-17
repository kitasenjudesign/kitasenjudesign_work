package ;

import js.Browser;
import js.Lib;
import physijs.Physijs;

/**
 * ...
 * @author nab
 */

class Main 
{
	
	static function main() 
	{
		Physijs.scripts.worker = "js/physijs_worker.js";
		Physijs.scripts.ammo = "ammo.js";

		//untyped __js__("Physijs.scripts.worker = 'js/physijs_worker.js';");
		//untyped __js__("Physijs.scripts.ammo = 'ammo.js';");
		
		Browser.window.onload = _onLoad;
	}
	
	static private function _onLoad(e):Void
	{
		trace("_onLoad");
		var test:CanvasTest3d = new CanvasTest3d();
		test.init();
		//var object:Object3D;
	}
	
}