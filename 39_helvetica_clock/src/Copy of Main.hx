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
	
	private var _dots:Dots;
	private var stage:Stage;
	//private var _b:Bitmap;
	static function main() 
	{
		new Main();
	}
	
	public function new() {
		
		Browser.window.onload = initialize;
		
	}
	
	private function initialize(e):Void
	{
		
		
		stage = new Stage(cast js.Browser.document.getElementById("canvas"));
		
		var img:ImageElement = Browser.document.createImageElement();
		//img.src = "hoge.jpg";
		//_b = new Bitmap(img);
		//stage.addChild(_b);
		Ticker.setFPS(60);
		Ticker.addEventListener("tick", _update);
		
		stage.update();
		
		if (Touch.isSupported()) {
			Touch.enable(stage);
		}
		
		//var instaReq:InstaRequest = new InstaRequest();
		//instaReq.request();
		
		_dots = new Dots();
		_dots.init(	new JQuery(Browser.window).width(), new JQuery(Browser.window).height());

		stage.addChild( _dots );
		
		new JQuery( Browser.window ).resize(_onResize);
		_onResize(null);
	}
	
	function _onResize(object) 
	{
		var element:Dynamic = js.Browser.document.getElementById("canvas");
		element.width = new JQuery(Browser.window).width();
		element.height =new JQuery(Browser.window).height();
		//_b.scaleX = element.width/1920;
		//_b.scaleY = _b.scaleX;
		//_b.cache(0, 0, element.width / 1920, element.height / 1300);

		
		_dots.resize(new JQuery(Browser.window).width(), new JQuery(Browser.window).height());
	}
	
	private function _update():Void 
	{
		
		_dots.update();
		stage.update();
		
	}
	
	
}