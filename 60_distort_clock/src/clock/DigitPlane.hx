package clock;
import haxe.Constraints.FlatEnum;
import three.ImageUtils;
import three.Mesh;
import three.MeshBasicMaterial;
import three.Object3D;
import three.Plane;
import three.PlaneBufferGeometry;
import three.PlaneGeometry;
import three.Texture;
import three.Vector3;
import three.Vertex;
import tween.TweenMax;

/**
 * 233333
 * @author nabe
 */
class DigitPlane extends Object3D
{
	private var _mesh1:Mesh;
	private var _mesh2:Mesh;
	private var _tgtR:Float = 0;
	private var _ww:Float = 0.055;
	public var offsetRot:Float = 0;
	public var rx:Float = 0;
	public  var SEGX:Int = 20;
	public  var SEGY:Int = 14;
	
	public function new() 
	{
		super();
	}
	
	
	//yugamaseru
	public function init(xx:Float):Void {
		
		rx = xx;
		
		var g:PlaneGeometry = new PlaneGeometry(2000, 500, SEGX, SEGY);
	
		var m1:MeshBasicMaterial = DigitManager.digitMaterialsA[0];
		_mesh1 = new Mesh(cast g, m1);
		_mesh1.frustumCulled = false;
		add(_mesh1);
		
		var m2:MeshBasicMaterial = DigitManager.digitMaterialsB[0];//_getMaterial(tt);
		_mesh2 = new Mesh(cast g, m2);
		_mesh2.frustumCulled = false;

		add(_mesh2);
			
	}
	
	/**
	 * 
	 * @param	r
	 */
	public function update(r:Float):Void {
		
		r += rx;
		r = r % 1;
		r = 0.05 + r * 0.9;
		
		_mesh1.geometry.verticesNeedUpdate = true;//これを忘れずに書く
		offsetRot += (_tgtR - offsetRot) / 10;
		
		for ( i in 0...SEGX+1) {
			for (j in 0...SEGY + 1) {
				
				//(i,j)のvertexを得る
				var index:Int = j * (SEGX + 1) + i % (SEGX + 1);
				var vv:Vertex = _mesh1.geometry.vertices[index];
				
				var ratioX:Float = 1-i / SEGX;
				var ratioY:Float = 1-j / SEGY;
				
				//
				var vec:Vector3 = Jiku.getPos(
					r - (ratioX - 0.5) * _ww,
					(ratioY) * Math.PI,
					offsetRot
				);
				//trace(vec.x, vec.y, vec.z);
				
				//時間経過と頂点の位置によって波を作る
				//trace(vec);
				//vv.x = 300 * (Math.random() - 0.5);//vec.x;
				//vv.y = 300 * (Math.random() - 0.5);//vec.y;
				//vv.z = 300 * (Math.random() - 0.5);//vec.z;
				vv.x = vec.x;
				vv.y = vec.y;
				vv.z = vec.z;// 300 * (Math.random() - 0.5);// vec.z;
				
			}           
		}
		
	}
	
	public function tweenRot(ratio:Float,tgtR:Float):Void {
		
		TweenMax.to(this, 0.3, {
			delay:ratio*0.2,
			_tgtR:tgtR+_tgtR
			//_tgtR += tgtR;
		});
		
	}
	
	
	public function setNo(idx:Int):Void
	{
		_mesh1.material = DigitManager.digitMaterialsA[idx];
		_mesh2.material = DigitManager.digitMaterialsB[idx];
	}
	

	
}