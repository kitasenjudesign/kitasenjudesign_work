package clock;
import three.Mesh;
import three.MeshBasicMaterial;
import three.PlaneGeometry;

/**
 * ...
 * @author nabe
 */
class KoronPlane extends DigitPlane
{

	public function new() 
	{
		super();
	}
	
	override	public function init(xx:Float):Void {
		
			_ww = 0.055 / 4;
			rx = xx;
			
			var g:PlaneGeometry = new PlaneGeometry(2000, 500/4, SEGX, SEGY);
		
			var m1:MeshBasicMaterial = DigitManager.koronA;
			_mesh1 = new Mesh(cast g, m1);
			_mesh1.frustumCulled = false;
			add(_mesh1);
			
			var m2:MeshBasicMaterial = DigitManager.koronB;
			_mesh2 = new Mesh(cast g, m2);
			_mesh2.frustumCulled = false;

			add(_mesh2);
			
		}
		
			
		override public function setNo(idx:Int):Void
		{
			//_mesh1.material = DigitManager.digitMaterialsA[idx];
			//_mesh2.material = DigitManager.digitMaterialsB[idx];
		}
		
	
	
}