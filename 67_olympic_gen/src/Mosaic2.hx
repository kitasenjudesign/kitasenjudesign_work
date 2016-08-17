package;
import createjs.easeljs.Bitmap;
import createjs.easeljs.Graphics;
import createjs.easeljs.Shape;
import createjs.easeljs.Stage;
import createjs.easeljs.Text;
import createjs.easeljs.Ticker;
import haxe.Timer;
import jp.nabe.utils.MyBitmapData;
import jp.nabe.utils.PCChecker;
import js.Browser;
import js.html.Blob;
import js.html.CanvasElement;
import js.html.CanvasRenderingContext2D;
import js.html.Element;
import js.html.FileReader;
import js.html.ImageElement;
import js.JQuery;
import js.JQuery.JqEvent;

/**
 * ...
 * @author nabe
 */
class Mosaic2
{

	public static inline var WEBCAM:String = "WEBCAM";
	public static inline var IMAGE:String = "IMAGE";
	
	private var _bitmap:MyBitmapData;
	private var _img:Img;
	private var _canvas:CanvasElement;
	private var _stage:Stage;
	private var _shape:Shape;
	//private var _font:FontShapeMaker;
	private var _loading:Text;
	private var circle:Bool = true;
	private var _webcam:Webcam;
	private var _baseCanvas:CanvasElement;
	private var _bg:Shape;
	private var _btns:Btns;
	var gui:Dynamic;
	var _timer:Timer;
	var _logo:Bitmap;
	var _mode:String;
	
	public var th_hensa:Float = 10;
	
	
	
	public function new() 
	{
		
	}
	
	//init
	public function init():Void {
	
		_canvas = cast Browser.document.getElementById("canvas");
		_canvas.width = 1024;
		_canvas.height = 1024 + 717;
		_canvas.id = "main";
		
		_stage = new Stage(cast _canvas);
		_stage.autoClear = false;	
		
		_shape = new Shape();
		_stage.addChild(_shape);
		
		Ticker.setFPS(30);
		Ticker.addEventListener("tick", _update);

		_logo = new Bitmap("logo1.png");
		_stage.addChild(_logo);
		
		//default logo
		var image:Bitmap = new Bitmap("logo.jpg");
		image.y = 1024;
		_stage.addChild(image);
		_stage.update();
		
	}
	
	private function _removeFirstLogo():Void {
		if (_logo != null) {
			_stage.removeChild(_logo);
			_logo = null;
			_stage.clear();
			_stage.update();
		}		
	}

	
	
	private function _startFromImage(data:String):Void {
		_mode = IMAGE;
		_removeFirstLogo();
		_createBitmap(data);
		_startGenerate();////startGenerate
		_onResize(null);
	}
	
	private function _createBitmap(data:String=null):Void {

		_bitmap = new MyBitmapData();
		
		if(_mode==WEBCAM){
			_bitmap.initB(_webcam.video);
		}else {
			_bitmap.init(data,null);
		}
		
		_baseCanvas = _bitmap.getCanvas();
		Browser.window.document.body.appendChild(_baseCanvas);	
			
	}
	
	
	
	private function _startGenerate():Void
	{
		_bitmap.updateImageData();
		//_baseCanvas.remove();

		_btns.showDownloadBtn(
			_goDownload,_repeat
		);
		
		
		//Generate start!!!!!!!
		_img = new Img(_bitmap, _draw);
		_img.split(0, 0, 1024, 1024);	
		
		
		_stage.clear();
		//_shape.graphics.beginFill(Graphics.getRGB(0xff, 0xff, 0xff));
		//_font.getShapes(_shape.graphics, "あ", false, 1);
		
		_debugGUI();
		_onResize(null);

	}
	
	/**
	 * 一番最初に戻す
	 */
	private function _repeat():Void 
	{
		//_btns.showGenerateBtn(_onInit);
		
		if (_timer != null) {
			_timer.stop();
		}
		if (_img != null) {
			_stage.clear();
			_shape.graphics.clear();
			_img.kill();
		}
		_img = null;
		
		_stage.clear();
		_stage.update();
		
		_btns.showEnterance( _startFromWebcam, _startFromImage );
	}
	
	function _goDownload(e:JqEvent):Void 
	{
		var canvas:CanvasElement = Browser.window.document.createCanvasElement();
		canvas.width = _canvas.width;
		canvas.height = _canvas.height;

		var ctx:CanvasRenderingContext2D = canvas.getContext2d();
		ctx.beginPath();
		ctx.fillStyle = 'rgb(255, 255, 255)';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.fill();
		
		if(_bitmap.visible){
			ctx.drawImage(_bitmap.getCanvas(), 0, 0);
		}
		
		ctx.drawImage(_canvas,0,0);
		
		Browser.window.open(canvas.toDataURL("image/png"), "hoge");
	}

	
	public function reset(isRandom:Bool=false):Void {
		
		
		_shape.graphics.clear();
		_stage.clear();
		//_stage.draw( _bitmap.getCanvas().getContext2d() );
		
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
		if (_bitmap != null && _img==null && _mode==WEBCAM) {
			_bitmap.drawVideo();
		}
		_stage.update();
		_shape.graphics.clear();//shape にかいている。
	}
	
	private function _draw(x:Int,y:Int,w:Int,h:Int,color:Int) 
	{
		//trace("_draw", x, y, w, h, color);
		trace("draw");
		var r:Int = color >> 16 & 0xFF;
		var g:Int = color >> 8 & 0xFF;
		var b:Int = color & 0xFF;
		
		//_shape.graphics.beginStroke(Graphics.getRGB(0x00, 0x00, 0x00)).setStrokeStyle(1);
		var s:Float = w / 100;
		
		OlympicShape.draw(_shape.graphics, r, g, b, x, y, w, h);
		
		if (_img.counter == -1) {
			_bitmap.hide();
			_timer = Timer.delay( _next, 2000);
		}
		
		//_shape.graphics.beginStroke(Graphics.getRGB(0xff, 0xff, 0xff));
		//_shape.graphics.drawRect(x, y, w, h);
		//_shape.graphics.endStroke();
		
	}
	
	function _next() 
	{
		_bitmap.show();
		reset(true);
	}
	
	
	
	private function _debugGUI():Void {
		//datgui...
		if(gui==null){
			gui = untyped __js__("new dat.GUI({ autoPlace: false })");
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
	}
	
}