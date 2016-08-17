package;
import jp.nabe.utils.MyBitmapData;
import tween.TweenMax;

/**
 * ...
 * @author nabe
 */
class Img
{
	public var th_hensa:Float = 15;
	public var th_end_size:Int = 8;
	//public var out:MyBitmapData;
	private var _src:MyBitmapData;
	private var _callback:Int->Int->Int->Int->Int->Void;
	public var counter:Int = 0;
	
	public function new(b:MyBitmapData,callback:Int->Int->Int->Int->Int->Void) 
	{
		_callback = callback;
		_src = b;
		//out = b.clone();
	}
	

	/**
	 * 
	 * @param	x　始点x
	 * @param	y　始点y
	 * @param	w　幅
	 * @param	h　高さ
	 * @param	delay 重くならないようにdelay
	 */
	public function split(
		x:Int, y:Int, w:Int, h:Int, delay:Float = 0
	):Void {
		//重くならないようにdelay
		TweenMax.delayedCall(delay, _split, [x, y, w, h]);
		//_split(x,y,w,h);
	}
	
	public function reset() 
	{
		counter = 0;
		TweenMax.killAll();
	}
		
		
		private function _split(x:Int,y:Int,w:Int,h:Int):Void{
			
			//この領域の偏差の平均を計算する
			var hensa:Float = _getHensa( x, y, w, h);
			counter--;
			
			if (hensa < th_hensa ||  w <= th_end_size || h <= th_end_size ) {
				//hensaが小さいか、面積が小さいと色を塗って再帰的呼び出し終了
				var col:Float = _getHeikinColor(x, y, w, h);
				
				//trace("count" + counter);
				//out.fillRect(new Rectangle(x, y, w, h), 0xff000000 + col);
				//外部関数化する
				_callback(x, y, w, h, Math.floor( col ));
				return;
				
			}else{
				//4つに分割、再帰的な呼び出し
				var ww:Int = cast w / 2;
				var hh:Int = cast h / 2;
				
				counter += 4;
				
				if (counter < 10) {
					split(x, y, ww, hh);
					split(x + ww, y, ww, hh);
					split(x, y + hh, ww, hh);
					split(x + ww, y + hh, ww, hh);
					
				}else{
					split(x, y, ww, hh, Math.random()*1);
					split(x+ww, y, ww, hh, Math.random()*1);
					split(x, y+hh, ww, hh, Math.random()*1);
					split(x + ww, y + hh, ww, hh, Math.random()*1);
				}
				
				/*
				if (Math.random() < 0.5) {
					split(x, y, ww, hh*2, Math.random());
					split(x+ww, y, ww, hh*2, Math.random());					
				}else {
					split(x, y, ww*2, hh, Math.random());
					split(x, y+hh, ww*2, hh, Math.random());					
				}*/
				
			}
				
		}
		
		//平均のrgb色をとる
		private function _getHeikinColor( x:Int, y:Int, w:Int, h:Int):Float {
			
			var sumR:Float = 0;
			var sumG:Float = 0;
			var sumB:Float = 0;
			for (i in  0...w) {
				for ( j in 0...h ) {
					var rgb:Int = _src.getPixel(x+i, y+j);
					var rr:Int = rgb >> 16 & 0xFF;
					var gg:Int = rgb >> 8 & 0xFF;
					var bb:Int = rgb & 0xFF;
					sumR += rr/(w*h);
					sumG += gg/(w*h);
					sumB += bb/(w*h);
				}
			}
			
			return (Math.floor(sumR) << 16 | Math.floor(sumG) << 8 | Math.floor(sumB));
		}		
		
		//輝度の偏差の平均を取得
		private function _getHensa( x:Int, y:Int, w:Int, h:Int):Float {
			
			var heikin:Float = _getHeikin( x, y, w, h);
			var sub:Float = 0;
			for (i in  0...w) {
				for ( j in 0...h ) {
					var rgb:Int = _src.getPixel(x+i, y+j);
					var rr:Int = rgb >> 16 & 0xFF;
					var gg:Int = rgb >> 8 & 0xFF;
					var bb:Int = rgb & 0xFF;
					var col:Float = (rr + bb + gg) / 3;
					sub += Math.abs( heikin - col );
				}
			}		
			
			return sub/(w*h);
		}
		
		//平均の輝度を取得
		private function _getHeikin(x:Int, y:Int, w:Int, h:Int):Float {
			
			var sum:Float = 0;
			for (i in  0...w) {
				for ( j in 0...h ) {
					var rgb:Int = _src.getPixel(x+i, y+j);
					var rr:Int = rgb >> 16 & 0xFF;
					var gg:Int = rgb >> 8 & 0xFF;
					var bb:Int = rgb & 0xFF;
					sum += (rr + gg + bb) / 3;
				}
			}
			return sum/(w*h);
		}		
}
