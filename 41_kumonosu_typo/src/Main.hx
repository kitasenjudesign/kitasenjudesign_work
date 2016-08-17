package ;

import createjs.easeljs.Point;
import createjs.easeljs.Rectangle;
import createjs.easeljs.Shape;
import createjs.easeljs.Stage;
import createjs.easeljs.Ticker;
import js.Browser;
import js.html.CanvasElement;
import net.badimon.five3D.typography.HelveticaMedium;
import typo.BePoints;
import typo.Letter;


/**
 * ...
 * @author nab
 */

class Main 
{
	
	private static var _canvas:CanvasElement;
	private static var _stage:Stage;
	private static var _types:Array<String>;
	private var _count:Int = 0;
	private static var shape:Shape;
	private static var letter:Letter;
	private var _index:Int = 0;
	static function main() 
	{
		new Main();
	}
	
	public function new() {
		Browser.window.onload = initialize;	
	}
	
	private function initialize(e):Void
	{
		_canvas = cast Browser.document.getElementById("canvas");
		_canvas.width = 1000;
		_canvas.height = 600;
		//Browser.document.appendChild(_canvas);
		
		_stage = new Stage(cast _canvas);
		_stage.autoClear = false;
		
		Ticker.setFPS(60);
		Ticker.addEventListener("tick", _update);
		
		_initMoji();
		
		Browser.window.onresize = _onResize;
		_onResize(null);
		
		_stage.update();
		_stage.addEventListener("stagemousedown", _onDown);
	}
	
	private function _initMoji():Void
	{
		var list:Array<String> = [
			"The quick_brown fox_jumps over_the lazy dog",
			"Kitasenju_Design is a_Adachi based_design unit"
		];
		
		
		//var s:String = "KitasenjuDesign_is a design unit.";
		//var s:String = "イロハニホヘト_ちりぬるを_わかよたれそ_つねらなむ";// "いろはにほへと_ちりぬるをわか_";
		var s:String = list[_index % list.length];
		_index++;
		//var s:String = "I am_Adachikumin";
		var allPoints:Array<Point> = [];
		var font:HelveticaMedium = new HelveticaMedium();
		//var font:AOTFProM = new AOTFProM();
		//var font:HGP = new HGP();
		var xx:Float = 60;
		var yy:Float  = -20;
		
		for(i in 0...s.length){
			
			if (s.substr(i, 1) == " ") {
				xx += 40;
			}else if (s.substr(i, 1) == "_") {
				xx = 60;
				yy += 180;
			}else{
				
				var bpoints:BePoints = new BePoints();
				var pp:Array<Array<Point>> = bpoints.getLetterPoints(s.substr(i,1), false, 2, font, true);
				var ww:Float = font.widths.get(s.substr(i, 1)) * 2;
				
				for (j in 0...pp.length) {
					for (k in 0...pp[j].length) {
						pp[j][k].x += xx;
						pp[j][k].y += yy;
					}
					allPoints=allPoints.concat(pp[j]);
				}
				
				xx += ww;
			}
		}

		if(letter==null){
			letter = new Letter();
			_stage.addChild(letter);
			//letter.rotation = 90;
			//letter.x = Browser.window.innerWidth;
		}
		
		//reposition
		var rect:Rectangle = _getRect(allPoints);
		letter.x = Browser.window.innerWidth / 2 - rect.x - rect.width / 2;
		letter.y = Browser.window.innerHeight / 2 - rect.y - rect.height / 2;
		if (letter.x < 0) letter.x = 0;		
		if (letter.y < 0) letter.y = 0;
		letter.init(allPoints);
	}
	
	
	private function _getRect(allPoints:Array<Point>):Rectangle
	{
		var minX:Float = Math.POSITIVE_INFINITY;
		var minY:Float = Math.POSITIVE_INFINITY;
		var maxX:Float = 0;
		var maxY:Float = 0;
		
		for (i in 0...allPoints.length) {
			var p:Point = allPoints[i];
			
			minX = Math.min(minX, p.x);
			minY = Math.min(minY, p.y);
			maxX = Math.max(maxX, p.x);
			maxY = Math.max(maxY, p.y);
			
		}
		
		/*
		var shape:Shape = new Shape();
		shape.graphics.beginStroke("#ff0000");
		shape.graphics.drawRect(minX, minY, maxX - minX, maxY - minY);
		_stage.addChild(shape);
		*/
		
		return new Rectangle(minX, minY, maxX - minX, maxY - minY);
		//Browser.window.alert(minX + ":" + minY + "__" + maxX + ":" + maxY);
		
	}
	
	
	
	
	
	private function _onDown(e):Void 
	{
		_stage.clear();
		_initMoji();
		
		//_restart();
	}
	
	function _restart() 
	{
		letter.start();
	}
	
	function _onResize(e):Void 
	{
		_canvas.width = (Browser.window).innerWidth;
		_canvas.height = (Browser.window).innerHeight;
		_stage.clear();
		letter.start();
		//_onDown(null);
	}
	
	static private function _update(e):Void 
	{
		letter.update();
		letter.update();

		_stage.update();
		letter.clear();
	}
	
}