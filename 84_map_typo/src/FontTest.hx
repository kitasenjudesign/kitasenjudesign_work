package ;
import createjs.easeljs.Graphics;
import three.Path;
import three.Shape;
import net.badimon.five3D.typography.Typography3D;

/**
 * ...
 * @author nab
 */
class FontTest
{

	public function new() 
	{
		
	}

	public static function getLetterPoints(
		g:Graphics,
		moji:String,
		isCentering:Bool = false,
		scale:Float = 1,
		letter:Typography3D = null,
		oxx:Float = 0,
		oyy:Float = 0
	):Void {

			var minY:Float = 0;
			var maxY:Float = 0;
		
		
			var shape:Graphics = g;
			var motif:Array<Dynamic> = letter.motifs.get(moji);
			
			if (motif == null || motif.length == 0) return;
			
			
			var ox:Float = oxx;
			var oy:Float = oyy;
			var s:Float = scale;
			
			if (isCentering) {
				ox += -letter.widths.get(moji) / 2;
				oy += -letter.height / 2;
			}
			
			var len:Int = motif.length;
			var count:Int = 0;
			for (i in 0...len) {
				
				var tgt:String = motif[i][0];
				if (tgt == "M") {
					g.moveTo(s * (motif[i][1][0] + ox), s * (motif[i][1][1] + oy));
					minY = Math.min(minY, s * (motif[i][1][1] + oy));
					maxY = Math.max(maxY, s * (motif[i][1][1] + oy));
					count++;
					
				}else if( tgt=="L" ){
					g.lineTo(s * (motif[i][1][0] + ox), s * (motif[i][1][1] + oy));
					minY = Math.min(minY, s * (motif[i][1][1] + oy));
					maxY = Math.max(maxY, s * (motif[i][1][1] + oy));

				}else if (tgt == "C") {
					
					g.quadraticCurveTo(
						s * (motif[i][1][0] + ox),
						s * (motif[i][1][1] + oy),
						s * (motif[i][1][2] + ox),
						s * (motif[i][1][3] + oy)
					);
					minY = Math.min(minY, s * (motif[i][1][3] + oy));
					maxY = Math.max(maxY, s * (motif[i][1][3] + oy));

				}
			}
			
			trace("moji=" + moji +" height=" + (maxY - minY));
			
			
		}
	
}