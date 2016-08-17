package physijs;
import three.Geometry;
import three.Material;
import three.Mesh;
import three.Scene;
import three.Vector3;

@:native("Physijs.Scene")
extern class PScene extends Scene{
    public function new() : Void;
	
	public function setGravity(vector3:Vector3):Void;
	public function simulate(param1:Dynamic=null,param2:Float=1):Void;
	
}
