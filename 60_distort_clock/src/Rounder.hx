package;
import three.Geometry;
import three.ShapeGeometry;
import three.Vector3;

/**
 * ...
 * @author nabe
 */
class Rounder
{

	public function new() 
	{
		
	}
	
	public static function round(geo:Geometry):Void {
		
		for(i in 0...geo.vertices.length){
			var v3:Vector3 = geo.vertices[i];//
			var rx:Float = v3.x / 600 * Math.PI * 2;
			var ry:Float = v3.y / 600 * Math.PI * 2;
			
			var A:Float = 100;
			var amp:Float = A * Math.cos(ry);

			var xx:Float = amp * Math.sin( rx );//横
			var yy:Float = A*Math.sin( ry );//縦
			var zz:Float = amp * Math.cos( rx );//横
		
			geo.vertices[i].x = xx;
			geo.vertices[i].y = yy;			
			geo.vertices[i].z = zz;
			

		}
		geo.verticesNeedUpdate = true;
		geo.computeFaceNormals();
		geo.computeVertexNormals();
	}
	
	static public function roundB(geo:ShapeGeometry) 
	{
		for(i in 0...geo.vertices.length){
			var v3:Vector3 = geo.vertices[i];//
			var rx:Float = v3.x / 1000 * Math.PI * 2;
			var ry:Float = v3.y / 1000 * Math.PI * 2;
			
			var A:Float = 100;
			var amp:Float = A * Math.cos(ry);

			var xx:Float = v3.x;//amp * Math.sin( rx );//横
			var yy:Float = v3.y;//A*Math.sin( ry );//縦
			var zz:Float = amp * Math.cos(ry);//amp * Math.cos( rx );//横
		
			geo.vertices[i].x = xx;
			geo.vertices[i].y = yy;			
			geo.vertices[i].z = zz;
			

		}
		
		geo.computeFaceNormals();
		geo.computeVertexNormals();
		geo.verticesNeedUpdate = true;

	}
	
	
	/*
			var rx:Float = dots[i].x / _w * Math.PI * 2;
			var ry:Float = dots[i].y / _h * Math.PI * 2;
		
			//A = 4500;
			var amp:Float = A * Math.cos(ry);

			var xx:Float = amp * Math.sin( rx );//横
			var yy:Float = A*Math.sin( ry );//縦
			var zz:Float = amp * Math.cos( rx );//横
		
			dots[i].position.x = xx;
			dots[i].position.y = yy;			
			dots[i].position.z = zz;
			dots[i].update();
	*/
	
}