package times;
import createjs.easeljs.Container;
import createjs.easeljs.Graphics;
import createjs.easeljs.Shape;
import js.Browser;

/**
 * ...
 * @author nabe
 */
class Graph extends Container
{

	private var _shape:Shape;
	private var _width:Float = 0;
	public function new() 
	{
		super();
		
		_shape = new Shape();
		_shape.alpha = 0.8;
		addChild(_shape);
		_width = Browser.window.innerWidth;
	}
	
	public function update(h:Int,m:Int,s:Int):Void {
		
		
		var g:Graphics = _shape.graphics;
		g.clear();
		
		g.beginStroke( Graphics.getRGB(0, 0, 0xff) ).setStrokeStyle(4);
		g.moveTo(0, 5);
		g.lineTo( s/60 * _width,5);
		g.endStroke();
		
		g.beginStroke( Graphics.getRGB(0, 0xff, 0) ).setStrokeStyle(4);
		g.moveTo(0, 10);
		g.lineTo( m/60 * _width,10);
		g.endStroke();
		
		g.beginStroke( Graphics.getRGB(0xff, 0, 0) ).setStrokeStyle(4);
		g.moveTo(0, 15);
		g.lineTo( h/24 * _width,15);
		g.endStroke();
		
		
		
	}
	
}