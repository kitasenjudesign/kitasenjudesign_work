package jp.nabe.utils;
import js.Browser;
import js.html.CanvasElement;
import js.html.CanvasRenderingContext2D;
import js.html.Image;
import js.html.ImageData;
import js.html.ImageElement;
import js.html.VideoElement;
import js.JQuery;
import js.JQuery.JqEvent;

/**
 * ビットマップデータみたいに扱うことを想定されたクラス
 * @author nabe
 */
class MyBitmapData
{

	private var _context:CanvasRenderingContext2D;
	private var _imageData:ImageData;
	private var _img:ImageElement;
	private var _width:Float;
	private var _height:Float;
	private var _canvas:CanvasElement;
	private var _callback:Void->Void;
	private var _video:VideoElement;
	public var visible:Bool = true;
	
	public function new() 
	{
	}
	
	
	public function draw():Void {
		
	}
	
	
	/**
	 * MyBitmapData
	 */
	public function initB(video:VideoElement):Void {

		if(_canvas==null){
			_canvas = Browser.document.createCanvasElement();// == 
			_canvas.id = "bitmap";		
			_context = _canvas.getContext2d();
			//Browser.document.body.appendChild(_canvas);
			//Browser.window.alert(
			//	video.videoWidth+" "+
			//	video.videoHeight
			//);

			_video = video;
			_canvas.width = 1024;
			_canvas.height = 1024;
			_context.drawImage(video, (video.videoWidth-video.videoHeight)/2, 0, video.videoHeight, video.videoHeight, 0, 0, 1024, 1024);
			_width = 1024;
			_height = 1024;
			_imageData = _context.getImageData(0, 0, _width, _height);
		}
	}
	
	public function drawVideo():Void {
		
		//_context.clearRect(0,0,1024,1014
		_context.drawImage(_video, (_video.videoWidth-_video.videoHeight)/2, 0, _video.videoHeight, _video.videoHeight, 0, 0, 1024, 1024);
		//_imageData = _context.getImageData(0, 0, _width, _height);
		
	}
	
	
	public function init(data:String,callback:Void->Void):Void {

		trace("init");
		_callback = callback;

		
		_img = Browser.document.createImageElement(); //new ImageElement();
		_img.onload = untyped function() {

			//Browser.window.alert("onload width/height=" + _img.width + " " + _img.height);
			
			_canvas = Browser.document.createCanvasElement();
			_canvas.id = "bitmap";
			_canvas.style.position = "absolute";
			_canvas.style.zIndex = "1000";
			_context = _canvas.getContext2d();			
			
			_canvas.width = 1024;// _img.width;
			_canvas.height = 1024;// _img.height;
			
			//大きいほうの正方形を切り取る
			var startX:Float = 0;
			var startY:Float = 0;
			var rect:Float = 0;
			
			//横のほうがおおきい
			var yokonaga:Bool = _img.width > _img.height;
			
			if ( yokonaga ) {
				startX = (_img.width - _img.height) / 2;
				startY = 0;
				rect = _img.height;
			}else {
				//縦のほうが大きい
				startX = 0;
				startY = (_img.height - _img.width) / 2;
				rect = _img.width;
			}
			
			//ここ
			_context.drawImage(_img, startX, startY, rect, rect, 0,0,1024,1024);
			
			_width = 1024;// _img.width;
			_height = 1024;// _img.height;
			_imageData = _context.getImageData(0, 0, 1024, 1024);

			//debug
			//Browser.document.body.appendChild( _canvas );
			if (_callback != null) {
				_callback();
			}
			
			
		}
		_img.src = data;// url;//"image2.gif?" + new Date().getTime();
		//_img.onload = untyped _onInit;

	}
	
	
	public function updateImageData():Void {
		
		if(_context!=null){
			_imageData = _context.getImageData(0, 0, _width, _height);
		}
	}
	
	
	public function setPixel(color:Int, x:Int, y:Int):Void {
		
		var r:Int = (color & 0xff0000) >> 16;
		var g:Int = (color & 0x00ff00) >> 8;
		var b:Int = (color & 0x0000ff);
		var a:Int = (color & 0xff000000) >> 24;
		
		//trace("setPixel32");
		var index:Int = cast ((_width * y) + x) * 4;
		_imageData.data[index] = r;
		_imageData.data[index + 1] = g;
		_imageData.data[index + 2] = b;
		_imageData.data[index + 3] = a;
    
	}
	
	public function getPixel(x:Int, y:Int):Int {
		
		//trace("getPixel32");
		var index:Int = cast ( x + y * _width ) * 4;
	
		var r:Int = _imageData.data[ index ];
		var g:Int = _imageData.data[ index + 1 ];
		var b:Int = _imageData.data[ index + 2 ];
		var a:Int = _imageData.data[ index + 3 ];
		
		return (a<<24) + (r << 16) + (g << 8) + b;
		
	}
	
	public function show():Void {
		visible = true;
		new JQuery("#bitmap").show();
	}
	
	public function hide():Void {
		visible = false;
		new JQuery("#bitmap").hide();
	}
	
	public function getCanvas():CanvasElement {
		return _canvas;
	}
	
	public function kill() 
	{
		
	}
	
	
	
}