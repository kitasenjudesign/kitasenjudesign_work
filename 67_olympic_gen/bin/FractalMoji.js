(function () { "use strict";
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var Base64toBlob = function() {
};
Base64toBlob.getBlob = function(_base64) {
	var tmp = _base64.split(",");
	var data = window.atob(tmp[1]);
	var mime = tmp[0].split(":")[1].split(";")[0];
	var arr = new Uint8Array(data.length);
	var _g1 = 0;
	var _g = data.length;
	while(_g1 < _g) {
		var i = _g1++;
		arr[i] = HxOverrides.cca(data,i);
	}
	var blob = new Blob([arr],{ type : mime});
	return blob;
};
Base64toBlob.saveBlob = function(_blob,_file) {
	if(jp.nabe.utils.PCChecker.isIE()) {
		var nav = window.navigator;
		nav.msSaveBlob(_blob,_file);
	} else {
		var win = window;
		var url = win.URL || win.webkitURL;
		var data = url.createObjectURL(_blob);
		var e = window.document.createEvent("MouseEvents");
		e.initMouseEvent("click",true,false,window,0,0,0,0,0,false,false,false,false,0,null);
		var a = window.document.createElementNS("http://www.w3.org/1999/xhtml","a");
		a.href = data;
		a.download = _file;
		a.dispatchEvent(e);
	}
};
var Btns = function() {
};
Btns.__super__ = createjs.EventDispatcher;
Btns.prototype = $extend(createjs.EventDispatcher.prototype,{
	init: function() {
		this._first = new js.JQuery("#first");
		this._btnGenerate = new js.JQuery("#generate");
		this._end = new js.JQuery("#last");
	}
	,showEnterance: function(callbackWebcam,callbackImg) {
		var _g = this;
		this._first.show();
		if(!jp.nabe.utils.PCChecker.isPC()) {
			this._first.children("#webcam").hide();
			new js.JQuery("#repeat").hide();
			new js.JQuery("#imageBtnTitle").text("Start");
		}
		this._first.children("#webcam").off("click");
		this._first.children("#webcam").on("click",function(e) {
			if(jp.nabe.utils.PCChecker.isIE() || jp.nabe.utils.PCChecker.isSafari()) window.alert("Webcam doesn't work on this browser. Check on Chrome or Firefox."); else {
				_g._first.hide();
				callbackWebcam(e);
			}
		});
		new js.JQuery("#imageFile").off("change");
		new js.JQuery("#imageFile").on("change",function(e1) {
			_g._first.hide();
			var reader = new FileReader();
			reader.onload = function(e2) {
				var data = reader.result;
				if(data != null) callbackImg(data); else window.alert("err");
			};
			var file = window.document.getElementById("imageFile").files[0];
			reader.readAsDataURL(file);
		});
	}
	,showGenerateBtn: function(callback) {
		var _g = this;
		this._btnGenerate.show();
		this._btnGenerate.off("click");
		this._btnGenerate.on("click",function(e) {
			console.log("click!!!");
			_g._btnGenerate.hide();
			callback();
		});
		this.resize();
	}
	,showDownloadBtn: function(callbackSave,callbackRepeat) {
		var _g = this;
		console.log("showDownloadBtn");
		this._end.show();
		this._end.children("#save").on("click",callbackSave);
		this._end.children("#repeat").on("click",function(e) {
			_g._end.hide();
			callbackRepeat();
		});
		this.resize();
	}
	,resize: function() {
	}
});
var HxOverrides = function() { };
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
};
var Img = function(b,callback) {
	this.counter = 0;
	this._isKill = false;
	this.th_end_size = 8;
	this.th_hensa = 15;
	this._callback = callback;
	this._src = b;
};
Img.prototype = {
	split: function(x,y,w,h,delay) {
		if(delay == null) delay = 0;
		TweenMax.delayedCall(delay,$bind(this,this._split),[x,y,w,h]);
	}
	,kill: function() {
		this._isKill = true;
		this.reset();
	}
	,reset: function() {
		this.counter = 0;
		TweenMax.killAll();
	}
	,_split: function(x,y,w,h) {
		if(this._isKill) return;
		var hensa = this._getHensa(x,y,w,h);
		this.counter--;
		if(hensa < this.th_hensa || w <= this.th_end_size || h <= this.th_end_size) {
			var col = this._getHeikinColor(x,y,w,h);
			this._callback(x,y,w,h,Math.floor(col));
			return;
		} else {
			var ww = w / 2;
			var hh = h / 2;
			this.counter += 4;
			if(this.counter < 10) {
				this.split(x,y,ww,hh);
				this.split(x + ww,y,ww,hh);
				this.split(x,y + hh,ww,hh);
				this.split(x + ww,y + hh,ww,hh);
			} else {
				this.split(x,y,ww,hh,Math.random());
				this.split(x + ww,y,ww,hh,Math.random());
				this.split(x,y + hh,ww,hh,Math.random());
				this.split(x + ww,y + hh,ww,hh,Math.random());
			}
		}
	}
	,_getHeikinColor: function(x,y,w,h) {
		var sumR = 0;
		var sumG = 0;
		var sumB = 0;
		var _g = 0;
		while(_g < w) {
			var i = _g++;
			var _g1 = 0;
			while(_g1 < h) {
				var j = _g1++;
				var rgb = this._src.getPixel(x + i,y + j);
				var rr = rgb >> 16 & 255;
				var gg = rgb >> 8 & 255;
				var bb = rgb & 255;
				sumR += rr / (w * h);
				sumG += gg / (w * h);
				sumB += bb / (w * h);
			}
		}
		return Math.floor(sumR) << 16 | Math.floor(sumG) << 8 | Math.floor(sumB);
	}
	,_getHensa: function(x,y,w,h) {
		var heikin = this._getHeikin(x,y,w,h);
		var sub = 0;
		var _g = 0;
		while(_g < w) {
			var i = _g++;
			var _g1 = 0;
			while(_g1 < h) {
				var j = _g1++;
				var rgb = this._src.getPixel(x + i,y + j);
				var rr = rgb >> 16 & 255;
				var gg = rgb >> 8 & 255;
				var bb = rgb & 255;
				var col = (rr + bb + gg) / 3;
				sub += Math.abs(heikin - col);
			}
		}
		return sub / (w * h);
	}
	,_getHeikin: function(x,y,w,h) {
		var sum = 0;
		var _g = 0;
		while(_g < w) {
			var i = _g++;
			var _g1 = 0;
			while(_g1 < h) {
				var j = _g1++;
				var rgb = this._src.getPixel(x + i,y + j);
				var rr = rgb >> 16 & 255;
				var gg = rgb >> 8 & 255;
				var bb = rgb & 255;
				sum += (rr + gg + bb) / 3;
			}
		}
		return sum / (w * h);
	}
};
var Main = function() { };
Main.main = function() {
	window.onload = Main.initialize;
};
Main.initialize = function(e) {
	Main._mosaic = new Mosaic();
	Main._mosaic.init();
	if(!jp.nabe.utils.PCChecker.isPC()) new js.JQuery("#container").css({ transform : "scale(1,1)", '-webkit-transform' : "scale(1,1)", '-moz-transform' : "scale(1,1)"});
	window.onresize = Main._onResize;
	Main._onResize();
};
Main._onResize = function() {
	var scale;
	if(jp.nabe.utils.PCChecker.isPC()) scale = 0.7; else scale = 1;
	new js.JQuery("#container").css({ top : "0px", left : window.innerWidth / 2 - 1024 * scale * 0.5 + "px"});
	var hh = new js.JQuery("#first").height();
	new js.JQuery("#first").css({ top : (1024 - hh) / 2 + "px"});
};
var Mosaic = function() {
	this.th_hensa = 10;
	this.circle = true;
};
Mosaic.prototype = {
	init: function() {
		this._canvas = window.document.getElementById("canvas");
		this._canvas.style.position = "absolute";
		this._canvas.width = 1024;
		this._canvas.height = 1024;
		this._canvas.id = "main";
		this._canvas.style.zIndex = "100";
		this._stage = new createjs.Stage(this._canvas);
		this._stage.autoClear = false;
		this._shape = new createjs.Shape();
		this._stage.addChild(this._shape);
		createjs.Ticker.setFPS(30);
		createjs.Ticker.addEventListener("tick",$bind(this,this._update));
		this._logo = new createjs.Bitmap("hoge1.png");
		this._stage.addChild(this._logo);
		this._stage.update();
		this._btns = new Btns();
		this._btns.init();
		this._btns.showEnterance($bind(this,this._startFromWebcam),$bind(this,this._startFromImage));
	}
	,_createLogo: function() {
		if(this._logo != null) {
			this._stage.removeChild(this._logo);
			this._logo = null;
			this._stage.clear();
			this._stage.update();
		}
	}
	,_startFromWebcam: function(e) {
		this._createLogo();
		this._mode = "WEBCAM";
		if(this._webcam == null) {
			this._webcam = new Webcam();
			this._webcam.init($bind(this,this._showGenerateBtn));
		} else new js.JQuery("#generate").show();
		this._createBitmap();
	}
	,_startFromImage: function(data) {
		this._mode = "IMAGE";
		this._createLogo();
		this._createBitmap(data);
	}
	,_createBitmap: function(data) {
		this._bitmap = new jp.nabe.utils.MyBitmapData();
		if(this._mode == "WEBCAM") {
			this._bitmap.initB(this._webcam.video);
			this._createBitmap2();
		} else this._bitmap.init(data,$bind(this,this._startFromImage2));
	}
	,_startFromImage2: function() {
		this._createBitmap2();
		this._startGenerate();
	}
	,_createBitmap2: function() {
		this._baseCanvas = this._bitmap.getCanvas();
		new js.JQuery("#container").append(this._baseCanvas);
		this._baseCanvas.style.position = "absolute";
		this._baseCanvas.style.zIndex = "95";
	}
	,_showGenerateBtn: function() {
		this._btns.showGenerateBtn($bind(this,this._startGenerate));
	}
	,_startGenerate: function() {
		this._bitmap.updateImageData();
		this._btns.showDownloadBtn($bind(this,this._goDownload),$bind(this,this._repeat));
		this._img = new Img(this._bitmap,$bind(this,this._draw));
		this._img.split(0,0,1024,1024);
		this._stage.clear();
	}
	,_repeat: function() {
		if(this._timer != null) this._timer.stop();
		this._img.kill();
		this._img = null;
		this._bitmap.kill();
		this._baseCanvas.remove();
		this._bitmap = null;
		this._stage.clear();
		this._shape.graphics.clear();
		this._stage.update();
		this._btns.showEnterance($bind(this,this._startFromWebcam),$bind(this,this._startFromImage));
	}
	,_goDownload: function(e) {
		var canvas = window.document.createElement("canvas");
		canvas.width = this._canvas.width;
		canvas.height = this._canvas.height;
		var ctx = canvas.getContext("2d");
		ctx.beginPath();
		ctx.fillStyle = "rgb(255, 255, 255)";
		ctx.fillRect(0,0,canvas.width,canvas.height);
		ctx.fill();
		if(this._bitmap.visible) ctx.drawImage(this._bitmap.getCanvas(),0,0);
		ctx.drawImage(this._canvas,0,0);
		if(jp.nabe.utils.PCChecker.isPC()) {
			var blob = Base64toBlob.getBlob(canvas.toDataURL("image/png"));
			Base64toBlob.saveBlob(blob,"tokyo2020.png");
		} else window.open(canvas.toDataURL("image/png"),"tokyo2020");
	}
	,reset: function(isRandom) {
		if(isRandom == null) isRandom = false;
		this._shape.graphics.clear();
		this._stage.clear();
		this._img.reset();
		if(isRandom) {
			if(jp.nabe.utils.PCChecker.isPC()) {
				this._img.th_hensa = Math.floor(Math.random() * 20 + 8);
				this._img.th_end_size = Math.pow(2,Math.floor(Math.random() * 4 + 2));
			} else {
				this._img.th_hensa = Math.floor(Math.random() * 20 + 8);
				this._img.th_end_size = Math.pow(2,Math.floor(Math.random() * 3 + 3));
			}
		}
		this._img.split(0,0,1024,1024);
	}
	,_update: function(e) {
		if(this._bitmap != null && this._img == null && this._mode == "WEBCAM") this._bitmap.drawVideo();
		this._stage.update();
		this._shape.graphics.clear();
	}
	,_draw: function(x,y,w,h,color) {
		console.log("draw");
		var r = color >> 16 & 255;
		var g = color >> 8 & 255;
		var b = color & 255;
		var s = w / 100;
		OlympicShape.draw(this._shape.graphics,r,g,b,x,y,w,h);
		if(this._img.counter == -1) {
			this._bitmap.hide();
			this._timer = haxe.Timer.delay($bind(this,this._next),2000);
		}
	}
	,_next: function() {
		this._bitmap.show();
		this.reset(true);
	}
	,_debugGUI: function() {
		if(this.gui == null) {
			this.gui = new dat.GUI({ autoPlace: false });
			this.gui.add(this._img,"th_hensa",5,30).listen();
			this.gui.add(this._img,"th_end_size",2,256).listen();
			this.gui.add(this,"circle");
			this.gui.add(this,"reset");
			this.gui.close();
			this.gui.domElement.style.position = "absolute";
			this.gui.domElement.style.right = "0px";
			this.gui.domElement.style.top = "0px";
			this.gui.domElement.style.zIndex = "1000";
		}
	}
};
var OlympicShape = function() {
};
OlympicShape.draw = function(gg,r,g,b,x,y,w,h) {
	var nn = Math.floor((r + g + b) / 3);
	var n = nn % 16;
	if(n == 0) {
		gg.beginFill(createjs.Graphics.getRGB(54,54,54));
		gg.drawRect(x,y,w,h);
	} else if(n == 1) {
		gg.beginFill(createjs.Graphics.getRGB(180,145,70));
		OlympicShape._drawHanen(gg,x,y,w,h);
	} else if(n == 2) {
		gg.beginFill(createjs.Graphics.getRGB(180,180,180));
		OlympicShape._drawHanen(gg,x,y,w,h);
	} else if(n == 3) {
		gg.beginFill(createjs.Graphics.getRGB(229,1,19));
		gg.drawCircle(x + w / 2,y + h / 2,w / 2);
	} else if(nn < 60) {
		gg.beginFill(createjs.Graphics.getRGB(54,54,54));
		gg.drawRect(x,y,w,h);
	} else if(nn < 120) {
		gg.beginFill(createjs.Graphics.getRGB(180,145,70));
		OlympicShape._drawHanen(gg,x,y,w,h);
	} else if(nn <= 180) {
		gg.beginFill(createjs.Graphics.getRGB(180,180,180));
		OlympicShape._drawHanen(gg,x,y,w,h);
	} else if(nn <= 230) {
		gg.beginFill(createjs.Graphics.getRGB(229,1,19));
		gg.drawCircle(x + w / 2,y + h / 2,w / 2);
	}
	gg.endFill();
};
OlympicShape._drawHanen = function(gg,x,y,w,h) {
	var rr = 0.7;
	var ran = Math.random();
	if(ran < 0.25) OlympicShape._drawHanen1(gg,x,y,x,y + h,x + w,y,x,y,w,h,rr); else if(ran < 0.5) OlympicShape._drawHanen1(gg,x + w,y + h,x + w,y,x,y + h,x,y,w,h,rr); else if(ran < 0.75) OlympicShape._drawHanen1(gg,x + w,y,x,y,x + w,y + h,x,y,w,h,rr); else OlympicShape._drawHanen1(gg,x,y + h,x + w,y + h,x,y,x,y,w,h,rr);
};
OlympicShape._drawHanen1 = function(gg,x1,y1,x2,y2,x3,y3,x,y,w,h,rr) {
	gg.moveTo(x1,y1);
	gg.lineTo(x2,y2);
	var r = rr;
	var xx = r * x1 + (1 - r) * (x + w / 2);
	var yy = r * y1 + (1 - r) * (y + w / 2);
	gg.quadraticCurveTo(xx,yy,x3,y3);
	gg.lineTo(x1,y1);
};
var Webcam = function() {
};
Webcam.prototype = {
	init: function(callback) {
		this._callback = callback;
		this.video = window.document.getElementById("vi");
		this.video.style.display = "none";
		var nav = window.navigator;
		new js.JQuery("#info").show();
		nav.getMedia = nav.getUserMedia || nav.webkitGetUserMedia || nav.mozGetUserMedia || nav.msGetUserMedia;
		nav.getMedia({ video : true, audio : false},$bind(this,this._onHoge),$bind(this,this._onErr));
	}
	,_onErr: function(err) {
		window.alert("ウェブカムが検出できませんでした。");
	}
	,_onHoge: function(stream) {
		new js.JQuery("#info").hide();
		var win = window;
		this.video.src = win.URL.createObjectURL(stream);
		this._callback();
		return true;
	}
};
var haxe = {};
haxe.Timer = function(time_ms) {
	var me = this;
	this.id = setInterval(function() {
		me.run();
	},time_ms);
};
haxe.Timer.delay = function(f,time_ms) {
	var t = new haxe.Timer(time_ms);
	t.run = function() {
		t.stop();
		f();
	};
	return t;
};
haxe.Timer.prototype = {
	stop: function() {
		if(this.id == null) return;
		clearInterval(this.id);
		this.id = null;
	}
	,run: function() {
	}
};
var jp = {};
jp.nabe = {};
jp.nabe.utils = {};
jp.nabe.utils.MyBitmapData = function() {
	this.visible = true;
};
jp.nabe.utils.MyBitmapData.prototype = {
	draw: function() {
	}
	,initB: function(video) {
		if(this._canvas == null) {
			var _this = window.document;
			this._canvas = _this.createElement("canvas");
			this._canvas.id = "bitmap";
			this._context = this._canvas.getContext("2d");
			this._video = video;
			this._canvas.width = 1024;
			this._canvas.height = 1024;
			this._context.drawImage(video,(video.videoWidth - video.videoHeight) / 2,0,video.videoHeight,video.videoHeight,0,0,1024,1024);
			this._width = 1024;
			this._height = 1024;
			this._imageData = this._context.getImageData(0,0,this._width,this._height);
		}
	}
	,drawVideo: function() {
		this._context.drawImage(this._video,(this._video.videoWidth - this._video.videoHeight) / 2,0,this._video.videoHeight,this._video.videoHeight,0,0,1024,1024);
	}
	,init: function(data,callback) {
		var _g = this;
		console.log("init");
		this._callback = callback;
		var _this = window.document;
		this._img = _this.createElement("img");
		this._img.onload = function() {
			var _this1 = window.document;
			_g._canvas = _this1.createElement("canvas");
			_g._canvas.id = "bitmap";
			_g._canvas.style.position = "absolute";
			_g._canvas.style.zIndex = "1000";
			_g._context = _g._canvas.getContext("2d");
			_g._canvas.width = 1024;
			_g._canvas.height = 1024;
			var startX = 0;
			var startY = 0;
			var rect = 0;
			var yokonaga = _g._img.width > _g._img.height;
			if(yokonaga) {
				startX = (_g._img.width - _g._img.height) / 2;
				startY = 0;
				rect = _g._img.height;
			} else {
				startX = 0;
				startY = (_g._img.height - _g._img.width) / 2;
				rect = _g._img.width;
			}
			_g._context.drawImage(_g._img,startX,startY,rect,rect,0,0,1024,1024);
			_g._width = 1024;
			_g._height = 1024;
			_g._imageData = _g._context.getImageData(0,0,1024,1024);
			if(_g._callback != null) _g._callback();
		};
		this._img.src = data;
	}
	,updateImageData: function() {
		if(this._context != null) this._imageData = this._context.getImageData(0,0,this._width,this._height);
	}
	,setPixel: function(color,x,y) {
		var r = (color & 16711680) >> 16;
		var g = (color & 65280) >> 8;
		var b = color & 255;
		var a = (color & -16777216) >> 24;
		var index = (this._width * y + x) * 4;
		this._imageData.data[index] = r;
		this._imageData.data[index + 1] = g;
		this._imageData.data[index + 2] = b;
		this._imageData.data[index + 3] = a;
	}
	,getPixel: function(x,y) {
		var index = (x + y * this._width) * 4;
		var r = this._imageData.data[index];
		var g = this._imageData.data[index + 1];
		var b = this._imageData.data[index + 2];
		var a = this._imageData.data[index + 3];
		return (a << 24) + (r << 16) + (g << 8) + b;
	}
	,show: function() {
		this.visible = true;
		new js.JQuery("#bitmap").show();
	}
	,hide: function() {
		this.visible = false;
		new js.JQuery("#bitmap").hide();
	}
	,getCanvas: function() {
		return this._canvas;
	}
	,kill: function() {
	}
};
jp.nabe.utils.PCChecker = function() {
};
jp.nabe.utils.PCChecker.isPC = function() {
	if(window.navigator.userAgent.indexOf("iPhone") > 0 || window.navigator.userAgent.indexOf("iPad") > 0 || window.navigator.userAgent.indexOf("iPod") > 0 || window.navigator.userAgent.indexOf("Android") > 0) return false;
	return true;
};
jp.nabe.utils.PCChecker.isIE = function() {
	var ua = window.navigator.userAgent.toLowerCase();
	if(ua.indexOf("msie") != -1) return true;
	return false;
};
jp.nabe.utils.PCChecker.isSafari = function() {
	var ua = window.navigator.userAgent.toLowerCase();
	console.log(ua);
	if(ua.indexOf("safari") != -1 && ua.indexOf("chrome") == -1) return true;
	return false;
};
jp.nabe.utils.PCChecker.isFirefox = function() {
	var ua = window.navigator.userAgent.toLowerCase();
	if(ua.indexOf("firefox") != -1) return true;
	return false;
};
var js = {};
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i1) {
	return isNaN(i1);
};
var q = window.jQuery;
js.JQuery = q;
Mosaic.WEBCAM = "WEBCAM";
Mosaic.IMAGE = "IMAGE";
Main.main();
})();

//# sourceMappingURL=FractalMoji.js.map