(function () { "use strict";
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var FontShapeMaker = function() {
};
FontShapeMaker.main = function() {
	new FontShapeMaker();
};
FontShapeMaker.prototype = {
	init: function(json,callback) {
		this.font = new net.badimon.five3D.typography.GenTypography3D();
		if(callback == null) this.font.initByString(json); else this.font.init(json,callback);
	}
	,getWidth: function(moji) {
		return this.font.getWidth(moji);
	}
	,getHeight: function() {
		return this.font.getHeight();
	}
	,getShapes: function(g,moji,isCentering,scale,ox,oy) {
		if(oy == null) oy = 0;
		if(ox == null) ox = 0;
		if(scale == null) scale = 1;
		if(isCentering == null) isCentering = false;
		var motif = this.font.motifs.get(moji);
		var s = scale;
		if(isCentering) {
			ox += -this.font.widths.get(moji) / 2;
			oy += -this.font.height / 2;
		}
		var len = motif.length;
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			var tgt = motif[i][0];
			if(tgt == "M" || tgt == "H") g.moveTo(s * motif[i][1][0] + ox,s * motif[i][1][1] + oy); else if(tgt == "L") g.lineTo(s * motif[i][1][0] + ox,s * motif[i][1][1] + oy); else if(tgt == "C") g.quadraticCurveTo(s * motif[i][1][0] + ox,s * motif[i][1][1] + oy,s * motif[i][1][2] + ox,s * motif[i][1][3] + oy);
		}
	}
};
var Img = function(b,callback) {
	this.counter = 0;
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
	,reset: function() {
		this.counter = 0;
		TweenMax.killAll();
	}
	,_split: function(x,y,w,h) {
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
var Lambda = function() { };
Lambda.exists = function(it,f) {
	var $it0 = it.iterator();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(f(x)) return true;
	}
	return false;
};
var List = function() {
	this.length = 0;
};
List.prototype = {
	iterator: function() {
		return { h : this.h, hasNext : function() {
			return this.h != null;
		}, next : function() {
			if(this.h == null) return null;
			var x = this.h[0];
			this.h = this.h[1];
			return x;
		}};
	}
};
var Main = function() { };
Main.main = function() {
	window.onload = Main.initialize;
};
Main.initialize = function(e) {
	Main._mosaic = new Mosaic();
	Main._mosaic.init();
};
var IMap = function() { };
var Mosaic = function() {
	this.th_hensa = 10;
	this.circle = false;
};
Mosaic.prototype = {
	init: function() {
		this._canvas = window.document.getElementById("canvas");
		this._canvas.width = 1024;
		this._canvas.height = 1024;
		this._stage = new createjs.Stage(this._canvas);
		this._stage.autoClear = false;
		this._shape = new createjs.Shape();
		this._stage.addChild(this._shape);
		createjs.Ticker.setFPS(30);
		createjs.Ticker.addEventListener("tick",$bind(this,this._update));
		window.onresize = $bind(this,this._onResize);
		this._onResize(null);
		this._loading = new createjs.Shape();
		this._loading.graphics.beginStroke("#cc9900").setStrokeStyle(1);
		this._loading.graphics.moveTo(0,0);
		this._loading.graphics.lineTo(1024,1024);
		this._loading.graphics.moveTo(1024,0);
		this._loading.graphics.lineTo(0,1024);
		this._stage.addChild(this._loading);
		this._stage.update();
		this._bitmap = new jp.nabe.utils.MyBitmapData();
		this._bitmap.init("mona.jpg",$bind(this,this._onInit));
	}
	,_onResize: function(e) {
		this._canvas.style.position = "absolute";
		this._canvas.style.top = "0px";
		this._canvas.style.left = window.innerWidth / 2 - 512. + "px";
	}
	,_onInit: function() {
		this._font = new FontShapeMaker();
		this._font.init("AOTFProM2.json",$bind(this,this._onLoad));
	}
	,_onLoad: function() {
		this._img = new Img(this._bitmap,$bind(this,this._draw));
		this._img.split(0,0,1024,1024);
		this._stage.removeChild(this._loading);
		this._loading = null;
		this._stage.clear();
		var gui = new dat.GUI({ autoPlace: false });
		gui.add(this._img,"th_hensa",5,30).listen();
		gui.add(this._img,"th_end_size",2,256).listen();
		gui.add(this,"circle");
		gui.add(this,"reset");
		gui.close();
		window.document.body.appendChild(gui.domElement);
		gui.domElement.style.position = "absolute";
		gui.domElement.style.right = "0px";
		gui.domElement.style.top = "0px";
		gui.domElement.style.zIndex = "1000";
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
				this._img.th_end_size = Math.pow(2,Math.floor(Math.random() * 4 + 3));
			}
		}
		this._img.split(0,0,1024,1024);
	}
	,_update: function(e) {
		if(this._loading != null) {
			this._stage.clear();
			this._stage.update();
			this._loading.alpha = Math.random();
		} else {
			this._stage.update();
			this._shape.graphics.clear();
		}
	}
	,_draw: function(x,y,w,h,color) {
		var r = color >> 16 & 255;
		var g = color >> 8 & 255;
		var b = color & 255;
		this._shape.graphics.beginFill(createjs.Graphics.getRGB(r,g,b));
		var s = w / 100;
		if(this.circle) this._shape.graphics.drawCircle(x + w / 2,y + h / 2,w / 2); else this._font.getShapes(this._shape.graphics,this._font.font.getRandomKey(),false,w / 100,x,y - w / 100 * 32.3);
		this._shape.graphics.endFill();
		if(this._img.counter == -1) haxe.Timer.delay($bind(this,this._next),1000);
	}
	,_next: function() {
		this.reset(true);
	}
};
var Reflect = function() { };
Reflect.getProperty = function(o,field) {
	var tmp;
	if(o == null) return null; else if(o.__properties__ && (tmp = o.__properties__["get_" + field])) return o[tmp](); else return o[field];
};
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
};
var Std = function() { };
Std.parseFloat = function(x) {
	return parseFloat(x);
};
var haxe = {};
haxe.Http = function(url) {
	this.url = url;
	this.headers = new List();
	this.params = new List();
	this.async = true;
};
haxe.Http.prototype = {
	request: function(post) {
		var me = this;
		me.responseData = null;
		var r = this.req = js.Browser.createXMLHttpRequest();
		var onreadystatechange = function(_) {
			if(r.readyState != 4) return;
			var s;
			try {
				s = r.status;
			} catch( e ) {
				s = null;
			}
			if(s == undefined) s = null;
			if(s != null) me.onStatus(s);
			if(s != null && s >= 200 && s < 400) {
				me.req = null;
				me.onData(me.responseData = r.responseText);
			} else if(s == null) {
				me.req = null;
				me.onError("Failed to connect or resolve host");
			} else switch(s) {
			case 12029:
				me.req = null;
				me.onError("Failed to connect to host");
				break;
			case 12007:
				me.req = null;
				me.onError("Unknown host");
				break;
			default:
				me.req = null;
				me.responseData = r.responseText;
				console.log("Unko");
				if("" + r.status == "0") me.onData(me.responseData = r.responseText); else me.onError("Http Error #" + r.status);
			}
		};
		if(this.async) r.onreadystatechange = onreadystatechange;
		var uri = this.postData;
		if(uri != null) post = true; else {
			var $it0 = this.params.iterator();
			while( $it0.hasNext() ) {
				var p = $it0.next();
				if(uri == null) uri = ""; else uri += "&";
				uri += encodeURIComponent(p.param) + "=" + encodeURIComponent(p.value);
			}
		}
		try {
			if(post) r.open("POST",this.url,this.async); else if(uri != null) {
				var question = this.url.split("?").length <= 1;
				r.open("GET",this.url + (question?"?":"&") + uri,this.async);
				uri = null;
			} else r.open("GET",this.url,this.async);
		} catch( e1 ) {
			me.req = null;
			this.onError(e1.toString());
			return;
		}
		if(!Lambda.exists(this.headers,function(h) {
			return h.header == "Content-Type";
		}) && post && this.postData == null) r.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		var $it1 = this.headers.iterator();
		while( $it1.hasNext() ) {
			var h1 = $it1.next();
			r.setRequestHeader(h1.header,h1.value);
		}
		r.send(uri);
		if(!this.async) onreadystatechange(null);
	}
	,onData: function(data) {
	}
	,onError: function(msg) {
	}
	,onStatus: function(status) {
	}
};
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
haxe.ds = {};
haxe.ds.StringMap = function() {
	this.h = { };
};
haxe.ds.StringMap.__interfaces__ = [IMap];
haxe.ds.StringMap.prototype = {
	set: function(key,value) {
		this.h["$" + key] = value;
	}
	,get: function(key) {
		return this.h["$" + key];
	}
};
var jp = {};
jp.nabe = {};
jp.nabe.utils = {};
jp.nabe.utils.MyBitmapData = function() {
};
jp.nabe.utils.MyBitmapData.prototype = {
	init: function(url,callback) {
		console.log("init");
		this._callback = callback;
		var _this = window.document;
		this._canvas = _this.createElement("canvas");
		this._context = this._canvas.getContext("2d");
		this._img = new Image();
		this._img.src = url;
		this._img.onload = $bind(this,this._onInit);
	}
	,_onInit: function() {
		console.log("onInit width/height=" + this._img.width + " " + this._img.height);
		this._canvas.width = this._img.width;
		this._canvas.height = this._img.height;
		this._context.drawImage(this._img,0,0);
		this._width = this._img.width;
		this._height = this._img.height;
		this._imageData = this._context.getImageData(0,0,this._width,this._height);
		if(this._callback != null) this._callback();
	}
	,updateImageData: function() {
		this._imageData = this._context.getImageData(0,0,this._width,this._height);
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
};
jp.nabe.utils.PCChecker = function() {
};
jp.nabe.utils.PCChecker.isPC = function() {
	if(window.navigator.userAgent.indexOf("iPhone") > 0 && window.navigator.userAgent.indexOf("iPad") == -1 || window.navigator.userAgent.indexOf("iPod") > 0 || window.navigator.userAgent.indexOf("Android") > 0) return false;
	return true;
};
var js = {};
js.Browser = function() { };
js.Browser.createXMLHttpRequest = function() {
	if(typeof XMLHttpRequest != "undefined") return new XMLHttpRequest();
	if(typeof ActiveXObject != "undefined") return new ActiveXObject("Microsoft.XMLHTTP");
	throw "Unable to create XMLHttpRequest object.";
};
var net = {};
net.badimon = {};
net.badimon.five3D = {};
net.badimon.five3D.typography = {};
net.badimon.five3D.typography.Typography3D = function() {
	this.motifs = new haxe.ds.StringMap();
	this.widths = new haxe.ds.StringMap();
};
net.badimon.five3D.typography.Typography3D.prototype = {
	getMotif: function($char) {
		return this.motifs.get($char);
	}
	,getWidth: function($char) {
		return this.widths.get($char);
	}
	,getHeight: function() {
		return this.height;
	}
};
net.badimon.five3D.typography.GenTypography3D = function() {
	this.keys = [];
	net.badimon.five3D.typography.Typography3D.call(this);
};
net.badimon.five3D.typography.GenTypography3D.__super__ = net.badimon.five3D.typography.Typography3D;
net.badimon.five3D.typography.GenTypography3D.prototype = $extend(net.badimon.five3D.typography.Typography3D.prototype,{
	init: function(uri,callback) {
		this._callback = callback;
		var http = new haxe.Http(uri);
		http.onData = $bind(this,this._onLoad);
		http.request(false);
	}
	,initByString: function(jsonStr) {
		this._onLoad(jsonStr);
	}
	,getRandomKey: function() {
		return this.keys[Math.floor(Math.random() * this.keys.length)];
	}
	,_onLoad: function(data) {
		var o = JSON.parse(data);
		var _g = 0;
		var _g1 = Reflect.fields(o);
		while(_g < _g1.length) {
			var key = _g1[_g];
			++_g;
			if(key == "height") this.height = Reflect.getProperty(o,key); else this._initTypo(key,Reflect.getProperty(o,key));
		}
		this._callback();
	}
	,_initTypo: function(key,ary) {
		this.widths.set(key,ary[0]);
		var motif = [];
		var _g1 = 1;
		var _g = ary.length;
		while(_g1 < _g) {
			var i = _g1++;
			motif.push(this._initAry(ary[i]));
		}
		this.motifs.set(key,motif);
		this.keys.push(key);
	}
	,_initAry: function(str) {
		var list = str.split(",");
		var out = [];
		out[0] = list[0];
		if(out[0] == "C") out[1] = [Std.parseFloat(list[1]),Std.parseFloat(list[2]),Std.parseFloat(list[3]),Std.parseFloat(list[4])]; else out[1] = [Std.parseFloat(list[1]),Std.parseFloat(list[2])];
		return out;
	}
});
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
Main.main();
})();
