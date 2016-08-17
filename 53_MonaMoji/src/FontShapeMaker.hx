package ;

import createjs.easeljs.Graphics;
import js.Browser;
import net.badimon.five3D.typography.GenTypography3D;
/*
import three.ExtrudeGeometry;
import three.Geometry;
import three.Mesh;
import three.Path;
import three.Shape;
import three.ShapeGeometry;
*/

/**
 * ...
 * @author nab
 */

//@:expose("FontShapeMaker")
class FontShapeMaker
{

	//public static var src:Map<String, ShapeGeometry>;
	public var font:GenTypography3D;
	#if debug
	//private static var _test3d:Test3d;
	#end
	
	static function main() 
	{
		new FontShapeMaker();
	}
	
	public function new() {
		//Browser.window.onload = _test;
	}

	
		
	
	
	
	
	
	
	
	
	
	
	public function init(json:String,callback:Void->Void):Void {
		
		//src = new Map();
		font = new GenTypography3D();
		if(callback==null){
			font.initByString(json);
		}else {
			font.init(json,callback);//url
		}
	}
	

	public function getWidth(moji:String):Float {
		return font.getWidth(moji);
	}
	
	public function getHeight():Float {
		return font.getHeight();
	}
	
	
	public function getShapes(
		g:Graphics,
		moji:String,
		isCentering:Bool = false,
		scale:Float = 1,
		ox:Float = 0,
		oy:Float = 0
	):Void {

			var motif:Array<Dynamic> = font.motifs.get(moji);
			var s:Float = scale;
			
			if (isCentering) {
				ox += -font.widths.get(moji) / 2;
				oy += -font.height / 2;
			}
			
			var len:Int = motif.length;
			
			for (i in 0...len) {
				
				var tgt:String = motif[i][0];
				if (tgt == "M" || tgt=="H") {
					g.moveTo(s * (motif[i][1][0]) + ox, s * (motif[i][1][1]) + oy);
					
				}else if( tgt=="L" ){
					g.lineTo(s * (motif[i][1][0]) + ox, s * (motif[i][1][1]) + oy);
					
				}else if (tgt == "C") {
					
					g.quadraticCurveTo(
						s * (motif[i][1][0]) + ox,
						s * (motif[i][1][1]) + oy,
						s * (motif[i][1][2]) + ox,
						s * (motif[i][1][3]) + oy
					);
					
				}
			}
			
			
			//return shapes;
			
		}
	
}