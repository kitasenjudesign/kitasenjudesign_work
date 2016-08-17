package;
import createjs.easeljs.EventDispatcher;
import jp.nabe.utils.PCChecker;
import js.Browser;
import js.html.Blob;
import js.html.FileReader;
import js.JQuery;
import js.JQuery.JqEvent;

/**
 * ...
 * @author nabe
 */
class Btns extends EventDispatcher
{

	private var _first:JQuery;
	private var _btnGenerate:JQuery;
	private var _end:JQuery;
	
	
	public function new() 
	{
		
	}
	
	public function init():Void {
		
		_first = new JQuery( "#first");
		_btnGenerate = new JQuery("#generate");
		_end = new JQuery( "#last" );
		
		
		/*
			<div id="first">
				<h1>あなただけの<br/>オリンピックエンブレム<br>ジェネレーター</h1>
				<div id="webcam" class="btn">ウェブカムから</div>
				<div id="image" class="btn">画像から</div>
			</div>
	
			<div id="generate" class="btn">ジェネレート!</div>
			<div id="end">
			<div id="save" class="btn">保存する</div>
			<div id="repeat" class="btn">もう１回</div>
		*/
		
		
	}
	
	public function showEnterance(callbackWebcam:JqEvent->Void,callbackImg:String->Void):Void {
		
		//for webcam
		
		_first.show();
		
		if ( !PCChecker.isPC() ) {
			_first.children("#webcam").hide();
			new JQuery("#repeat").hide();
			new JQuery("#imageBtnTitle").text("Start");
		}
		
		_first.children("#webcam").off("click");		
		_first.children("#webcam").on("click", function(e:JqEvent) {
			
			if (PCChecker.isIE() || PCChecker.isSafari()) {
				Browser.window.alert("Webcam doesn't work on this browser. Check on Chrome or Firefox.");
			}else{
				_first.hide();
				callbackWebcam(e);
			}
		});
	
		//for image
		
		new JQuery("#imageFile").off("change");
		new JQuery("#imageFile").on("change", function(e:JqEvent):Void{
				_first.hide();
				
				var reader:FileReader = new FileReader();			
				reader.onload = untyped function(e) {
					//Browser.window.alert("success");
					var data:String = reader.result;
					if (data != null) {
								//	Browser.window.alert("success2");
		
						callbackImg(data);
					}else {
						Browser.window.alert("err");

						//Browser.window.alert("hogehoegoajoijfa");
					}
				}
			  
			  var file:Blob = untyped Browser.document.getElementById("imageFile").files[0];
			  reader.readAsDataURL(file);
		});
		
	}
	
	
	//
	public function showGenerateBtn(callback:Void->Void):Void {
		
		//Browser.window.alert("hoge");
		_btnGenerate.show();
		
		_btnGenerate.off("click");
		_btnGenerate.on("click", function(e:JqEvent) {
			trace("click!!!");
			_btnGenerate.hide();
			callback();
		});
		resize();
		
	}
	
	public function showDownloadBtn(
		callbackSave:JqEvent->Void,
		callbackRepeat:Void->Void
	):Void {
		
		trace("showDownloadBtn");
		//Browser.window.alert("hoge");
		
		_end.show();
		
		_end.children("#save").on("click",callbackSave);
		_end.children("#repeat").on("click", function(e:JqEvent):Void {
			_end.hide();
			callbackRepeat();
		});
		
		resize();
		
	}


	
	
	
	
	public function resize():Void {
		
		/*
		_first.css( {
			left:(Browser.window.innerWidth/2 - _first.width()/2) +"px",
			top:(Browser.window.innerHeight/2 - _first.height()/2) +"px"
		});
		
		_btnGenerate.css( {
			left:(Browser.window.innerWidth/2 - _btnGenerate.width()/2) +"px",
			bottom:"20px"//(Browser.window.innerHeight/2 - _btnGenerate.height()/2) +"px"
		});
		
		
		_end.css( {
			left:(Browser.window.innerWidth/2 - _end.width()/2) +"px",
			bottom:"20px"//(Browser.window.innerHeight/2 - _btnGenerate.height()/2) +"px"
		});
		*/
		
	}
	
	
}