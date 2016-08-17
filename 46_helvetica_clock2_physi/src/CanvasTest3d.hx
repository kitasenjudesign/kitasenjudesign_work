package ;

	import haxe.Timer;
	import three.AmbientLight;
	import three.BoxGeometry;
	import three.DirectionalLight;
	import three.ExtrudeGeometry;
	import three.Material;
	import three.Mesh;
	import three.MeshBasicMaterial;
	import three.MeshLambertMaterial;
	import three.PlaneGeometry;
	import three.PointLight;
	import three.Shape;
	import three.SpotLight;
	import three.SpotLightHelper;
	import net.badimon.five3D.typography.HelveticaMedium;
	import physijs.BoxMesh;
	import physijs.Physijs;

/**
 * ...
 * @author nab
 */
class CanvasTest3d extends Test3d
{

	private var _factory:FontFactory;
	private var _mate:MeshLambertMaterial;
	private var _meshes:Array<BoxMesh>;
	private var _count:Int = 0;
	
	public function new() 
	{
		super();
	}
	
	override public function init():Void
	{
		super.init();			
		
		_meshes = [];
		
		var geo:PlaneGeometry = new PlaneGeometry(2000, 2000, 10, 10);
		var m:MeshBasicMaterial = new MeshBasicMaterial( { color:0xffffff, wireframe:true } );
		
		var mate:Material = Physijs.createMaterial(
			new MeshBasicMaterial({ color:0xff0000,wireframe:true }),
			.8, // high friction
			.1 // low restitution
		);
		
		var m:BoxMesh = new BoxMesh(
			new BoxGeometry(1000, 20, 60),
			mate,
			0 // mass
		);
		m.position.y = -100;
		m.visible = false;
		_scene.add( m );	
		
		
		_mate = Physijs.createMaterial(
			new MeshLambertMaterial({ color:0xffffff,shading:Three.FlatShading }),
			.6,//.9, // high friction
			.2//.9 // low restitution
		);
		
		
		_factory = new FontFactory();
		_factory.init();
		
		_startClock();
		
		
		
		//var d:DirectionalLight = new DirectionalLight(0xffffff, 1);
		//var d:PointLight = new PointLight( 0xffffff,2,1000 );
		var d:SpotLight = new SpotLight(0xffffff, 2, 7000);
		d.angle = Math.PI / 7;
		//var helper:SpotLightHelper=new SpotLightHelper(
		d.position.y = 0;
		d.position.z = 3500;
		_scene.add(d);
		
		/*
		var am:AmbientLight = new AmbientLight(0x888888);
		_scene.add(am);
		*/
	}
	
	private function _startClock():Void
	{

		var s:String = DateString.getString();
		
		var count:Int = 0;
		for (m in _meshes) {
			if ( m.position.y > 900 ) {
				count++;
			}
		}
		if (count >= 6) {
			//
			_remove();
			Timer.delay( _startClock, 1000 );
			return;
		}
		
		var space:Float = 180;
		for(i in 0...s.length){
			
			var b:BoxMesh = new BoxMesh( _factory.map.get(s.substr(i, 1)), _mate, 300 );
			b.position.x = space * i - (s.length - 1) * space / 2 + 4 * (Math.random() - 0.5);
			b.position.y = _count==0 ? 600 : 1200;
			b.position.z = 30 * (Math.random() - .5);

			if (i == 1) {
				b.rotation.x = 0.2 * (Math.random() - 0.5);
				b.rotation.y = 0.2 * (Math.random() - 0.5);
				b.rotation.z = 0.2 * (Math.random() - 0.5);				
			}else if(i>1){
				b.rotation.x = 0.1 * (Math.random() - 0.5);
				b.rotation.y = 0.1 * (Math.random() - 0.5);
				b.rotation.z = 0.1 * (Math.random() - 0.5);
			}
			
			_scene.add(b);
			_meshes.push(b);
		}

		_remove();
		_count++;
		Timer.delay(_startClock, 1000);
		
	}
	
	
	private function _remove() 
	{
		//trace("削除開始 length=" + _meshes.length);
		var n:Int = 0;
		for (i in 0..._meshes.length) {
			var m:BoxMesh = _meshes[n];
			
			if (m.position.y < -400) {
				_scene.remove(m);
				_meshes.remove(m);
				n -= 1;
				//trace("削除 len=" + _meshes.length);
			}
			n++;
			
		}		
	}
	
	
	override private function _run():Void {
	
		super._run();
		
	}

	
	
}