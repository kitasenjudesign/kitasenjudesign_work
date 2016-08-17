package ;

import camera.ExCamera;
import clock.Digit;
import js.Browser;
import three.CanvasRenderer;
import three.Line;
import three.Mesh;
import three.MeshBasicMaterial;
import three.PerspectiveCamera;
import three.Scene;
import three.Shape;
import three.ShapeGeometry;
import three.Vector3;
import three.WebGLRenderer;
import net.badimon.five3D.typography.HelveticaMedium;
//import createjs.easeljs.Stage;
//import js.three.Path;
//import js.three.Shape;
//import js.three.ShapeGeometry;
//import flash.events.Event;

/**
 * ...
 * @author watanabe
 */

class Main 
{	
	private var _scene:Scene;
	private var _camera:ExCamera;
	private var _renderer:WebGLRenderer;
	private var _mouseX:Float = 0;
	private var _mouseY:Float = 0;
	
	private var _downX:Float = 0;
	private var _downY:Float = 0;
	
	var _lines:Line;
	var _digits:Array<Digit>;
	var _amp:Float=400;
	var _flag:Bool=true;
	var _oldSec:Int=0;
	var _rad:Float = 0;
	var _yy:Float = 100;
	var letters:Array<Mesh>;
	public static var isCanvas:Bool = false;
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

		isCanvas = false;// !(untyped __js__("Detector.webgl"));
		if ( isCanvas  ) {
			//trace("web glない");
			_renderer = untyped new CanvasRenderer({antialias:true});
		}else {
			//trace("web glある");
			_renderer = new WebGLRenderer( {
				antialias:true
			});
			
		}
		//_renderer.autoClear = false;
		
		_scene = new Scene();
        _camera = new ExCamera( isCanvas ? 30 : 60, Browser.window.innerWidth / Browser.window.innerHeight, 10, 50000);
		_camera.init(_renderer.domElement);
		_renderer.setClearColorHex(0x000000, 1);

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
		letters = [];
		for(i in 0...s.length){

			var shapes:Array<Shape> = [];
			var shape:Shape = new Shape();
			FontTest.getLetterPoints(shape, s.substr(i, 1), true, 2.2, new HelveticaMedium());
			//FontTest.getLetterPoints(shape, s.substr(i, 1), true, 2.2, new DiamanteLightMed());
			
			shapes.push(shape);
			//var geo:ExtrudeGeometry = new ExtrudeGeometry(untyped shape, {amount:1});
			var geo:ShapeGeometry = new ShapeGeometry(untyped shapes, { } );
			
			//Rounder.round(geo);

			
			var mesh:Mesh = new Mesh(
				geo, 
				new MeshBasicMaterial( { wireframe:true, color:0xffffff, side:Three.DoubleSide } )
			);
			
			//_scene.add(mesh);
			letters.push(mesh);

		}
		
		_digits = [];
		for (i in 0...6) {
			var digit:Digit = new Digit();
			digit.init(letters);
			digit.position.x = (i - 2.5) * 120;
			//digit.position.y = 200 * 5; 
			digit.position.z = 0;
			_digits.push(digit);
			_scene.add(digit);			
		}
		

		/*
		untyped Browser.document.addEventListener("mousemove", function(event){
            _mouseX = (event.clientX - Browser.window.innerWidth / 2) / Browser.window.innerWidth;
            _mouseY = (event.clientY - Browser.window.innerHeight / 2) / Browser.window.innerHeight;
        }, false);
		
		//touchstart : タッチしたときに発生する
		//touchmove : タッチしたまま動かしたときに発生する
		//touchend : タッチ状態から離れたときに発生する
		untyped Browser.document.addEventListener("touchstart", function(e) {
			e.preventDefault();
			var touch = e.touches[0];
			if( e.touches.length<=1){
				_downX = touch.pageX / Browser.window.innerWidth - 0.5;
				_downY = touch.pageY / Browser.window.innerHeight - 0.5;
			}
		},false);
		
		untyped Browser.document.addEventListener("touchmove", function(e) {
			e.preventDefault();
			var touch = e.touches[0];
			if( e.touches.length<=1){
				_mouseX = touch.pageX / Browser.window.innerWidth - 0.5;
				_mouseY = touch.pageY / Browser.window.innerHeight - 0.5;
			}
        }, false);
		untyped Browser.document.addEventListener("gestureend", function(e) {
			if (e.scale < 1) {
				_amp += 200;
				if(_amp<200)_amp=200;
			}else if (e.scale > 1) {
				_amp -= 200;
			}
		},false);
		*/
		
		/*
		var cube:Mesh = new Mesh(new CubeGeometry(2000, 2000, 2000, 1, 1),new MeshBasicMaterial({wireframe:true,color:0x888888}));
		_scene.add(cube);
		*/
		
		_run();
		
		Browser.window.onkeydown = function(e) {
			_flag = !_flag;
			_change();
		}
		
		Browser.window.onresize = _onResize;
		_renderer.setSize(Browser.window.innerWidth, Browser.window.innerHeight);	

		
		//new JQuery( Browser.window ).resize(_onResize);
		//_onResize(null);
	}
	
	function _change():Void
	{
		if (_flag) {
			_renderer.setClearColorHex(0x000000, 1);
			for (i in 0..._digits.length) {
				_digits[i].setColor(0xffffff);
			}
		}else {
			_renderer.setClearColorHex(0xffffff, 1);
			for (i in 0..._digits.length) {
				_digits[i].setColor(0x000000);
			}
		}
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
		var date:Date = Date.now();

			_rad = _mouseX * 4 * Math.PI + Math.PI / 2;
			_yy = _amp * _mouseY * 2.2;
		
			
			if (_camera != null) {
				_camera.update();
			}
			
		/*
		_camera.position.x += (_amp * Math.cos(_rad) -_camera.position.x) / 4;
		_camera.position.y += ( (_yy ) - _camera.position.y ) / 4;
		_camera.position.z += (_amp * Math.sin(_rad) - _camera.position.z) / 4;
		_camera.lookAt(new Vector3(0, 0, 0));
		*/
		
		var hh:Int = 		date.getHours();
		var mm:Int = 		date.getMinutes();
		var ss:Int = 		date.getSeconds();
		
		_digits[0].setNo( _getKeta2(hh) );
		_digits[1].setNo(_getKeta1(hh) );
		_digits[2].setNo(_getKeta2(mm) );
		_digits[3].setNo(_getKeta1(mm) );
		_digits[4].setNo(_getKeta2(ss) );
		_digits[5].setNo(_getKeta1(ss) );
		
		
		
		_renderer.render(_scene, _camera);
	}
	
	private function _getKeta1(n:Int):Int {
		return n % 10;
	}
	private function _getKeta2(n:Int):Int {
		return Math.floor(n / 10);
	}
	
	
	function _onResize(object) 
	{
		
		if (_camera != null) {
			//_camera.kill();
		}
		
		_camera.aspect = Browser.window.innerWidth / Browser.window.innerHeight;
		_camera.updateProjectionMatrix();
		_renderer.setSize(Browser.window.innerWidth, Browser.window.innerHeight);	
		
	}
	
	
	
}