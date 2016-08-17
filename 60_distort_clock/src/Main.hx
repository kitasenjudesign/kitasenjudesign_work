package ;

import camera.ExCamera;
import clock.DigitManager;
import clock.DigitPlanes;
import js.Browser;
import three.CanvasRenderer;
import three.Line;
import three.Object3D;
import three.Scene;
import three.WebGLRenderer;
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
	var _digits:Array<DigitPlanes>;
	var _amp:Float=400;
	var _flag:Bool=true;
	var _oldSec:Int=0;
	var _rad:Float = 0;
	var _yy:Float = 100;
	
	var _planes:DigitPlanes;
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

		DigitManager.init();
		
		isCanvas = false;// !(untyped __js__("Detector.webgl"));
		if ( isCanvas  ) {
			//trace("web glない");
			_renderer = untyped new CanvasRenderer({antialias:false});
		}else {
			//trace("web glある");
			_renderer = new WebGLRenderer( {
				antialias:false
			});
			
		}
		//_renderer.autoClear = false;
		
		Jiku.init();
		
		_scene = new Scene();
        _camera = new ExCamera( 30, Browser.window.innerWidth / Browser.window.innerHeight, 10, 50000);
		_camera.init(_renderer.domElement);
		//_renderer.setClearColorHex(0, 1);

		//_renderer.setClearColor(new Color(0xff), 1);
        _renderer.setSize(Browser.window.innerWidth, Browser.window.innerHeight);
        Browser.document.body.appendChild(_renderer.domElement);
		
		
		var obj:Object3D = new Object3D();
		_scene.add(obj);
		Jiku.obj = obj;
		
		_planes = new DigitPlanes();
		_planes.init();
		_scene.add(_planes);

		/*
		var p:DigitPlane = new DigitPlane(3);
		p.init();
		_scene.add(p);
		*/
			
		
		_run();
		
		
		Browser.window.onresize = _onResize;
		_onResize(null);
		//_renderer.setSize(Browser.window.innerWidth, Browser.window.innerHeight);	

	}
	
	
	
	private function _run():Void
	{
		Three.requestAnimationFrame( untyped _run);
		
		Jiku.update(_camera._mouseX/Browser.window.innerWidth, _camera._mouseY/Browser.window.innerHeight);
		
		_planes.update();
			
		if (_camera != null) {
			_camera.update();
		}
			
		_renderer.render(_scene, _camera);
		//Timer.delay( _run, Math.floor(1000 / 60) );
	}
	
	
	
	function _onResize(object) 
	{
		if (_camera != null) {
			//_camera.kill();
		}
		
		//_camera.aspect = Browser.window.innerWidth / Browser.window.innerHeight;
		//_camera = new ExCamera( isCanvas ? 30 : 60, Browser.window.innerWidth / Browser.window.innerHeight, 10, 50000);
		_renderer.setSize(Browser.window.innerWidth, Browser.window.innerHeight);	
		//_camera.updateProjectionMatrix();
		_camera.resize();
	}
	
	
	
}