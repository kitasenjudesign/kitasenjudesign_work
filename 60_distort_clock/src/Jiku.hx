package;
import three.Object3D;
import three.Vector3;
import tween.TweenMax;

/**
 * ...
 * @author nabe
 */
class Jiku
{

	public static var obj:Object3D;
	private static var params:Dynamic;
	static private var mouseX:Float=0;
	static private var mouseY:Float=0;
	
	public function new() 
	{
		
	}
	
	/**
	 * 
	 */
	public static function init():Void {
		
		params = {
			//radius:100,
			radius:100,
			
			phase:1,
			phaseY:1,
			ampX:300,
			ampY:500,
			phaseR:1,
			length:5000
		};
		
	}
	
	
	/**
	 * r: 0-1
	 * @param	ratio
	 */
	public static function getPos(r:Float,rad:Float,oRot:Float):Vector3 {
	
		if (r <= 0) r = 0;
		if (r >= 1) r = 1;
		
		//objを移動
		var v1:Vector3 = getPos1(r);
		obj.position.x = v1.x;
		obj.position.y = v1.y;
		obj.position.z = v1.z;
		
		//
		var v2:Vector3 = getPos1(r+0.01);
		//v2 = v1.sub(v2);		
		obj.lookAt(v2);
		
		//
		var amp:Float = 300 + params.radius * Math.sin(r * Math.PI * 2 * params.phase);
		
		var v3:Vector3 = new Vector3();
		v3.x = amp * Math.sin(rad + r * 2 * Math.PI * params.phaseR + oRot );
		v3.y = amp * Math.cos(rad + r * 2 * Math.PI * params.phaseR + oRot );
		v3.z = 0;
		
		
		obj.updateMatrixWorld();
		var out:Vector3 = obj.localToWorld(v3);
		//trace(out.x, out.y, out.z);
		
		return out;
		
	}
	
	
	
	
	
	public static function setRandom():Void {
		
		
		TweenMax.to(params, 1, {
			radius:100 + 200 * Math.random(),/////////////////
			phase:0.5 + 1.5 * Math.random(),
			phaseY:0.2 + 3.2 * Math.random(),
			phaseR:0.0 + 2.5 * Math.random(),
			ampY:0 + 400 * Math.random(),
			ampX:300 + 500 * Math.random(),
			length:4000+2000*Math.random()
		});
		
		
	}
	
	
	/**
	 * 
	 * @param	r
	 * @return
	 */
	public static function getPos1(r:Float):Vector3 {
		
		var v:Vector3 = new Vector3();
		v.x = params.ampX * Math.cos(r *  Math.PI * 2);
		
		var rr:Float = (1 - params.ampY / 400) * 0.6 + 0.4;
		v.y = params.ampY * Math.sin(r *  Math.PI * 2 * params.phaseY*rr ) ;
		
		v.z = params.length * (r - 0.5);//z no oku
		return v;
		
	}
	
	static public function update(rx:Float, ry:Float) 
	{
		mouseX = rx * 2 * Math.PI;
		mouseY = ry * 2 * Math.PI;
	}
	
	
}