package times;
import createjs.easeljs.Container;
import createjs.easeljs.Graphics;
import createjs.easeljs.Shape;
import js.Browser;
import net.badimon.five3D.typography.HelveticaMedium;

/**
 * ...
 * @author nabe
 */
class Keta extends Container
{
	
	private var _shape1:Shape;
	private var _shape2:Shape;
	private var _shape3:Shape;
	
	private static var helvetica:HelveticaMedium;
	public var height:Float = 800;// 873;
	public var space:Float = 310;
	private var _color:String;
	var _counter:Int=Math.floor(100*Math.random());

	public function new() 
	{
		super();
	}
	
	public function init(color:String,type:String):Void {
		
		if (helvetica == null) {
			helvetica = new HelveticaMedium();
		}
		_color = color;
		_shape1 = new Shape();
		_shape2 = new Shape();
		_shape1.compositeOperation = "lighter";
		_shape2.compositeOperation = "lighter";
		addChild(_shape1);
		addChild(_shape2);
		_shape1.x = -space;
		_shape2.x = space;
		
		//shape 3
		_shape3 = new Shape();
		_shape3.compositeOperation = "lighter";
		addChild(_shape3);
		_update(_shape3, type, 0.5, false);
		_shape3.x = space * 1.95;
		_shape3.y = height / 2.15;
		
	}
	
	public function update(nn:Int):Void {
		
		if (nn < 10) {
			_update(_shape1, "0");
			_update(_shape2, "" + nn);
		}else {
			var hoge:String = ""+nn;
			_update(_shape1, hoge.substr(0, 1));
			_update(_shape2, hoge.substr(1, 1));
		}
		

		
	}
	
	public function setBlendMode(str:String) 
	{
		_shape1.compositeOperation = str;
		_shape2.compositeOperation = str;
		_shape3.compositeOperation = str;
		
	}
	
	private function _update(s:Shape, moji:String, scl:Float=12,centering:Bool=true):Void {

		s.graphics.clear();
		//s.graphics.beginFill(_color);
		s.graphics.beginFill( 
			Graphics.getRGB(
				Math.floor( Math.sin(_counter / 10+Math.PI/10) * 128+128 ) ,
				Math.floor( Math.sin(_counter/13+Math.PI/30)*128+128 ),
				Math.floor( Math.sin(_counter/28+Math.PI/38)*128+128 )
			)
		);
		
		_counter++;
		
		if(moji.length==1){
			FontTest.getLetterPoints(s.graphics, moji, centering, scl, helvetica);
		}else {
			for (i in 0...moji.length) {
				FontTest.getLetterPoints(s.graphics, moji.substr(i,1), centering, scl, helvetica,i*60);
			}
		}
	}
	
	
}