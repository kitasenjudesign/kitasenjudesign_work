package clock;
import js.three.Color;
import js.three.Geometry;
import js.three.GeometryUtils;
import js.three.Mesh;
import js.three.MeshBasicMaterial;
import js.three.Object3D;
import js.three.Three;

/**
 * ...
 * @author nab
 */
class Digit extends Object3D
{

	private var digits:Array<Mesh>;
	private var m:MeshBasicMaterial;
	private var mesh:Mesh;
	
	public function new() 
	{
		super();
	}
	
	public function init(letters:Array<Mesh>):Void {

		digits = [];
		var g:Geometry = new Geometry();
		
		for (i in 0...letters.length) {
			var d:Object3D = letters[i].clone();
			digits.push(cast d);
			if (i == 1) {
				d.position.x = 8;
			}
			d.position.y = i * 200;
			//add(d);
			GeometryUtils.merge(g, cast d);
		}
		
		
		m = new MeshBasicMaterial( { color:0xffffff,overdraw:true } );
		m.side = Three.DoubleSide;
		mesh = new Mesh(g, m);
		add(mesh);
		//GeometryUtil
		
	}
	
	public function setColor(col:Int):Void {
		m.color = new Color( col );
		//mesh.up
	}
	
	
	public function setNo(n:Int):Void {
		
		this.position.y += ( -(n * 200) - this.position.y) / 7;
		
	}
	
}