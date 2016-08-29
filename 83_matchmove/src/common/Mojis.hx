package common;
import objects.MyDAELoader;
import three.BoxGeometry;
import three.ExtrudeGeometry;
import three.Geometry;
import three.Matrix4;
import three.Mesh;
import three.MeshBasicMaterial;
import three.MeshPhongMaterial;
import three.Object3D;
import three.Plane;
import three.Shape;
import three.Texture;
import three.Vector3;

/**
 * ...
 * @author watanabe
 */
class Mojis extends Object3D
{
	private var _shape:FontShapeMaker;
	private var _callback:Void->Void;
	//private var _mesh:Mesh;
	private var _material:MeshPhongMaterial;
	private var _meshes:Array<Mesh>;
	private var _loader:MyDAELoader;
	private var _face:Mesh;
	var _rad:Float=0;
	
	public function new() 
	{
		super();
	}
	
	public function init(callback:Void->Void):Void {
		
		_callback = callback;
		
		_shape = new FontShapeMaker();
		_shape.init("AOTFProM4.json", _onInitA);
		
	}
	
	private function _onInitA():Void {
		//_onInit0();
		
		_loader = new MyDAELoader();
		_loader.load("dede_c4d.dae", _onInit0);
		
		
	}

	private function _onInit0():Void {
		
		var all:String = "北千住デザイン";
		// "は東京都足立区千住をベースに活動するデザイン集団です。";// 主にプログラミングを使った映像やグラフィックの研究・開発を行っています。そのほかホームページ制作・記事執筆・ロゴ制作・同人誌制作なども行っています。お問い合わせはツイッター@_nabeよりお願いたします。";
		//var all:String = "あけましておめでとうございます。今年もよろしくお願いします。";
		var list:Array<String> = [];
		var nn:Int = 8;
		for (i in 0...Math.floor( all.length / nn+1 )) {
			list.push(all.substr(i * nn, nn));
		}
		
		var space:Float = 200;
		var spaceY:Float = 250;
		
		var g:Geometry = new Geometry();
		
		for (i in 0...list.length) {
			var src:String = list[i];
			for(j in 0...src.length){
			
			var shapes:Array<Shape> = _shape.getShapes(src.substr(j,1), true);
			var geo:ExtrudeGeometry = new ExtrudeGeometry(shapes, { bevelEnabled:true, amount:50 } );
			
			var mat4:Matrix4 = new Matrix4();
			mat4.multiply( new Matrix4().makeScale(2, 2, 2) );
			var vv:Vector3 = 
				new Vector3( 
					(j * space - (nn - 1) / 2 * space)*0.5, 
					(- i * spaceY)*0.5, 
				0);
			mat4.multiply( new Matrix4().makeTranslation(vv.x,vv.y,vv.z));
			g.merge(geo, mat4);
			
			}
		}
		
		
		var p:Plane = new Plane(
			new Vector3( 0, 1, 0 ), 0.8 
		);
		
		_material = new MeshPhongMaterial( { color:0xffffff } );
		_material.clippingPlanes = [p];
		_material.clipShadows = true;
		
		_meshes = [];
		for(i in 0...4){
			var m:Mesh = new Mesh(g, _material);
			m.castShadow = true;
			var rr:Float = Math.random() * 0.1;
			m.scale.set(0.2 + rr, 0.2 + rr, 0.2 + rr);
			m.position.y += 60 * ( Math.random() - 0.5);
			//position.y = 100;
			add(m);
			_meshes.push(m);
		}
		
		_face = new Mesh(_loader.geometry, _material);
		_face.scale.set(70, 70, 70);
		_face.position.y = 30;
		_face.castShadow = true;
		add(_face);

		
		/*
		var cube:Mesh = new Mesh(
			new BoxGeometry(400, 50, 50), 
			new MeshBasicMaterial( { color:0xffffff, wireframe:true,clippingPlanes:[p] } )
		);
		add(cube);*/
		
		if (_callback != null) {
			_callback();
		}
		
	}
	
	/**
	 * 
	 * @param	texture
	 */
	public function setEnvMap(texture:Texture) 
	{
		_material.envMap = texture;
	}
	
	public function update() 
	{
		if(_face!=null){
			_face.rotation.x += 0.01;
			_face.rotation.y += 0.012;
			_face.rotation.z += 0.013;
			_face.position.y = 120 * Math.sin(_rad) - 20;
			_rad += 0.01;
		}
		
		for(i in 0..._meshes.length){
			_meshes[i].rotation.x += 0.003*(i+1); 
			_meshes[i].rotation.y += 0.008*(i+1);
			_meshes[i].rotation.z += 0.011 * (i + 1);
			_face.position.y = 100 * Math.sin(_rad + Math.PI / 2) + i * 10;
		}
		
		//cube.rotation.x += 0.016;

	}
		
	
	
}