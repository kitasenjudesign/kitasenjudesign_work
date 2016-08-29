package objects ;

import three.Geometry;
import three.ImageUtils;
import three.Material;
import three.MeshBasicMaterial;
import three.Object3D;
import three.Vector3;
/**
 * ...
 * @author nab
 */
class MyDAELoader
{
	
	private var _callback:Void->Void;
	
	public var dae:Object3D;
	public var geometry:Geometry;
	public var material:Material;
	
	
	public function new() 
	{
		
	}

	public function load(filename:String,callback:Void->Void):Void {
		
		_callback = callback;
		
		var loader = untyped __js__("new THREE.ColladaLoader()");
		loader.options.convertUpAxis = true;		
		loader.load( filename, _onComplete );
		
	}
	
	
	
	private function _onComplete(collada):Void 
	{
		
		dae = collada.scene;
		dae.scale.x = dae.scale.y = dae.scale.z =80;

		geometry = untyped dae.children[0].children[0].geometry;
		
	
		
		if (_callback != null) {
			_callback();
		}
		
		//dispatchEvent(new Event("COMPLETE", true, true));
	}
	
	
	
	
	
}