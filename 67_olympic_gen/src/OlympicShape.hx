package;
import createjs.easeljs.Graphics;

/**
 * ...
 * @author nabe
 */
class OlympicShape
{

	public function new() 
	{
		
	}
	
	
	/**
	 * 
	 * @param	gg
	 * @param	r
	 * @param	g
	 * @param	b
	 * @param	x
	 * @param	y
	 * @param	w
	 * @param	h
	 */
	static public function draw(gg:Graphics, r:Int, g:Int, b:Int, x:Float, y:Float, w:Float, h:Float):Void
	{
		
		var nn:Int = Math.floor( (r + g + b) / 3 );
		var n:Int = nn % 16;
		
		
		if(n==0){
			gg.beginFill( Graphics.getRGB(0x36, 0x36, 0x36) );
			gg.drawRect(x, y, w, h);
			
		}else if (n==1) {
			//#B49146 gold
			gg.beginFill( Graphics.getRGB(0xB4, 0x91, 0x46) );
			_drawHanen(gg,x,y,w,h);
			//gg.drawCircle(x + w / 2, y + h / 2, w / 2);// , h);
			
		}else if (n==2) {
			//b4b4b4 silver
			gg.beginFill( Graphics.getRGB(0xb4, 0xb4, 0xb4) );
			_drawHanen(gg,x,y,w,h);
			
		}else if (n==3) {
			//#E50113
			gg.beginFill( Graphics.getRGB(0xE5, 0x01, 0x13) );
			gg.drawCircle(x + w / 2, y + h / 2, w / 2);// , h);
			
		}else {
			
			if(nn<60){
				gg.beginFill( Graphics.getRGB(0x36, 0x36, 0x36) );
				gg.drawRect(x, y, w, h);
			
			}else if (nn<120) {
				//#B49146 gold
				gg.beginFill( Graphics.getRGB(0xB4, 0x91, 0x46) );
				_drawHanen(gg,x,y,w,h);
				//gg.drawCircle(x + w / 2, y + h / 2, w / 2);// , h);
				
			}else if (nn<=180) {
				//b4b4b4 silver
				gg.beginFill( Graphics.getRGB(0xb4, 0xb4, 0xb4) );
				_drawHanen(gg,x,y,w,h);
				
			}else if(nn<=230){
				//#E50113
				gg.beginFill( Graphics.getRGB(0xE5, 0x01, 0x13) );
				gg.drawCircle(x + w / 2, y + h / 2, w / 2);// , h);		
				
			}
			
		}
		
		
		gg.endFill();
		
	}
	
	static private function _drawHanen(gg:Graphics, x:Float, y:Float, w:Float, h:Float):Void
	{
		var rr:Float = 0.7;
		var ran:Float = Math.random();
		
		if(ran<0.25){
			_drawHanen1(
				gg, 
				x, y,
				x, y + h,
				x+w, y,
				x,y, w, h, rr
			);
		}else if(ran<0.5){
			_drawHanen1(
				gg, 
				x+w, y+h,
				x+w, y,
				x, y+h,
				x,y, w, h, rr
			);
		}else if (ran < 0.75) {
			
			_drawHanen1(
				gg, 
				x+w, y,
				x, y,
				x+w, y+h,
				x,y, w, h, rr
			);
		
		}else{
			
			_drawHanen1(
				gg, 
				x, y+h,
				x+w, y+h,
				x, y,
				x,y, w, h, rr
			);
		}
			
		//}else {
		//	
		///}
		
	}
	
	//左上
	static private function _drawHanen1(
		gg:Graphics, 
		x1:Float, y1:Float, 
		x2:Float, y2:Float, 
		x3:Float, y3:Float,
		x:Float,y:Float,		
		w:Float, h:Float, rr:Float
	):Void
	{
		/*
		var x1:Float = x;
		var y1:Float = y;
		
		var x2:Float = x;
		var y2:Float = y + h;
		
		var x3:Float = x + w;
		var y3:Float = y;
		*/
		
		gg.moveTo(x1, y1);
		gg.lineTo(x2, y2);
		
		var r:Float = rr;
		var xx:Float = r * x1 + (1 - r) * (x + w / 2);
		var yy:Float = r * y1 + (1 - r) * (y + w / 2);
		
		gg.quadraticCurveTo( xx, yy, x3, y3);
		//gg.lineTo(x + w, y);
		gg.lineTo(x1, y1);
		
	}
	
	
	
	
	
	
	
}