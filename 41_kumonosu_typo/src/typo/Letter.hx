package typo;
import createjs.easeljs.Container;
import createjs.easeljs.Graphics;
import createjs.easeljs.Point;
import createjs.easeljs.Shape;
import js.Browser;
import js.html.svg.Number;
import net.badimon.five3D.typography.HelveticaMedium;

/**
 * ...
 * @author nab
 */
class Letter extends Container
{
	var _allPoints:Array<Point>;
	var _count:Int = 0;
	var shape:Shape;
	var mojiAlpha:Float = 0.06;
	var _rad:Float = 0;
	
	public var isColor:Bool = false;
	
	public function new() 
	{
		super();
	}

	public function init(allPoints:Array<Point>):Void {
		
		//_count = Math.floor( 100 * Math.random() );
		_rad = Math.random() * 2 * Math.PI;
		_count = 0;
		if(shape==null){
			shape = new Shape();
			addChild(shape);
			shape.graphics.beginStroke(Graphics.getRGB(255, 255, 255, mojiAlpha)).setStrokeStyle(1, 0, 0, 0, true);
		}
		_allPoints = allPoints;
		
		//randmize
		
		var len:Int = Math.floor(_allPoints.length / 24);
		for (i in 0...len) {
			var idx1:Int = Math.floor(Math.random() * _allPoints.length);
			var idx2:Int = Math.floor(Math.random() * _allPoints.length);
			var tmp = _allPoints[idx1];
			_allPoints[idx1] = _allPoints[idx2];
			_allPoints[idx2] = tmp;
		}
		
		isColor = !isColor;
		mojiAlpha = isColor ? 0.06 : 0.02;
		Browser.document.body.style.backgroundColor = (isColor) ? "#888888" : "#ffffff";
		
	}
	
	public function start() 
	{
		_count = 0;
		/*
		_count = 0;
		_rad = Math.random() * 2 * Math.PI;
		isColor = !isColor;
		Browser.document.body.style.backgroundColor = (isColor) ? "#888888" : "#ffffff";
		*/
	}

	
	
	public function update():Void {
		
		if (_count >= _allPoints.length) return;
		
		//なにか
		var i:Int = _count;
		//for (i in 0...allPoints.length) {
			for(j in i..._allPoints.length){
				if (i != j) {
					
					var dx:Float = _allPoints[i].x - _allPoints[j].x;
					var dy:Float = _allPoints[i].y - _allPoints[j].y;
					var dist:Float = Math.sqrt(dx * dx + dy * dy);
					if (dist <100) {
						//trace(dx + ":" + dy);
						shape.graphics.moveTo(_allPoints[i].x, _allPoints[i].y);						
						shape.graphics.lineTo(_allPoints[j].x, _allPoints[j].y);
					}
				}
			}
		//}
		_count++;
		
		shape.compositeOperation = (isColor) ? "darker" : "normal";//darker
	}
	
	public function clear() 
	{
		shape.graphics.clear();
		
		if (!isColor){
			shape.graphics.beginStroke(Graphics.getRGB(0,0,0, mojiAlpha));
		}else {
			shape.graphics.beginStroke(
				//Graphics.getHSL(Math.random()*360, 1, 1, mojiAlpha)
				
				Graphics.getRGB(
					Math.floor( 128 + 128 * Math.sin(_count / 200 + _rad) ), 
					Math.floor( 128 + 128 * Math.sin(_count / 400 + _rad) ),
					Math.floor( 128 + 128 * Math.sin(_count / 600 + _rad) ), mojiAlpha
				)
				
			);	
		}
		
		
	}
	
	
}