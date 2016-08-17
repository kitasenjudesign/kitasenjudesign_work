package ;

import createjs.easeljs.Bitmap;
import createjs.easeljs.MovieClip;
import createjs.easeljs.Rectangle;
import createjs.easeljs.Shape;
import createjs.easeljs.Sprite;
import createjs.easeljs.Stage;
import createjs.easeljs.Text;
import createjs.easeljs.Ticker;
import createjs.easeljs.Touch;
import haxe.Http;
import js.html.CanvasElement;
import js.html.ImageElement;
import js.JQuery;
//import flash.events.Event;
import js.Browser;
import js.Lib;

/**
 * ...
 * @author watanabe
 */

class Main 
{
	
    private var stage	:Stage;
	private var dots	:Array<Dot>;
	private var _shape:Shape;
	private var mc:MovieClip;
	
	static function main() 
	{
		new Main();
	}
	
	public function new() {
		
		Browser.window.onload = initialize;
		
	}
	
	private function initialize(e):Void
	{
		
		
		dots = new Array();
		stage = new Stage(cast js.Browser.document.getElementById("canvas"));
		
		Ticker.setFPS(60);
		Ticker.addEventListener("tick", _update);
		
		stage.update();
		
		if (Touch.isSupported()) {
			Touch.enable(stage);
		}
		
		//var instaReq:InstaRequest = new InstaRequest();
		//instaReq.request();
		
		mc = untyped __js__("new lib.dots()");
		stage.addChild(mc);
		
		_shape = new Shape();
		stage.addChild(_shape);
		//_shape.visible = false;
		mc.visible = false;
		
		new JQuery( Browser.window ).resize(_onResize);
		_onResize(null);
	}
	
	function _onResize(object) 
	{
		var element:Dynamic = js.Browser.document.getElementById("canvas");
		element.width = new JQuery(Browser.window).width();
		element.height = new JQuery(Browser.window).height();
	}
	
	private function _update():Void 
	{
		if (Math.random() < 0.01) {
			_shape.graphics.clear();
			//mc.gotoAndStop( Math.floor( Math.random() * 3 ) );
		}

		var rect:Rectangle = mc.getBounds();
		trace(rect);
		
		
		for (i in 0 ... 100) {
			var xx:Float = 1000 * Math.random(); 
			var yy:Float = 1000 * Math.random();
			
			if ( mc.hitTest( xx,yy ) ) {
				_shape.graphics.beginFill( HexColor.getColor( Math.floor( 0xffffff * Math.random() ) ) );
				_shape.graphics.drawCircle(xx, yy, 5 + 20 * Math.random());
				break;
			}
			
		}
		stage.update();
		
	}
	
	
}