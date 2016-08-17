package typo;
import createjs.easeljs.Container;
import createjs.easeljs.Graphics;
import createjs.easeljs.Point;
import createjs.easeljs.Shape;
import net.badimon.five3D.typography.HelveticaMedium;

/**
 * ...
 * @author nab
 */
class MyLetter extends Container
{
	var font:HelveticaMedium;
	var bpoints:BePoints;
	var shape:Shape;
	public var points:Array<Point>;
	
	
	public function new() 
	{
		super();
	}
	
	public function init(moji:String):Void {
		
		font = new HelveticaMedium();
		
		shape = new Shape();
		
		setMoji(moji);
		visible = true;
	}
	
	public function setMoji(str:String):Void {
		
		trace(str);
		bpoints = new BePoints();
		var pp:Array<Array<Point>> = bpoints.getLetterPoints(str, true,7, font, true);
		visible = false;
		var g:Graphics = shape.graphics;
		
		g.clear();
		
		addChild(shape);
		points = [];
		
		for (i in 0...pp.length) {
			for (j in 0...pp[i].length) {
				
				points.push( pp[i][j] );
				g.beginFill("#ff0000");
				g.drawCircle( pp[i][j].x, pp[i][j].y, 2);
				g.endFill();
			}
		}
		
		
	}
	
}