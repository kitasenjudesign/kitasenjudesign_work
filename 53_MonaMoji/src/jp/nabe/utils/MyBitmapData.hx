package jp.nabe.utils;
import js.Browser;
import js.html.CanvasElement;
import js.html.CanvasRenderingContext2D;
import js.html.Image;
import js.html.ImageData;

/**
 * ...
 * @author nabe
 */
class MyBitmapData
{

	private var _context:CanvasRenderingContext2D;
	private var _imageData:ImageData;
	private var _img:Image;
	private var _width:Float;
	private var _height:Float;
	private var _canvas:CanvasElement;
	private var _callback:Void->Void;
	
	public function new() 
	{
	}
	
	public function init(url:String,callback:Void->Void):Void {

		trace("init");
		_callback = callback;
		_canvas = Browser.document.createCanvasElement();
		_context = _canvas.getContext2d();
		_img = new Image();
		_img.src = url;//"image2.gif?" + new Date().getTime();
		_img.onload = untyped _onInit;
		
	}
	
	private function _onInit():Void
	{
		trace("onInit width/height=" + _img.width+" "+_img.height);
		_canvas.width = _img.width;
		_canvas.height = _img.height;
		_context.drawImage(_img, 0, 0);
		_width = _img.width;
		_height = _img.height;
		_imageData = _context.getImageData(0, 0, _width, _height);
		//debug
		//Browser.document.body.appendChild( _canvas );
		if (_callback != null) {
			_callback();
		}
	}
	
	
	public function updateImageData():Void {
		
		_imageData = _context.getImageData(0, 0, _width, _height);
		
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
	
	
	
}