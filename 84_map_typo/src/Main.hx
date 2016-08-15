package ;

import createjs.easeljs.Bitmap;
import createjs.easeljs.Matrix2D;
import createjs.easeljs.Shape;
import createjs.easeljs.Stage;
import createjs.easeljs.Ticker;
import data.MapData;
import data.MapDataList;
import haxe.Timer;
import js.html.ImageElement;
import js.JQuery;
import net.badimon.five3D.typography.HelveticaMedium;
import net.badimon.five3D.typography.Typography3D;

import js.Browser;
import js.html.CanvasElement;
import js.html.CanvasRenderingContext2D;
import js.Lib;

/**
 * ...
 * @author nab
 */

class Main 
{
	
	private static var _canvas1:CanvasElement;
	private static var _canvas2:CanvasElement;

	private static var _stage1:Stage;
	private static var _stage2:Stage;

	private static var _circles:Circles;
	private static var _types:Array<String>;
	private static var _typo:MainDrawer;
	
	private static var _bg:BgDrawer;
	private static var _loader:MapDataList;
	var _data:MapData;
	
	static function main() 
	{
		new Main();
	}
	
	public function new() {
		Browser.window.onload = initialize;	
	}
	
	private function initialize(e):Void
	{
		_loader = new MapDataList();
		_loader.load(_onLoad);
	}
	
	private function _onLoad():Void{
		
		_canvas1 = cast Browser.document.getElementById("canvas1");
		_canvas2 = cast Browser.document.getElementById("canvas2");
		
		
		_stage1 = new Stage(cast _canvas1);
		_stage1.autoClear = false;
		
		_stage2 = new Stage(cast _canvas2);
		_stage2.autoClear = false;
		
		Ticker.setFPS(30);
		Ticker.addEventListener("tick", _update);
		
		//new JQuery( Browser.window ).resize(_onResize);
		Browser.window.onresize = _onResize;
		_onResize(null);

		_stage2.addEventListener("stagemousedown", _onDown);
		_onDown();
	}
	

	
	private function _onDown(e=null):Void 
	{
		trace("_onDown");
		
		new JQuery("#canvas1").hide();
		new JQuery("#canvas2").hide();
		
		
		_stage1.clear();
		_stage2.clear();
		
		_data = _loader.getRandom();
		new JQuery("#title").text("#"+_data.id +" "+_data.title);
		new JQuery("#title").off("click");
		new JQuery("#title").on("click", _goMap);
		
		//trace(_data.image);
		
		if (_typo != null) {
			_stage2.removeChild(_typo);
		}
		_typo = new MainDrawer();
		_typo.init(_data,_onLoadMainDrawer);
		_stage2.addChild(_typo);		
		
	}
	
	/**
	 * _onLoadMainDrawer
	 */
	private function _onLoadMainDrawer():Void
	{
		//bg remove
		if (_bg != null) {
			_stage1.removeChild(_bg);
		}
		
		new JQuery("#canvas1").show();
		new JQuery("#canvas2").show();
		
		
		//_bg = new Bitmap(_data.image);
		_bg = new BgDrawer();
		_bg.init(_typo.getImage());
		_stage1.addChild(_bg);
		
		_stage1.update();
		//_stage1.update();
		_stage2.update();
		

	}
	
	function _goMap(e) 
	{
		Browser.window.location.href = _data.map;
	}
	
	function _onResize(e):Void 
	{
		
		_canvas1.width 		= Browser.window.innerWidth;
		_canvas1.height 	= Browser.window.innerHeight;
		
		_canvas2.width 		= Browser.window.innerWidth;
		_canvas2.height 	= Browser.window.innerHeight;
		
		_stage1.clear();
		
	}
	
	static private function _update(e):Void 
	{
		if(_typo!=null){
			_typo.update();
		}
		if (_bg != null) {
			_bg.update();
		}
		
		_stage1.update();
		_stage2.update();
		
	}
	
}