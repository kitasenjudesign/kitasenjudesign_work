package ;

import haxe.Timer;
import js.Browser;
//import js.Stats;
import three.CanvasRenderer;
import three.BoxGeometry;
import three.Line;
import three.Mesh;
import three.MeshBasicMaterial;
import three.OrthographicCamera;
import three.PerspectiveCamera;
import three.Scene;
import three.Shape;
import three.ShapeGeometry;
import three.Vector3;
import three.WebGLRenderer;
import physijs.PScene;

/**
 * ...
 * @author watanabe
 */

class Test3d 
{	
	private var _scene:PScene;
	private var _camera:PerspectiveCamera;
	private var _renderer:WebGLRenderer;
	private var _mouseX:Float = 0;
	private var _mouseY:Float = 0;
	private var _amp:Float = 1300;
	private var _yy:Float = 400;
	private var _rad:Float = 0;
	//private var _stats:Stats;
	private var _down:Bool = false;
	
	private var _focalLength:Float = 100;
	private var _frameSize:Float = 500;
	
	public function new() {

	}
	
	public function init():Void
	{
		
		_renderer = new WebGLRenderer( {antialias:true});
		_renderer.shadowMapType = Three.PCFSoftShadowMap;
		
		_scene = new PScene();
		_scene.setGravity(new Vector3( 0, -1300, 0 ));
		untyped _scene.addEventListener(
			'update',
			function(e):Void {
				_scene.simulate( null, 1 );
			}
		);
		
        _camera = new PerspectiveCamera(40, Browser.window.innerWidth / Browser.window.innerHeight, 10, 4000);
		_camera.near = 10;
		_camera.far = 4000;
		
		_renderer.setClearColorHex(0, 1);
        _renderer.setSize(Browser.window.innerWidth, Browser.window.innerHeight);
		Browser.document.body.appendChild(_renderer.domElement);
	
		/*
		_stats = new Stats();
		_stats.domElement.style.position = "absolute";
		_stats.domElement.style.zIndex = "10000";
		_stats.domElement.style.left = "0px";
		_stats.domElement.style.top = "0px";
		Browser.document.body.appendChild(_stats.domElement);
			*/
		_renderer.domElement.addEventListener("mousedown", _onMouseDown, false);
		_renderer.domElement.addEventListener("mouseup", _onMouseUp, false);
		_renderer.domElement.addEventListener("mousemove", _onMouseMove, false);		
		_renderer.domElement.addEventListener("touchstart", _onMouseDown, false);
		_renderer.domElement.addEventListener("touchend", _onMouseUp, false);
		_renderer.domElement.addEventListener("touchmove", _onMouseMove, false);
		
		_run();
		_scene.simulate();
		
		Browser.document.onmousewheel = function(e) {
			_amp += e.wheelDelta;
			if (_amp < 200)_amp = 200;
			if (_amp > 2000)_amp = 2000;
		}
					
		Browser.window.onresize = _onResize;
		_onResize(null);
		
		//gui
		/*
		var gui:Dynamic = untyped __js__("new dat.GUI({ autoPlace: false })");
		gui.add(this, "_amp", 100, 20000).listen();
		gui.add(this, "_focalLength",	100, 30000).onChange( _onChangeFocal );
		gui.add(this, "_frameSize",		100, 10000).onChange( _onChangeFocal );
		gui.close();
		
		gui.domElement.style.position = "absolute";
		gui.domElement.style.right = "0px";
		gui.domElement.style.top = "0px";
		gui.domElement.style.zIndex = "100000";
		Browser.document.body.appendChild(gui.domElement);
		*/
	}
	
	private function _onChangeFocal():Void
	{
		//_camera.setLens(_focalLength, _frameSize);
	}
	
	private function _onMouseDown(e):Void {
		_down = true;
	}
	private function _onMouseUp(e):Void {
		_down = false;
	}
	private function _onMouseMove(event):Void {
		
		var xx:Float = 0;
		var yy:Float = 0;
		if (event.type == "touchmove") {
			event.preventDefault();
			var touch = event.touches[0];
			if ( event.touches.length <= 1) {
				xx = touch.pageX;
				yy = touch.pageY;
			}
		}else{
			xx = event.clientX;
			yy = event.clientY;
		}
		
		_mouseX = (xx - Browser.window.innerWidth / 2) / Browser.window.innerWidth;
		_mouseY = (yy - Browser.window.innerHeight / 2) / Browser.window.innerHeight;

	}
	
	
	
	private function _run():Void
	{
		//if (_stats != null)_stats.update();
		
		//if(_down){
			_rad = Math.PI / 2;// _mouseX * 2 * Math.PI + Math.PI / 2;
			_yy = 0;// _amp * _mouseY * 4;
		//}else{
			//_rad = Math.PI/2;
			//_yy = 0;
		//}
		_camera.position.x += (_amp * Math.cos(_rad) -_camera.position.x) / 4;
		_camera.position.y += ( (_yy ) - _camera.position.y ) / 4;
		_camera.position.z += (_amp * Math.sin(_rad) - _camera.position.z) / 4;
		
		
		/*
		_camera.position.x = 0;
		_camera.position.y = 0;
		_camera.position.z = _amp;
		*/
		
		_camera.lookAt(new Vector3(0, 0, 0));//
		_renderer.render(_scene, _camera);
		
		//Three.requestAnimationFrame( untyped _run);
		Timer.delay(_run, Math.floor(1000/35));
	}
	
	function _onResize(object) 
	{
		Browser.window.scrollTo(0, 0);
		_camera = new PerspectiveCamera(40, Browser.window.innerWidth / Browser.window.innerHeight, 12, 100000);
		_renderer.setClearColorHex(0, 1);
        _renderer.setSize(Browser.window.innerWidth, Browser.window.innerHeight);

	}
	
	
	
}