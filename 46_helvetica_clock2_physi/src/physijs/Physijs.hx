package physijs;
import three.Material;

@:native("Physijs")
extern class Physijs {

    public function new() : Void;
	public static function createMaterial(m:Material, hiReflection:Float, lowReflection:Float):Dynamic;
	public static var scripts:Dynamic;
	
	//public static var 	
	//Physijs.scripts.worker 
	
}
