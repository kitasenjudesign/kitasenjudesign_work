package ;

import camera.ExCamera;
import common.Dat;
import common.Mojis;
import common.SkyboxTexture;
import haxe.Http;
import js.Browser;
import sound.MyAudio;
import three.AmbientLight;
import three.BoxGeometry;
import three.Color;
import three.ImageUtils;
import three.Mesh;
import three.MeshPhongMaterial;
import three.PlaneGeometry;
import three.Scene;
import three.ShadowMaterial;
import three.SpotLight;
import three.WebGLRenderer;
import video.VideoPlayer;
/**
 * ...
 * @author nabe
 */

class Main3d
{
	
	public static  var W:Int = 960;// 1280;
	public static  var H:Int = 540;// 768;// 1920;

	private var _scene		:Scene;
	private var _camera		:ExCamera;
	private var _renderer	:WebGLRenderer;
	private var _audio:MyAudio;
	private var _frame:Int = 0;
	private var _skyboxMat:SkyboxTexture;
	private var _shape:FontShapeMaker;
	//private var _fov:Float = 34.2;// 3.235;
	private var _video:VideoPlayer;
	var cube:Mesh;
	var cubes:Array<Mesh>;
	var http:Http;
	var _ground:Mesh;
	var _mojis:Mojis;
	///loader wo kaku
	//loader
	
	public function new() 
	{
		
	}
	
	public function init() 
	{
		Dat.init();
		//_audio = new MyAudio();
		//_audio.init(_onInit0);
		_mojis = new Mojis();
		_mojis.init(_onInit0);
	}
	
	private function _onInit0():Void
	{
		_camera = new ExCamera(33.235, W / H, 10, 10000);
		_camera.amp = 1000;		
		_scene = new Scene();
		
		_video = new VideoPlayer();
		_video.init(_scene, _camera,_onInit2);
	}
	
	
	
	private function _onInit2():Void{
	
			_scene.add(_mojis);
			
		_scene.add(_video);
		_renderer = new WebGLRenderer({
			/*preserveDrawingBuffer: true,*/ 
			alpha:true,
			antialias:true, 
			devicePixelRatio:1	
		});
		//_renderer.shadowMapEnabled = true;
		untyped _renderer.localClippingEnabled = true;
		untyped _renderer.shadowMap.enabled = true;
		untyped _renderer.shadowMap.type = untyped __js__("THREE.BasicShadowMap");
		
		_renderer.setClearColor(new Color(0x000000),0);
		_renderer.setSize(W, H);
		_renderer.domElement.style.position = "absolute";
		_renderer.domElement.style.zIndex = "100";
		
		_camera.init(_renderer.domElement);	
        Browser.document.body.appendChild(_renderer.domElement);
	
		//var light:DirectionalLight = new DirectionalLight(0xffffff);
		var light = new SpotLight( 0xffffff, 1.5 );
		//light.position.x = 10*(Math.random()-0.5);
		light.position.x = 300;
		light.position.y = 2000;
		light.position.z = 100;
		
		light.castShadow = true;
		untyped __js__("
			light.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera( 30, 1, 200, 2000 ) );
			light.shadow.bias = -0.000222;
			light.shadow.mapSize.width = 1024;
			light.shadow.mapSize.height = 1024;		
		");
		_scene.add(light);
		
		
		var a:AmbientLight = new AmbientLight(0x333333);
		_scene.add(a);
		
		
		_skyboxMat = new SkyboxTexture();
		_skyboxMat.init(ImageUtils.loadTexture("mae_face.jpg"));
		_skyboxMat.update(_renderer);

		_video.setInitCallback(_updateTexture);
		_updateTexture();
		
		cube = new Mesh(
			new BoxGeometry(150, 150, 150,5,5, 5),
			new MeshPhongMaterial( { 
					color:0xffffff,
					side:Three.DoubleSide,	
					refractionRatio: 0.98,
					reflectivity: 1
			} )
		);
		cube.material.needsUpdate = true;
		
		//cube.castShadow = true;
		cube.position.x = 0;
		cube.position.y = 150;
		//_scene.add(cube);		

		var mm:ShadowMaterial = new ShadowMaterial();
		mm.opacity = 0.3;
		//var mm:MeshBasicMaterial = new MeshBasicMaterial( { color:0xcccccc,side:Three.DoubleSide } );
		//mm.opacity = 0.5;
		_ground = new Mesh(
			new PlaneGeometry(500, 500, 5, 5),
			mm
		);
		_ground.receiveShadow = true;
		_ground.rotation.x = -Math.PI / 2;
		_scene.add(_ground);
				
		//var axis:AxisHelper = new AxisHelper(100);   
		//_scene.add(axis);
		
		
		Dat.gui.add(this, "_frame", 0, 300).onChange(_update);
		//Dat.gui.add(this, "_fov", 10, 100).step(0.1).onFinishChange(_onResize);
		Dat.gui.add(_camera.rotation, "x").name("rotX").listen();
		Dat.gui.add(_camera.rotation, "y").name("rotY").listen();
		Dat.gui.add(_camera.rotation, "z").name("rotZ").listen();
		Dat.gui.add(_camera.position, "x").name("posX").listen();
		Dat.gui.add(_camera.position, "y").name("posY").listen();
		Dat.gui.add(_camera.position, "z").name("posZ").listen();
		Dat.gui.add(this, "_updateTexture");
		
		Browser.window.onresize = _onResize;
		_onResize(null);
		
		_run(true);
		
	}
	
	public function _updateTexture():Void {
		
		_skyboxMat.init(_video.getTexture());
		
	}
	
	function _update() 
	{
		_run(false);
	}
	
	
	
	private function _onResize(d:Dynamic):Void
	{
		//trace("set " + _fov);
		W = Browser.window.innerWidth;
		H = Math.floor(W * 9 / 16);//540;// Browser.window.innerHeight;
		var oy:Float = (- (H - Browser.window.innerHeight) / 2);
		_renderer.domElement.width = W;// + "px";
		_renderer.domElement.height = H;// + "px";	
		_renderer.domElement.style.top = oy+"px";
		_renderer.setSize(W, H);
		//_camera.setFOV(_fov);
		_camera.aspect = W / H;// , 10, 50000);
		_camera.updateProjectionMatrix();
		_video.resize(W, H, oy);
	}
	
	
	
	private function _run(loop:Bool=false):Void
	{

		_skyboxMat.update(_renderer);
		
		//untyped cube.material.map = _skyboxMat.getTexture();
		untyped cube.material.envMap = _skyboxMat.getTexture();
		_mojis.setEnvMap( _skyboxMat.getTexture() );
		//cube.material.needsUpdate = true;
		
		_video.update(_camera);
		if (!_video.getEnded()) {
			_mojis.update();
		}
		
		//cube.rotation.y += 0.016;
		//cube.rotation.z += 0.016;
		//cube.position.y = 150;// + 100 * (Math.sin(_rad * 0.8));
		
		//if(_audio != null && _audio.isStart) {
		//	_audio.update();
		//}
		
		//_camera.lookAt(new Vector3());
		
		
		
		
		_renderer.render(_scene, _camera);
		//_pp.render();
		
		//Timer.delay(_run, Math.floor(1000 / 30));
		if(loop)Three.requestAnimationFrame( untyped _run);
		
	}	
	
	private function fullscreen() 
	{
		_renderer.domElement.requestFullscreen();
	}
	
	
}