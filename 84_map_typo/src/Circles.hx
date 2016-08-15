package ;
import createjs.easeljs.Graphics;
import createjs.easeljs.Shape;
import createjs.easeljs.Stage;
import js.Browser;

/**
 * ...
 * @author nab
 */
class Circles
{
	var _shape:Shape;
	var _count:Float = 0;
	var _w:Int = 1000;
	var _h:Int = 600;
	
	var _rad:Float = 0;
	
	var _radSpeed1:Float = 0;
	var _radSpeed2:Float = 0;
	var _radSpeed3:Float = 0;
	var _freq1:Float = 0;
	var _freq2:Float = 0;
	var _freq3:Float = 0;
	
	var _amp1:Float = 0; 
	var _amp2:Float = 0;
	var _amp3:Float = 0;
	var _xx:Float = 0;
	var _yy:Float = 0;
	var _phase1:Float = 0;
	var _phase2:Float = 0;
	var _phase3:Float = 0;
	
	var _speed:Float = 0;
	var _drawSpeed:Int = 40;
	
	var guide:Guide;
	var _stage1:Stage;
	var _r:Float = 0;
	public function new() 
	{

	}
	
	public function init(stage:Stage,stage2:Stage)
	{
		trace("init");
		_stage1 = stage;
		_speed = (2 * Math.PI) / 90;
		
		_shape = new Shape();
		stage.addChild(_shape);
		
		guide = new Guide();
		guide.init();
		stage2.addChild(guide);
		
		reset();
		
		var gui:Dynamic = untyped __js__("new dat.GUI({ autoPlace: false })");
	
		var hoge = gui.add(this, "_freq1", -100, 100).listen();
		hoge.onChange(_clear);
		hoge=gui.add(this, "_freq2", -100, 100).listen();
		hoge.onChange(_clear);
		hoge=gui.add(this, "_r", 0, 1).listen();
		hoge.onChange(_clear);
		
		
		gui.add(this, "_drawSpeed", 5, 100).listen();
		gui.add(this, "random");
		
		
		//gui.close();
		gui.domElement.style.position = "absolute";
		gui.domElement.style.right = "0px";
		gui.domElement.style.top = "0px";
		gui.domElement.style.zIndex = "100000";
		Browser.document.body.appendChild(gui.domElement);
		
		
	}

	public function random():Void {
		_clear();
		reset();
	}
	
	private function _clear():Void {
		trace("clear");
		_stage1.clear();		
	}
	
	public function reset() 
	{
		_r = Math.random();
		
		_freq1 = Math.floor( 100 * (Math.random()-0.5) );
		_freq2 = Math.floor( 100 * (Math.random()-0.5) );
		_freq3 = Math.floor( 100 * (Math.random() - 0.5) );
		
		_phase1 = Math.random() * 2 * Math.PI;
		_phase2 = Math.random() * 2 * Math.PI;
		_phase3 = Math.random() * 2 * Math.PI;
		_amp1 = 250 * Math.random();//350 * _r;
		_amp2 = 250 * Math.random();//350 - _amp1;
		_amp3 = 250 * Math.random();

	} 

	
	public function update():Void {
			
		_radSpeed1 = 2 * Math.PI / _freq1;//* (Math.random()-0.5) / 5;
		_radSpeed2 = 2 * Math.PI / _freq2;//* (Math.random()-0.5) / 2;
		_radSpeed3 = 2 * Math.PI / _freq3;//* (Math.random()-0.5) / 2;
		
		
		
		var g:Graphics = _shape.graphics;
		g.clear();
		g.beginStroke("#000000");
	
		for(i in 0..._drawSpeed){
			_rad += _speed;

			var xx:Float = _w / 2 + _amp1 * Math.cos( _rad * _radSpeed1 + _phase1);// _count / 300 );// 257);
			var yy:Float = _h / 2 + _amp1 * Math.sin( _rad * _radSpeed1 + _phase1);// _count / 300 );// 351);	

			var xxx:Float = xx + _amp2 * Math.cos( _rad * _radSpeed2 + _phase2);
			var yyy:Float = yy + _amp2 * Math.sin( _rad * _radSpeed2 + _phase2);
			
			var xxxx:Float = xxx + _amp3 * Math.cos( _rad * _radSpeed3 + _phase3 );
			var yyyy:Float = yyy + _amp3 * Math.sin( _rad * _radSpeed3 + _phase3 );
			
			if(i==0)g.moveTo(xxxx, yyyy);	
			g.lineTo(xxxx, yyyy);
		}

		_rad -= _speed;
		
		guide.update(
			_rad * _radSpeed1, 
			_rad * _radSpeed2, 
			_rad * _radSpeed3, 
			
			_amp1, 
			_amp2, 
			_amp3,
			
			_phase1, 
			_phase2, 
			_phase3,
			
			_w,
			_h
		);
	}
	
	public function resize(width:Int, height:Int) 
	{
		_w = width;
		_h = height;
	}
	
	
	
	
}