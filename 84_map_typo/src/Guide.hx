package ;
import createjs.easeljs.Container;
import createjs.easeljs.Shape;

/**
 * ...
 * @author nab
 */
class Guide extends Container
{
	
	private var _shape:Shape;

	public function new() 
	{
		super();
	}
	
	public function init():Void {
		
		_shape = new Shape();
		addChild(_shape);
		
	}
	
	public function update(
		rad1:Float, rad2:Float, rad3:Float,
		amp1:Float, amp2:Float, amp3:Float,
		phase1:Float, phase2:Float, phase3:Float,
		ww:Float, hh:Float
	):Void {
		
		_shape.graphics.clear();
		_shape.graphics.beginStroke("#ff0000");

		_shape.graphics.moveTo(ww / 2, hh / 2);
		
		var xx:Float = ww / 2 + amp1 * Math.cos( rad1 + phase1);// _count / 300 );// 257);
		var yy:Float = hh / 2 + amp1 * Math.sin( rad1 + phase1);// _count / 300 );// 351);	
		_shape.graphics.lineTo(xx, yy);
			
		var xxx:Float = xx + amp2 * Math.cos( rad2 + phase2);
		var yyy:Float = yy + amp2 * Math.sin( rad2 + phase2);
		_shape.graphics.lineTo(xxx, yyy);

		var xxxx:Float = xxx + amp3 * Math.cos( rad3 + phase3);
		var yyyy:Float = yyy + amp3 * Math.sin( rad3 + phase3);
		_shape.graphics.lineTo(xxxx, yyyy);		
		
		//
		_shape.graphics.beginFill("#000000");
		_shape.graphics.drawCircle(xxxx, yyyy, 3);
		_shape.graphics.endFill();
		
		
		_shape.graphics.beginFill("#000000");
		_shape.graphics.drawCircle(xxx, yyy, 3);
		_shape.graphics.endFill();
		
		_shape.graphics.beginFill("#ff0000");
		_shape.graphics.drawCircle(xx, yy, 3);
		_shape.graphics.endFill();

		_shape.graphics.beginFill("#ff0000");
		_shape.graphics.drawCircle(ww/2, hh/2, 3);
		_shape.graphics.endFill();

	}
	
}