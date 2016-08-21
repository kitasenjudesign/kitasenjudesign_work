package ;
import createjs.easeljs.Event;
import createjs.easeljs.EventDispatcher;
import js.three.Geometry;
import js.three.Material;
import js.three.MeshBasicMaterial;
import js.three.MeshNormalMaterial;
import js.three.Object3D;
import js.three.Three;

/**
 * ...
 * @author nab
 */
class MyDAELoader extends EventDispatcher
{
	
	public var dae:Object3D;
	
	public function new() 
	{
		
	}

	public function load():Void {
		var loader = untyped __js__("new THREE.ColladaLoader()");
		loader.options.convertUpAxis = true;		
		loader.load( 'negimiku.dae', _onComplete );
	}
	
	private function _onComplete(collada):Void 
	{
		trace("dae load onComplete");
		dae = collada.scene;
		//trace("unko " + collada);
		dae.scale.x = dae.scale.y = dae.scale.z = 30;
		//untyped dae.children[0].children[0].material = new MeshNormalMaterial( { overdraw: 0.5 } );
		
		untyped dae.children[0].children[0].material.shading = Three.FlatShading;
		
		//var s:MeshBasicMaterial;
		//s.shading
		
		var skin = collada.skins[ 0 ];
		dae.updateMatrix();
		
		dispatchEvent(new Event("COMPLETE", true, true));
	}
	
}