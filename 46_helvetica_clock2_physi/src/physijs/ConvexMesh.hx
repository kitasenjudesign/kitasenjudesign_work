package physijs;
import js.three.Geometry;
import js.three.Material;
import js.three.Mesh;

@:native("Physijs.ConvexMesh")
extern class ConvexMesh extends BoxMesh{
    public function new(g:Geometry,m:Material,mass:Float=0) : Void;
}
