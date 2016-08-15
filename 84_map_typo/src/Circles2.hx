package ;
import createjs.easeljs.Graphics;
import createjs.easeljs.Shape;
import createjs.easeljs.Stage;
import js.Browser;

/**
 * ...
 * @author nab
 */
class Circles2
{
	var _shape:Shape;
	var _count:Float = 0;
	var _w:Int = 1000;
	var _h:Int = 600;
	
	var _rad:Float = 0;
	
	var _radSpeed1:Float = 0;
	var _radSpeed2:Float = 0;
	
	var _offsetAmp:Float = 0; 
	var _amp:Float = 0;
	var _xx:Float = 0;
	var _yy:Float = 0;
	var _phase1:Float = 0;
	var _phase2:Float = 0;
	
	
	public function new() 
	{

	}
	
	public function init(stage:Stage) 
	{
		trace("init");
		_shape = new Shape();
		stage.addChild(_shape);
		
		reset();
		
		var gui:Dynamic = untyped __js__("new dat.GUI({ autoPlace: false })");
	
		gui.add(this, "_radSpeed1", 0.01, 2*Math.PI).listen();
		gui.add(this, "_radSpeed2", 0.01, 2*Math.PI).listen();
		gui.add(this, "_amp", 10, 1000).listen();
		gui.add(this, "_offsetAmp", 10, 1000).listen();

		//gui.close();
		gui.domElement.style.position = "absolute";
		gui.domElement.style.right = "0px";
		gui.domElement.style.top = "0px";
		gui.domElement.style.zIndex = "100000";
		Browser.document.body.appendChild(gui.domElement);
		
		
	}

	public function reset() 
	{
		_radSpeed1 = 2 * Math.PI * Math.random() / 5;
		_radSpeed2 = Math.random() * 2 * Math.PI / 20;
		
		_phase1 = Math.random() * 2 * Math.PI;
		_phase2= Math.random() * 2 * Math.PI;
		
		_offsetAmp = 400*Math.random();
		_amp = 400 - _offsetAmp;

	}

	
	public function update():Void {
			
		var g:Graphics = _shape.graphics;
		g.clear();
		g.beginStroke("#000000");
	
		for(i in 0...70){
			_rad += (2*Math.PI)/30;
			
			var amp:Float = _offsetAmp + _amp * Math.cos( _rad * _radSpeed2 + _phase2);		
			var xx:Float = _w / 2 + amp * Math.cos( _rad * _radSpeed1 + _phase1);// _count / 300 );// 257);
			var yy:Float = _h / 2 + amp * Math.sin( _rad * _radSpeed1 + _phase1);// _count / 300 );// 351);	
			if(i==0)g.moveTo(xx, yy);	
			g.lineTo(xx, yy);
		}

		_rad -= (2 * Math.PI) / 30;
	}
	
	public function resize(width:Int, height:Int) 
	{
		_w = width;
		_h = height;
	}
	
	
	
	
}