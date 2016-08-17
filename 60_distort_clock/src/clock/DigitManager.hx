package clock;
import three.ImageUtils;
import three.MeshBasicMaterial;
import three.Texture;

/**
 * ...
 * @author nabe
 */
class DigitManager
{

	
	public static var digitMaterialsA:Array<MeshBasicMaterial>;
	public static var digitMaterialsB:Array<MeshBasicMaterial>;

	public static var koronA:MeshBasicMaterial;
	public static var koronB:MeshBasicMaterial;

	public static var textures:Array<Texture>;
	
	public function new() 
	{
		
	}
	
	/**
	 * 
	 */
	public static function init():Void {
		
		
		textures = [];
		for (i in 0...10) {
			var tt:Texture = ImageUtils.loadTexture("./helv/w" + i + ".png");
			tt.magFilter = Three.NearestFilter;
			textures.push(tt);
		}
		
		
		digitMaterialsA = [];		
		for(i in 0...10){
			var m:MeshBasicMaterial = _getMaterial(textures[i]);
			digitMaterialsA.push(m);
		}
		
		digitMaterialsB = [];
		for(i in 0...10){
			var m2:MeshBasicMaterial = _getMaterial(textures[i]);
			m2.side = Three.BackSide;
			m2.color.setHex(0x555555);
			digitMaterialsB.push(m2);
		}
		
		
		var tx:Texture = ImageUtils.loadTexture("./helv/wKoron.png");
		koronA = _getMaterial(tx);

		koronB = _getMaterial(tx);
		koronB.side = Three.BackSide;
		koronB.color.setHex(0x555555);
		
		
	}
	
	
	private static function _getMaterial(tt:Texture):MeshBasicMaterial
	{
		return new MeshBasicMaterial( {
			//color:0xffffff,
			alphaTest:0.5,
			transparent:true,
			map:tt,
			shading:Three.FlatShading
			//depthWrite:false,
			//depthTest:false
		});
	}

	
	
	
}