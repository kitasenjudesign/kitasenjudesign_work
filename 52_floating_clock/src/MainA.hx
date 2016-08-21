package ;

import clock.NumLetter;
import haxe.Timer;
import js.Browser;
import net.badimon.five3D.typography.Helvetica85Heavy;
import three.AmbientLight;
import three.CanvasRenderer;
import three.DirectionalLight;
import three.ExtrudeGeometry;
import three.Line;
import three.Mesh;
import three.MeshBasicMaterial;
import three.MeshLambertMaterial;
import three.OrthographicCamera;
import three.PerspectiveCamera;
import three.Scene;
import three.Shape;
import three.Vector3;
import three.WebGLRenderer;
import net.badimon.five3D.typography.DiamanteLightMed;
import net.badimon.five3D.typography.HelveticaMedium;
//import createjs.easeljs.Stage;
//import three.Path;
//import three.Shape;
//import three.ShapeGeometry;
//import flash.events.Event;

/**
 * ...
 * @author watanabe
 */

class MainA
{	
	private var _scene:Scene;
	private var _camera:OrthographicCamera;
	private var _renderer:WebGLRenderer;
	private var _mouseX:Float = 0;
	private var _mouseY:Float = 0;
	
	private var _downX:Float = 0;
	private var _downY:Float = 0;
	
	var _lines:Line;
	//var _digits:Array<NumLetter>;
	var _amp:Float=400;
	var _flag:Bool=true;
	var _oldSec:Int=0;
	var _rad:Float = 0;
	var _yy:Float = 100;
	var letters		:Array<Mesh>;
	var nletters	:Array<NumLetter>;
	var _isDown:Bool=false;
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

	
		_renderer = new WebGLRenderer( {
				antialias:false
		});
			
		
		//_renderer.autoClear = false;
		
		_scene = new Scene();
        //_camera = new PerspectiveCamera(isCanvas ? 30 : 60, Browser.window.innerWidth / Browser.window.innerHeight, 10, 50000);
		var ww:Float = Browser.window.innerWidth * 0.3;
		var hh:Float = Browser.window.innerHeight * 0.3;
		_camera = new OrthographicCamera(-ww, ww, hh, -hh, 10, 10000);
		//_camera.zoom = 2;
		_renderer.setClearColorHex(0x000000, 1);

		//_renderer.setClearColor(new Color(0xff), 1);
        _renderer.setSize(Browser.window.innerWidth, Browser.window.innerHeight);
        Browser.document.body.appendChild(_renderer.domElement);
		
	
		var points:Array<Array<Dynamic>> = MojiPoints.getPoints();
	

		var light:DirectionalLight = new DirectionalLight(0xffffff);
		light.position.x = 30;
		light.position.y = 10;
		light.position.z = 100;
		_scene.add(light);
		
		var light2:AmbientLight = new AmbientLight(0x111111);
		_scene.add(light2);
		
		var s:String = "0123456789";// "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		letters = [];
		for(i in 0...s.length){

			var shapes:Array<Shape> = [];
			var shape:Shape = new Shape();
			FontTest.getLetterPoints(shape, s.substr(i, 1), true, 1.5, new HelveticaMedium());
			//FontTest.getLetterPoints(shape, s.substr(i, 1), true, 1.5, new Helvetica85Heavy());
			
			//FontTest.getLetterPoints(shape, s.substr(i, 1), true, 1.6, new DiamanteLightMed());
			
			
			shapes.push(shape);
			var geo:ExtrudeGeometry = new ExtrudeGeometry(untyped shape, { amount:20,bevelEnabled:false } );
			//var geo:ShapeGeometry = new ShapeGeometry(untyped shapes,{});
			//var mesh:Mesh = new Mesh(geo, new MeshLambertMaterial( {color:0xffffff, side:Three.DoubleSide} ));
			var mesh:Mesh = new Mesh(geo, new MeshLambertMaterial( {/*wireframe:true,*/ color:0xffffff, side:Three.DoubleSide} ));
			//_scene.add(mesh);
			
			letters.push(mesh);

		}
		
		nletters = [];
		for (i in 0...6) {
			for(j in 0...5){
				var nLet:NumLetter = new NumLetter();
				nLet.init(letters);
				nLet.position.x = (i - 2.5) * 120;
				nLet.position.y = (j - 2) * 160;
				nletters.push(nLet);
				_scene.add(nLet);
			}
		}
		
		
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
		
		
		/*
		var cube:Mesh = new Mesh(new CubeGeometry(2000, 2000, 2000, 1, 1),new MeshBasicMaterial({wireframe:true,color:0x888888}));
		_scene.add(cube);
		*/
		
		_run();
		
		Browser.document.onmousewheel = function(e) {
			//_amp += e.wheelDelta*0.5;
			//if (_amp < 100)_amp = 100;
			//trace("WHEEL");
			_camera.zoom += e.wheelDelta*0.5;
		}
		
		Browser.window.onclick = function(e) {
			_flag = !_flag;
			//_change();
		}
		
		Browser.window.onresize = _onResize;
		//new JQuery( Browser.window ).resize(_onResize);
		_onResize(null);
		
		_tween();
	}
	
	function _tween() 
	{
		
		
				
		var date:Date = Date.now();
		var hh:Int = 		date.getHours();
		var mm:Int = 		date.getMinutes();
		var ss:Int = 		date.getSeconds();
		
		for(letter in nletters) {
			if (ss % 10 == 0) {
				letter.force(true);
			}else {
				letter.force(false);
			}
		}
		
		for(i in 0...nletters.length){
			nletters[i].setNo( Math.floor(Math.random()*10) );
			//nletters[1].setNo( _getKeta1(hh) );
			//nletters[2].setNo( _getKeta2(mm) );
			//nletters[3].setNo( _getKeta1(mm) );
			//nletters[4].setNo( _getKeta2(ss) );
			//nletters[5].setNo( _getKeta1(ss) );
		}
		Timer.delay(_tween, 1000);
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
		
		if(_flag){

			_rad = Math.PI/2;// _mouseX * 4 * Math.PI + Math.PI / 2;
			_yy = 0;// _amp * _mouseY * 2.2;
		
			
		_camera.position.x += (_amp * Math.cos(_rad) -_camera.position.x) / 4;
		_camera.position.y += ( (_yy ) - _camera.position.y ) / 4;
		_camera.position.z += (_amp * Math.sin(_rad) - _camera.position.z) / 4;
		_camera.lookAt(new Vector3(0, 0, 0));

		}
		
		
		for(letter in nletters) {
			letter.update();
		}
		
		
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
		
		//_camera = new PerspectiveCamera( isCanvas ? 30 : 60, Browser.window.innerWidth / Browser.window.innerHeight, 10, 50000);
		//_renderer.setSize(Browser.window.innerWidth, Browser.window.innerHeight);	
		
	}
	
	
	
}