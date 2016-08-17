package ;
import createjs.easeljs.EventDispatcher;
import createjs.easeljs.Point;
import js.three.Geometry;
import js.three.Line;
import js.three.LineBasicMaterial;
import js.three.Mesh;
import js.three.MeshBasicMaterial;
import js.three.MeshLambertMaterial;
import js.three.MeshNormalMaterial;
import js.three.MeshPhongMaterial;
import js.three.Object3D;
import js.three.Plane;
import js.three.PlaneGeometry;
import js.three.Scene;
import js.three.Three;
import js.three.Vector3;
import js.three.Vertex;

/**
 * ...
 * @author nab
 */
class Dots extends EventDispatcher
{
	static public inline var DIST:Float = 100;

	
	private var distance:Array<Float>;
	private var _w:Float;
	private var _h:Float;
	private var number_of_points:Int = 160;
	private var _lines:Line;
	private var _scene:Scene;
	private var _mesh:Mesh;
	private var _plane:Mesh;
	private var _count:Int = 0;
	
	public function new() 
	{
		//super();
	}

	public function init(dae:Object3D,scene:Scene,w:Float,h:Float):Void {
		
		_scene = scene;
		
		var geo:Geometry = new Geometry();
		for(i in 0...100){
			geo.vertices.push( new Vertex( 3000*(Math.random()-0.5), 3000*(Math.random()-0.5), 3000*(Math.random()-0.5) ) ); 
			geo.vertices.push( new Vertex( 3000*(Math.random()-0.5), 3000*(Math.random()-0.5), 3000*(Math.random()-0.5) ) ); 
			geo.vertices.push( new Vertex( 3000*(Math.random()-0.5), 3000*(Math.random()-0.5), 3000*(Math.random()-0.5) ) );
		}
		_lines = new Line( geo, new LineBasicMaterial( { color: 0xff0000 } ) );
		_lines.geometry.verticesNeedUpdate = true;
		//_lines.updateMatrix();
		_scene.add(_lines);
		
		//var mate:MeshBasicMaterial = new MeshBasicMaterial( {
		//		color:0xffff00,
		//		shading:Three.FlatShading
		//} );
		//var mate:MeshNormalMaterial = new MeshNormalMaterial( { shading: Three.FlatShading, overdraw: 0.5,color:0xff0000 } );

		//var mate:MeshLambertMaterial = new MeshLambertMaterial( { color: 0xffffff, shading: Three.FlatShading } );

		var mate:MeshPhongMaterial 
		=new MeshPhongMaterial( { ambient: 0x555555, color: 0x555555, specular: 0xffffff, shininess: 50, shading: Three.FlatShading } );
		
		//var  mate:MeshPhongMaterial = new MeshPhongMaterial( { ambient: 0x555555, color: 0x555555, specular: 0xffffff, shininess: 50, shading: Three.FlatShading }); 
		//new MeshPhongMaterial( { color: 0x00ff00, shading: Three.FlatShading } );
		mate.side = Three.DoubleSide;
		

		
		_plane = new Mesh(
			new PlaneGeometry(2000, 2000, 5, 5),
			mate
		);
		_scene.add(_plane);
		
		_plane.geometry.verticesNeedUpdate = true;
		_plane.geometry.normalsNeedUpdate = true;		
		
		
	}
	

	
	
	
	
	public function update():Void {
		
		
		_lines.geometry.verticesNeedUpdate = true;
		_plane.geometry.verticesNeedUpdate = true;

		for(i in 0..._plane.geometry.vertices.length)
		{
			_plane.geometry.vertices[i].z =  Math.sin(i / 10 + _count / 411) * 800; 
			_count++;
		}

		_plane.geometry.computeFaceNormals();
		_plane.geometry.computeVertexNormals();

		
		
		
		for (i in 0..._lines.geometry.vertices.length){
			_lines.geometry.vertices[i].x = 3000 * (Math.random() - 0.5);
			_lines.geometry.vertices[i].y = 3000 * (Math.random() - 0.5);
			_lines.geometry.vertices[i].z = 3000 * (Math.random() - 0.5);
		}
		
	}

	
	
	public function resize(w:Float, h:Float) 
	{
		_w = w;
		_h = h;
	}
	
	
	
	
	
	
	
	
}