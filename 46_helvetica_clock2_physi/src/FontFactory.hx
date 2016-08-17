package ;
import three.ExtrudeGeometry;
import three.Matrix4;
import three.Shape;
import net.badimon.five3D.typography.HelveticaMedium;

/**
 * ...
 * @author nab
 */
class FontFactory
{


	public var map:Map<String,ExtrudeGeometry>;
	
	public function new() 
	{
		
	}

	public function init():Void {
		
		map = new Map();
		
		var str:String = "0123456789";
		for(i in 0...str.length){
			var shapes:Array<Shape> = [];
			var shape:Shape = new Shape();
			FontTest.getLetterPoints(shape, str.substr(i,1), true, 3, new HelveticaMedium());
			shapes.push(shape);
			var geo:ExtrudeGeometry = new ExtrudeGeometry(untyped shapes, { amount:50,bevelEnabled:false } );
			map.set(str.substr(i, 1), geo);
			
			map.set(str.substr(i, 1), geo);
			
			var mm:Matrix4 = new Matrix4();
			mm.makeTranslation(0, 0, -25);
			geo.applyMatrix(mm);
			geo.verticesNeedUpdate = true;

			
			//var geo:ShapeGeometry = new ShapeGeometry(untyped shapes,{});
			//var mesh:Mesh = new Mesh(geo, new MeshBasicMaterial( {wireframe:true, color:0xffffff, side:Three.DoubleSide} ));
		}
	}
	
}