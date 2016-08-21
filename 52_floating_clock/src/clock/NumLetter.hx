package clock;
import three.Mesh;
import three.Object3D;
import three.Vector3;

/**
 * ...
 * @author nab
 */
class NumLetter extends Object3D
{

	private var _letters	:Array<DigMesh>;
	
	private var _current:DigMesh;
	private var _shoumen:Bool = false;
	
	public var vx:Float = 0;
	public var vy:Float = 0;
	public var vz:Float = 0;
	
	
	
	
	public function new() 
	{
		super();
	}
	
	public function getCurrent():DigMesh {
		return _current;
	}
	
	public function init(letters:Array<Mesh>):Void {
	
		_letters = [];
		for (m in letters) {
			var mc:DigMesh = new DigMesh( cast m.clone() );
			_letters.push( mc );
			add(mc.mesh);
			mc.mesh.visible = false;
		}
		
	}
	
	
	public function setNo(n:Int):Void {
		
		for (m in _letters) {
			m.mesh.visible = false;
		}
		
		_letters[n].mesh.visible = true;
		_current = _letters[n];
	}
	
	
	public function force(shoumen:Bool):Void {
		
		_shoumen = shoumen;
		
		if (_shoumen) {
			this.rotation.x = this.rotation.x % (Math.PI * 2);
			this.rotation.y = this.rotation.y % (Math.PI * 2);
			this.rotation.z = this.rotation.z % (Math.PI * 2);

		}
		
		var v:Vector3 = new Vector3();
		v.x = 1 * (Math.random() - 0.5);
		v.y = 1 * (Math.random() - 0.5);
		v.z = 1 * (Math.random() - 0.5);
		v.normalize();
		v.multiplyScalar(0.4);
		vx = v.x;
		vy = v.y;
		vz = v.z;

		if(_current!=null){
			_current.force();
		}
		
	}
	
	public function update():Void {
		
		if (_shoumen) {
			
			this.rotation.x += (0-this.rotation.x)/ 10;
			this.rotation.y += (0 - this.rotation.y) / 10;
			this.rotation.z += (0 - this.rotation.z) / 10;
			
		}else{
		
		this.rotation.x += vx;
		this.rotation.y += vy;
		this.rotation.z += vz;
		
		vx *= 0.92;
		vy *= 0.92;
		vz *= 0.92;
		}

		
		if (_current != null) {
			_current.update();

			/*
			_current.geometry.verticesNeedUpdate = true;
			for (v in _current.geometry.vertices) {
				v.x += 0.5 * (Math.random() - 0.5);
				v.y += 0.5 * (Math.random() - 0.5);
				v.z += 0.5 * (Math.random() - 0.5);
			}
			*/
		}
	}
	
	
}