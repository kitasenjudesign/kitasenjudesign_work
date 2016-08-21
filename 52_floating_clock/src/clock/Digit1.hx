package clock;
import js.three.Geometry;
import js.three.Material;
import js.three.Mesh;
import js.three.Object3D;


/**
 * ...
 * @author nab
 */
class Digit1 extends Object3D
{

	public var vx:Float = 0;
	public var vy:Float = 0;
	public var vz:Float = 0;
	
	public function new(g:Geometry,m:Material) 
	{
		super(g, m);
	}
	
	public function force():Void {
		
		vx = 0.5*(Math.random() - 0.5);
		vy = 0.5*(Math.random() - 0.5);
		vz = 0.5*(Math.random() - 0.5);
		
	}
	
	public function update():Void {
		
		this.rotation.x += vx;
		this.rotation.y += vy;
		this.rotation.z += vz;
		
		vx *= 0.95;
		vy *= 0.95;
		vz *= 0.95;
		
	}
	
}