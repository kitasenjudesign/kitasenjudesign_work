package ;
import createjs.easeljs.Bitmap;
import createjs.easeljs.Container;
import createjs.easeljs.Graphics;
import createjs.easeljs.MovieClip;
import createjs.easeljs.Rectangle;
import createjs.easeljs.Shape;
import createjs.tweenjs.Tween;
import js.Browser;
import js.html.ImageElement;
import js.html.svg.Number;
import js.three.Object3D;
import js.three.Vector3;

/**
 * ...
 * @author nab
 */
class Dot extends Object3D
{
	
	public var vx:Float = 0;
	public var vy:Float = 0;
	public var vz:Float = 0;
	
	private var _shape:Shape;
	private var _flag:Bool=false;
	public var r:Float = 0;
	private var _tgtR:Float = 0;
	private var _sw:Float = 0;
	private var _sh:Float = 0;
	
	public function new() 
	{
		super();
	}
	
	public function init(dae:Object3D, sw:Float,sh:Float):Void {
		
		_sw = sw;
		_sh = sh;
		//r = 10 + 130 * Math.random();
		r = 10 + 20 * Math.random();
		if (Math.random() < 0.1) {
			//r = 100 + 100 * Math.random();
		}
		_tgtR = r;
		vx = 4 * (Math.random() - 0.5);
		vy = 4 * (Math.random() - 0.5);
		vz = 4 * (Math.random() - 0.5);
		add(dae);
	}
	
	public function tween():Void {
		
		_flag = !_flag;
		var t:Tween = new Tween(this);
		t.wait(Math.floor(3500 * Math.random()))
		.to( {
			scaleX:_flag ? 1 : 0,
			scaleY:_flag ? 1 : 0,
			r: _flag ? _tgtR : 0,
		},500).wait(Math.floor(20000 + 3500 * Math.random())).call(_onTween);
		
	}
	
	private function _onTween() 
	{
		//x = _sw * Math.random();
		//y = _sh * Math.random();
		//tween();
	}
	
	
	
	
	
	
	private function _addZero(colStr:String,keta:Int):String
	{
		var out:String = colStr;
		
		while (out.length < keta) {
			
			out = "0" + out;

		}
		
		return out;
	}
	
	public function getAbsV():Float {
		
		return Math.sqrt(vx * vx + vy * vy + vz*vz);
	}
	
	public function normalizeV(n:Float) 
	{
		var v:Vector3 = new Vector3(vx, vy, vz);
		vx = v.normalize().x * n;
		vy = v.normalize().y * n;
		vz = v.normalize().z * n;
		
	}
	
	
	
}