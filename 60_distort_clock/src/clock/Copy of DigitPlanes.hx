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
		
		for (i in 0...21) {
			
			var d:DigitPlane = (i%7==0) ? new EmptyPlane() : new DigitPlane();
			d.init(i / 21);//0-1;
			add(d);
			d.update(0);
			_planes.push(d);
			
		}
		
		
		
		updateTime();
	}
		
	/**
	 * 
	 */
	public function updateTime():Void {
		
		Jiku.setRandom();
		
		var date:Date = Date.now();

		var hh:Int = 		date.getHours();
		var mm:Int = 		date.getMinutes();
		var ss:Int = 		date.getSeconds();
		
		_index = _index % 3;
		
		trace(hh + ":" + mm + ":" + ss);
		
		var n:Int = (2-_index) * 7;
		_planes[n+1].setNo( _getKeta2(hh) );
		_planes[n+2].setNo( _getKeta1(hh) );
		_planes[n+3].setNo( _getKeta2(mm) );
		_planes[n+4].setNo( _getKeta1(mm) );
		_planes[n+5].setNo( _getKeta2(ss) );
		_planes[n+6].setNo( _getKeta1(ss) );
		
		
		for (nn in 0...3) {
			
			var tgtR:Float = Math.random() * Math.PI;
				
			for (i in 1...7) {
				_planes[nn*7 + i].tweenRot( (i-1)/6, tgtR );
			}
		}
		
		
		TweenMax.to(this, 0.8, {
			_offset:_offset+1/3
		});// += 0.002;
		
		_index++;
		Timer.delay(updateTime, 1000);
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