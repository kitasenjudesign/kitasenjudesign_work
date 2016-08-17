package;
import createjs.easeljs.Graphics;
import createjs.easeljs.Shape;
import createjs.easeljs.Stage;
import createjs.easeljs.Text;
import createjs.easeljs.Ticker;
import haxe.Timer;
import jp.nabe.utils.MyBitmapData;
import jp.nabe.utils.PCChecker;
import js.Browser;
import js.html.CanvasElement;
import js.html.Element;

/**
 * ...
 * @author nabe
 */
class Mosaic
{

	private var _bitmap:MyBitmapData;
	private var _img:Img;
	private var _canvas:CanvasElement;
	private var _stage:Stage;
	private var _shape:Shape;
	private var _font:FontShapeMaker;
	private var _loading:Shape;
	private var circle:Bool = false;
	public var th_hensa:Float = 10;
	
	public function new() 
	{
		
	}
	
	public function init():Void {
	
		_canvas = cast Browser.document.getElementById("canvas");
		_canvas.width = 1024;
		_canvas.height = 1024;
		//Browser.document.appendChild(_canvas);
		
		_stage = new Stage(cast _canvas);
		_stage.autoClear = false;
		
		_shape = new Shape();
		_stage.addChild(_shape);
		
		Ticker.setFPS(30);
		Ticker.addEventListener("tick", _update);
		
		Browser.window.onresize = _onResize;
		_onResize(null);
		
		
		_loading = new Shape();
		_loading.graphics.beginStroke("#cc9900").setStrokeStyle(1);
		_loading.graphics.moveTo(0, 0);
		_loading.graphics.lineTo(1024, 1024);
		_loading.graphics.moveTo(1024, 0);
		_loading.graphics.lineTo(0, 1024);
		//_loading.graphics.drawRect(0, 0, 1024, 1024);
		_stage.addChild(_loading);
		
		_stage.update();

		_bitmap = new MyBitmapData();
		_bitmap.init("mona.jpg", _onInit);
		
	}
	
	function _onResize(e) 
	{
		_canvas.style.position = "absolute";
		_canvas.style.top = "0px";
		_canvas.style.left = (Browser.window.innerWidth / 2 - 1024 / 2) + "px";
		
	}
	private function _onInit():Void
	{
		
		_font = new FontShapeMaker();
		_font.init("AOTFProM2.json", _onLoad);
	}
	
	private function _onLoad():Void
	{
		_img = new Img(_bitmap, _draw);
		_img.split(0, 0, 1024, 1024);	
		
		_stage.removeChild(_loading);
		_loading = null;
		
		_stage.clear();
		//_shape.graphics.beginFill(Graphics.getRGB(0xff, 0xff, 0xff));
		//_font.getShapes(_shape.graphics, "あ", false, 1);
		
		//datgui...
		var gui:Dynamic = untyped __js__("new dat.GUI({ autoPlace: false })");
		//gui.add(this, "_anime1");
		gui.add(_img, "th_hensa", 5, 30).listen();
		gui.add(_img, "th_end_size", 2, 256).listen();
		gui.add(this, "circle");
		
		gui.add(this, "reset");
		gui.close();
		
		Browser.document.body.appendChild(gui.domElement);
		gui.domElement.style.position = "absolute";
		gui.domElement.style.right = "0px";
		gui.domElement.style.top = "0px";
		gui.domElement.style.zIndex = "1000";
		
		
		
	}
	
	public function reset(isRandom:Bool=false):Void {
		
		_shape.graphics.clear();
		_stage.clear();
		_img.reset();
		
		if (isRandom) {
			if( PCChecker.isPC() ){
				_img.th_hensa = Math.floor( Math.random() * 20 + 8 );
				_img.th_end_size = cast Math.pow(2, Math.floor( Math.random() * 4 + 2));
			}else {
				_img.th_hensa = Math.floor( Math.random() * 20 + 8 );
				_img.th_end_size = cast Math.pow(2, Math.floor( Math.random() * 4 + 3));
			}
		}
		//_img = new Img(_bitmap, _draw);
		//_img.th_hensa = this.th_hensa;
		_img.split(0, 0, 1024, 1024);	
		
	}
	
	private function _update(e):Void 
	{
		if ( _loading != null ) {
			//trace("Hoge");
			_stage.clear();
			_stage.update();
			
			_loading.alpha = Math.random();
		}else{
			_stage.update();
			_shape.graphics.clear();
		}
	}
	
	private function _draw(x:Int,y:Int,w:Int,h:Int,color:Int) 
	{
		//trace("_draw", x, y, w, h, color);
		var r:Int = color >> 16 & 0xFF;
		var g:Int = color >> 8 & 0xFF;
		var b:Int = color & 0xFF;
		
		//_shape.graphics.beginStroke(Graphics.getRGB(0x00, 0x00, 0x00)).setStrokeStyle(1);
		_shape.graphics.beginFill( Graphics.getRGB(r,g,b) );
		//_shape.graphics.beginStroke( Graphics.getRGB(r,g,b,0.95) );
		var s:Float = w / 100;
		
		
		
		if(circle){
			_shape.graphics.drawCircle(x + w / 2, y + h / 2, w / 2);// , h);
			/*_shape.graphics.drawRect(x, y, w,h);// , h);
			//_shape.graphics.setStrokeStyle(w / 5);
			_shape.graphics.moveTo(x + w / 2, y + h / 2);
			var oldX:Float = x + w / 2;
			var oldY:Float = y + h / 2;
			for (i in 0...20) {
				var rad:Float = Math.random() * 2 * Math.PI;
				var amp:Float = 2 * w * Math.random();
				if (Math.random() < 0.05) {
					amp *= 3;
				}
				var xx:Float = x + w / 2 + amp * Math.cos(rad);
				var yy:Float = y + h / 2 + amp * Math.sin(rad);
				_shape.graphics.quadraticCurveTo( xx, yy, (oldX+xx)/2, (oldY+yy)/2);
			}
			_shape.graphics.endStroke();*/
		}else{
			
			_font.getShapes(_shape.graphics, _font.font.getRandomKey(), false, w / 100, x, y - w / 100 * 32.3);
			
		}
		_shape.graphics.endFill();
		
		if (_img.counter == -1) {
			Timer.delay( _next, 1000);
		}
		
		//_shape.graphics.beginStroke(Graphics.getRGB(0xff, 0xff, 0xff));
		//_shape.graphics.drawRect(x, y, w, h);
		//_shape.graphics.endStroke();
		
	}
	
	function _next() 
	{
		reset(true);
	}
	
}