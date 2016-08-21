package ;

import createjs.easeljs.Event;
import createjs.easeljs.Stage;
import js.Browser;
import js.JQuery;
import js.three.AmbientLight;
import js.three.CubeGeometry;
import js.three.Geometry;
import js.three.Line;
import js.three.LineBasicMaterial;
import js.three.Mesh;
import js.three.MeshBasicMaterial;
import js.three.MeshNormalMaterial;
import js.three.Path;
import js.three.PerspectiveCamera;
import js.three.PointLight;
import js.three.Scene;
import js.three.Shape;
import js.three.ShapeGeometry;
import js.three.Three;
import js.three.Vector3;
import js.three.Vertex;
import js.three.WebGLRenderer;
import net.badimon.five3D.typography.DiamanteLightMed;
import net.badimon.five3D.typography.HelveticaLight;
import net.badimon.five3D.typography.HelveticaMedium;
//import flash.events.Event;

/**
 * ...
 * @author watanabe
 */

class Main 
{
	
	private var _dots:Dots;
	private var stage:Stage;
	
	private var _scene:Scene;
	private var _camera:PerspectiveCamera;
	private var _renderer:WebGLRenderer;
	private var _loader:MyDAELoader;
	private var _mouseX:Float = 0;
	private var _mouseY:Float = 0;
	var _lines:Line;
	
	//private var _b:Bitmap;

	
	static function main() 
	{
		new Main();
	}
	
	public function new() {
		Browser.window.onload = initialize;
	}
	
	private function initialize(e):Void
	{
		_scene = new Scene();
        _camera = new PerspectiveCamera(60, Browser.window.innerWidth / Browser.window.innerHeight, 100, 50000);
		
		_renderer = new WebGLRenderer();
		//_renderer.setClearColor(new Color(0xff), 1);
        _renderer.setSize(Browser.window.innerWidth, Browser.window.innerHeight);
        Browser.document.body.appendChild(_renderer.domElement);
		
		/*
		var points:Array<Array<Dynamic>> = MojiPoints.getPoints();
		for (i in 0...points.length) {
			var geo:Geometry = new Geometry();
			for ( j in 0...points[i].length) {
				var v1:Vector3 = new Vector3(points[i][j][0], points[i][j][1], 0);
				geo.vertices.push( v1 );				
			}
			var line:Line = new Line( geo, new LineBasicMaterial( { color: Math.floor( 0xffffff*Math.random() ) } ) );
			_scene.add(line);
		
		}
		*/
		
		var points:Array<Array<Dynamic>> = MojiPoints.getPoints();
	
		/*
		for (i in 0...points.length) {
			
			//
			if(i==0){
				shapes.push(shape);
			
				for ( j in 0...points[i].length) {
					if (j == 0) {
						shape.moveTo(points[i][j][0]*10, -points[i][j][1]*10);
					}else {
						shape.lineTo(points[i][j][0] * 10, -points[i][j][1] * 10);
					}
				}
			}else {
				var path:Path = new Path();				
				for ( j in 0...points[i].length) {
					if (j == 0) {
						path.moveTo(points[i][j][0]*10, -points[i][j][1]*10);
					}else {
						path.lineTo(points[i][j][0] * 10, -points[i][j][1] * 10);
					}
				}
				shape.holes = untyped [path];
			}
	
			//shape.holes
			//var path:Path = new Path();
			//shape.quadraticCurveTo(
		}*/
		
		
		var s:String = "0123456789";// "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		for(i in 0...s.length){
			var shapes:Array<Shape> = [];
			var shape:Shape = new Shape();

			FontTest.getLetterPoints(shape, s.substr(i, 1), true, 2, new DiamanteLightMed());//new HelveticaLight());
			shapes.push(shape);
			var geo:ShapeGeometry = new ShapeGeometry(untyped shapes,{});
			var mesh:Mesh = new Mesh(geo, new MeshNormalMaterial( { color:0xffffff, side:Three.DoubleSide, wireframe:true} ));
			_scene.add(mesh);

			mesh.position.x = 500 * (Math.random() - 0.5);
			mesh.position.y = 500 * (Math.random() - 0.5);
			mesh.position.z = 500 * (Math.random() - 0.5);

		}
		
		//_radX 0~2pi
		//_radY 0~2pi
		/*
		var numX:Int = 10;
		var numY:Int = 10;
		
		for (j in 0...numY) {

			for(i in 0...numX){

				var geo:Geometry = new Geometry();

				var radX:Float = 2 * Math.PI * Math.random();//i / numX * Math.PI * 2;
				var radY:Float = 2 * Math.PI * Math.random();//j / numY * Math.PI * 2;
				var v1:Vector3 = _getPoint(950, radX, radY);
				var v2:Vector3 = _getPoint(1050+500*Math.random(), radX, radY);
		
				geo.vertices.push( v1 ); 
				geo.vertices.push( v2 ); 
		
				
				var line:Line = new Line( geo, new LineBasicMaterial( { color: Math.floor( 0xffffff*Math.random() ) } ) );
				_scene.add(line);
		
			}
		}
		*/
		//_lines.geometry.verticesNeedUpdate = true;
		//_lines.updateMatrix();
		

		/*
		_dots = new Dots();
		_dots.init(_loader.dae, _scene, Browser.window.innerWidth, Browser.window.innerHeight);
		*/
		//_scene.add(_loader.dae);
		
		/*
		var directionalLight = new AmbientLight(0x000000 );
			directionalLight.position.x = 1000;// 10000 * (Math.random() - 0.5);
			directionalLight.position.y = 3000;// 10000 * (Math.random() - 0.5);
			directionalLight.position.z = 0;// 10000;
			//directionalLight.position.normalize();
			_scene.add( directionalLight );
		
		var light3:PointLight = new PointLight( 0x3300ff, 1, 3000 );
		light3.position.x = 400;
		light3.position.y = 400;
		_scene.add( light3 );

		var light3:PointLight = new PointLight( 0x00ffff, 1, 3000 );
		light3.position.x = 800;
		light3.position.y = 400;
		_scene.add( light3 );
		*/

		
		untyped Browser.document.addEventListener("mousemove", function(event){
            _mouseX = (event.clientX - Browser.window.innerWidth / 2) / Browser.window.innerWidth;
            _mouseY = (event.clientY - Browser.window.innerHeight / 2) / Browser.window.innerHeight;
        }, false);

		/*
		var cube:Mesh = new Mesh(new CubeGeometry(2000, 2000, 2000, 1, 1),new MeshBasicMaterial({wireframe:true,color:0x888888}));
		_scene.add(cube);
		*/
		
		_run();
		
		new JQuery( Browser.window ).resize(_onResize);
		_onResize(null);
	}
	
	function _getPoint(A:Float, radX:Float, radY:Float):Vector3
	{
		var amp:Float = A * Math.cos(radY);		
		var xx:Float = amp * Math.sin( radX );//横
		var yy:Float = A*Math.sin(radY);//縦
		var zz:Float = amp * Math.cos( radX );//横
		
		return new Vector3(xx, yy, zz);
	}
	
	private function _run():Void
	{
		Three.requestAnimationFrame( untyped _run);
		
		
		
		var rad:Float = _mouseX * 2 * Math.PI;
		_camera.position.x += (1000 * Math.cos(rad) -_camera.position.x) / 4;
		_camera.position.y += (2000 * (_mouseY ) - _camera.position.y ) / 4;
		_camera.position.z += (1000 * Math.sin(rad) - _camera.position.z) / 4;
		_camera.lookAt(new Vector3(0, 0, 0));
		

		_renderer.render(_scene, _camera);

	}
	
	function _onResize(object) 
	{
       // _renderer.setSize(Browser.window.innerWidth, Browser.window.innerHeight);
		_dots.resize(new JQuery(Browser.window).width(), new JQuery(Browser.window).height());
		
	}
	
	
	
}