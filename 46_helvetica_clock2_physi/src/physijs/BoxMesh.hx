package physijs;
import three.Geometry;
import three.Material;
import three.Mesh;

@:native("Physijs.BoxMesh")
extern class BoxMesh extends Mesh{
    public function new(g:Geometry,m:Material,mass:Float=0) : Void;
	
}
