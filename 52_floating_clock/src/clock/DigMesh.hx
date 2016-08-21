package clock;
import three.Geometry;
import three.Mesh;
import three.Vector3;

/**
 * ...
 * @author nab
 */
class DigMesh
{

	public var mesh:Mesh;
	private var _map:Map<String,Array<Int>>;
	private var _geo:Geometry;
	private var _vertices:Array<Vector3>;
	
	public function new(m:Mesh) 
	{
		
		mesh = m;
		mesh.castShadow = true;
		_vertices = [];
		_geo = mesh.geometry;
		_map = new Map();
		
		//
		for (i in 0..._geo.vertices.length) {

			var v:Vector3 = _geo.vertices[i];
			_vertices[i] = v.clone();
			var name:String = toString(v);
			if ( _map.get(name) == null ) {
				_map.set(name, []);
			}
			_map.get(name).push(i);
			
		}
		
		
	}
	
	
	public function update():Void {
		/*
		for (a in _map) {
			for (idx in a) 
			{
				_geo.verticesNeedUpdate = true;
				_geo.vertices[idx].x += (_vertices[idx].x - _geo.vertices[idx].x)/14;
				_geo.vertices[idx].y += (_vertices[idx].y - _geo.vertices[idx].y)/14;
				_geo.vertices[idx].z += (_vertices[idx].z - _geo.vertices[idx].z)/14;
				//_geo.computeVertexNormals();
				//_geo.computeFaceNormals();			
				
			}
		}
		*/

	}
	
	public function force():Void {
		
		/*
		for (a in _map) {
			for (idx in a) 
			{
				_geo.verticesNeedUpdate = true;
				_geo.vertices[idx].x = _vertices[idx].x + 160 * (Math.random() - 0.5);
				_geo.vertices[idx].y = _vertices[idx].y + 160 * (Math.random() - 0.5);
				_geo.vertices[idx].z = _vertices[idx].z + 160 * (Math.random() - 0.5);
				//_geo.computeVertexNormals();
				//_geo.computeFaceNormals();			
				
			}
		}*/
		
	}
	
	public function toString(v:Vector3):String {
		
		return v.x + "_" + v.y + "_" + v.z;
		
	}
	
	
	
	
}