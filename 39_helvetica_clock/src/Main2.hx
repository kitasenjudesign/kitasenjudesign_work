package ;

import createjs.easeljs.Bitmap;
import createjs.easeljs.MovieClip;
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
		for (i in 0 ... 100) {
			
			var dot:Dot = new Dot();
			dot.init();
			dots.push(dot);
			stage.addChild(dot);
			
		}
		
		Ticker.setFPS(60);
		Ticker.addEventListener("tick", _update);
		
		stage.update();
		
		if (Touch.isSupported()) {
			Touch.enable(stage);
		}
		
		//var instaReq:InstaRequest = new InstaRequest();
		//instaReq.request();
		
		var mc:MovieClip = untyped __js__("new lib.dots()");
		stage.addChild(mc);
		
		
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
		//trace("update");
		for ( dot in dots) {

			dot.update(stage.mouseX, stage.mouseY);
			
		}
		
		stage.update();
	}
	
	
}