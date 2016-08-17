package clock;
import haxe.Timer;
import three.BoxGeometry;
import three.Mesh;
import three.MeshBasicMaterial;
import three.Object3D;
import tween.easing.Cubic;
import tween.easing.Expo;
import tween.TweenMax;

/**
 * ...
 * @author nabe
 */
class DigitPlanes extends Object3D
{
	static public var MAX_KETA:Int = 9;

	private var _keta1:Int = -1;
	private var _sum:Float=0;
	private var _index:Int=0;
	private var _planes:Array<DigitPlane>;
	private var _offset:Float=0;
	private var _nums:Array<DigitPlane> = [];
	private var _corons:Array<DigitPlane> = [];
	
	public function new() 
	{		
		super();
	}
	
	public function init():Void {
		
		//var m:Mesh = new Mesh(new BoxGeometry(10, 10, 10), new MeshBasicMaterial( { color:0xff0000 } ));
		//add(m);
		
		//6x3=18
		//0...9
		_planes = [];
		
		
		for (i in 0...3) {
			
			var rr:Float = 0.33;
			var or:Float = i * 0.333;
			
			_createDigit(or+rr*0.10, false); 
			_createDigit(or+rr*0.24, false); 

			_createDigit(or+rr*0.33, true); 
			
			_createDigit(or+rr*0.42, false);
			_createDigit(or+rr*0.56, false);
			
			_createDigit(or+rr*0.65, true);
			
			_createDigit(or+rr*0.74, false);
			_createDigit(or+rr*0.88, false); 
			
		}
		
		
		/*
		for (i in 0...21) {
			
			var d:DigitPlane = (i%7==0) ? new EmptyPlane() : new DigitPlane();
			d.init(i / 21);//0-1;
			add(d);
			d.update(0);
			_planes.push(d);
			
		}
		*/
		
		//_calcTime();
		//_calcTime();
		
		_calcTime();
		_calcTime();
		_calcTime();
		
		updateTime();
	}
		

	private function _createDigit(r:Float,koron:Bool):Void {
		var d:DigitPlane = koron ? new KoronPlane() : new DigitPlane();
			d.init(r);//0-1;
			add(d);
			d.update(0);
			_planes.push(d);
			if (!koron)_nums.push(d);
			else _corons.push(d);
	}
	
	
	/**
	 * 
	 */
	public function updateTime():Void {
		
		_calcTime();
		
		TweenMax.to(this, 0.8, {
			_offset:_offset+1/3
		});// += 0.002;
		
		
		for (i in 0..._corons.length) {
			_corons[i].visible = false;
		}
		Timer.delay(_tenmetsu, 700);
		Timer.delay(updateTime, 1000);
	}
	
	private function _tenmetsu():Void
	{
		for (i in 0..._corons.length) {
			_corons[i].visible = true;
		}
	}
	
	private function _calcTime():Void {
		
		Jiku.setRandom();
		
		var date:Date = Date.now();

		var hh:Int = 		date.getHours();
		var mm:Int = 		date.getMinutes();
		var ss:Int = 		date.getSeconds();
		
		_index = _index % 3;
		
		//trace(hh + ":" + mm + ":" + ss);
		
		var n:Int = (2-_index) * 6;
		_nums[n+0].setNo( _getKeta2(hh) );
		_nums[n+1].setNo( _getKeta1(hh) );
		_nums[n+2].setNo( _getKeta2(mm) );
		_nums[n+3].setNo( _getKeta1(mm) );
		_nums[n+4].setNo( _getKeta2(ss) );
		_nums[n+5].setNo( _getKeta1(ss) );
		
		
		for(nn in 0...3){
			var tgtR:Float = Math.PI*0.4+Math.random() * Math.PI;
			for (i in 0...8) {
				_planes[nn*8 + i].tweenRot( i/8, tgtR );
			}
		}
		_index++;
	}
	
	private function _getKeta1(n:Int):Int {
		return n % 10;
	}
	private function _getKeta2(n:Int):Int {
		return Math.floor(n / 10);
	}
	
	
	public function update():Void {
		
		_offset = _offset % 1;
		for (i in 0..._planes.length) {
			
			var d:DigitPlane = _planes[i];
			//d.position
			d.update(_offset);
			
		}
		
	}

}