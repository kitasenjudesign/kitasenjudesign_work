(function () { "use strict";
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var BgDrawer = function() {
	createjs.Container.call(this);
};
BgDrawer.__name__ = true;
BgDrawer.__super__ = createjs.Container;
BgDrawer.prototype = $extend(createjs.Container.prototype,{
	init: function(img) {
		this._img = img;
		var stgWidth = window.innerWidth;
		var stgHeight = window.innerHeight;
		this._shape1 = new createjs.Shape();
		this._shape1.y = 0;
		this._shape1.graphics.beginBitmapFill(this._img);
		this._shape1.graphics.drawRect(0,0,stgWidth,stgHeight / 2);
		var mm = new createjs.Matrix2D();
		mm.translate(0,-stgHeight / 2 + 1);
		this._shape2 = new createjs.Shape();
		this._shape2.y = Math.floor(stgHeight / 2) - 1;
		this._shape2.graphics.beginBitmapFill(this._img,null,mm);
		this._shape2.graphics.drawRect(0,0,stgWidth,stgHeight / 2);
		this.addChild(this._shape1);
		this.addChild(this._shape2);
	}
	,update: function() {
	}
});
var Circles = function() {
	this._r = 0;
	this._drawSpeed = 40;
	this._speed = 0;
	this._phase3 = 0;
	this._phase2 = 0;
	this._phase1 = 0;
	this._yy = 0;
	this._xx = 0;
	this._amp3 = 0;
	this._amp2 = 0;
	this._amp1 = 0;
	this._freq3 = 0;
	this._freq2 = 0;
	this._freq1 = 0;
	this._radSpeed3 = 0;
	this._radSpeed2 = 0;
	this._radSpeed1 = 0;
	this._rad = 0;
	this._h = 600;
	this._w = 1000;
	this._count = 0;
};
Circles.__name__ = true;
Circles.prototype = {
	init: function(stage,stage2) {
		console.log("init");
		this._stage1 = stage;
		this._speed = 2 * Math.PI / 90;
		this._shape = new createjs.Shape();
		stage.addChild(this._shape);
		this.guide = new Guide();
		this.guide.init();
		stage2.addChild(this.guide);
		this.reset();
		var gui = new dat.GUI({ autoPlace: false });
		var hoge = gui.add(this,"_freq1",-100,100).listen();
		hoge.onChange($bind(this,this._clear));
		hoge = gui.add(this,"_freq2",-100,100).listen();
		hoge.onChange($bind(this,this._clear));
		hoge = gui.add(this,"_r",0,1).listen();
		hoge.onChange($bind(this,this._clear));
		gui.add(this,"_drawSpeed",5,100).listen();
		gui.add(this,"random");
		gui.domElement.style.position = "absolute";
		gui.domElement.style.right = "0px";
		gui.domElement.style.top = "0px";
		gui.domElement.style.zIndex = "100000";
		window.document.body.appendChild(gui.domElement);
	}
	,random: function() {
		this._clear();
		this.reset();
	}
	,_clear: function() {
		console.log("clear");
		this._stage1.clear();
	}
	,reset: function() {
		this._r = Math.random();
		this._freq1 = Math.floor(100 * (Math.random() - 0.5));
		this._freq2 = Math.floor(100 * (Math.random() - 0.5));
		this._freq3 = Math.floor(100 * (Math.random() - 0.5));
		this._phase1 = Math.random() * 2 * Math.PI;
		this._phase2 = Math.random() * 2 * Math.PI;
		this._phase3 = Math.random() * 2 * Math.PI;
		this._amp1 = 250 * Math.random();
		this._amp2 = 250 * Math.random();
		this._amp3 = 250 * Math.random();
	}
	,update: function() {
		this._radSpeed1 = 2 * Math.PI / this._freq1;
		this._radSpeed2 = 2 * Math.PI / this._freq2;
		this._radSpeed3 = 2 * Math.PI / this._freq3;
		var g = this._shape.graphics;
		g.clear();
		g.beginStroke("#000000");
		var _g1 = 0;
		var _g = this._drawSpeed;
		while(_g1 < _g) {
			var i = _g1++;
			this._rad += this._speed;
			var xx = this._w / 2 + this._amp1 * Math.cos(this._rad * this._radSpeed1 + this._phase1);
			var yy = this._h / 2 + this._amp1 * Math.sin(this._rad * this._radSpeed1 + this._phase1);
			var xxx = xx + this._amp2 * Math.cos(this._rad * this._radSpeed2 + this._phase2);
			var yyy = yy + this._amp2 * Math.sin(this._rad * this._radSpeed2 + this._phase2);
			var xxxx = xxx + this._amp3 * Math.cos(this._rad * this._radSpeed3 + this._phase3);
			var yyyy = yyy + this._amp3 * Math.sin(this._rad * this._radSpeed3 + this._phase3);
			if(i == 0) g.moveTo(xxxx,yyyy);
			g.lineTo(xxxx,yyyy);
		}
		this._rad -= this._speed;
		this.guide.update(this._rad * this._radSpeed1,this._rad * this._radSpeed2,this._rad * this._radSpeed3,this._amp1,this._amp2,this._amp3,this._phase1,this._phase2,this._phase3,this._w,this._h);
	}
	,resize: function(width,height) {
		this._w = width;
		this._h = height;
	}
};
var FontTest = function() {
};
FontTest.__name__ = true;
FontTest.getLetterPoints = function(g,moji,isCentering,scale,letter,oxx,oyy) {
	if(oyy == null) oyy = 0;
	if(oxx == null) oxx = 0;
	if(scale == null) scale = 1;
	if(isCentering == null) isCentering = false;
	var minY = 0;
	var maxY = 0;
	var shape = g;
	var motif = letter.motifs.get(moji);
	if(motif == null || motif.length == 0) return;
	var ox = oxx;
	var oy = oyy;
	var s = scale;
	if(isCentering) {
		ox += -letter.widths.get(moji) / 2;
		oy += -letter.height / 2;
	}
	var len = motif.length;
	var count = 0;
	var _g = 0;
	while(_g < len) {
		var i = _g++;
		var tgt = motif[i][0];
		if(tgt == "M") {
			g.moveTo(s * (motif[i][1][0] + ox),s * (motif[i][1][1] + oy));
			minY = Math.min(minY,s * (motif[i][1][1] + oy));
			maxY = Math.max(maxY,s * (motif[i][1][1] + oy));
			count++;
		} else if(tgt == "L") {
			g.lineTo(s * (motif[i][1][0] + ox),s * (motif[i][1][1] + oy));
			minY = Math.min(minY,s * (motif[i][1][1] + oy));
			maxY = Math.max(maxY,s * (motif[i][1][1] + oy));
		} else if(tgt == "C") {
			g.quadraticCurveTo(s * (motif[i][1][0] + ox),s * (motif[i][1][1] + oy),s * (motif[i][1][2] + ox),s * (motif[i][1][3] + oy));
			minY = Math.min(minY,s * (motif[i][1][3] + oy));
			maxY = Math.max(maxY,s * (motif[i][1][3] + oy));
		}
	}
	console.log("moji=" + moji + " height=" + (maxY - minY));
};
var Guide = function() {
	createjs.Container.call(this);
};
Guide.__name__ = true;
Guide.__super__ = createjs.Container;
Guide.prototype = $extend(createjs.Container.prototype,{
	init: function() {
		this._shape = new createjs.Shape();
		this.addChild(this._shape);
	}
	,update: function(rad1,rad2,rad3,amp1,amp2,amp3,phase1,phase2,phase3,ww,hh) {
		this._shape.graphics.clear();
		this._shape.graphics.beginStroke("#ff0000");
		this._shape.graphics.moveTo(ww / 2,hh / 2);
		var xx = ww / 2 + amp1 * Math.cos(rad1 + phase1);
		var yy = hh / 2 + amp1 * Math.sin(rad1 + phase1);
		this._shape.graphics.lineTo(xx,yy);
		var xxx = xx + amp2 * Math.cos(rad2 + phase2);
		var yyy = yy + amp2 * Math.sin(rad2 + phase2);
		this._shape.graphics.lineTo(xxx,yyy);
		var xxxx = xxx + amp3 * Math.cos(rad3 + phase3);
		var yyyy = yyy + amp3 * Math.sin(rad3 + phase3);
		this._shape.graphics.lineTo(xxxx,yyyy);
		this._shape.graphics.beginFill("#000000");
		this._shape.graphics.drawCircle(xxxx,yyyy,3);
		this._shape.graphics.endFill();
		this._shape.graphics.beginFill("#000000");
		this._shape.graphics.drawCircle(xxx,yyy,3);
		this._shape.graphics.endFill();
		this._shape.graphics.beginFill("#ff0000");
		this._shape.graphics.drawCircle(xx,yy,3);
		this._shape.graphics.endFill();
		this._shape.graphics.beginFill("#ff0000");
		this._shape.graphics.drawCircle(ww / 2,hh / 2,3);
		this._shape.graphics.endFill();
	}
});
var HxOverrides = function() { };
HxOverrides.__name__ = true;
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
};
var Lambda = function() { };
Lambda.__name__ = true;
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
List.__name__ = true;
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
var Main = function() {
	window.onload = $bind(this,this.initialize);
};
Main.__name__ = true;
Main.main = function() {
	new Main();
};
Main._update = function(e) {
	if(Main._typo != null) Main._typo.update();
	if(Main._bg != null) Main._bg.update();
	Main._stage1.update();
	Main._stage2.update();
};
Main.prototype = {
	initialize: function(e) {
		Main._loader = new data.MapDataList();
		Main._loader.load($bind(this,this._onLoad));
	}
	,_onLoad: function() {
		Main._canvas1 = window.document.getElementById("canvas1");
		Main._canvas2 = window.document.getElementById("canvas2");
		Main._stage1 = new createjs.Stage(Main._canvas1);
		Main._stage1.autoClear = false;
		Main._stage2 = new createjs.Stage(Main._canvas2);
		Main._stage2.autoClear = false;
		createjs.Ticker.setFPS(30);
		createjs.Ticker.addEventListener("tick",Main._update);
		window.onresize = $bind(this,this._onResize);
		this._onResize(null);
		Main._stage2.addEventListener("stagemousedown",$bind(this,this._onDown));
		this._onDown();
	}
	,_onDown: function(e) {
		console.log("_onDown");
		new js.JQuery("#canvas1").hide();
		new js.JQuery("#canvas2").hide();
		Main._stage1.clear();
		Main._stage2.clear();
		this._data = Main._loader.getRandom();
		new js.JQuery("#region_no").text("#" + this._data.id);
		new js.JQuery("#title").text(this._data.title);
		new js.JQuery("#footer").off("click");
		new js.JQuery("#footer").on("click",$bind(this,this._goMap));
		new js.JQuery("#footer").css({ left : window.innerWidth / 2 - new js.JQuery("#footer").width() / 2, top : window.innerHeight - new js.JQuery("#footer").height() - 20});
		if(Main._typo != null) Main._stage2.removeChild(Main._typo);
		Main._typo = new MainDrawer();
		Main._typo.init(this._data,$bind(this,this._onLoadMainDrawer));
		Main._stage2.addChild(Main._typo);
	}
	,_onLoadMainDrawer: function() {
		if(Main._bg != null) Main._stage1.removeChild(Main._bg);
		new js.JQuery("#canvas1").show();
		new js.JQuery("#canvas2").show();
		Main._bg = new BgDrawer();
		Main._bg.init(Main._typo.getImage());
		Main._stage1.addChild(Main._bg);
		Main._stage1.update();
		Main._stage2.update();
	}
	,_goMap: function(e) {
		window.open(this._data.url,"map");
	}
	,_onResize: function(e) {
		Main._canvas1.width = window.innerWidth;
		Main._canvas1.height = window.innerHeight;
		Main._canvas2.width = window.innerWidth;
		Main._canvas2.height = window.innerHeight;
		Main._stage1.clear();
	}
};
var MainDrawer = function() {
	this._isStart = false;
	this._rotSpeed = 0;
	this._counter = 0;
	this._flag = false;
	createjs.Container.call(this);
};
MainDrawer.__name__ = true;
MainDrawer.__super__ = createjs.Container;
MainDrawer.prototype = $extend(createjs.Container.prototype,{
	init: function(data,callback) {
		this._data = data;
		this._callback = callback;
		if(Math.random() < 0.5) this._flag = true; else this._flag = false;
		this._helv = new net.badimon.five3D.typography.Neue();
		if(Math.random() < 0.5) this._rotSpeed = 0.33; else this._rotSpeed = -0.33;
		var _this = window.document;
		this._img = _this.createElement("img");
		this._img.src = data.image;
		this._container = new createjs.Container();
		this.addChild(this._container);
		this._img.onload = $bind(this,this._onLoad);
	}
	,_onLoad: function(e) {
		this._shapes = [];
		var str = this._data.region;
		var space = 20;
		var width = (str.length - 1) * space;
		var _g1 = 0;
		var _g = str.length;
		while(_g1 < _g) {
			var i = _g1++;
			width += this._helv.getWidth(HxOverrides.substr(str,i,1).toUpperCase()) * 2;
		}
		var ox = -width / 2;
		var scale = window.innerWidth / width;
		this._container.scaleX = scale;
		this._container.scaleY = scale;
		this._container.x = window.innerWidth / 2;
		this._container.y = window.innerHeight / 2;
		var _g11 = 0;
		var _g2 = str.length;
		while(_g11 < _g2) {
			var i1 = _g11++;
			var ss = HxOverrides.substr(str,i1,1).toUpperCase();
			var ww = this._helv.getWidth(ss) * 2;
			ox += ww / 2;
			this._makeTypo(ss,ox,0,scale);
			ox += ww / 2 + space;
		}
		if(this._callback != null) this._callback();
	}
	,_makeTypo: function(moji,xx,yy,scale) {
		var m = new createjs.Matrix2D();
		m.scale(1 / scale,1 / scale);
		m.translate(-xx - this._container.x / scale,-yy - this._container.y / scale);
		var shape = new createjs.Shape();
		shape.graphics.beginBitmapFill(this._img,null,m);
		shape.x = xx;
		shape.y = yy;
		this._container.addChild(shape);
		FontTest.getLetterPoints(shape.graphics,moji,true,2,this._helv);
		this._shapes.push(shape);
		haxe.Timer.delay($bind(this,this._start),1000);
	}
	,_start: function() {
		this._motionData = data.MotionData.getData();
		this._isStart = true;
	}
	,update: function() {
		this._counter++;
		if(this._isStart) {
			this._container.x += this._motionData.speedX;
			this._container.y += this._motionData.speedY;
			this._container.rotation += this._motionData.speedR;
			if(this._container.x < 0) this._container.x = window.innerWidth; else this._container.x = this._container.x % window.innerWidth;
			if(this._container.y < 0) this._container.y = window.innerHeight; else this._container.y = this._container.y % window.innerHeight;
		}
		if(this._shapes != null) {
			var _g1 = 0;
			var _g = this._shapes.length;
			while(_g1 < _g) {
				var i = _g1++;
				this._shapes[i].rotation += this._motionData.speedLocalR;
			}
		}
	}
	,getImage: function() {
		return this._img;
	}
});
var IMap = function() { };
IMap.__name__ = true;
Math.__name__ = true;
var Std = function() { };
Std.__name__ = true;
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
};
var _Three = {};
_Three.CullFace_Impl_ = function() { };
_Three.CullFace_Impl_.__name__ = true;
_Three.FrontFaceDirection_Impl_ = function() { };
_Three.FrontFaceDirection_Impl_.__name__ = true;
_Three.ShadowMapType_Impl_ = function() { };
_Three.ShadowMapType_Impl_.__name__ = true;
_Three.Side_Impl_ = function() { };
_Three.Side_Impl_.__name__ = true;
_Three.Shading_Impl_ = function() { };
_Three.Shading_Impl_.__name__ = true;
_Three.Colors_Impl_ = function() { };
_Three.Colors_Impl_.__name__ = true;
_Three.BlendMode_Impl_ = function() { };
_Three.BlendMode_Impl_.__name__ = true;
_Three.BlendingEquation_Impl_ = function() { };
_Three.BlendingEquation_Impl_.__name__ = true;
_Three.BlendingDestinationFactor_Impl_ = function() { };
_Three.BlendingDestinationFactor_Impl_.__name__ = true;
_Three.TextureConstant_Impl_ = function() { };
_Three.TextureConstant_Impl_.__name__ = true;
_Three.WrappingMode_Impl_ = function() { };
_Three.WrappingMode_Impl_.__name__ = true;
_Three.Filter_Impl_ = function() { };
_Three.Filter_Impl_.__name__ = true;
_Three.DataType_Impl_ = function() { };
_Three.DataType_Impl_.__name__ = true;
_Three.PixelType_Impl_ = function() { };
_Three.PixelType_Impl_.__name__ = true;
_Three.PixelFormat_Impl_ = function() { };
_Three.PixelFormat_Impl_.__name__ = true;
_Three.TextureFormat_Impl_ = function() { };
_Three.TextureFormat_Impl_.__name__ = true;
_Three.LineType_Impl_ = function() { };
_Three.LineType_Impl_.__name__ = true;
var Three = function() { };
Three.__name__ = true;
Three.requestAnimationFrame = function(f) {
	return window.requestAnimationFrame(f);
};
Three.cancelAnimationFrame = function(f) {
	window.cancelAnimationFrame(id);
};
var data = {};
data.MapData = function(o) {
	this.region = "";
	this.title = "";
	this.url = "";
	this.map = "";
	this.image = "";
	this.id = "";
	this.image = o.image;
	var imgAry = this.image.split("/");
	this.id = imgAry[imgAry.length - 1].split(".")[0];
	this.title = this.title.toUpperCase();
	if(o.region != "") {
		this.title = Std.string(o.region) + ", " + Std.string(o.country);
		this.region = o.region;
		this.url = "https://earthview.withgoogle.com/" + this.region + "-" + Std.string(o.country) + "-" + this.id;
	} else {
		this.title = o.country;
		this.region = o.country;
		this.url = "https://earthview.withgoogle.com/" + Std.string(o.country) + "-" + this.id;
	}
	this.map = o.map;
};
data.MapData.__name__ = true;
data.MapDataList = function() {
};
data.MapDataList.__name__ = true;
data.MapDataList.prototype = {
	load: function(callback) {
		this._list = [];
		this._callback = callback;
		this._http = new haxe.Http("earthview.json");
		this._http.onData = $bind(this,this._onLoad);
		this._http.request();
	}
	,_onLoad: function(str) {
		var list = JSON.parse(str);
		var _g1 = 0;
		var _g = list.length;
		while(_g1 < _g) {
			var i = _g1++;
			var data1 = new data.MapData(list[i]);
			this._list.push(data1);
		}
		if(this._callback != null) this._callback();
	}
	,getRandom: function() {
		return this._list[Math.floor(Math.random() * this._list.length)];
	}
};
data.MotionData = function(xx,yy,rr,localRot) {
	if(localRot == null) localRot = 0;
	this.speedLocalR = 0;
	this.speedR = 0;
	this.speedY = 0;
	this.speedX = 0;
	this.speedX = xx;
	this.speedY = yy;
	this.speedR = rr;
	this.speedLocalR = localRot;
};
data.MotionData.__name__ = true;
data.MotionData.getData = function() {
	return data.MotionData.list[Math.floor(Math.random() * data.MotionData.list.length)];
};
var haxe = {};
haxe.Http = function(url) {
	this.url = url;
	this.headers = new List();
	this.params = new List();
	this.async = true;
};
haxe.Http.__name__ = true;
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
				me.onError("Http Error #" + r.status);
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
haxe.Timer.__name__ = true;
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
haxe.ds.StringMap.__name__ = true;
haxe.ds.StringMap.__interfaces__ = [IMap];
haxe.ds.StringMap.prototype = {
	set: function(key,value) {
		this.h["$" + key] = value;
	}
	,get: function(key) {
		return this.h["$" + key];
	}
};
var js = {};
js.Boot = function() { };
js.Boot.__name__ = true;
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i1;
			var str1 = "[";
			s += "\t";
			var _g2 = 0;
			while(_g2 < l) {
				var i2 = _g2++;
				str1 += (i2 > 0?",":"") + js.Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str2 = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str2.length != 2) str2 += ", \n";
		str2 += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str2 += "\n" + s + "}";
		return str2;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
};
js.Browser = function() { };
js.Browser.__name__ = true;
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
net.badimon.five3D.typography.Typography3D.__name__ = true;
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
net.badimon.five3D.typography.HelveticaMedium = function() {
	net.badimon.five3D.typography.Typography3D.call(this);
	this.initializeMotifsUppercase();
	this.initializeMotifsLowercase();
	this.initializeMotifsNumbers();
	this.initializeMotifsPunctuation();
	this.initializeWidthsUppercase();
	this.initializeWidthsLowercase();
	this.initializeWidthsNumbers();
	this.initializeWidthsPunctuation();
	this.height = 117;
};
net.badimon.five3D.typography.HelveticaMedium.__name__ = true;
net.badimon.five3D.typography.HelveticaMedium.__super__ = net.badimon.five3D.typography.Typography3D;
net.badimon.five3D.typography.HelveticaMedium.prototype = $extend(net.badimon.five3D.typography.Typography3D.prototype,{
	initializeMotifsUppercase: function() {
		this.motifs.set("A",[["M",[26.7,23.8]],["L",[-0.7,95.2]],["L",[12.2,95.2]],["L",[18.95,76.3]],["L",[47.4,76.3]],["L",[54.1,95.2]],["L",[67.55,95.2]],["L",[40.05,23.8]],["L",[26.7,23.8]],["M",[33.45,36.1]],["L",[44.15,66.8]],["L",[22.3,66.8]],["L",[33.1,36.1]],["L",[33.45,36.1]]]);
		this.motifs.set("B",[["M",[51,43.8]],["C",[50.9,48.6,48,51.15]],["C",[45.05,53.7,40.5,53.7]],["L",[20.1,53.7]],["L",[20.1,34]],["L",[40.5,34]],["C",[45.6,33.95,48.3,36.2]],["C",[51,38.45,51,43.8]],["M",[42.3,23.8]],["L",[7.6,23.8]],["L",[7.6,95.2]],["L",[40.45,95.2]],["C",[49.6,95.15,55.4,92.5]],["C",[61.3,89.95,64,85.45]],["C",[66.7,80.95,66.7,75.3]],["C",[66.65,67.95,63.3,63.15]],["C",[59.85,58.4,53.3,56.85]],["L",[53.3,56.65]],["C",[58.2,54.6,60.85,50.75]],["C",[63.45,46.9,63.5,41.5]],["C",[63.45,35.6,60.85,31.65]],["C",[58.2,27.7,53.45,25.75]],["C",[48.75,23.8,42.3,23.8]],["M",[20.1,62.7]],["L",[42.2,62.7]],["C",[47.95,62.75,51.05,65.55]],["C",[54.15,68.4,54.2,73.65]],["C",[54.15,79.15,51.05,82.05]],["C",[47.95,84.95,42.2,85]],["L",[20.1,85]],["L",[20.1,62.7]]]);
		this.motifs.set("C",[["M",[68.3,46.5]],["C",[67.5,38.8,63.4,33.35]],["C",[59.25,27.9,52.7,25.05]],["C",[46.15,22.2,38,22.1]],["C",[30,22.15,23.65,25.1]],["C",[17.3,28,12.9,33.15]],["C",[8.45,38.3,6.15,45.05]],["C",[3.8,51.8,3.8,59.5]],["C",[3.8,67.2,6.15,73.95]],["C",[8.45,80.7,12.9,85.85]],["C",[17.3,91,23.65,93.95]],["C",[30,96.85,38,96.9]],["C",[46.75,96.85,53.35,93.2]],["C",[60,89.6,63.9,83.1]],["C",[67.85,76.6,68.4,68]],["L",[56.2,68]],["C",[55.7,73.3,53.5,77.5]],["C",[51.3,81.65,47.4,84.15]],["C",[43.55,86.65,38,86.7]],["C",[32.3,86.65,28.15,84.35]],["C",[24,82.1,21.45,78.25]],["C",[18.8,74.4,17.55,69.5]],["C",[16.3,64.7,16.3,59.5]],["C",[16.3,54.35,17.55,49.5]],["C",[18.8,44.6,21.45,40.75]],["C",[24,36.9,28.15,34.65]],["C",[32.3,32.35,38,32.3]],["C",[45.75,32.4,50,36.3]],["C",[54.3,40.2,55.8,46.5]],["L",[68.3,46.5]]]);
		this.motifs.set("D",[["M",[55.15,28.7]],["C",[48.2,23.9,37.2,23.8]],["L",[7.6,23.8]],["L",[7.6,95.2]],["L",[37.2,95.2]],["C",[48.2,95.1,55.15,90.3]],["C",[62.1,85.6,65.45,77.5]],["C",[68.75,69.45,68.7,59.5]],["C",[68.75,49.55,65.45,41.5]],["C",[62.1,33.45,55.15,28.7]],["M",[54.4,46.55]],["C",[56.3,52.3,56.2,59.5]],["C",[56.3,66.75,54.4,72.45]],["C",[52.5,78.2,47.25,81.6]],["C",[42.1,84.95,32.4,85]],["L",[20.1,85]],["L",[20.1,34]],["L",[32.4,34]],["C",[42.1,34.05,47.25,37.45]],["C",[52.5,40.8,54.4,46.55]]]);
		this.motifs.set("E",[["M",[59.05,23.8]],["L",[7.6,23.8]],["L",[7.6,95.2]],["L",[59.7,95.2]],["L",[59.7,84.4]],["L",[20.1,84.4]],["L",[20.1,63.5]],["L",[56.1,63.5]],["L",[56.1,53.3]],["L",[20.1,53.3]],["L",[20.1,34.6]],["L",[59.05,34.6]],["L",[59.05,23.8]]]);
		this.motifs.set("F",[["M",[56.95,23.8]],["L",[7.6,23.8]],["L",[7.6,95.2]],["L",[20.1,95.2]],["L",[20.1,63.5]],["L",[52.4,63.5]],["L",[52.4,53.3]],["L",[20.1,53.3]],["L",[20.1,34.6]],["L",[56.95,34.6]],["L",[56.95,23.8]]]);
		this.motifs.set("G",[["M",[52.95,24.85]],["C",[46.4,22.1,38.5,22.1]],["C",[30.45,22.15,24.1,25.1]],["C",[17.75,28,13.4,33.15]],["C",[8.95,38.3,6.65,45.05]],["C",[4.3,51.8,4.3,59.5]],["C",[4.3,67.2,6.65,73.95]],["C",[8.95,80.7,13.4,85.85]],["C",[17.75,91,24.1,93.95]],["C",[30.45,96.85,38.5,96.9]],["C",[44.9,97,50,94.7]],["C",[55.1,92.4,60,86.8]],["L",[61.9,95.2]],["L",[69.85,95.2]],["L",[69.85,57.6]],["L",[39.5,57.6]],["L",[39.5,67.1]],["L",[58.5,67.1]],["C",[58.3,76.3,53.2,81.55]],["C",[48.15,86.75,38.5,86.7]],["C",[32.75,86.65,28.65,84.35]],["C",[24.5,82.1,21.9,78.25]],["C",[19.3,74.4,18,69.55]],["C",[16.8,64.7,16.8,59.5]],["C",[16.8,54.35,18,49.5]],["C",[19.3,44.6,21.9,40.75]],["C",[24.5,36.9,28.65,34.65]],["C",[32.75,32.35,38.5,32.3]],["C",[43.05,32.3,47,33.9]],["C",[50.95,35.5,53.6,38.65]],["C",[56.25,41.8,56.9,46.5]],["L",[69.1,46.5]],["C",[68.05,38.45,63.75,33.05]],["C",[59.45,27.6,52.95,24.85]]]);
		this.motifs.set("H",[["M",[52.3,23.8]],["L",[52.3,52.2]],["L",[19.8,52.2]],["L",[19.8,23.8]],["L",[7.3,23.8]],["L",[7.3,95.2]],["L",[19.8,95.2]],["L",[19.8,62.95]],["L",[52.3,62.95]],["L",[52.3,95.2]],["L",[64.8,95.2]],["L",[64.8,23.8]],["L",[52.3,23.8]]]);
		this.motifs.set("I",[["M",[7.6,23.8]],["L",[7.6,95.2]],["L",[20.1,95.2]],["L",[20.1,23.8]],["L",[7.6,23.8]]]);
		this.motifs.set("J",[["M",[13.8,70.2]],["L",[1.3,70.2]],["L",[1.3,74]],["C",[1.3,80.55,3.45,85.75]],["C",[5.65,90.85,10.4,93.9]],["C",[15.1,96.85,22.6,96.9]],["C",[30.2,96.85,34.9,94.8]],["C",[39.6,92.7,42.05,89.2]],["C",[44.45,85.7,45.3,81.3]],["C",[46.15,76.9,46.1,72.2]],["L",[46.1,23.8]],["L",[33.6,23.8]],["L",[33.6,72.9]],["C",[33.65,77.4,32.8,80.45]],["C",[32,83.55,29.8,85.1]],["C",[27.65,86.7,23.6,86.7]],["C",[18,86.65,15.85,83.35]],["C",[13.7,80,13.8,73.9]],["L",[13.8,70.2]]]);
		this.motifs.set("K",[["M",[51.9,23.8]],["L",[20.1,56.3]],["L",[20.1,23.8]],["L",[7.6,23.8]],["L",[7.6,95.2]],["L",[20.1,95.2]],["L",[20.1,71.2]],["L",[30.3,61.05]],["L",[53.7,95.2]],["L",[69.35,95.2]],["L",[38.8,52.3]],["L",[67.35,23.8]],["L",[51.9,23.8]]]);
		this.motifs.set("L",[["M",[7.6,23.8]],["L",[7.6,95.2]],["L",[56.4,95.2]],["L",[56.4,84.4]],["L",[20.1,84.4]],["L",[20.1,23.8]],["L",[7.6,23.8]]]);
		this.motifs.set("M",[["M",[81.5,23.8]],["L",[64.05,23.8]],["L",[44.85,79.7]],["L",[44.7,79.7]],["L",[25,23.8]],["L",[7.35,23.8]],["L",[7.35,95.2]],["L",[19.3,95.2]],["L",[19.3,40.1]],["L",[19.5,40.1]],["L",[39.3,95.2]],["L",[49.55,95.2]],["L",[69.4,40.1]],["L",[69.6,40.1]],["L",[69.6,95.2]],["L",[81.5,95.2]],["L",[81.5,23.8]]]);
		this.motifs.set("N",[["M",[53.1,23.8]],["L",[53.1,76.4]],["L",[52.9,76.4]],["L",[20.25,23.8]],["L",[7.1,23.8]],["L",[7.1,95.2]],["L",[19,95.2]],["L",[19,42.7]],["L",[19.3,42.7]],["L",[51.8,95.2]],["L",[65,95.2]],["L",[65,23.8]],["L",[53.1,23.8]]]);
		this.motifs.set("O",[["M",[54.6,40.75]],["C",[57.25,44.6,58.5,49.5]],["C",[59.7,54.35,59.7,59.5]],["C",[59.7,64.7,58.5,69.5]],["C",[57.25,74.4,54.6,78.25]],["C",[52,82.1,47.85,84.35]],["C",[43.75,86.65,38.05,86.7]],["C",[32.3,86.65,28.15,84.35]],["C",[24,82.1,21.45,78.25]],["C",[18.8,74.4,17.55,69.5]],["C",[16.3,64.7,16.3,59.5]],["C",[16.3,54.35,17.55,49.5]],["C",[18.8,44.6,21.45,40.75]],["C",[24,36.9,28.15,34.65]],["C",[32.3,32.35,38.05,32.3]],["C",[43.75,32.35,47.85,34.65]],["C",[52,36.9,54.6,40.75]],["M",[52.4,25.1]],["C",[46.05,22.15,38.05,22.1]],["C",[30,22.15,23.65,25.1]],["C",[17.3,28,12.9,33.15]],["C",[8.45,38.3,6.15,45.05]],["C",[3.8,51.8,3.8,59.5]],["C",[3.8,67.2,6.15,73.95]],["C",[8.45,80.7,12.9,85.85]],["C",[17.3,91,23.65,93.95]],["C",[30,96.85,38.05,96.9]],["C",[46.05,96.85,52.4,93.95]],["C",[58.75,91,63.15,85.85]],["C",[67.6,80.7,69.85,73.95]],["C",[72.2,67.2,72.2,59.5]],["C",[72.2,51.8,69.85,45.05]],["C",[67.6,38.3,63.15,33.15]],["C",[58.75,28,52.4,25.1]]]);
		this.motifs.set("P",[["M",[51.45,26]],["C",[46.7,23.85,39.1,23.8]],["L",[7.6,23.8]],["L",[7.6,95.2]],["L",[20.1,95.2]],["L",[20.1,67.9]],["L",[39.1,67.9]],["C",[46.7,67.85,51.45,65.75]],["C",[56.3,63.65,58.9,60.3]],["C",[61.45,56.9,62.45,53.1]],["C",[63.45,49.35,63.4,46]],["C",[63.45,42.55,62.45,38.75]],["C",[61.45,34.9,58.9,31.55]],["C",[56.3,28.15,51.45,26]],["M",[50.9,45.85]],["C",[50.85,50.35,48.9,52.95]],["C",[46.95,55.55,44.15,56.65]],["C",[41.25,57.75,38.4,57.7]],["L",[20.1,57.7]],["L",[20.1,34]],["L",[38.55,34]],["C",[41.95,33.95,44.75,35]],["C",[47.5,36,49.15,38.6]],["C",[50.85,41.2,50.9,45.85]]]);
		this.motifs.set("Q",[["M",[52.4,25.1]],["C",[46.05,22.15,38.05,22.1]],["C",[30,22.15,23.65,25.1]],["C",[17.3,28,12.9,33.15]],["C",[8.45,38.3,6.15,45.05]],["C",[3.8,51.8,3.8,59.5]],["C",[3.8,67.2,6.15,73.95]],["C",[8.45,80.7,12.9,85.85]],["C",[17.3,91,23.65,93.95]],["C",[30,96.85,38.05,96.9]],["C",[42.25,96.9,46.55,95.9]],["C",[50.85,94.85,54.85,92.6]],["L",[65.25,101.7]],["L",[71.35,94.9]],["L",[62.1,86.9]],["C",[65.65,83.5,67.85,78.95]],["C",[70.1,74.45,71.2,69.45]],["C",[72.2,64.45,72.2,59.5]],["C",[72.2,51.8,69.85,45.05]],["C",[67.6,38.3,63.15,33.15]],["C",[58.75,28,52.4,25.1]],["M",[54.6,40.75]],["C",[57.25,44.6,58.5,49.5]],["C",[59.7,54.35,59.7,59.5]],["C",[59.75,65,58.3,70.15]],["C",[56.85,75.3,53.5,79.45]],["L",[44.8,71.8]],["L",[38.8,78.7]],["L",[46,85]],["C",[44.15,85.9,42.05,86.3]],["L",[38.05,86.7]],["C",[32.3,86.65,28.15,84.35]],["C",[24,82.1,21.45,78.25]],["C",[18.8,74.4,17.55,69.5]],["C",[16.3,64.7,16.3,59.5]],["C",[16.3,54.35,17.55,49.5]],["C",[18.8,44.6,21.45,40.75]],["C",[24,36.9,28.15,34.65]],["C",[32.3,32.35,38.05,32.3]],["C",[43.75,32.35,47.85,34.65]],["C",[52,36.9,54.6,40.75]]]);
		this.motifs.set("R",[["M",[41.7,23.8]],["L",[7.6,23.8]],["L",[7.6,95.2]],["L",[20.1,95.2]],["L",[20.1,65.8]],["L",[38.5,65.8]],["C",[44.2,65.8,47.3,67.8]],["C",[50.45,69.8,51.6,73.95]],["C",[52.8,78.15,52.75,84.7]],["C",[52.7,87.35,53,90.05]],["C",[53.25,92.85,54.65,95.2]],["L",[68,95.2]],["C",[66.65,93.7,65.8,90.85]],["C",[64.95,88.05,64.5,84.3]],["C",[64.1,80.6,64.1,76.4]],["C",[64,70.8,62.3,67.6]],["C",[60.6,64.4,58.2,62.95]],["C",[55.75,61.55,53.5,61.3]],["L",[53.5,61.1]],["L",[56.3,59.85]],["C",[58.2,58.9,60.25,56.9]],["C",[62.3,54.95,63.75,51.6]],["C",[65.25,48.25,65.3,43.1]],["C",[65.3,33.95,59.35,28.95]],["C",[53.4,23.9,41.7,23.8]],["M",[52.8,44.9]],["C",[52.8,50.5,49.65,53.4]],["C",[46.55,56.3,40.6,56.3]],["L",[20.1,56.3]],["L",[20.1,34]],["L",[40.45,34]],["C",[43.7,33.95,46.5,34.8]],["C",[49.3,35.7,51.05,38]],["C",[52.75,40.4,52.8,44.9]]]);
		this.motifs.set("S",[["M",[45.85,24.7]],["C",[39.65,22.1,32.15,22.1]],["C",[27.2,22.1,22.6,23.35]],["C",[17.95,24.65,14.2,27.25]],["C",[10.5,29.8,8.25,33.75]],["C",[6.05,37.75,6,43.1]],["C",[5.95,46.85,7.35,50.4]],["C",[8.85,53.85,12.3,56.65]],["C",[15.75,59.5,21.85,61.2]],["L",[34.3,64.45]],["L",[43.1,67.1]],["C",[45.4,67.85,47.15,69.85]],["C",[48.95,71.85,49,75.9]],["C",[49.05,78.65,47.55,81.1]],["C",[46.05,83.6,42.7,85.1]],["C",[39.4,86.65,33.95,86.7]],["C",[28.85,86.75,24.8,85.2]],["C",[20.7,83.65,18.3,80.25]],["C",[15.85,76.9,15.8,71.4]],["L",[3.3,71.4]],["C",[3.55,80.25,7.55,85.85]],["C",[11.55,91.55,18.2,94.2]],["C",[24.9,96.9,33.1,96.9]],["C",[38.55,96.9,43.55,95.65]],["C",[48.6,94.35,52.65,91.7]],["C",[56.7,89,59.1,84.75]],["C",[61.45,80.5,61.5,74.5]],["C",[61.5,70.75,60,67.1]],["C",[58.5,63.5,55.4,60.65]],["C",[52.35,57.75,47.6,56.3]],["L",[43,55]],["L",[36.35,53.25]],["L",[30.2,51.65]],["L",[27,50.8]],["C",[23.15,49.8,20.85,47.55]],["C",[18.55,45.35,18.5,41.6]],["C",[18.6,38,20.6,35.95]],["C",[22.65,33.95,25.65,33.15]],["C",[28.6,32.25,31.6,32.3]],["C",[38.2,32.2,42.35,35.15]],["C",[46.5,38.05,47,44.9]],["L",[59.5,44.9]],["C",[59.4,37.45,55.7,32.35]],["C",[52.05,27.3,45.85,24.7]]]);
		this.motifs.set("T",[["M",[58.6,23.8]],["L",[0.8,23.8]],["L",[0.8,34.6]],["L",[23.4,34.6]],["L",[23.4,95.2]],["L",[35.9,95.2]],["L",[35.9,34.6]],["L",[58.6,34.6]],["L",[58.6,23.8]]]);
		this.motifs.set("U",[["M",[52.9,23.8]],["L",[52.9,65.4]],["L",[52.55,72.7]],["C",[52.15,76.35,50.55,79.4]],["C",[48.95,82.4,45.55,84.2]],["C",[42.1,86.05,36.1,86.1]],["C",[30.1,86.05,26.6,84.2]],["C",[23.2,82.4,21.65,79.4]],["C",[20,76.35,19.65,72.7]],["C",[19.25,69.1,19.3,65.4]],["L",[19.3,23.8]],["L",[6.8,23.8]],["L",[6.8,69.5]],["C",[6.85,78.65,10.5,84.75]],["C",[14.1,90.85,20.65,93.9]],["C",[27.25,96.9,36.1,96.9]],["C",[44.9,96.9,51.5,93.9]],["C",[58.05,90.85,61.65,84.75]],["C",[65.35,78.65,65.4,69.5]],["L",[65.4,23.8]],["L",[52.9,23.8]]]);
		this.motifs.set("V",[["M",[48.95,23.8]],["L",[30.6,80.3]],["L",[30.4,80.3]],["L",[12.5,23.8]],["L",[-0.5,23.8]],["L",[23.35,95.2]],["L",[37.2,95.2]],["L",[61.6,23.8]],["L",[48.95,23.8]]]);
		this.motifs.set("W",[["M",[81.1,23.8]],["L",[67.8,78.4]],["L",[67.6,78.4]],["L",[53.6,23.8]],["L",[40.8,23.8]],["L",[26.4,78.4]],["L",[26.2,78.4]],["L",[13.3,23.8]],["L",[0.6,23.8]],["L",[19.4,95.2]],["L",[32.3,95.2]],["L",[46.9,40.6]],["L",[47.1,40.6]],["L",[61.4,95.2]],["L",[74.1,95.2]],["L",[93.8,23.8]],["L",[81.1,23.8]]]);
		this.motifs.set("X",[["M",[49.4,23.8]],["L",[32.5,49]],["L",[16.3,23.8]],["L",[1.4,23.8]],["L",[25,58.2]],["L",[-0.3,95.2]],["L",[14,95.2]],["L",[32.1,67.9]],["L",[49.9,95.2]],["L",[65.1,95.2]],["L",[39.8,58.2]],["L",[63.4,23.8]],["L",[49.4,23.8]]]);
		this.motifs.set("Y",[["M",[51.4,23.8]],["L",[32.8,55.8]],["L",[13.9,23.8]],["L",[-0.6,23.8]],["L",[26.2,67.2]],["L",[26.2,95.2]],["L",[38.7,95.2]],["L",[38.7,67.2]],["L",[65.45,23.8]],["L",[51.4,23.8]]]);
		this.motifs.set("Z",[["M",[59.8,23.8]],["L",[5.5,23.8]],["L",[5.5,34.6]],["L",[43.9,34.6]],["L",[2.3,85]],["L",[2.3,95.2]],["L",[60.8,95.2]],["L",[60.8,84.4]],["L",[18.2,84.4]],["L",[59.8,33.35]],["L",[59.8,23.8]]]);
	}
	,initializeMotifsLowercase: function() {
		this.motifs.set("a",[["M",[9.05,48.9]],["C",[5.6,52.65,5.15,59.25]],["L",[16.5,59.25]],["C",[16.95,55.05,19.95,53.05]],["C",[23.05,51.05,27.9,51.05]],["L",[32.7,51.55]],["C",[35.15,52.1,36.85,53.65]],["C",[38.55,55.15,38.55,58.1]],["C",[38.55,61.35,36.4,62.65]],["C",[34.3,63.95,30.75,64.35]],["L",[23.1,65.4]],["C",[18.2,65.85,13.65,67.2]],["C",[9.2,68.55,6.25,71.85]],["C",[3.3,75.15,3.2,81.55]],["C",[3.25,86.55,5.75,89.95]],["C",[8.2,93.3,12.2,94.95]],["C",[16.15,96.6,20.9,96.6]],["L",[27.25,96]],["C",[30.5,95.3,33.5,93.95]],["C",[36.5,92.5,38.75,90.3]],["C",[39.5,93.8,41.8,95.25]],["C",[44.1,96.65,47.55,96.6]],["L",[51.2,96.2]],["L",[54.8,95.3]],["L",[54.8,87.45]],["L",[53.15,87.65]],["L",[51.95,87.65]],["C",[50.45,87.65,49.8,86.75]],["C",[49.2,85.85,49.25,83.75]],["L",[49.25,57.05]],["C",[49.15,51.65,46.15,48.35]],["C",[43.1,45.05,38.45,43.55]],["C",[33.75,42.1,28.6,42.1]],["C",[22.8,42.05,17.65,43.6]],["C",[12.45,45.15,9.05,48.9]],["M",[37.9,69.3]],["L",[37.9,77.8]],["C",[37.8,81.45,35.7,83.6]],["C",[33.6,85.75,30.6,86.7]],["C",[27.7,87.65,25.1,87.65]],["L",[20.6,87.05]],["C",[18.15,86.45,16.4,85]],["C",[14.7,83.6,14.6,81.05]],["C",[14.7,76.6,17.45,74.75]],["C",[20.1,72.9,23.9,72.4]],["L",[31.45,71.35]],["C",[35.2,70.95,37.9,69.3]]]);
		this.motifs.set("b",[["M",[6.3,23.8]],["L",[6.3,95.2]],["L",[17.1,95.2]],["L",[17.1,88.1]],["L",[17.3,88.1]],["C",[19,91.5,21.9,93.35]],["C",[24.7,95.2,28.15,95.95]],["L",[35.2,96.6]],["C",[42.8,96.5,47.75,92.7]],["C",[52.7,88.9,55.1,82.8]],["C",[57.45,76.7,57.45,69.6]],["C",[57.45,61.95,54.85,55.75]],["C",[52.15,49.55,46.8,45.85]],["C",[41.45,42.15,33.3,42.1]],["C",[30.3,42.1,27.4,43.05]],["C",[24.45,44.05,21.95,45.85]],["C",[19.5,47.65,17.85,50.2]],["L",[17.7,50.2]],["L",[17.7,23.8]],["L",[6.3,23.8]],["M",[31.8,51.05]],["C",[36.45,51.15,39.7,53.7]],["C",[42.85,56.3,44.5,60.45]],["C",[46.1,64.6,46.1,69.4]],["C",[46.15,74,44.7,78.1]],["C",[43.25,82.25,40.15,84.9]],["C",[36.95,87.55,31.8,87.65]],["C",[27.15,87.6,23.95,85.25]],["C",[20.7,82.85,19,78.75]],["C",[17.3,74.65,17.3,69.4]],["C",[17.3,61,20.95,56.1]],["C",[24.55,51.15,31.8,51.05]]]);
		this.motifs.set("c",[["M",[14.85,45.85]],["C",[9.2,49.5,6.35,55.75]],["C",[3.5,62,3.5,69.9]],["C",[3.5,77.55,6.4,83.6]],["C",[9.35,89.6,14.9,93.05]],["C",[20.45,96.5,28.6,96.6]],["C",[38.6,96.55,44.65,91.25]],["C",[50.7,85.9,52.3,75.8]],["L",[40.85,75.8]],["C",[40.05,81.45,36.8,84.5]],["C",[33.6,87.6,28.6,87.65]],["C",[23.7,87.55,20.65,84.95]],["C",[17.65,82.35,16.25,78.3]],["C",[14.9,74.3,14.9,69.9]],["C",[15,62.1,17.25,58.05]],["C",[19.55,53.95,22.8,52.45]],["C",[26.05,50.95,29.1,51.05]],["C",[33.9,51.05,37,53.55]],["C",[40.15,56.05,40.85,60.8]],["L",[52.3,60.8]],["C",[51.65,54.45,48.45,50.3]],["C",[45.15,46.15,40.15,44.1]],["C",[35.05,42.1,29,42.1]],["C",[20.5,42.15,14.85,45.85]]]);
		this.motifs.set("d",[["M",[43.3,23.8]],["L",[43.3,50.2]],["L",[43.1,50.2]],["C",[41.3,47.3,38.55,45.55]],["C",[35.75,43.75,32.45,42.9]],["C",[29.2,42.1,25.9,42.1]],["C",[20.15,42.1,15.1,44.9]],["C",[10,47.75,6.8,53.7]],["C",[3.6,59.65,3.5,69]],["C",[3.5,76.85,6.15,83.05]],["C",[8.85,89.3,14.2,92.9]],["C",[19.55,96.5,27.7,96.6]],["C",[32.65,96.65,37,94.6]],["C",[41.35,92.6,43.7,88.2]],["L",[43.9,88.2]],["L",[43.9,95.2]],["L",[54.7,95.2]],["L",[54.7,23.8]],["L",[43.3,23.8]],["M",[29.4,51.05]],["C",[36.1,51.1,39.85,55.9]],["C",[43.65,60.7,43.7,69.25]],["C",[43.75,73.9,42.25,78.05]],["C",[40.7,82.2,37.5,84.9]],["C",[34.3,87.55,29.2,87.65]],["C",[24.25,87.55,21.1,85]],["C",[17.9,82.5,16.4,78.45]],["C",[14.9,74.45,14.9,69.9]],["C",[14.85,65.15,16.25,60.85]],["C",[17.7,56.6,20.9,53.9]],["C",[24.05,51.15,29.4,51.05]]]);
		this.motifs.set("e",[["M",[15.2,45.9]],["C",[9.55,49.6,6.6,55.75]],["C",[3.55,61.95,3.5,69.35]],["C",[3.5,77.45,6.5,83.55]],["C",[9.4,89.65,15.05,93.1]],["C",[20.65,96.55,28.8,96.6]],["C",[34.45,96.6,39.3,94.55]],["C",[44.15,92.5,47.5,88.6]],["C",[50.9,84.7,52.2,79]],["L",[41.4,79]],["C",[39.9,83.3,36.8,85.5]],["C",[33.75,87.65,28.8,87.65]],["C",[24,87.6,20.95,85.5]],["C",[17.85,83.35,16.4,79.85]],["C",[14.9,76.4,14.9,72.3]],["L",[52.9,72.3]],["C",[53.55,66.45,52.15,61]],["C",[50.8,55.65,47.5,51.35]],["C",[44.3,47.1,39.45,44.6]],["C",[34.6,42.1,28.45,42.1]],["C",[20.75,42.15,15.2,45.9]],["M",[39.65,58.05]],["C",[41.25,61.1,41.5,64.8]],["L",[14.9,64.8]],["C",[15.1,60.85,16.8,57.8]],["C",[18.5,54.7,21.55,52.9]],["C",[24.5,51.1,28.45,51.05]],["C",[32.35,51.1,35.2,53]],["C",[38.05,54.9,39.65,58.05]]]);
		this.motifs.set("f",[["M",[28.35,23.95]],["L",[23.7,23.8]],["C",[19.9,23.7,16.7,24.9]],["C",[13.5,26,11.45,29.35]],["C",[9.45,32.7,9.4,39.2]],["L",[9.4,43.5]],["L",[0.95,43.5]],["L",[0.95,52]],["L",[9.4,52]],["L",[9.4,95.2]],["L",[20.8,95.2]],["L",[20.8,52]],["L",[30.5,52]],["L",[30.5,43.5]],["L",[20.8,43.5]],["L",[20.8,38.2]],["C",[20.85,35.05,22.4,33.85]],["C",[24,32.75,26.4,32.8]],["L",[29.35,32.95]],["L",[31.7,33.4]],["L",[31.7,24.5]],["L",[28.35,23.95]]]);
		this.motifs.set("g",[["M",[42.45,43.5]],["L",[42.45,50.55]],["L",[42.25,50.55]],["C",[40,46.25,35.95,44.15]],["C",[31.9,42.1,26.9,42.1]],["C",[19.55,42.15,14.3,45.7]],["C",[9.1,49.25,6.3,55.05]],["C",[3.55,60.9,3.5,68]],["C",[3.5,75.45,5.9,81.65]],["C",[8.3,87.8,13.45,91.45]],["C",[18.55,95.1,26.7,95.2]],["C",[31.6,95.15,35.7,92.8]],["C",[39.75,90.4,42.25,86.1]],["L",[42.45,86.1]],["L",[42.45,94]],["C",[42.5,100.4,39.2,103.8]],["C",[36,107.15,29.1,107.2]],["L",[23.65,106.65]],["C",[21.05,106.15,19.25,104.5]],["C",[17.45,102.8,16.7,99.6]],["L",[5.3,99.6]],["C",[5.9,105.6,9.4,109.15]],["C",[12.95,112.7,18,114.25]],["C",[23.1,115.75,28.4,115.7]],["C",[40.7,115.7,47.2,109.9]],["C",[53.75,104.15,53.8,92.5]],["L",[53.8,43.5]],["L",[42.45,43.5]],["M",[28.5,51.05]],["C",[33.45,51.1,36.5,53.5]],["C",[39.6,55.9,41,59.8]],["C",[42.45,63.65,42.45,68.2]],["C",[42.5,72.7,41.05,76.8]],["C",[39.7,80.9,36.6,83.5]],["C",[33.55,86.1,28.5,86.2]],["C",[23.8,86.1,20.75,83.7]],["C",[17.7,81.2,16.3,77.35]],["C",[14.9,73.4,14.9,69.1]],["C",[14.85,64.7,16.15,60.6]],["C",[17.5,56.5,20.5,53.8]],["C",[23.5,51.15,28.5,51.05]]]);
		this.motifs.set("h",[["M",[6,23.8]],["L",[6,95.2]],["L",[17.4,95.2]],["L",[17.4,64.7]],["C",[17.4,60.85,18.95,57.75]],["C",[20.45,54.65,23.25,52.9]],["C",[26.05,51.1,29.9,51.05]],["C",[34.9,51,37.4,53.85]],["C",[39.85,56.65,40,62.7]],["L",[40,95.2]],["L",[51.35,95.2]],["L",[51.35,59.65]],["C",[51.25,50.95,46.45,46.5]],["C",[41.55,42.1,33.1,42.1]],["C",[27.95,42.15,23.85,44.4]],["C",[19.75,46.65,17.6,50.3]],["L",[17.4,50.3]],["L",[17.4,23.8]],["L",[6,23.8]]]);
		this.motifs.set("i",[["M",[6.3,34.6]],["L",[17.7,34.6]],["L",[17.7,23.8]],["L",[6.3,23.8]],["L",[6.3,34.6]],["M",[6.3,43.5]],["L",[6.3,95.2]],["L",[17.7,95.2]],["L",[17.7,43.5]],["L",[6.3,43.5]]]);
		this.motifs.set("j",[["M",[6.3,34.6]],["L",[17.7,34.6]],["L",[17.7,23.8]],["L",[6.3,23.8]],["L",[6.3,34.6]],["M",[6.3,43.5]],["L",[6.3,99.1]],["C",[6.4,102.95,5.55,104.8]],["C",[4.75,106.7,1.7,106.7]],["L",[-0.1,106.65]],["L",[-2.2,106.35]],["L",[-2.2,115.3]],["L",[0.1,115.55]],["L",[2.9,115.7]],["C",[10.85,115.65,14.3,111.5]],["C",[17.75,107.4,17.7,99.65]],["L",[17.7,43.5]],["L",[6.3,43.5]]]);
		this.motifs.set("k",[["M",[6.3,23.8]],["L",[6.3,95.2]],["L",[17.7,95.2]],["L",[17.7,76.7]],["L",[24.45,70.1]],["L",[40.3,95.2]],["L",[54.15,95.2]],["L",[32.45,62.5]],["L",[52.3,43.5]],["L",[38.3,43.5]],["L",[17.7,64.4]],["L",[17.7,23.8]],["L",[6.3,23.8]]]);
		this.motifs.set("l",[["M",[6.3,23.8]],["L",[6.3,95.2]],["L",[17.7,95.2]],["L",[17.7,23.8]],["L",[6.3,23.8]]]);
		this.motifs.set("m",[["M",[54.2,44.35]],["C",[50.3,46.65,47.45,50.65]],["C",[45.65,46.25,41.75,44.15]],["C",[37.8,42.1,33,42.1]],["C",[26.95,42.1,23.25,44.45]],["C",[19.55,46.75,17.1,50.65]],["L",[16.8,50.65]],["L",[16.8,43.5]],["L",[6,43.5]],["L",[6,95.2]],["L",[17.4,95.2]],["L",[17.4,64.5]],["C",[17.45,60.15,19,57.15]],["C",[20.55,54.2,23.15,52.6]],["C",[25.7,51.05,28.7,51.05]],["C",[33.8,51.05,35.85,53.85]],["C",[37.9,56.65,37.8,61.95]],["L",[37.8,95.2]],["L",[49.15,95.2]],["L",[49.15,64.9]],["C",[49.1,58.3,51.75,54.7]],["C",[54.45,51.1,60.15,51.05]],["C",[64.55,51.1,66.55,52.8]],["C",[68.6,54.6,69.15,57.7]],["C",[69.7,60.85,69.6,65]],["L",[69.6,95.2]],["L",[80.95,95.2]],["L",[80.95,59.45]],["C",[80.9,50.15,76.4,46.05]],["C",[71.9,42,63.65,42.1]],["C",[58.1,42.1,54.2,44.35]]]);
		this.motifs.set("n",[["M",[6,43.5]],["L",[6,95.2]],["L",[17.4,95.2]],["L",[17.4,64.7]],["C",[17.4,60.85,18.95,57.75]],["C",[20.45,54.65,23.25,52.9]],["C",[26.05,51.1,29.9,51.05]],["C",[34.9,51,37.4,53.85]],["C",[39.85,56.65,40,62.7]],["L",[40,95.2]],["L",[51.35,95.2]],["L",[51.35,59.65]],["C",[51.25,50.95,46.45,46.5]],["C",[41.55,42.1,33.1,42.1]],["C",[27.95,42.1,23.8,44.5]],["C",[19.6,46.95,17,51.25]],["L",[16.8,51.05]],["L",[16.8,43.5]],["L",[6,43.5]]]);
		this.motifs.set("o",[["M",[15.6,45.65]],["C",[9.7,49.1,6.7,55.2]],["C",[3.65,61.3,3.6,69.25]],["C",[3.65,77.35,6.7,83.5]],["C",[9.7,89.6,15.6,93.05]],["C",[21.4,96.55,29.75,96.6]],["C",[38.05,96.55,43.85,93.05]],["C",[49.7,89.6,52.75,83.5]],["C",[55.75,77.35,55.8,69.25]],["C",[55.75,61.3,52.75,55.2]],["C",[49.7,49.1,43.85,45.65]],["C",[38.05,42.1,29.75,42.1]],["C",[21.4,42.1,15.6,45.65]],["M",[29.75,51.05]],["C",[34.8,51.15,38.1,53.8]],["C",[41.3,56.5,42.85,60.6]],["C",[44.45,64.75,44.45,69.25]],["C",[44.45,73.9,42.85,78.05]],["C",[41.3,82.2,38.1,84.9]],["C",[34.8,87.55,29.75,87.65]],["C",[24.6,87.55,21.35,84.9]],["C",[18.1,82.2,16.55,78.05]],["C",[15,73.9,15,69.25]],["C",[15,64.75,16.55,60.6]],["C",[18.1,56.5,21.35,53.8]],["C",[24.6,51.15,29.75,51.05]]]);
		this.motifs.set("p",[["M",[6.3,43.5]],["L",[6.3,114.3]],["L",[17.7,114.3]],["L",[17.7,88.5]],["L",[17.85,88.5]],["C",[19.75,91.4,22.5,93.15]],["C",[25.3,94.95,28.55,95.8]],["C",[31.85,96.6,35.2,96.6]],["C",[42.8,96.5,47.75,92.7]],["C",[52.7,88.9,55.1,82.8]],["C",[57.45,76.7,57.45,69.6]],["C",[57.45,61.95,54.85,55.75]],["C",[52.15,49.55,46.8,45.85]],["C",[41.45,42.15,33.3,42.1]],["C",[28.25,42.05,24,44.1]],["C",[19.8,46.1,17.3,50.45]],["L",[17.1,50.45]],["L",[17.1,43.5]],["L",[6.3,43.5]],["M",[31.8,51.05]],["C",[36.45,51.15,39.7,53.7]],["C",[42.85,56.3,44.5,60.45]],["C",[46.1,64.6,46.1,69.4]],["C",[46.15,74,44.7,78.1]],["C",[43.25,82.25,40.15,84.9]],["C",[36.95,87.55,31.8,87.65]],["C",[27.15,87.6,23.95,85.25]],["C",[20.7,82.85,19,78.75]],["C",[17.3,74.65,17.3,69.4]],["C",[17.3,61,20.95,56.1]],["C",[24.55,51.15,31.8,51.05]]]);
		this.motifs.set("q",[["M",[43.9,43.5]],["L",[43.9,50.45]],["L",[43.7,50.45]],["C",[41.2,46.1,36.95,44.1]],["C",[32.7,42.05,27.7,42.1]],["C",[19.55,42.15,14.2,45.85]],["C",[8.85,49.55,6.15,55.75]],["C",[3.5,61.95,3.5,69.6]],["C",[3.5,76.7,5.9,82.8]],["C",[8.3,88.9,13.25,92.7]],["C",[18.15,96.5,25.8,96.6]],["L",[32.4,95.8]],["C",[35.7,94.95,38.5,93.15]],["C",[41.25,91.4,43.1,88.5]],["L",[43.3,88.5]],["L",[43.3,114.3]],["L",[54.7,114.3]],["L",[54.7,43.5]],["L",[43.9,43.5]],["M",[29.2,51.05]],["C",[36.35,51.15,40.05,56.05]],["C",[43.7,60.85,43.7,69.4]],["C",[43.7,74.85,42.15,78.95]],["C",[40.6,83.05,37.35,85.3]],["C",[34.15,87.6,29.2,87.65]],["C",[24,87.55,20.85,84.9]],["C",[17.7,82.25,16.3,78.1]],["C",[14.85,74,14.9,69.4]],["C",[14.9,64.6,16.5,60.45]],["C",[18.1,56.3,21.3,53.7]],["C",[24.5,51.15,29.2,51.05]]]);
		this.motifs.set("r",[["M",[6,43.5]],["L",[6,95.2]],["L",[17.4,95.2]],["L",[17.4,70.6]],["C",[17.45,64.9,19.3,60.9]],["C",[21.15,56.95,24.25,54.9]],["C",[27.45,52.85,31.4,52.85]],["L",[33.85,53.05]],["L",[36.3,53.35]],["L",[36.3,42.35]],["L",[34.7,42.15]],["L",[32,42.1]],["C",[28.4,42.1,25.25,43.85]],["C",[22.05,45.5,19.8,48.1]],["C",[17.6,50.65,16.9,53.45]],["L",[16.7,53.45]],["L",[16.7,43.5]],["L",[6,43.5]]]);
		this.motifs.set("s",[["M",[11.55,45.25]],["C",[8.35,46.9,6.35,49.8]],["C",[4.35,52.65,4.3,56.85]],["C",[4.4,62.1,6.75,65.1]],["C",[9.1,68.15,12.85,69.75]],["C",[16.6,71.35,20.9,72.2]],["L",[28.9,73.95]],["C",[32.65,74.8,35.1,76.35]],["C",[37.55,77.85,37.8,80.8]],["C",[37.85,83.75,35.9,85.25]],["C",[33.95,86.7,31.25,87.2]],["L",[26.25,87.65]],["C",[21.65,87.7,18.35,85.65]],["C",[15.15,83.55,14.6,78.65]],["L",[3.2,78.65]],["C",[3.35,84.7,6.35,88.7]],["C",[9.35,92.7,14.45,94.65]],["C",[19.55,96.6,26.05,96.6]],["L",[34.25,95.75]],["C",[38.3,94.8,41.65,92.85]],["C",[45,90.85,47.05,87.65]],["C",[49.1,84.4,49.15,79.8]],["C",[49.05,74.8,46.7,71.8]],["C",[44.3,68.85,40.55,67.2]],["C",[36.7,65.6,32.5,64.75]],["L",[24.4,62.9]],["C",[20.55,62.1,18.15,60.6]],["C",[15.75,59.1,15.65,56.4]],["C",[15.75,54.15,17.4,52.95]],["C",[19,51.85,21.2,51.45]],["L",[25.1,51.05]],["C",[28.9,50.95,31.85,52.5]],["C",[34.75,54,35.6,58]],["L",[47.45,58]],["C",[46.75,52.25,43.6,48.7]],["C",[40.55,45.25,35.9,43.65]],["C",[31.25,42.1,25.9,42.1]],["L",[18.55,42.8]],["C",[14.8,43.55,11.55,45.25]]]);
		this.motifs.set("t",[["M",[0.85,43.5]],["L",[0.85,52]],["L",[9.4,52]],["L",[9.4,82.5]],["C",[9.45,86.8,10.6,89.75]],["C",[11.7,92.65,14.75,94.15]],["C",[17.8,95.7,23.7,95.7]],["L",[27.4,95.45]],["L",[31.1,95.1]],["L",[31.1,86.3]],["L",[28.7,86.65]],["L",[26.3,86.7]],["C",[23.8,86.7,22.6,85.9]],["C",[21.45,85.1,21.1,83.55]],["C",[20.75,81.95,20.8,79.6]],["L",[20.8,52]],["L",[31.1,52]],["L",[31.1,43.5]],["L",[20.8,43.5]],["L",[20.8,28]],["L",[9.4,28]],["L",[9.4,43.5]],["L",[0.85,43.5]]]);
		this.motifs.set("u",[["M",[6,43.5]],["L",[6,76.3]],["C",[5.95,86.45,10.6,91.55]],["C",[15.25,96.6,25.3,96.6]],["C",[29.7,96.55,33.75,94.25]],["C",[37.8,92,40,88]],["L",[40.2,88]],["L",[40.2,95.2]],["L",[51.35,95.2]],["L",[51.35,43.5]],["L",[40,43.5]],["L",[40,73.45]],["C",[40.05,77.55,38.8,80.75]],["C",[37.6,83.9,34.8,85.8]],["C",[32.05,87.6,27.3,87.65]],["C",[22.6,87.75,20,84.85]],["C",[17.45,81.95,17.4,75.25]],["L",[17.4,43.5]],["L",[6,43.5]]]);
		this.motifs.set("v",[["M",[0.9,43.5]],["L",[19.7,95.2]],["L",[32.45,95.2]],["L",[51,43.5]],["L",[39.15,43.5]],["L",[26.55,83.2]],["L",[26.35,83.2]],["L",[13.3,43.5]],["L",[0.9,43.5]]]);
		this.motifs.set("w",[["M",[64.9,43.5]],["L",[54.4,82.1]],["L",[54.2,82.1]],["L",[44.9,43.5]],["L",[33.4,43.5]],["L",[23.7,82.1]],["L",[23.5,82.1]],["L",[13.4,43.5]],["L",[1.3,43.5]],["L",[17.3,95.2]],["L",[29.3,95.2]],["L",[38.8,56.75]],["L",[39,56.75]],["L",[48.6,95.2]],["L",[60.3,95.2]],["L",[76.5,43.5]],["L",[64.9,43.5]]]);
		this.motifs.set("x",[["M",[2,43.5]],["L",[19.9,67.95]],["L",[0.4,95.2]],["L",[13.8,95.2]],["L",[26.5,76.1]],["L",[39.6,95.2]],["L",[53.3,95.2]],["L",[33.5,67.35]],["L",[51.1,43.5]],["L",[37.9,43.5]],["L",[26.6,59.35]],["L",[15.8,43.5]],["L",[2,43.5]]]);
		this.motifs.set("y",[["M",[0.3,43.5]],["L",[19.9,95]],["L",[18.6,99]],["L",[17.1,102.8]],["C",[16.2,104.45,14.7,105.3]],["C",[13.25,106.2,10.6,106.2]],["L",[7.9,105.95]],["L",[5.2,105.5]],["L",[5.2,115.1]],["L",[9.15,115.55]],["L",[13.1,115.7]],["C",[18.95,115.6,22.3,113.15]],["C",[25.7,110.75,27.65,106.7]],["L",[31.4,98]],["L",[51.5,43.5]],["L",[39.6,43.5]],["L",[26.5,82.1]],["L",[26.3,82.1]],["L",[12.8,43.5]],["L",[0.3,43.5]]]);
		this.motifs.set("z",[["M",[2.2,95.2]],["L",[47.7,95.2]],["L",[47.7,86.2]],["L",[16.6,86.2]],["L",[46.2,51.5]],["L",[46.2,43.5]],["L",[4.2,43.5]],["L",[4.2,52.5]],["L",[30.8,52.5]],["L",[2.2,87.2]],["L",[2.2,95.2]]]);
	}
	,initializeMotifsNumbers: function() {
		this.motifs.set("0",[["M",[47.45,36.05]],["C",[44.8,30.65,40.1,27.3]],["C",[35.3,23.9,27.85,23.8]],["C",[20.3,23.9,15.55,27.3]],["C",[10.8,30.65,8.15,36.05]],["C",[5.55,41.5,4.6,47.85]],["C",[3.55,54.15,3.6,60.2]],["C",[3.55,66.3,4.6,72.6]],["C",[5.55,78.95,8.15,84.35]],["C",[10.8,89.8,15.55,93.15]],["C",[20.3,96.5,27.85,96.6]],["C",[35.3,96.5,40.1,93.15]],["C",[44.8,89.8,47.45,84.35]],["C",[50.05,78.95,51.05,72.6]],["C",[52.05,66.3,52,60.2]],["C",[52.05,54.15,51.05,47.85]],["C",[50.05,41.5,47.45,36.05]],["M",[39.55,46.75]],["C",[40.65,52.8,40.65,60.2]],["C",[40.65,67.6,39.55,73.65]],["C",[38.4,79.7,35.6,83.4]],["C",[32.75,87,27.85,87.1]],["C",[22.85,87,20,83.4]],["C",[17.25,79.7,16.05,73.65]],["C",[14.95,67.6,15,60.2]],["C",[14.95,52.8,16.05,46.75]],["C",[17.25,40.7,20,37.05]],["C",[22.85,33.45,27.85,33.35]],["C",[32.75,33.45,35.6,37.05]],["C",[38.4,40.7,39.55,46.75]]]);
		this.motifs.set("1",[["M",[5.3,45.8]],["L",[22.5,45.8]],["L",[22.5,95.2]],["L",[35,95.2]],["L",[35,25.2]],["L",[25.75,25.2]],["C",[24.8,29.4,21.8,31.95]],["C",[18.8,34.55,14.5,35.75]],["C",[10.15,36.85,5.3,36.8]],["L",[5.3,45.8]]]);
		this.motifs.set("2",[["M",[46.95,31.2]],["C",[44.4,27.95,40.05,25.9]],["C",[35.7,23.85,29.3,23.8]],["C",[21.5,23.9,16.1,27.4]],["C",[10.8,30.85,8,36.95]],["C",[5.2,43,5.2,50.8]],["L",[16.6,50.8]],["C",[16.7,45.9,17.8,41.95]],["C",[19,37.95,21.6,35.7]],["C",[24.1,33.4,28.6,33.35]],["C",[33.5,33.45,36.1,35.45]],["C",[38.65,37.45,39.6,40.25]],["C",[40.55,43.15,40.45,45.75]],["C",[40.3,49.8,38.35,52.95]],["C",[36.4,56.2,33.2,58.8]],["C",[30.1,61.45,26.4,63.85]],["L",[19.3,68.7]],["C",[12.2,73.4,8.15,80]],["C",[4.05,86.6,3.9,95.2]],["L",[51.7,95.2]],["L",[51.7,85]],["L",[17.6,85]],["C",[18.65,81.9,21.55,79.35]],["C",[24.35,76.7,28.2,74.2]],["L",[36.25,68.95]],["C",[40.3,66.15,43.8,62.8]],["C",[47.35,59.4,49.55,55.1]],["C",[51.75,50.85,51.8,45.3]],["C",[51.8,41.9,50.7,38.15]],["C",[49.55,34.45,46.95,31.2]]]);
		this.motifs.set("3",[["M",[46.4,32.15]],["C",[43.2,28,38.2,25.9]],["C",[33.15,23.8,27.6,23.8]],["C",[20.5,23.85,15.45,27]],["C",[10.35,30.05,7.5,35.4]],["C",[4.75,40.75,4.4,47.6]],["L",[15.75,47.6]],["C",[15.65,43.95,16.95,40.7]],["C",[18.2,37.5,20.8,35.45]],["C",[23.45,33.4,27.4,33.35]],["C",[32.25,33.4,35.25,36.05]],["C",[38.25,38.75,38.35,43.2]],["C",[38.3,47.5,36,49.95]],["C",[33.75,52.4,30.2,53.4]],["C",[26.7,54.4,22.85,54.2]],["L",[22.8,62.7]],["L",[31.55,63.15]],["C",[35.7,63.9,38.4,66.6]],["C",[41,69.2,41.1,74.6]],["C",[41.05,78.6,39.3,81.4]],["C",[37.6,84.15,34.55,85.65]],["C",[31.55,87.1,27.7,87.1]],["C",[23.25,87.05,20.25,85.15]],["C",[17.3,83.2,15.8,79.8]],["C",[14.35,76.5,14.5,72.2]],["L",[3.15,72.2]],["C",[3.25,79.55,6.05,85]],["C",[8.8,90.45,14.2,93.55]],["C",[19.65,96.55,27.7,96.6]],["C",[34.5,96.55,40.1,94]],["C",[45.7,91.4,49,86.6]],["C",[52.4,81.8,52.5,75.2]],["C",[52.45,68.35,49.1,63.65]],["C",[45.8,59,39.8,57.7]],["L",[39.8,57.5]],["C",[44.8,55.65,47.25,51.75]],["C",[49.7,47.85,49.7,42.5]],["C",[49.6,36.3,46.4,32.15]]]);
		this.motifs.set("4",[["M",[32.4,95.2]],["L",[43.2,95.2]],["L",[43.2,78.6]],["L",[52.2,78.6]],["L",[52.2,69.6]],["L",[43.2,69.6]],["L",[43.2,25.2]],["L",[32.4,25.2]],["L",[2.45,67.3]],["L",[2.45,78.6]],["L",[32.4,78.6]],["L",[32.4,95.2]],["M",[32.4,38.8]],["L",[32.4,69.6]],["L",[11.25,69.6]],["L",[32.25,38.8]],["L",[32.4,38.8]]]);
		this.motifs.set("5",[["M",[48.5,25.2]],["L",[12.3,25.2]],["L",[4.85,63.4]],["L",[16.2,63.4]],["C",[17.65,59.8,20.7,58.4]],["C",[23.85,56.95,27.5,57]],["C",[32.1,57.05,35.05,59.1]],["C",[38,61.1,39.4,64.45]],["C",[40.8,67.75,40.8,71.65]],["C",[40.85,75.95,39.6,79.45]],["C",[38.4,82.95,35.5,85]],["C",[32.6,87.05,27.8,87.1]],["C",[22.2,87.05,18.85,84]],["C",[15.5,80.95,14.9,75.3]],["L",[3.5,75.3]],["C",[3.8,82.3,7.1,87.05]],["C",[10.35,91.8,15.75,94.15]],["C",[21.2,96.6,28.05,96.6]],["C",[34.4,96.55,39.05,94.25]],["C",[43.65,92,46.55,88.25]],["C",[49.45,84.5,50.85,80.1]],["C",[52.2,75.7,52.2,71.45]],["C",[52.2,64.7,49.6,59.4]],["C",[47,54.15,42.2,51.1]],["C",[37.3,48.1,30.3,48.05]],["C",[26.7,48.05,23.25,49.4]],["C",[19.8,50.75,17.4,53.3]],["L",[17.2,53.1]],["L",[20.8,35.4]],["L",[48.5,35.4]],["L",[48.5,25.2]]]);
		this.motifs.set("6",[["M",[47.6,32.9]],["C",[44.75,28.65,40.1,26.25]],["C",[35.4,23.85,29.8,23.8]],["C",[22.4,23.9,17.35,27.15]],["C",[12.25,30.35,9.2,35.7]],["C",[6.1,40.95,4.8,47.3]],["C",[3.4,53.65,3.4,60]],["C",[3.3,70.3,5.45,78.55]],["C",[7.55,86.8,13.15,91.65]],["C",[18.7,96.5,28.9,96.6]],["C",[35.95,96.55,41.15,93.45]],["C",[46.4,90.3,49.25,84.95]],["C",[52.15,79.6,52.2,72.7]],["C",[52.15,65.9,49.55,60.65]],["C",[46.9,55.35,42.05,52.35]],["C",[37.1,49.25,30.15,49.2]],["C",[25.4,49.2,21.4,51.3]],["C",[17.45,53.35,15.05,57.5]],["L",[14.8,57.3]],["C",[15.05,53.75,15.65,49.7]],["C",[16.2,45.6,17.7,41.9]],["C",[19.15,38.15,21.9,35.8]],["C",[24.7,33.4,29.3,33.35]],["C",[33.8,33.4,36.45,35.95]],["C",[39.1,38.6,39.5,42.9]],["L",[50.9,42.9]],["C",[50.5,37.2,47.6,32.9]],["M",[28.5,58.2]],["C",[32.6,58.25,35.35,60.25]],["C",[38.1,62.2,39.45,65.45]],["C",[40.8,68.7,40.8,72.5]],["C",[40.8,76.3,39.45,79.6]],["C",[38.1,82.95,35.35,85]],["C",[32.6,87.05,28.5,87.1]],["C",[24.35,87.05,21.6,85]],["C",[18.75,82.95,17.35,79.65]],["C",[15.9,76.35,15.9,72.5]],["C",[15.9,68.6,17.35,65.35]],["C",[18.75,62.15,21.6,60.2]],["C",[24.35,58.25,28.5,58.2]]]);
		this.motifs.set("7",[["M",[51.35,25.2]],["L",[3.5,25.2]],["L",[3.5,35.4]],["L",[39.8,35.4]],["C",[32.5,43.55,26.7,53.15]],["C",[20.9,62.85,17.3,73.45]],["C",[13.6,84.1,12.8,95.2]],["L",[25.3,95.2]],["C",[26.2,82.6,29.6,71.9]],["C",[33,61.25,38.55,52.1]],["C",[44.05,42.9,51.35,34.7]],["L",[51.35,25.2]]]);
		this.motifs.set("8",[["M",[43.95,28.9]],["C",[38.3,23.9,27.85,23.8]],["C",[17.35,23.9,11.65,28.9]],["C",[6.05,33.9,6,42.9]],["C",[6.05,48.05,8.6,51.75]],["C",[11.15,55.45,15.9,57.3]],["L",[15.9,57.5]],["C",[10,59.05,6.6,63.5]],["C",[3.15,67.95,3.15,74.65]],["C",[3.15,81.55,6.35,86.4]],["C",[9.55,91.35,15.1,94]],["C",[20.65,96.55,27.85,96.6]],["C",[34.95,96.55,40.55,94]],["C",[46.05,91.35,49.25,86.4]],["C",[52.45,81.55,52.5,74.65]],["C",[52.45,67.95,49,63.5]],["C",[45.6,59.05,39.7,57.5]],["L",[39.7,57.3]],["C",[44.5,55.45,47,51.75]],["C",[49.55,48.05,49.6,42.9]],["C",[49.55,33.9,43.95,28.9]],["M",[27.85,32.8]],["C",[32.5,32.8,35.6,35.6]],["C",[38.7,38.3,38.8,43.5]],["C",[38.7,48.45,35.7,51.1]],["C",[32.6,53.8,27.85,53.8]],["C",[23,53.8,19.9,51.1]],["C",[16.9,48.45,16.8,43.5]],["C",[16.9,38.3,20,35.6]],["C",[23.1,32.8,27.85,32.8]],["M",[37.3,65.55]],["C",[41,68.8,41.1,74.6]],["C",[41,80.8,37.3,84.2]],["C",[33.65,87.6,27.85,87.65]],["C",[21.95,87.6,18.3,84.2]],["C",[14.6,80.85,14.5,74.65]],["C",[14.6,68.8,18.3,65.55]],["C",[21.95,62.35,27.85,62.3]],["C",[33.65,62.35,37.3,65.55]]]);
		this.motifs.set("9",[["M",[42.7,28.8]],["C",[37.3,23.9,27.5,23.8]],["C",[19.8,23.85,14.45,27]],["C",[9.1,30.1,6.25,35.5]],["C",[3.4,40.85,3.4,47.7]],["C",[3.45,54.85,6.2,60.2]],["C",[8.95,65.45,13.9,68.35]],["C",[18.85,71.25,25.5,71.25]],["C",[30.35,71.25,34.35,69.1]],["C",[38.3,66.95,40.6,62.9]],["L",[40.8,63.05]],["C",[40.6,66.65,40,70.75]],["C",[39.4,74.85,37.95,78.55]],["C",[36.45,82.25,33.7,84.65]],["C",[30.9,87.05,26.3,87.1]],["C",[21.85,87.05,19.15,84.45]],["C",[16.45,81.8,16.05,77.5]],["L",[4.7,77.5]],["C",[5.1,83.25,7.95,87.55]],["C",[10.85,91.8,15.55,94.15]],["C",[20.15,96.55,25.8,96.6]],["C",[33.2,96.5,38.3,93.3]],["C",[43.35,90.05,46.45,84.75]],["C",[49.5,79.5,50.85,73.15]],["C",[52.2,66.8,52.2,60.45]],["C",[52.3,50.15,50.2,41.9]],["C",[48.1,33.65,42.7,28.8]],["M",[16.1,40.5]],["C",[17.45,37.3,20.15,35.35]],["C",[22.85,33.4,27,33.35]],["C",[31.25,33.4,34.1,35.4]],["C",[36.9,37.35,38.3,40.55]],["C",[39.7,43.8,39.7,47.6]],["C",[39.7,51.5,38.3,54.8]],["C",[36.9,58.15,34.1,60.2]],["C",[31.25,62.25,27,62.3]],["C",[22.85,62.25,20.15,60.2]],["C",[17.45,58.1,16.1,54.75]],["C",[14.8,51.45,14.8,47.6]],["C",[14.8,43.8,16.1,40.5]]]);
	}
	,initializeMotifsPunctuation: function() {
		this.motifs.set(" ",[]);
		this.motifs.set("!",[["M",[7.7,44.4]],["L",[11.05,75.35]],["L",[16.9,75.35]],["L",[20.2,44.4]],["L",[20.2,23.8]],["L",[7.7,23.8]],["L",[7.7,44.4]],["M",[7.25,95.2]],["L",[20.6,95.2]],["L",[20.6,82.7]],["L",[7.25,82.7]],["L",[7.25,95.2]]]);
		this.motifs.set("\"",[["M",[25.9,23.8]],["L",[25.9,52.05]],["L",[36.1,52.05]],["L",[36.1,23.8]],["L",[25.9,23.8]],["M",[8.3,23.8]],["L",[8.3,52.05]],["L",[18.5,52.05]],["L",[18.5,23.8]],["L",[8.3,23.8]]]);
		this.motifs.set("#",[["M",[46.8,25.2]],["L",[38.65,25.2]],["L",[35.8,46.2]],["L",[24.65,46.2]],["L",[27.7,25.2]],["L",[19.6,25.2]],["L",[16.7,46.2]],["L",[6.3,46.2]],["L",[6.3,53.7]],["L",[15.65,53.7]],["L",[13.85,66.7]],["L",[3.35,66.7]],["L",[3.35,74.2]],["L",[12.8,74.2]],["L",[9.85,95.2]],["L",[17.85,95.2]],["L",[20.9,74.2]],["L",[31.9,74.2]],["L",[29,95.2]],["L",[36.95,95.2]],["L",[40,74.2]],["L",[49.45,74.2]],["L",[49.45,66.7]],["L",[40.95,66.7]],["L",[42.75,53.7]],["L",[52.4,53.7]],["L",[52.4,46.2]],["L",[43.8,46.2]],["L",[46.8,25.2]],["M",[34.75,53.7]],["L",[32.95,66.7]],["L",[21.9,66.7]],["L",[23.7,53.7]],["L",[34.75,53.7]]]);
		this.motifs.set("$",[["M",[41.2,24.2]],["C",[36.3,22.1,30.2,22.1]],["L",[30.2,14.3]],["L",[25.9,14.3]],["L",[25.9,22.1]],["C",[19.85,22.1,14.75,24.35]],["C",[9.6,26.6,6.45,31]],["C",[3.3,35.35,3.2,41.7]],["C",[3.3,48.9,6.7,53.2]],["C",[10,57.55,15.2,59.9]],["C",[20.3,62.3,25.9,63.7]],["L",[25.9,87.9]],["C",[19.1,87.65,16,83.9]],["C",[13,80.15,13.1,73.5]],["L",[1.7,73.5]],["C",[1.65,81,4.7,86.1]],["C",[7.7,91.3,13.2,94.05]],["C",[18.65,96.75,25.9,96.9]],["L",[25.9,104.7]],["L",[30.2,104.7]],["L",[30.2,96.9]],["C",[36.9,96.6,42.3,94.15]],["C",[47.6,91.7,50.75,86.8]],["C",[53.85,81.9,53.9,74.4]],["C",[53.8,67.2,50.45,62.9]],["C",[47.1,58.6,41.75,56.15]],["C",[36.4,53.75,30.2,52.2]],["L",[30.2,31.1]],["C",[35.5,31.15,38,33.8]],["C",[40.55,36.55,40.7,41.6]],["L",[52.1,41.6]],["C",[52,35,49.05,30.7]],["C",[46.15,26.35,41.2,24.2]],["M",[17.55,33.4]],["C",[20.45,31.05,25.9,31.1]],["L",[25.9,51.1]],["C",[23.05,50.4,20.45,49.25]],["C",[17.9,48.15,16.25,46.15]],["C",[14.65,44.15,14.6,40.9]],["C",[14.65,35.7,17.55,33.4]],["M",[36.15,66.65]],["C",[38.95,67.85,40.7,70.1]],["C",[42.5,72.3,42.55,76]],["C",[42.45,81.95,39.05,84.8]],["C",[35.7,87.6,30.2,87.9]],["L",[30.2,64.65]],["C",[33.35,65.35,36.15,66.65]]]);
		this.motifs.set("%",[["M",[82.05,83.55]],["C",[81.25,86.55,79.55,88.3]],["C",[77.8,90.05,75,90.1]],["C",[72.2,90.05,70.5,88.3]],["C",[68.85,86.55,68.1,83.55]],["C",[67.4,80.5,67.4,76.7]],["C",[67.35,73.35,67.95,70.25]],["C",[68.6,67.2,70.25,65.3]],["C",[71.9,63.35,75,63.3]],["C",[78.1,63.35,79.8,65.3]],["C",[81.5,67.2,82.2,70.25]],["C",[82.85,73.35,82.8,76.7]],["C",[82.8,80.5,82.05,83.55]],["M",[84.6,59.6]],["C",[80.95,56.85,75.1,56.8]],["C",[69.25,56.85,65.6,59.6]],["C",[61.85,62.3,60.1,66.8]],["C",[58.4,71.25,58.4,76.7]],["C",[58.4,82.25,60.05,86.7]],["C",[61.7,91.2,65.4,93.9]],["C",[69.1,96.55,75.1,96.6]],["C",[81.1,96.55,84.8,93.9]],["C",[88.5,91.2,90.15,86.7]],["C",[91.8,82.25,91.8,76.7]],["C",[91.8,71.25,90.1,66.8]],["C",[88.35,62.3,84.6,59.6]],["M",[64.9,22.85]],["L",[26.05,97.6]],["L",[33.8,97.6]],["L",[72.45,22.85]],["L",[64.9,22.85]],["M",[9.9,33.75]],["C",[8.2,38.2,8.2,43.75]],["C",[8.2,49.25,9.85,53.75]],["C",[11.5,58.2,15.2,60.85]],["C",[18.9,63.55,24.9,63.6]],["C",[30.9,63.55,34.6,60.85]],["C",[38.3,58.2,39.95,53.75]],["C",[41.6,49.25,41.6,43.75]],["C",[41.6,38.2,39.9,33.75]],["C",[38.15,29.3,34.4,26.6]],["C",[30.75,23.85,24.9,23.8]],["C",[19.05,23.85,15.4,26.6]],["C",[11.65,29.3,9.9,33.75]],["M",[17.75,37.25]],["C",[18.4,34.2,20.05,32.3]],["C",[21.75,30.35,24.8,30.3]],["C",[27.9,30.35,29.6,32.3]],["C",[31.3,34.2,32,37.25]],["C",[32.65,40.3,32.6,43.75]],["C",[32.6,47.5,31.85,50.5]],["C",[31.05,53.55,29.35,55.3]],["C",[27.6,57.05,24.8,57.1]],["C",[22,57.05,20.3,55.3]],["C",[18.65,53.55,17.9,50.5]],["C",[17.2,47.5,17.2,43.75]],["C",[17.15,40.3,17.75,37.25]]]);
		this.motifs.set("&",[["M",[45.1,29.7]],["C",[42.65,25.9,38.6,24]],["C",[34.55,22.1,29.9,22.1]],["C",[25,22.15,21.05,24.2]],["C",[17.1,26.3,14.8,30.1]],["C",[12.45,33.9,12.4,39.1]],["C",[12.5,43.7,14.6,47.45]],["C",[16.75,51.2,19.65,54.7]],["C",[15.45,56.8,11.7,59.7]],["C",[8,62.65,5.65,66.5]],["C",[3.3,70.4,3.2,75.4]],["C",[3.25,82.15,6.15,86.9]],["C",[9,91.6,14.05,94.1]],["C",[19.1,96.6,25.7,96.6]],["C",[31.9,96.6,36.8,94.35]],["C",[41.75,92.1,45.7,87.25]],["L",[52.2,95.2]],["L",[66.2,95.2]],["L",[52.5,78.6]],["C",[54.9,74.8,56.25,70.3]],["C",[57.55,65.8,58.1,61.1]],["L",[48.1,61.1]],["C",[47.7,64.55,47.1,66.8]],["L",[45.9,70.7]],["L",[34.8,57.3]],["C",[38.3,55.45,41.2,52.8]],["C",[44.15,50.25,45.9,46.8]],["C",[47.65,43.4,47.7,39.2]],["C",[47.6,33.5,45.1,29.7]],["M",[22.6,38.5]],["C",[22.7,34.85,24.85,32.75]],["C",[26.95,30.65,30.2,30.6]],["C",[33.55,30.65,35.5,32.95]],["C",[37.45,35.2,37.5,38.8]],["C",[37.4,43,34.9,45.65]],["C",[32.45,48.35,29.1,50.4]],["L",[26.25,46.75]],["C",[24.75,44.9,23.75,42.85]],["C",[22.65,40.85,22.6,38.5]],["M",[25.6,62.25]],["L",[39.6,79.6]],["L",[36.95,83]],["C",[35.4,84.85,32.8,86.2]],["C",[30.2,87.6,26.1,87.65]],["C",[21.05,87.6,17.85,84.5]],["C",[14.7,81.45,14.6,75.6]],["C",[14.7,71.4,16.5,69]],["C",[18.35,66.5,20.9,65]],["C",[23.4,63.45,25.6,62.25]]]);
		this.motifs.set("'",[["M",[8.8,23.8]],["L",[8.8,52.05]],["L",[19,52.05]],["L",[19,23.8]],["L",[8.8,23.8]]]);
		this.motifs.set("(",[["M",[8.7,44.35]],["C",[5,56.1,4.95,68.2]],["C",[5,77.7,6.9,85.85]],["C",[8.8,93.95,12,100.95]],["C",[15.3,108,19.3,114.3]],["L",[28.6,114.3]],["C",[22.3,103.65,19.3,92.15]],["C",[16.3,80.7,16.3,68.2]],["C",[16.3,55.7,19.45,44.25]],["C",[22.6,32.8,28.6,22.1]],["L",[19.3,22.1]],["C",[12.45,32.65,8.7,44.35]]]);
		this.motifs.set(")",[["M",[8.55,22.1]],["L",[-0.8,22.1]],["C",[5.5,32.8,8.55,44.3]],["C",[11.5,55.8,11.5,68.3]],["C",[11.5,80.8,8.4,92.2]],["C",[5.2,103.65,-0.8,114.3]],["L",[8.55,114.3]],["C",[15.4,103.8,19.15,92.1]],["C",[22.85,80.45,22.9,68.3]],["C",[22.85,58.75,20.95,50.65]],["C",[19.05,42.55,15.8,35.55]],["C",[12.55,28.45,8.55,22.1]]]);
		this.motifs.set("*",[["M",[4.1,31.55]],["L",[1.9,38]],["L",[13,41.85]],["L",[6,51.2]],["L",[11.6,55.1]],["L",[18.4,45.3]],["L",[25.5,55.1]],["L",[30.8,51.2]],["L",[23.85,41.85]],["L",[35.2,38]],["L",[32.8,31.55]],["L",[21.9,35.85]],["L",[21.9,23.8]],["L",[15.1,23.8]],["L",[15.1,35.85]],["L",[4.1,31.55]]]);
		this.motifs.set("+",[["M",[24.9,44.55]],["L",[24.9,64.8]],["L",[4.8,64.8]],["L",[4.8,75]],["L",[24.9,75]],["L",[24.9,95.2]],["L",[35.1,95.2]],["L",[35.1,75]],["L",[55.2,75]],["L",[55.2,64.8]],["L",[35.1,64.8]],["L",[35.1,44.55]],["L",[24.9,44.55]]]);
		this.motifs.set(",",[["M",[6.9,95.2]],["L",[13.75,95.2]],["C",[13.85,98.5,12.2,101.25]],["C",[10.6,104,7.3,104.9]],["L",[7.3,111]],["C",[13.35,109.75,17,105.55]],["C",[20.6,101.4,20.8,95.2]],["L",[20.8,81.7]],["L",[6.9,81.7]],["L",[6.9,95.2]]]);
		this.motifs.set("-",[["M",[4.9,73.35]],["L",[34,73.35]],["L",[34,62.6]],["L",[4.9,62.6]],["L",[4.9,73.35]]]);
		this.motifs.set(".",[["M",[6.9,95.2]],["L",[20.8,95.2]],["L",[20.8,81.7]],["L",[6.9,81.7]],["L",[6.9,95.2]]]);
		this.motifs.set("/",[["M",[26.5,22.1]],["L",[-2.2,96.9]],["L",[8.7,96.9]],["L",[37.4,22.1]],["L",[26.5,22.1]]]);
		this.motifs.set(":",[["M",[6.9,44.6]],["L",[6.9,58.1]],["L",[20.8,58.1]],["L",[20.8,44.6]],["L",[6.9,44.6]],["M",[6.9,95.2]],["L",[20.8,95.2]],["L",[20.8,81.7]],["L",[6.9,81.7]],["L",[6.9,95.2]]]);
		this.motifs.set(");",[["M",[6.9,44.6]],["L",[6.9,58.1]],["L",[20.8,58.1]],["L",[20.8,44.6]],["L",[6.9,44.6]],["M",[6.9,95.2]],["L",[13.75,95.2]],["C",[13.85,98.5,12.2,101.25]],["C",[10.6,104,7.3,104.9]],["L",[7.3,111]],["C",[13.35,109.75,17,105.55]],["C",[20.6,101.4,20.8,95.2]],["L",[20.8,81.7]],["L",[6.9,81.7]],["L",[6.9,95.2]]]);
		this.motifs.set("<",[["M",[4.6,73.5]],["L",[55.35,96.05]],["L",[55.35,85.85]],["L",[17.95,69.9]],["L",[55.35,54.05]],["L",[55.35,43.85]],["L",[4.6,66.35]],["L",[4.6,73.5]]]);
		this.motifs.set("=",[["M",[4.8,85.1]],["L",[55.2,85.1]],["L",[55.2,74.9]],["L",[4.8,74.9]],["L",[4.8,85.1]],["M",[4.8,64.95]],["L",[55.2,64.95]],["L",[55.2,54.7]],["L",[4.8,54.7]],["L",[4.8,64.95]]]);
		this.motifs.set(">",[["M",[4.6,96.05]],["L",[55.35,73.5]],["L",[55.35,66.35]],["L",[4.6,43.85]],["L",[4.6,54.05]],["L",[42,69.9]],["L",[4.6,85.85]],["L",[4.6,96.05]]]);
		this.motifs.set("?",[["M",[47.75,31.35]],["C",[44.85,26.85,39.95,24.5]],["C",[35.05,22.1,28.9,22.1]],["C",[21.55,22.15,16.15,25.2]],["C",[10.75,28.2,7.85,33.7]],["C",[4.95,39.15,4.95,46.5]],["L",[16.3,46.5]],["C",[16.3,39.7,19.3,35.7]],["C",[22.25,31.7,28.35,31.65]],["C",[30.25,31.6,32.5,32.7]],["C",[34.75,33.75,36.45,36.2]],["C",[38.1,38.7,38.2,42.7]],["C",[38.15,46.05,37.05,48.2]],["C",[35.95,50.4,34.1,52.05]],["L",[30.1,55.5]],["C",[27.45,57.75,25.75,60.25]],["C",[24,62.75,23.15,66.4]],["C",[22.3,70.05,22.3,75.8]],["L",[33.1,75.8]],["C",[33.1,71.1,34.25,68.15]],["C",[35.35,65.15,37.35,63.05]],["C",[39.3,60.95,41.9,58.9]],["L",[46.15,55.05]],["C",[48.1,53,49.35,50]],["C",[50.65,46.95,50.7,42.3]],["C",[50.65,35.85,47.75,31.35]],["M",[20.8,95.2]],["L",[34.2,95.2]],["L",[34.2,82.7]],["L",[20.8,82.7]],["L",[20.8,95.2]]]);
		this.motifs.set("@",[["M",[41.6,22.1]],["C",[34.1,22.15,27.5,24.9]],["C",[20.85,27.65,15.75,32.6]],["C",[10.7,37.5,7.8,44.05]],["C",[4.95,50.55,4.9,58.2]],["C",[5,69.7,9.95,78.4]],["C",[14.9,87.1,23.3,92]],["C",[31.7,96.8,42.1,96.9]],["C",[51.45,96.85,59.3,92.55]],["C",[67.1,88.3,72,80.5]],["L",[65,80.5]],["C",[60.9,85.2,55,87.8]],["C",[49.1,90.35,42.55,90.4]],["C",[34,90.35,27.3,86.5]],["C",[20.65,82.65,16.8,75.5]],["C",[13,68.4,12.9,58.6]],["C",[12.95,50.2,16.55,43.4]],["C",[20.15,36.65,26.6,32.65]],["C",[33.05,28.7,41.6,28.6]],["C",[48.95,28.65,55.05,31.55]],["C",[61.05,34.4,64.65,39.75]],["C",[68.2,45.1,68.3,52.6]],["C",[68.25,58.75,66.3,63.6]],["C",[64.4,68.5,61.45,71.3]],["C",[58.5,74.15,55.3,74.2]],["C",[54,74.15,53.6,73.15]],["C",[53.25,72.05,53.5,70.5]],["C",[53.75,68.9,54.3,67.3]],["L",[61.5,41]],["L",[54.5,41]],["L",[52.75,46.7]],["C",[50.85,42.9,47.95,41.2]],["C",[45.05,39.5,41.5,39.5]],["C",[36.55,39.55,32.5,41.75]],["C",[28.5,44,25.65,47.7]],["C",[22.7,51.4,21.15,56]],["C",[19.6,60.6,19.6,65.35]],["C",[19.65,69.7,21.55,73.3]],["C",[23.45,76.8,26.7,78.95]],["C",[30,81.05,34.2,81.1]],["C",[37.45,81,40.4,79.35]],["C",[43.3,77.7,45.4,75.4]],["L",[45.6,75.4]],["C",[45.8,78.3,47.45,79.75]],["C",[49.1,81.2,51.5,81.2]],["C",[54.65,81.2,58.6,79.4]],["C",[62.6,77.5,66.35,73.8]],["C",[70.05,70.15,72.55,64.55]],["C",[75,58.9,75.1,51.4]],["C",[75.05,44.9,72.35,39.6]],["C",[69.7,34.2,65.05,30.3]],["C",[60.35,26.4,54.35,24.25]],["C",[48.35,22.15,41.6,22.1]],["M",[30.2,71.05]],["C",[28.15,68.55,28.1,64.5]],["C",[28.1,60.65,29.8,56.65]],["C",[31.55,52.6,34.6,49.9]],["C",[37.7,47.1,41.9,47]],["C",[45.2,47.1,47.45,49.65]],["C",[49.7,52.2,49.8,55.8]],["C",[49.8,58.6,48.8,61.65]],["C",[47.75,64.75,45.9,67.4]],["C",[44.1,70.1,41.55,71.8]],["C",[39.05,73.5,36.1,73.55]],["C",[32.35,73.5,30.2,71.05]]]);
		this.motifs.set("[",[["M",[7.25,22.1]],["L",[7.25,114.3]],["L",[29.5,114.3]],["L",[29.5,105.3]],["L",[18,105.3]],["L",[18,31.1]],["L",[29.5,31.1]],["L",[29.5,22.1]],["L",[7.25,22.1]]]);
		this.motifs.set("\\",[["M",[37.4,96.9]],["L",[8.7,22.1]],["L",[-2.2,22.1]],["L",[26.5,96.9]],["L",[37.4,96.9]]]);
		this.motifs.set("]",[["M",[11.6,31.1]],["L",[11.6,105.3]],["L",[0.15,105.3]],["L",[0.15,114.3]],["L",[22.4,114.3]],["L",[22.4,22.1]],["L",[0.15,22.1]],["L",[0.15,31.1]],["L",[11.6,31.1]]]);
		this.motifs.set("^",[["M",[26.4,25.2]],["L",[8.4,61.7]],["L",[18.6,61.7]],["L",[30.05,37]],["L",[41.4,61.7]],["L",[51.6,61.7]],["L",[33.6,25.2]],["L",[26.4,25.2]]]);
		this.motifs.set("_",[["M",[50,102.7]],["L",[0,102.7]],["L",[0,107.7]],["L",[50,107.7]],["L",[50,102.7]]]);
		this.motifs.set("`",[["M",[10.55,22.1]],["L",[-2.9,22.1]],["L",[11.35,36.4]],["L",[19.65,36.4]],["L",[10.55,22.1]]]);
	}
	,initializeWidthsUppercase: function() {
		this.widths.set("A",67);
		this.widths.set("B",70);
		this.widths.set("C",72);
		this.widths.set("D",72);
		this.widths.set("E",63);
		this.widths.set("F",59);
		this.widths.set("G",76);
		this.widths.set("H",72);
		this.widths.set("I",28);
		this.widths.set("J",54);
		this.widths.set("K",69);
		this.widths.set("L",57);
		this.widths.set("M",89);
		this.widths.set("N",72);
		this.widths.set("O",76);
		this.widths.set("P",67);
		this.widths.set("Q",76);
		this.widths.set("R",70);
		this.widths.set("S",65);
		this.widths.set("T",59);
		this.widths.set("U",72);
		this.widths.set("V",61);
		this.widths.set("W",94);
		this.widths.set("X",65);
		this.widths.set("Y",65);
		this.widths.set("Z",63);
	}
	,initializeWidthsLowercase: function() {
		this.widths.set("a",56);
		this.widths.set("b",61);
		this.widths.set("c",56);
		this.widths.set("d",61);
		this.widths.set("e",56);
		this.widths.set("f",32);
		this.widths.set("g",59);
		this.widths.set("h",57);
		this.widths.set("i",24);
		this.widths.set("j",24);
		this.widths.set("k",54);
		this.widths.set("l",24);
		this.widths.set("m",87);
		this.widths.set("n",57);
		this.widths.set("o",59);
		this.widths.set("p",61);
		this.widths.set("q",61);
		this.widths.set("r",35);
		this.widths.set("s",52);
		this.widths.set("t",33);
		this.widths.set("u",57);
		this.widths.set("v",52);
		this.widths.set("w",78);
		this.widths.set("x",54);
		this.widths.set("y",52);
		this.widths.set("z",50);
	}
	,initializeWidthsNumbers: function() {
		this.widths.set("0",56);
		this.widths.set("1",56);
		this.widths.set("2",56);
		this.widths.set("3",56);
		this.widths.set("4",56);
		this.widths.set("5",56);
		this.widths.set("6",56);
		this.widths.set("7",56);
		this.widths.set("8",56);
		this.widths.set("9",56);
	}
	,initializeWidthsPunctuation: function() {
		this.widths.set(" ",28);
		this.widths.set("!",28);
		this.widths.set("\"",44);
		this.widths.set("#",56);
		this.widths.set("$",56);
		this.widths.set("%",100);
		this.widths.set("&",65);
		this.widths.set("'",28);
		this.widths.set("(",28);
		this.widths.set(")",28);
		this.widths.set("*",37);
		this.widths.set("+",60);
		this.widths.set(",",28);
		this.widths.set("-",39);
		this.widths.set(".",28);
		this.widths.set("/",35);
		this.widths.set(":",28);
		this.widths.set(");",28);
		this.widths.set("<",60);
		this.widths.set("=",60);
		this.widths.set(">",60);
		this.widths.set("?",56);
		this.widths.set("@",80);
		this.widths.set("[",30);
		this.widths.set("\\",35);
		this.widths.set("]",30);
		this.widths.set("^",60);
		this.widths.set("_",50);
		this.widths.set("`",24);
	}
});
net.badimon.five3D.typography.Neue = function() {
	net.badimon.five3D.typography.Typography3D.call(this);
	this.initializeMotifs();
	this.initializeWidths();
	this.height = 95;
};
net.badimon.five3D.typography.Neue.__name__ = true;
net.badimon.five3D.typography.Neue.__super__ = net.badimon.five3D.typography.Typography3D;
net.badimon.five3D.typography.Neue.prototype = $extend(net.badimon.five3D.typography.Typography3D.prototype,{
	initializeMotifs: function() {
		this.motifs.set("\x05",[["M",[-3.7,7.3]],["C",[-2.3,21.9,11.7,21.9]],["C",[26.5,22.1,28.9,7.3]],["L",[22.8,7.3]],["C",[20.8,14.6,12.1,14.4]],["C",[9.2,14.4,6.2,12.8]],["C",[3.3,11.2,2.5,7.3]],["L",[-3.7,7.3]]]);
		this.motifs.set("\x07",[["M",[29.5,7.7]],["L",[18.8,7.7]],["L",[12.5,15.8]],["L",[6.4,7.7]],["L",[-4.4,7.7]],["L",[6.3,21.8]],["L",[18.8,21.8]],["C",[24.2,14.8,29.5,7.7]]]);
		this.motifs.set("\x11",[["M",[5.6,80]],["L",[19.4,80]],["L",[19.4,28.3]],["L",[5.6,28.3]],["L",[5.6,80]]]);
		this.motifs.set("\x13",[["M",[6,20.3]],["L",[19.1,20.3]],["L",[19.1,8.6]],["L",[6,8.6]],["L",[6,20.3]]]);
		this.motifs.set("\x16",[["M",[19.2,7.7]],["L",[3.5,7.7]],["C",[-1,14.8,-5.6,21.9]],["L",[4.3,21.9]],["C",[11.8,14.8,19.2,7.7]],["M",[39.9,7.7]],["L",[24.2,7.7]],["C",[19.7,14.8,15.1,21.9]],["L",[25,21.9]],["C",[32.5,14.8,39.9,7.7]]]);
		this.motifs.set("\x1A",[["M",[6.3,14.4]],["C",[6.3,11.3,8.1,9.3]],["C",[9.8,7.4,12.5,7.4]],["C",[15.3,7.4,17,9.3]],["C",[18.7,11.3,18.7,14.4]],["C",[18.7,17.3,17,19.3]],["C",[15.3,21.4,12.5,21.4]],["C",[9.8,21.4,8.1,19.3]],["C",[6.3,17.3,6.3,14.4]],["M",[0.7,14.4]],["C",[0.7,19.5,4.2,22.9]],["C",[7.6,26.6,12.5,26.6]],["C",[17.5,26.6,20.9,22.9]],["C",[24.3,19.5,24.4,14.4]],["C",[24.3,9.1,20.9,5.7]],["C",[17.5,2.3,12.5,2.2]],["C",[7.6,2.3,4.2,5.7]],["C",[0.7,9.1,0.7,14.4]]]);
		this.motifs.set("\x1E",[["M",[19.6,92.8]],["C",[18.3,94.5,16.9,95.1]],["C",[15.5,95.8,14,95.8]],["C",[12.5,95.7,11.4,94.8]],["C",[10.2,93.9,10.2,92.4]],["C",[10.1,89.9,11.9,86.9]],["C",[13.7,84,18.2,79.7]],["L",[11.9,79.7]],["C",[7.9,82.1,5.8,84.2]],["C",[3.4,86.3,2.4,88]],["C",[1.5,89.7,1.2,90.9]],["C",[0.9,92.1,0.9,92.8]],["C",[0.9,95.9,2.2,97.7]],["C",[3.5,99.5,5.3,100.4]],["C",[7.1,101.2,8.7,101.5]],["C",[10.4,101.8,11.3,101.8]],["C",[14.6,101.8,18,100.2]],["C",[21.3,98.7,24.2,95]],["L",[19.6,92.8]]]);
		this.motifs.set(" ",[]);
		this.motifs.set("!",[["M",[20.7,8.6]],["L",[6.3,8.6]],["L",[6.3,27.8]],["L",[10,58.6]],["L",[16.8,58.6]],["L",[20.7,27.8]],["L",[20.7,8.6]],["M",[5.4,80]],["L",[21.1,80]],["L",[21.1,64.7]],["L",[5.4,64.7]],["L",[5.4,80]]]);
		this.motifs.set("\"",[["M",[26.3,40.6]],["L",[36.6,40.6]],["L",[36.6,8.6]],["L",[26.3,8.6]],["L",[26.3,40.6]],["M",[7.7,40.6]],["L",[18,40.6]],["L",[18,8.6]],["L",[7.7,8.6]],["L",[7.7,40.6]]]);
		this.motifs.set("#",[["M",[8.4,80]],["L",[17.9,80]],["L",[20.6,60.2]],["L",[29.9,60.2]],["C",[28.6,70.1,27.2,80]],["L",[36.7,80]],["C",[38,70.1,39.3,60.2]],["L",[47.8,60.2]],["L",[47.8,51.2]],["L",[40.3,51.2]],["C",[41.2,45,42,38.8]],["L",[50.6,38.8]],["L",[50.6,29.8]],["L",[43.4,29.8]],["L",[46.1,10]],["L",[36.7,10]],["C",[35.4,19.9,34.1,29.8]],["L",[24.7,29.8]],["L",[27.4,10]],["L",[18,10]],["C",[16.7,19.9,15.3,29.8]],["L",[6.1,29.8]],["L",[6.1,38.8]],["L",[14.1,38.8]],["L",[12.4,51.2]],["L",[3.2,51.2]],["L",[3.2,60.2]],["L",[11.2,60.2]],["L",[8.4,80]],["M",[32.8,38.8]],["L",[31.2,51.2]],["L",[21.8,51.2]],["L",[23.5,38.8]],["L",[32.8,38.8]]]);
		this.motifs.set("$",[["M",[23.3,34.9]],["C",[13.8,33.1,14.1,26.9]],["C",[14.2,22.7,17,20.6]],["C",[19.8,18.6,23.3,18.6]],["L",[23.3,34.9]],["M",[29,50.8]],["C",[35.1,52.3,37.7,54.3]],["C",[40.2,56.3,40.2,60.2]],["C",[40.1,65,36.5,67.2]],["C",[33.1,69.6,29,70]],["L",[29,50.8]],["M",[-1.4,56.8]],["C",[1.1,80.2,23.3,81.7]],["L",[23.3,90.2]],["L",[29,90.2]],["L",[29,81.7]],["C",[36.4,81,41.4,78.6]],["C",[46.2,76.1,49,72.8]],["C",[51.9,69.4,52.9,66.2]],["C",[54,63,54,60.8]],["C",[54,58.2,53.7,55]],["C",[53.2,51.8,51.3,48.6]],["C",[49.7,45.4,45.5,42.5]],["C",[41.4,39.6,34,37.6]],["C",[31.3,36.9,29,36.3]],["L",[29,18.6]],["C",[32.7,18.7,35.2,21.3]],["C",[37.5,24.1,37.6,28.2]],["L",[51.4,28.2]],["C",[50.6,17.9,44.4,12.8]],["C",[38.1,7.7,29,6.9]],["L",[29,-0.8]],["L",[23.3,-0.8]],["L",[23.3,6.9]],["C",[14.1,7.3,7.3,12.6]],["C",[0.4,18,0.3,28.3]],["C",[0.3,33.2,2.1,36.5]],["C",[3.7,39.9,6.5,42.1]],["C",[9.4,44.3,12.9,45.7]],["C",[16.4,47.2,20.1,48.2]],["C",[22.2,48.6,23.3,49.1]],["L",[22.7,70]],["C",[18.3,69,15.3,65.7]],["C",[12.5,62.4,12.4,56.8]],["L",[-1.4,56.8]]]);
		this.motifs.set("%",[["M",[7.3,28.4]],["C",[7.2,36.8,10.8,42.2]],["C",[14.5,47.5,23.2,47.6]],["C",[31.7,47.5,35.7,42.3]],["C",[39.6,37.1,39.6,28.8]],["C",[39.6,20.3,36.2,14.5]],["C",[34.4,11.8,31.4,10.1]],["C",[28.2,8.6,23.7,8.6]],["C",[15.4,8.7,11.3,14.3]],["C",[7.3,19.9,7.3,28.4]],["M",[17.1,28.6]],["C",[17,24.9,18.1,20.6]],["C",[18.9,18.6,20.2,17.4]],["C",[21.4,16.1,23.7,16.1]],["C",[28,16.4,29,20.9]],["C",[29.5,22.9,29.6,25.1]],["C",[29.7,27.2,29.7,28.7]],["C",[29.8,32.1,28.9,35.9]],["C",[28.3,37.7,27,38.8]],["C",[25.7,40.1,23.4,40.1]],["C",[18.9,40,17.9,35.9]],["C",[17,32.1,17.1,28.6]],["M",[24.3,82.2]],["L",[33,82.2]],["L",[72.9,7.8]],["L",[64.7,7.8]],["L",[24.3,82.2]],["M",[57.3,61.7]],["C",[57.2,70.1,60.9,75.6]],["C",[64.6,81.3,73.2,81.4]],["C",[81.7,81.3,85.7,75.8]],["C",[89.6,70.4,89.6,62.1]],["C",[89.6,53.6,86.2,48]],["C",[82.7,42.5,73.7,42.4]],["C",[65.4,42.5,61.3,47.9]],["C",[57.3,53.3,57.3,61.7]],["M",[67.1,61.8]],["C",[67.1,60,67.4,57.9]],["C",[67.5,55.9,68.1,54.1]],["C",[68.9,52.2,70.2,51]],["C",[71.4,49.9,73.7,49.9]],["C",[78,50.1,79,54.4]],["C",[79.5,56.3,79.6,58.3]],["C",[79.7,60.3,79.7,61.9]],["C",[79.8,65.4,78.9,69.4]],["C",[78.3,71.2,77.1,72.5]],["C",[75.7,73.9,73.3,73.9]],["C",[71,73.9,69.7,72.5]],["C",[68.5,71.2,67.9,69.4]],["C",[67.3,67.4,67.2,65.4]],["C",[67.1,63.4,67.1,61.8]]]);
		this.motifs.set("&",[["M",[37,24]],["C",[36.9,27.9,34.9,30]],["C",[32.7,32.3,29.5,34.2]],["C",[27.3,31.8,25.7,29.3]],["C",[23.7,26.8,23.7,23.6]],["C",[23.7,20.7,25.8,19]],["C",[27.6,17.3,30.3,17.3]],["C",[33.3,17.3,35.1,19.2]],["C",[37,21.2,37,24]],["M",[25.3,48.5]],["L",[37.7,63.4]],["C",[35.3,66.2,32.4,67.9]],["C",[29.5,69.7,25.5,69.7]],["C",[21.3,69.7,18.3,66.9]],["C",[15.1,64.3,15.1,60.3]],["C",[15.2,56,18.4,53]],["C",[21.3,50.1,25.3,48.5]],["M",[43.9,72.9]],["L",[49.8,80]],["L",[67.4,80]],["L",[53.4,63.1]],["C",[59.1,55.3,60.1,45.5]],["L",[48.1,45.5]],["C",[47.7,50,45.7,54]],["C",[41.2,48.4,36.7,42.7]],["C",[42,39.9,45.5,35.4]],["C",[48.9,31,49,24.9]],["C",[48.9,16.3,43.4,12]],["C",[37.8,7.8,29.6,7.8]],["C",[22.4,7.9,17,12.2]],["C",[11.3,16.5,11.2,24.1]],["C",[11.2,28.7,13.2,32.2]],["C",[15.1,35.7,18,39.3]],["C",[11.5,42.2,6.9,47.3]],["C",[2.1,52.5,2.1,60]],["C",[2.1,70.1,8.6,75.7]],["C",[14.8,81.3,24.5,81.4]],["C",[36,81.3,43.9,72.9]]]);
		this.motifs.set("'",[["M",[8.3,40.6]],["L",[18.7,40.6]],["L",[18.7,8.6]],["L",[8.3,8.6]],["L",[8.3,40.6]]]);
		this.motifs.set("(",[["M",[17.9,6.9]],["C",[11.5,16.6,8.3,29.1]],["C",[5,41.7,5,53.2]],["C",[5.3,77.2,17.8,98.2]],["L",[29.2,98.2]],["C",[18.7,76.2,18.8,52.2]],["C",[18.7,28.5,29.3,6.9]],["L",[17.9,6.9]]]);
		this.motifs.set(")",[["M",[10.8,98.2]],["C",[17.2,88.4,20.4,75.9]],["C",[23.6,63.4,23.6,52]],["C",[23.4,28,10.8,6.9]],["L",[-0.6,6.9]],["C",[10,29,9.9,53]],["C",[9.9,76.7,-0.6,98.2]],["L",[10.8,98.2]]]);
		this.motifs.set("*",[["M",[23.5,21.1]],["L",[23.5,8.6]],["L",[15.7,8.6]],["L",[15.7,21.1]],["L",[4.7,16.7]],["L",[2.1,24.4]],["L",[13.4,28.3]],["L",[6.2,38.1]],["L",[12.7,43]],["L",[19.5,32.7]],["L",[26.7,43]],["L",[33.1,38.1]],["C",[29.5,33.2,25.9,28.3]],["L",[37.3,24.4]],["C",[36,20.5,34.7,16.7]],["L",[23.5,21.1]]]);
		this.motifs.set("+",[["M",[34.3,29.6]],["L",[23.9,29.6]],["L",[23.9,49.4]],["L",[4.6,49.4]],["L",[4.6,60.1]],["L",[23.9,60.1]],["L",[23.9,80]],["L",[34.3,80]],["L",[34.3,60.1]],["L",[53.6,60.1]],["L",[53.6,49.4]],["L",[34.3,49.4]],["L",[34.3,29.6]]]);
		this.motifs.set(",",[["M",[5.7,80]],["L",[12.8,80]],["C",[12.9,83.4,11.1,86]],["C",[9.1,88.7,5.8,89.4]],["L",[5.8,96.6]],["C",[12.4,95.5,16.9,91.2]],["C",[21.3,86.9,21.4,80]],["L",[21.4,64.7]],["L",[5.7,64.7]],["L",[5.7,80]]]);
		this.motifs.set("-",[["M",[5.1,58.8]],["L",[34.2,58.8]],["L",[34.2,46.6]],["L",[5.1,46.6]],["L",[5.1,58.8]]]);
		this.motifs.set(".",[["M",[5.6,80]],["L",[21.3,80]],["L",[21.3,64.7]],["L",[5.6,64.7]],["L",[5.6,80]]]);
		this.motifs.set("/",[["M",[-1.1,81.7]],["L",[10,81.7]],["C",[23.5,44.3,37,6.9]],["L",[26,6.9]],["L",[-1.1,81.7]]]);
		this.motifs.set("0",[["M",[2,44.7]],["C",[2.1,65.2,9.5,73.5]],["C",[16.5,81.5,26.8,81.4]],["C",[37.3,81.5,44.5,73.5]],["C",[51.7,65.2,51.9,44.7]],["C",[51.7,24.5,44.5,16.4]],["C",[37.3,8.5,26.8,8.6]],["C",[16.5,8.5,9.5,16.4]],["C",[2.1,24.5,2,44.7]],["M",[15.8,44.7]],["C",[15.8,41.8,16,37.8]],["C",[16.3,33.8,17.2,29.8]],["C",[18.2,25.8,20.5,23.1]],["C",[22.9,20.4,26.8,20.3]],["C",[31,20.4,33.4,23.1]],["C",[35.8,25.8,36.7,29.8]],["C",[37.7,33.8,38,37.8]],["C",[38.1,41.8,38.1,44.7]],["C",[38.1,47.6,38,51.8]],["C",[37.7,55.9,36.7,60.1]],["C",[35.8,64.1,33.4,66.8]],["C",[31,69.7,26.8,69.7]],["C",[22.9,69.7,20.5,66.8]],["C",[18.2,64.1,17.2,60.1]],["C",[16.3,55.9,16,51.8]],["C",[15.8,47.6,15.8,44.7]]]);
		this.motifs.set("1",[["M",[38,10]],["L",[27,10]],["C",[25.9,17.8,20.3,21.1]],["C",[14.6,24.2,7.2,23.9]],["L",[7.2,34.6]],["L",[24.2,34.6]],["L",[24.2,80]],["L",[38,80]],["L",[38,10]]]);
		this.motifs.set("2",[["M",[16.7,36.9]],["C",[16.7,31,19.1,26]],["C",[21.5,21,27.5,20.8]],["C",[32.1,20.8,34.9,23.7]],["C",[37.6,26.6,37.7,31.6]],["C",[37.7,34.8,36.4,37.2]],["C",[35.1,39.7,32.8,41.7]],["C",[30.8,43.6,28.3,45.3]],["L",[23.5,48.7]],["C",[19,51.6,15.3,54.6]],["C",[11.4,57.7,8.4,61.3]],["C",[2.4,68.2,2.1,80]],["L",[51.9,80]],["L",[51.9,67.8]],["L",[19.8,67.8]],["C",[23.6,62.5,29,58.8]],["L",[39.4,51.7]],["C",[44.6,48.1,48,43.1]],["C",[51.4,38.2,51.5,30.5]],["C",[51.3,20.1,44.5,14.3]],["C",[37.8,8.7,28.2,8.6]],["C",[16,8.7,9.7,16.7]],["C",[3.4,24.6,3.6,36.9]],["L",[16.7,36.9]]]);
		this.motifs.set("3",[["M",[22.1,48.3]],["L",[27.5,48.3]],["C",[30.2,48.5,32.5,49.5]],["C",[34.9,50.4,36.4,52.5]],["C",[37.7,54.7,37.7,58.7]],["C",[37.6,63.7,34.6,66.6]],["C",[31.5,69.7,26.7,69.7]],["C",[20.8,69.6,18,65.6]],["C",[15.1,61.7,14.8,55.9]],["L",[1.8,55.9]],["C",[1.8,68,8.6,74.6]],["C",[15.4,81.3,26.9,81.4]],["C",[37.3,81.3,44.5,75.3]],["C",[51.9,69.4,52.1,58.4]],["C",[52.1,52.4,48.9,48.1]],["C",[45.6,43.8,39.7,42.5]],["L",[39.7,42.3]],["C",[44.7,40.8,47.1,36.9]],["C",[49.5,33,49.5,28]],["C",[49.3,18.5,42.2,13.5]],["C",[35.3,8.6,26.8,8.6]],["C",[16.3,8.7,10.2,15.2]],["C",[4.1,21.8,3.5,32.8]],["L",[16.6,32.8]],["C",[16.6,27.3,19.2,23.8]],["C",[21.9,20.4,26.9,20.3]],["C",[30.8,20.3,33.6,22.8]],["C",[36.3,25.2,36.4,29.7]],["C",[36.4,32.5,35.1,34.3]],["C",[33.7,36.3,31.5,37.1]],["C",[29.4,38,26.8,38.3]],["C",[24.3,38.5,22,38.3]],["C",[22.1,43.3,22.1,48.3]]]);
		this.motifs.set("4",[["M",[30.2,80]],["L",[43.3,80]],["L",[43.3,63.8]],["L",[52.3,63.8]],["L",[52.3,52.1]],["L",[43.3,52.1]],["L",[43.3,10]],["L",[31,10]],["C",[16.3,30.4,1.6,50.8]],["L",[1.6,63.8]],["L",[30.2,63.8]],["L",[30.2,80]],["M",[30.2,52.1]],["L",[12.4,52.1]],["C",[21.2,40,29.9,27.8]],["L",[30.2,27.8]],["L",[30.2,52.1]]]);
		this.motifs.set("5",[["M",[48.4,10]],["L",[10.5,10]],["L",[3.9,48.7]],["L",[16.2,48.7]],["C",[18.2,45.9,20.6,44.4]],["C",[23,43,26.6,43]],["C",[32.2,43.1,35.3,46.7]],["C",[38.3,50.5,38.3,56.2]],["C",[38.3,61.6,35.2,65.5]],["C",[32.1,69.6,26.6,69.7]],["C",[22.1,69.7,19,66.7]],["C",[16.2,63.9,15.5,59.2]],["L",[1.7,59.2]],["C",[2.2,70.1,9.5,75.7]],["C",[16.7,81.4,26.9,81.4]],["C",[37.5,81.3,44.7,74.2]],["C",[51.9,67.2,52.1,56.2]],["C",[52.1,46,46.6,39.3]],["C",[41.2,32.5,31.2,32.4]],["C",[23.3,32.3,17.9,37.8]],["L",[17.7,37.6]],["L",[20.4,21.7]],["L",[48.4,21.7]],["L",[48.4,10]]]);
		this.motifs.set("6",[["M",[50.7,28]],["C",[49.4,18.6,43.6,13.6]],["C",[37.7,8.6,28.7,8.6]],["C",[14.4,8.9,8.1,20.4]],["C",[1.9,31.6,2,45.2]],["C",[1.8,59,7.5,69.8]],["C",[12.9,81.1,28.1,81.4]],["C",[38.9,81.2,45.3,73.9]],["C",[51.8,66.7,51.9,55.8]],["C",[51.9,47.1,46.6,40.3]],["C",[40.3,33.3,31,33.1]],["C",[21.2,32.9,15.7,40.8]],["L",[15.5,40.6]],["C",[15.7,37.6,16.4,34]],["C",[17,30.2,18.5,26.9]],["C",[20,23.5,22.4,21.4]],["C",[24.9,19.4,28.5,19.3]],["C",[32.2,19.4,34.6,21.7]],["C",[37,24.3,37.6,28]],["L",[50.7,28]],["M",[27.7,43.7]],["C",[33,43.8,35.7,47.8]],["C",[38.1,51.7,38.1,56.9]],["C",[38.1,61.8,35.5,65.6]],["C",[34.2,67.4,32.3,68.5]],["C",[30.2,69.7,27.7,69.7]],["C",[22.6,69.6,19.8,65.5]],["C",[16.7,61.7,16.7,56.7]],["C",[16.7,51.3,19.6,47.5]],["C",[22.2,43.8,27.7,43.7]]]);
		this.motifs.set("7",[["M",[50.1,10]],["L",[3.8,10]],["L",[3.8,23.2]],["L",[35.9,23.2]],["C",[16,48.1,13.1,80]],["L",[27.9,80]],["C",[28.1,65.2,33.8,48.8]],["C",[39.4,32.4,50.1,22.2]],["L",[50.1,10]]]);
		this.motifs.set("8",[["M",[15.6,58.8]],["C",[15.6,53.4,19.3,50.5]],["C",[22.8,47.7,28,47.7]],["C",[33.1,47.8,36.5,50.7]],["C",[39.9,53.7,40,58.9]],["C",[39.9,64.2,36.6,67.4]],["C",[33.2,70.7,28,70.7]],["C",[22.8,70.7,19.3,67.4]],["C",[15.6,64.2,15.6,58.8]],["M",[4.3,27.7]],["C",[4.3,32.9,7,36.7]],["C",[9.5,40.5,14.6,42.1]],["L",[14.6,42.3]],["C",[1.6,45.7,1.4,59.5]],["C",[1.6,70.7,9.7,76.1]],["C",[17.6,81.4,28,81.4]],["C",[38.2,81.4,46,75.8]],["C",[54,70.4,54.2,59.4]],["C",[54,45.7,41.1,42.3]],["L",[41.1,42.1]],["C",[51.2,38.3,51.3,27.4]],["C",[51.3,24.7,50.2,21.5]],["C",[48.9,18.3,46.2,15.4]],["C",[43.5,12.5,39,10.5]],["C",[34.5,8.6,27.9,8.6]],["C",[18.9,8.6,11.9,13.4]],["C",[4.5,18.2,4.3,27.7]],["M",[17.2,29]],["C",[17.3,24.3,20.5,21.7]],["C",[23.5,19.3,27.9,19.3]],["C",[31.2,19.3,33.4,20.2]],["C",[35.5,21.1,36.5,22.7]],["C",[37.7,24.2,38.1,25.9]],["C",[38.4,27.6,38.4,29]],["C",[38.3,33.5,35.4,35.8]],["C",[32.4,38.2,27.9,38.2]],["C",[23.5,38.2,20.5,35.8]],["C",[17.3,33.5,17.2,29]]]);
		this.motifs.set("9",[["M",[3.2,62]],["C",[4.5,71.2,10.4,76.2]],["C",[16.3,81.3,25.1,81.4]],["C",[39.6,81,45.8,69.4]],["C",[51.9,58.2,51.9,44.8]],["C",[52,30.8,46.6,20]],["C",[40.9,8.9,25.8,8.6]],["C",[15,8.7,8.6,16]],["C",[2.1,23.1,2,34.2]],["C",[1.9,42.9,7.3,49.8]],["C",[13.7,56.9,22.9,57]],["C",[32.7,57.1,38.2,49.2]],["L",[38.4,49.4]],["C",[38.3,52.4,37.7,55.9]],["C",[37,59.5,35.6,63]],["C",[34.1,66.2,31.7,68.4]],["C",[29.2,70.8,25.4,70.8]],["C",[21.9,70.8,19.5,68.1]],["C",[17,65.6,16.3,62]],["L",[3.2,62]],["M",[26.2,46.4]],["C",[20.9,46.3,18.4,42.2]],["C",[15.8,38.3,15.8,33.2]],["C",[15.8,28.1,18.6,24.3]],["C",[21.2,20.4,26.2,20.3]],["C",[31.4,20.4,34.3,24.3]],["C",[37.1,28.1,37.1,33.4]],["C",[37.1,38.5,34.5,42.4]],["C",[31.7,46.3,26.2,46.4]]]);
		this.motifs.set(":",[["M",[5.7,80]],["L",[21.4,80]],["L",[21.4,64.7]],["L",[5.7,64.7]],["L",[5.7,80]],["M",[21.4,29.3]],["L",[5.7,29.3]],["L",[5.7,44.6]],["L",[21.4,44.6]],["L",[21.4,29.3]]]);
		this.motifs.set(";",[["M",[5.7,80]],["L",[12.8,80]],["C",[12.9,83.4,11.1,86]],["C",[9.1,88.7,5.8,89.4]],["L",[5.8,96.6]],["C",[12.4,95.5,16.9,91.2]],["C",[21.3,86.9,21.4,80]],["L",[21.4,64.7]],["L",[5.7,64.7]],["L",[5.7,80]],["M",[21.4,29.3]],["L",[5.7,29.3]],["L",[5.7,44.6]],["L",[21.4,44.6]],["L",[21.4,29.3]]]);
		this.motifs.set("<",[["M",[53.7,28.6]],["L",[4.4,48.8]],["L",[4.4,60.6]],["C",[29.1,70.7,53.7,80.8]],["L",[53.7,69.4]],["C",[35.3,62.1,16.9,54.8]],["C",[35.3,47.5,53.7,40.2]],["L",[53.7,28.6]]]);
		this.motifs.set("=",[["M",[53.6,38.7]],["L",[4.6,38.7]],["L",[4.6,49.3]],["L",[53.6,49.3]],["L",[53.6,38.7]],["M",[53.6,60.1]],["L",[4.6,60.1]],["L",[4.6,70.8]],["L",[53.6,70.8]],["L",[53.6,60.1]]]);
		this.motifs.set(">",[["M",[4.4,80.8]],["C",[29.1,70.7,53.7,60.6]],["L",[53.7,48.8]],["L",[4.4,28.6]],["L",[4.4,40.2]],["C",[22.2,47.5,40,54.8]],["C",[22.2,62.1,4.4,69.4]],["L",[4.4,80.8]]]);
		this.motifs.set("?",[["M",[16.9,31.6]],["C",[17,26,19.5,22.3]],["C",[21.9,18.7,27.1,18.6]],["C",[35.4,18.6,35.6,27.6]],["C",[35.5,31.5,33.6,33.8]],["C",[31.5,36.1,28.5,38.4]],["C",[25.5,40.5,23,44]],["C",[20.7,47.6,20.1,54.1]],["L",[20.1,58.6]],["L",[33.2,58.6]],["L",[33.2,54.8]],["C",[33.7,52.6,34.6,50.8]],["C",[35.4,49.2,36.9,47.9]],["C",[38.3,46.6,39.9,45.4]],["L",[43,43.1]],["C",[46.4,40.7,48.9,37]],["C",[51.3,33.2,51.4,26.2]],["C",[51.4,23.1,50.3,19.8]],["C",[49,16.5,46.1,13.6]],["C",[43.3,10.7,38.6,8.8]],["C",[33.7,6.9,26.7,6.9]],["C",[15.7,7,9.4,13.8]],["C",[3,20.6,2.6,31.6]],["L",[16.9,31.6]],["M",[18.3,80]],["L",[34,80]],["L",[34,64.7]],["L",[18.3,64.7]],["L",[18.3,80]]]);
		this.motifs.set("@",[["M",[28.2,48.1]],["C",[28.2,42.7,31.6,38.2]],["C",[33.2,36.1,35.4,34.6]],["C",[37.6,33.4,40.2,33.4]],["C",[43.5,33.5,45.5,35.8]],["C",[47.7,38.1,47.7,41.9]],["C",[47.7,47.3,44.3,52]],["C",[42.8,54.1,40.6,55.5]],["C",[38.3,57,35.7,57]],["C",[32.3,57,30.3,54.5]],["C",[28.2,52,28.2,48.1]],["M",[60.3,25.5]],["L",[52.3,25.5]],["L",[50.7,30.9]],["C",[49.1,27,45.9,25.4]],["C",[42.7,23.9,39.4,23.9]],["C",[29.7,24.1,24.1,31.9]],["C",[18.4,39.5,18.3,49.3]],["C",[18.4,56.5,22.9,61.3]],["C",[27.1,66.3,33.5,66.5]],["C",[36.6,66.5,39.4,65]],["C",[42.2,63.6,43.9,60.7]],["L",[44.1,60.7]],["C",[44.3,63.1,46.3,64.7]],["C",[48.2,66.3,51.2,66.3]],["C",[53.7,66.3,57.5,64.7]],["C",[61.3,63,64.9,59.5]],["C",[68.8,56,71.3,50.5]],["C",[73.9,45,74,37.4]],["C",[73.7,23.4,63.7,15.2]],["C",[58.9,11.1,52.9,9]],["C",[46.8,6.9,40,6.9]],["C",[24.4,7.1,13.9,17.6]],["C",[3.2,28,3,44.3]],["C",[3.2,60.6,14,71]],["C",[24.6,81.5,40.5,81.7]],["C",[59.5,81.5,70.3,65.4]],["L",[62.1,65.4]],["C",[54,73.6,41.1,73.7]],["C",[28.3,73.6,20.5,65.6]],["C",[12.4,57.7,12.3,44.5]],["C",[12.4,31.5,19.9,23.3]],["C",[27.2,15,39.9,14.9]],["C",[51.4,14.9,58.8,21.1]],["C",[66.4,27.4,66.5,39.5]],["C",[66.4,47.5,62.8,52.6]],["C",[59.4,57.7,55,57.8]],["C",[53.3,57.7,53.4,55.4]],["C",[53.4,53.3,54.1,51.2]],["L",[60.3,25.5]]]);
		this.motifs.set("A",[["M",[-0.7,80]],["L",[14.7,80]],["L",[20.1,64.1]],["L",[46,64.1]],["L",[51.2,80]],["L",[67,80]],["L",[41.1,8.6]],["L",[25.6,8.6]],["L",[-0.7,80]],["M",[33.1,26.1]],["L",[33.3,26.1]],["L",[42,52.4]],["L",[24.1,52.4]],["L",[33.1,26.1]]]);
		this.motifs.set("B",[["M",[22.1,48.2]],["L",[38.4,48.2]],["C",[43.3,48.2,46.2,50.5]],["C",[49.1,52.9,49.1,58.4]],["C",[49,63.8,45.9,65.8]],["C",[42.7,67.9,38.1,67.8]],["L",[22.1,67.8]],["L",[22.1,48.2]],["M",[6.4,80]],["L",[40.2,80]],["C",[50.1,80,57.3,75]],["C",[64.6,70.1,64.8,59.3]],["C",[64.8,45.4,51.8,41.2]],["C",[56.4,38.9,59,35.2]],["C",[61.4,31.5,61.4,26.3]],["C",[61.3,16.4,55.3,12.4]],["C",[49.3,8.6,39.2,8.6]],["L",[6.4,8.6]],["L",[6.4,80]],["M",[22.1,20.8]],["L",[36.3,20.8]],["C",[40.5,20.7,43.5,22.3]],["C",[46.6,24,46.7,29]],["C",[46.6,33.6,44.1,35.5]],["C",[41.6,37.6,37.4,37.6]],["L",[22.1,37.6]],["L",[22.1,20.8]]]);
		this.motifs.set("C",[["M",[67.8,32.6]],["C",[66.2,20.1,57.8,13.5]],["C",[49.5,7,37.7,6.9]],["C",[21.5,7.1,12.5,17.7]],["C",[3.5,28.3,3.4,44.6]],["C",[3.5,60.4,12.5,70.8]],["C",[21.5,81.5,37.7,81.7]],["C",[64.6,81,68.4,52.6]],["L",[53.6,52.6]],["C",[52.8,59.7,48.9,64]],["C",[44.9,68.4,37.9,68.5]],["C",[27.9,68.3,23.5,61.1]],["C",[19,53.8,19.1,44.6]],["C",[19,34.8,23.5,27.6]],["C",[27.9,20.3,37.9,20.1]],["C",[43.7,20.2,48,23.6]],["C",[52.2,27.1,53,32.6]],["L",[67.8,32.6]]]);
		this.motifs.set("D",[["M",[6.4,80]],["L",[36.5,80]],["C",[52.4,79.9,60.4,69.6]],["C",[68.2,59.7,68.2,43.9]],["C",[68,26.1,59.1,17.3]],["C",[50.4,8.6,36.5,8.6]],["L",[6.4,8.6]],["L",[6.4,80]],["M",[22.1,21.8]],["L",[32.8,21.8]],["C",[43.9,21.9,48.2,28.2]],["C",[52.5,34.5,52.4,45.4]],["C",[52.4,51.2,51.1,55.3]],["C",[49.8,59.5,47.3,62]],["C",[45,64.5,41.9,65.6]],["C",[38.8,66.8,35.5,66.8]],["L",[22.1,66.8]],["L",[22.1,21.8]]]);
		this.motifs.set("E",[["M",[6.4,80]],["L",[59.4,80]],["L",[59.4,66.8]],["L",[22.1,66.8]],["L",[22.1,49.3]],["L",[55.7,49.3]],["L",[55.7,37.1]],["L",[22.1,37.1]],["L",[22.1,21.8]],["L",[58.7,21.8]],["L",[58.7,8.6]],["L",[6.4,8.6]],["L",[6.4,80]]]);
		this.motifs.set("F",[["M",[6.4,80]],["L",[22.1,80]],["L",[22.1,50.5]],["L",[51.1,50.5]],["L",[51.1,38.3]],["L",[22.1,38.3]],["L",[22.1,21.8]],["L",[55.6,21.8]],["L",[55.6,8.6]],["L",[6.4,8.6]],["L",[6.4,80]]]);
		this.motifs.set("G",[["M",[56.6,71.9]],["L",[58.2,80]],["L",[67.9,80]],["L",[67.9,41.4]],["L",[38.9,41.4]],["L",[38.9,53.1]],["C",[46.5,53.1,54.2,53.1]],["C",[52.7,68.4,37.8,68.5]],["C",[27.8,68.3,23.4,61.1]],["C",[19,53.8,19.1,44.6]],["C",[19,34.8,23.5,27.6]],["C",[27.8,20.3,37.8,20.1]],["C",[49.2,20.2,52.4,32.1]],["L",[66.8,32.1]],["C",[65.3,19.9,56.9,13.4]],["C",[48.5,6.9,37.5,6.9]],["C",[21.4,7.1,12.5,17.7]],["C",[3.5,28.3,3.4,44.6]],["C",[3.5,60.4,12.5,70.8]],["C",[21.4,81.5,37.6,81.7]],["C",[48.2,81.9,56.6,71.9]]]);
		this.motifs.set("H",[["M",[6.4,80]],["L",[22.1,80]],["L",[22.1,49.2]],["L",[49.6,49.2]],["L",[49.6,80]],["L",[65.3,80]],["L",[65.3,8.6]],["L",[49.6,8.6]],["L",[49.6,36]],["L",[22.1,36]],["L",[22.1,8.6]],["L",[6.4,8.6]],["L",[6.4,80]]]);
		this.motifs.set("I",[["M",[6.4,80]],["L",[22.1,80]],["L",[22.1,8.6]],["L",[6.4,8.6]],["L",[6.4,80]]]);
		this.motifs.set("J",[["M",[47.4,8.6]],["L",[31.7,8.6]],["L",[31.7,56.9]],["C",[31.8,60.9,30.7,64.6]],["C",[29.6,68.4,23.8,68.5]],["C",[21.2,68.5,19.6,67.5]],["C",[17.9,66.7,16.9,65.2]],["C",[15,61.8,15.1,56.7]],["L",[15.1,53.4]],["L",[1.4,53.4]],["L",[1.4,59.6]],["C",[1.6,71.2,8.4,76.4]],["C",[15.3,81.7,24.3,81.7]],["C",[32,81.6,36.8,79.1]],["C",[41.5,76.7,43.7,73]],["C",[46.1,69.2,46.8,65.1]],["C",[47.4,61.1,47.4,57.5]],["L",[47.4,8.6]]]);
		this.motifs.set("K",[["M",[6.4,80]],["L",[22.1,80]],["L",[22.1,57]],["L",[30.8,47.9]],["L",[51.7,80]],["L",[70.8,80]],["L",[41.1,36.8]],["L",[68.2,8.6]],["L",[49.2,8.6]],["L",[22.1,38.2]],["L",[22.1,8.6]],["L",[6.4,8.6]],["L",[6.4,80]]]);
		this.motifs.set("L",[["M",[6.4,80]],["L",[55.8,80]],["L",[55.8,66.8]],["L",[22.1,66.8]],["L",[22.1,8.6]],["L",[6.4,8.6]],["L",[6.4,80]]]);
		this.motifs.set("M",[["M",[6.7,80]],["L",[20.9,80]],["L",[20.9,29.9]],["L",[21.1,29.9]],["C",[29.6,55,38.1,80]],["L",[49.9,80]],["L",[66.7,29.4]],["L",[66.9,29.4]],["L",[66.9,80]],["L",[81.2,80]],["L",[81.2,8.6]],["L",[59.8,8.6]],["L",[44.5,57.7]],["L",[44.3,57.7]],["C",[36.2,33.2,28.1,8.6]],["L",[6.7,8.6]],["L",[6.7,80]]]);
		this.motifs.set("N",[["M",[6.7,80]],["L",[20.9,80]],["L",[20.9,32.2]],["L",[21.1,32.2]],["C",[35.5,56.1,49.9,80]],["L",[65.1,80]],["L",[65.1,8.6]],["L",[50.8,8.6]],["L",[50.8,56.5]],["L",[50.6,56.5]],["L",[21.8,8.6]],["L",[6.7,8.6]],["L",[6.7,80]]]);
		this.motifs.set("O",[["M",[3.4,44.6]],["C",[3.5,60.4,12.5,70.8]],["C",[21.5,81.5,37.7,81.7]],["C",[54.1,81.5,62.9,70.8]],["C",[71.8,60.4,71.9,44.6]],["C",[71.8,28.3,62.9,17.7]],["C",[54.1,7.1,37.7,6.9]],["C",[21.5,7.1,12.5,17.7]],["C",[3.5,28.3,3.4,44.6]],["M",[19.1,44.6]],["C",[19,34.8,23.4,27.6]],["C",[27.8,20.3,37.7,20.1]],["C",[47.8,20.3,52.1,27.6]],["C",[56.2,34.8,56.2,44.6]],["C",[56.2,53.8,52.1,61.1]],["C",[47.8,68.3,37.7,68.5]],["C",[27.8,68.3,23.4,61.1]],["C",[19,53.8,19.1,44.6]]]);
		this.motifs.set("P",[["M",[6.4,80]],["L",[22.1,80]],["L",[22.1,54.4]],["L",[38,54.4]],["C",[50.7,54.2,56.4,47.2]],["C",[61.8,40.5,61.8,31.5]],["C",[61.8,22.4,56.3,15.6]],["C",[50.6,8.8,37.7,8.6]],["L",[6.4,8.6]],["L",[6.4,80]],["M",[22.1,20.8]],["L",[33.8,20.8]],["C",[39.4,20.7,43.1,22.7]],["C",[47,24.8,47.1,31.5]],["C",[47,38.1,43.1,40.2]],["C",[41.4,41.4,39,41.8]],["C",[36.6,42.2,33.8,42.2]],["L",[22.1,42.2]],["L",[22.1,20.8]]]);
		this.motifs.set("Q",[["M",[64.3,86.7]],["L",[71.5,79]],["C",[67.1,75,62.6,71]],["C",[71.8,60.5,71.9,44.6]],["C",[71.8,28.3,62.9,17.7]],["C",[54.1,7.1,37.7,6.9]],["C",[21.5,7.1,12.5,17.7]],["C",[3.5,28.3,3.4,44.6]],["C",[3.5,60.4,12.5,70.8]],["C",[21.4,81.5,37.6,81.7]],["C",[47.5,81.6,54.4,77.5]],["L",[64.3,86.7]],["M",[44.3,53.6]],["L",[37,61.4]],["L",[43.7,67.5]],["C",[42.9,68.2,41.2,68.3]],["C",[39.5,68.5,37.7,68.5]],["C",[27.8,68.3,23.4,61.1]],["C",[19,53.8,19.1,44.6]],["C",[19,34.8,23.4,27.6]],["C",[27.8,20.3,37.7,20.1]],["C",[47.8,20.3,52.1,27.6]],["C",[56.2,34.8,56.2,44.6]],["C",[56.1,55.6,52,61.1]],["L",[44.3,53.6]]]);
		this.motifs.set("R",[["M",[6.4,80]],["L",[22.1,80]],["L",[22.1,52.1]],["L",[37.2,52.1]],["C",[42.9,52.1,45.5,54.6]],["C",[48,57.1,48.6,62.9]],["C",[49.1,67.2,49.5,71.8]],["C",[49.8,74,50.2,76.1]],["C",[50.5,78.2,51.1,80]],["L",[66.3,80]],["C",[65.3,78.5,64.8,76.2]],["C",[64.6,75.1,64.5,73.9]],["C",[64.2,72.9,64.1,71.7]],["C",[63.6,66.6,63.4,63.1]],["C",[63.2,57.5,61,52.7]],["C",[58.7,48,53,46.4]],["L",[53,46.2]],["C",[64.8,41.1,64.7,28.3]],["C",[64.6,19.9,59.2,14.3]],["C",[53.8,8.7,44.2,8.6]],["L",[6.4,8.6]],["L",[6.4,80]],["M",[22.1,20.8]],["L",[38.7,20.8]],["C",[48.9,20.7,49,30.7]],["C",[48.9,41.1,38.7,40.9]],["L",[22.1,40.9]],["L",[22.1,20.8]]]);
		this.motifs.set("S",[["M",[2.2,56.3]],["C",[2.5,69.4,11.3,75.5]],["C",[19.8,81.7,31.8,81.7]],["C",[46,81.6,53.3,75.1]],["C",[60.6,68.7,60.6,58.8]],["C",[60.5,52.7,58.3,48.8]],["C",[55.8,44.9,52.3,42.7]],["C",[48.8,40.4,45.5,39.4]],["C",[42.1,38.4,40,38]],["C",[27.4,34.8,23.2,32.8]],["C",[21.1,31.7,20.2,30.4]],["C",[19.4,29.1,19.4,27.2]],["C",[19.5,22.7,22.9,20.8]],["C",[26,19.1,29.8,19.1]],["C",[35.4,19,39.3,21.2]],["C",[43.1,23.6,43.5,29.9]],["L",[58.2,29.9]],["C",[58,17.5,49.9,12.1]],["C",[41.8,6.9,30.5,6.9]],["C",[20.7,6.9,12.9,12.2]],["C",[4.8,17.6,4.6,28.5]],["C",[4.6,33.4,6.5,36.8]],["C",[8.3,40.2,11.2,42.5]],["C",[14.2,44.7,17.9,46.2]],["C",[21.5,47.8,25.3,48.8]],["C",[33.3,50.6,39.5,52.8]],["C",[42.5,53.9,44.2,55.7]],["C",[45.9,57.6,45.9,60.6]],["C",[45.9,63.3,44.6,64.9]],["C",[43.3,66.7,41.2,67.7]],["C",[39.2,68.7,36.8,69.1]],["C",[34.5,69.5,32.4,69.5]],["C",[26,69.5,21.6,66.4]],["C",[17,63.3,16.9,56.3]],["L",[2.2,56.3]]]);
		this.motifs.set("T",[["M",[21.7,80]],["L",[37.5,80]],["L",[37.5,21.8]],["L",[58.2,21.8]],["L",[58.2,8.6]],["L",[1,8.6]],["L",[1,21.8]],["L",[21.7,21.8]],["L",[21.7,80]]]);
		this.motifs.set("U",[["M",[65.6,8.6]],["L",[49.9,8.6]],["L",[49.9,53]],["C",[49.9,61,46.8,64.7]],["C",[43.7,68.5,35.8,68.5]],["C",[31.4,68.5,28.7,67.2]],["C",[25.8,65.7,24.3,63.6]],["C",[22.9,61.3,22.4,58.7]],["C",[21.8,55.9,21.8,53]],["L",[21.8,8.6]],["L",[6.1,8.6]],["L",[6.1,53]],["C",[6.5,81.8,35.8,81.7]],["C",[65.1,81.7,65.6,53]],["L",[65.6,8.6]]]);
		this.motifs.set("V",[["M",[61.8,8.6]],["L",[46.1,8.6]],["C",[38.3,33.7,30.5,58.8]],["L",[30.3,58.8]],["L",[14.9,8.6]],["L",[-0.8,8.6]],["L",[21.7,80]],["L",[38.8,80]],["C",[50.3,44.3,61.8,8.6]]]);
		this.motifs.set("W",[["M",[91.1,8.6]],["L",[75.7,8.6]],["L",[64,57.8]],["L",[63.8,57.8]],["L",[51.6,8.6]],["L",[36.9,8.6]],["L",[24.5,57.2]],["L",[24.3,57.2]],["C",[18.7,32.9,13,8.6]],["L",[-2.7,8.6]],["C",[6.7,44.3,16.2,80]],["L",[32.1,80]],["C",[38,55.7,44,31.4]],["L",[44.2,31.4]],["C",[50.2,55.7,56.3,80]],["L",[71.9,80]],["C",[81.5,44.3,91.1,8.6]]]);
		this.motifs.set("X",[["M",[-0.6,80]],["L",[16.6,80]],["C",[24.2,67.6,31.9,55.3]],["L",[47,80]],["L",[65.1,80]],["C",[52.7,61.3,40.3,42.7]],["C",[51.8,25.7,63.2,8.6]],["L",[46.5,8.6]],["L",[32.5,31.4]],["L",[18.9,8.6]],["L",[1.4,8.6]],["C",[12.8,25.6,24.4,42.6]],["C",[11.9,61.3,-0.6,80]]]);
		this.motifs.set("Y",[["M",[24.3,80]],["L",[40,80]],["L",[40,52.6]],["L",[65.7,8.6]],["L",[48.6,8.6]],["L",[32.4,36.8]],["L",[16.1,8.6]],["L",[-1.1,8.6]],["C",[11.6,30.4,24.3,52.2]],["L",[24.3,80]]]);
		this.motifs.set("Z",[["M",[2.2,80]],["L",[60.5,80]],["L",[60.5,66.8]],["L",[22.5,66.8]],["L",[59.6,21]],["L",[59.6,8.6]],["L",[5.2,8.6]],["L",[5.2,21.8]],["L",[39.3,21.8]],["L",[2.2,67.6]],["L",[2.2,80]]]);
		this.motifs.set("[",[["M",[6.6,98.2]],["L",[32.2,98.2]],["L",[32.2,87.1]],["L",[20.4,87.1]],["L",[20.4,18]],["L",[32.2,18]],["L",[32.2,6.9]],["L",[6.6,6.9]],["L",[6.6,98.2]]]);
		this.motifs.set("\\",[["M",[10,6.9]],["L",[-1.1,6.9]],["L",[26,81.7]],["L",[37,81.7]],["C",[23.5,44.3,10,6.9]]]);
		this.motifs.set("]",[["M",[25.7,6.9]],["L",[0.1,6.9]],["L",[0.1,18]],["L",[11.9,18]],["L",[11.9,87.1]],["L",[0.1,87.1]],["L",[0.1,98.2]],["L",[25.7,98.2]],["L",[25.7,6.9]]]);
		this.motifs.set("^",[["M",[5.9,48.5]],["L",[17.2,48.5]],["L",[29.1,21]],["L",[40.9,48.5]],["L",[52.2,48.5]],["C",[43.9,29.3,35.5,10]],["L",[22.6,10]],["C",[14.2,29.3,5.9,48.5]]]);
		this.motifs.set("_",[["M",[0,92.5]],["L",[48.4,92.5]],["L",[48.4,87.5]],["L",[0,87.5]],["L",[0,92.5]]]);
		this.motifs.set("`",[["M",[10.3,21.8]],["L",[19.9,21.8]],["C",[15.2,14.8,10.5,7.7]],["L",[-4.6,7.7]],["L",[10.3,21.8]]]);
		this.motifs.set("a",[["M",[36.4,54.8]],["L",[36.4,60]],["C",[36.4,61.2,36.2,63.2]],["C",[35.9,65.2,35,67.2]],["C",[34,69.2,31.7,70.4]],["C",[29.3,71.9,25.2,71.9]],["C",[21.9,71.9,19.5,70.5]],["C",[16.9,69.2,16.8,65.4]],["C",[16.8,61.5,19.4,59.8]],["C",[21.7,58.3,25,57.7]],["C",[28.3,57.1,31.5,56.7]],["C",[34.6,56.2,36.4,54.8]],["M",[18.4,44.3]],["C",[19.4,36.5,27.5,36.6]],["C",[31.3,36.6,33.8,37.7]],["C",[36.3,39,36.4,43.5]],["C",[36.3,47.5,31.5,48.5]],["C",[29.2,48.9,26.3,49.2]],["C",[23.4,49.6,20.1,50.2]],["C",[16.9,50.6,13.9,51.5]],["C",[10.9,52.3,8.4,54.1]],["C",[6,55.7,4.6,58.6]],["C",[3.1,61.4,3.1,65.9]],["C",[3.2,73.8,8.1,77.5]],["C",[12.8,81.4,20.1,81.4]],["C",[24.9,81.4,29.2,79.9]],["C",[33.7,78.4,37,75]],["C",[37.2,77.6,38,80]],["L",[52,80]],["C",[51,78.3,50.7,75.1]],["C",[50.2,72,50.2,68.5]],["L",[50.2,41.8]],["C",[50.2,37.1,48.2,34.2]],["C",[46.3,31.3,43,29.7]],["C",[39.8,28.1,35.9,27.5]],["C",[32.1,27.1,28.2,27.1]],["C",[19.5,27,12.6,30.7]],["C",[5.6,34.5,4.6,44.4]],["C",[11.5,44.3,18.4,44.3]]]);
		this.motifs.set("b",[["M",[5.2,80]],["L",[18.3,80]],["L",[18.3,73.5]],["L",[18.5,73.5]],["C",[20.9,77.6,25.1,79.5]],["C",[29.4,81.4,35,81.4]],["C",[42.9,81.4,49.2,74.8]],["C",[55.5,68.3,55.7,54.2]],["C",[55.5,40.1,49.2,33.5]],["C",[42.9,27.1,35,27.1]],["C",[30.2,27.1,26.1,28.9]],["C",[21.9,30.8,19.2,34.8]],["L",[19,34.8]],["L",[19,8.6]],["L",[5.2,8.6]],["L",[5.2,80]],["M",[41.9,54.3]],["C",[41.9,61,39.2,65.6]],["C",[36.3,70.7,30.2,70.8]],["C",[24.1,70.7,21.4,65.6]],["C",[18.5,61,18.5,54.3]],["C",[18.5,47.5,21.4,42.6]],["C",[24.1,37.9,30.2,37.8]],["C",[36.3,37.9,39.2,42.6]],["C",[41.9,47.5,41.9,54.3]]]);
		this.motifs.set("c",[["M",[52.8,46.6]],["C",[52,36.7,45.2,31.9]],["C",[38.5,27.1,29.2,27.1]],["C",[16.9,27.2,10.4,34.9]],["C",[3.7,42.6,3.7,55]],["C",[3.8,66.7,10.7,73.9]],["C",[17.4,81.3,29,81.4]],["C",[49.6,81.2,53.1,60.3]],["L",[39.8,60.3]],["C",[38.4,70.5,28.9,70.8]],["C",[25.7,70.8,23.5,69.2]],["C",[21.4,67.6,20,65.3]],["C",[17.3,60.3,17.4,54.5]],["C",[17.3,48.5,20,43.2]],["C",[22.8,38,29.2,37.8]],["C",[37.9,37.9,39.3,46.6]],["L",[52.8,46.6]]]);
		this.motifs.set("d",[["M",[42.3,80]],["L",[55.8,80]],["L",[55.8,8.6]],["L",[41.6,8.6]],["L",[41.6,34.6]],["L",[41.4,34.6]],["C",[38.9,30.7,34.9,28.8]],["C",[30.8,26.9,26.1,26.9]],["C",[14.7,27.1,9,35]],["C",[3.2,42.8,3.2,53.7]],["C",[3.2,64.7,9,72.8]],["C",[14.7,81.2,26.4,81.4]],["C",[31.4,81.4,35.5,79.5]],["C",[39.6,77.6,42.1,73.4]],["L",[42.3,73.4]],["L",[42.3,80]],["M",[42.1,54]],["C",[42.1,60.6,39.6,65.5]],["C",[36.9,70.6,29.9,70.7]],["C",[23.4,70.6,20.4,65.3]],["C",[17.4,60.4,17.4,54.1]],["C",[17.3,47.4,20.2,42.6]],["C",[23.1,37.7,29.9,37.6]],["C",[36.7,37.7,39.5,42.6]],["C",[42.1,47.5,42.1,54]]]);
		this.motifs.set("e",[["M",[52.7,57.6]],["C",[53.2,51.5,51.9,46]],["C",[51.1,43.2,50.1,40.8]],["C",[48.9,38.4,47.4,36.3]],["C",[41.3,27.3,28.4,27.1]],["C",[16.8,27.2,10,34.8]],["C",[2.9,42.5,2.8,54.3]],["C",[2.9,66.4,9.8,73.8]],["C",[16.5,81.3,28.4,81.4]],["C",[45.8,81.6,51.9,64]],["L",[39.7,64]],["C",[39,66.6,36.1,68.5]],["C",[33.1,70.8,28.9,70.8]],["C",[17.2,70.9,16.6,57.6]],["L",[52.7,57.6]],["M",[16.6,48.6]],["C",[16.6,45.3,19,41.6]],["C",[20.3,39.9,22.7,38.8]],["C",[24.8,37.8,28,37.8]],["C",[33,37.8,35.6,40.4]],["C",[38.2,43.2,38.9,48.6]],["L",[16.6,48.6]]]);
		this.motifs.set("f",[["M",[8.2,80]],["L",[22,80]],["L",[22,37.8]],["L",[31.5,37.8]],["L",[31.5,28.3]],["L",[22,28.3]],["L",[22,25.2]],["C",[22,21.8,23.2,20.6]],["C",[24.5,19.3,27.2,19.3]],["C",[29.8,19.3,32.3,19.6]],["L",[32.3,9]],["C",[28.7,8.7,25,8.6]],["C",[16.6,8.7,12.5,13]],["C",[8.2,17.3,8.2,24.3]],["L",[8.2,28.3]],["L",[0,28.3]],["L",[0,37.8]],["L",[8.2,37.8]],["L",[8.2,80]]]);
		this.motifs.set("g",[["M",[53.4,28.3]],["L",[40.3,28.3]],["L",[40.3,35.2]],["L",[40.1,35.2]],["C",[35.1,26.9,25.1,27.1]],["C",[14.7,27.3,9.3,34.7]],["C",[3.7,42.3,3.7,52.6]],["C",[3.7,63.4,8.8,70.9]],["C",[13.9,78.4,25,78.5]],["C",[29.6,78.5,33.8,76.5]],["C",[37.9,74.5,40.1,70.5]],["L",[40.3,70.5]],["L",[40.3,77.3]],["C",[40.4,83,37.8,86.4]],["C",[35.1,90,29.2,90.1]],["C",[25.6,90.1,22.9,88.5]],["C",[20,86.9,18.9,83]],["L",[5.3,83]],["C",[5.7,87.3,7.7,90.5]],["C",[9.9,93.6,12.9,95.7]],["C",[19.7,99.6,27.4,99.6]],["C",[36.1,99.5,41.3,97.2]],["C",[46.4,94.8,49.1,91.3]],["C",[51.9,87.6,52.7,83.7]],["C",[53.4,79.9,53.4,76.7]],["L",[53.4,28.3]],["M",[28.6,67.8]],["C",[22.4,67.7,19.8,62.8]],["C",[17.3,58.2,17.4,52.4]],["C",[17.4,46.3,20.1,42.2]],["C",[22.8,37.9,28.6,37.8]],["C",[35.1,37.9,37.9,42.5]],["C",[40.3,47.1,40.3,53.6]],["C",[40.3,59.3,37.4,63.3]],["C",[34.5,67.7,28.6,67.8]]]);
		this.motifs.set("h",[["M",[5.2,80]],["L",[19,80]],["L",[19,53]],["C",[18.8,38.1,29.6,38.3]],["C",[38.6,38.3,38.4,50.9]],["L",[38.4,80]],["L",[52.2,80]],["L",[52.2,48.3]],["C",[52.3,38.5,48.6,32.9]],["C",[44.6,27.2,33.9,27.1]],["C",[30,27.1,26.1,29.2]],["C",[22,31.3,19.3,35.7]],["L",[19,35.7]],["L",[19,8.6]],["L",[5.2,8.6]],["L",[5.2,80]]]);
		this.motifs.set("i",[["M",[5.6,80]],["L",[19.4,80]],["L",[19.4,28.3]],["L",[5.6,28.3]],["L",[5.6,80]],["M",[19.4,8.6]],["L",[5.6,8.6]],["L",[5.6,20.3]],["L",[19.4,20.3]],["L",[19.4,8.6]]]);
		this.motifs.set("j",[["M",[-1.9,97.8]],["C",[0.4,98.1,2.6,98.2]],["C",[12.9,98.2,16.7,94.3]],["C",[20.4,90.5,20.3,82.6]],["L",[20.3,28.3]],["L",[6.5,28.3]],["L",[6.5,81.9]],["C",[6.5,84.6,4.9,85.6]],["C",[3.4,86.5,1.2,86.5]],["C",[-0.6,86.5,-1.9,86.1]],["L",[-1.9,97.8]],["M",[20.3,8.6]],["L",[6.5,8.6]],["L",[6.5,20.3]],["L",[20.3,20.3]],["L",[20.3,8.6]]]);
		this.motifs.set("k",[["M",[6.5,80]],["L",[20.3,80]],["L",[20.3,62.2]],["C",[22.9,59.6,25.6,57]],["L",[39.3,80]],["L",[56,80]],["C",[45.5,63.6,35,47.3]],["C",[44.4,37.8,53.9,28.3]],["L",[37.6,28.3]],["C",[29,37.6,20.3,46.9]],["L",[20.3,8.6]],["L",[6.5,8.6]],["L",[6.5,80]]]);
		this.motifs.set("l",[["M",[5.6,80]],["L",[19.4,80]],["L",[19.4,8.6]],["L",[5.6,8.6]],["L",[5.6,80]]]);
		this.motifs.set("m",[["M",[4.6,80]],["L",[18.4,80]],["L",[18.4,50.1]],["C",[18.4,46.2,19.6,44]],["C",[20.8,41.6,22.3,40.4]],["C",[23.8,39,25.5,38.6]],["C",[27.1,38.3,28.2,38.3]],["C",[31.7,38.3,33.5,39.3]],["C",[35.4,40.4,36.1,42.4]],["C",[36.9,44.2,37,46.4]],["L",[37,51.1]],["L",[37,80]],["L",[50.8,80]],["L",[50.8,51.3]],["C",[50.8,48.7,51.2,46.3]],["C",[51.6,44.1,52.6,42.3]],["C",[53.7,40.4,55.7,39.3]],["C",[57.5,38.3,60.5,38.3]],["C",[63.7,38.3,65.5,39.1]],["C",[67.4,40.2,68.2,41.9]],["C",[69.1,43.5,69.3,45.8]],["C",[69.4,48.1,69.4,50.8]],["L",[69.4,80]],["L",[83.2,80]],["L",[83.2,45.5]],["C",[83.1,35.6,78,31.2]],["C",[72.8,27.1,64.4,27.1]],["C",[59,27.2,55.1,29.6]],["C",[51.2,32.1,48.9,35.7]],["C",[46.8,31.1,42.8,29]],["C",[38.8,27.1,33.9,27.1]],["C",[23.8,27.2,18.1,35.3]],["L",[17.9,35.3]],["L",[17.9,28.3]],["L",[4.6,28.3]],["L",[4.6,80]]]);
		this.motifs.set("n",[["M",[5.2,80]],["L",[19,80]],["L",[19,53]],["C",[18.8,38.1,29.6,38.3]],["C",[38.6,38.3,38.4,50.9]],["L",[38.4,80]],["L",[52.2,80]],["L",[52.2,48.3]],["C",[52.3,38.5,48.6,32.9]],["C",[44.6,27.2,33.9,27.1]],["C",[29.4,27.1,25.5,29]],["C",[21.3,31.1,18.6,35.5]],["L",[18.3,35.5]],["L",[18.3,28.3]],["L",[5.2,28.3]],["L",[5.2,80]]]);
		this.motifs.set("o",[["M",[3.7,54.3]],["C",[3.8,66.8,10.8,73.9]],["C",[17.6,81.3,29.6,81.4]],["C",[41.6,81.3,48.5,73.9]],["C",[55.4,66.8,55.5,54.3]],["C",[55.4,41.8,48.5,34.4]],["C",[41.6,27.2,29.6,27.1]],["C",[17.6,27.2,10.8,34.4]],["C",[3.8,41.8,3.7,54.3]],["M",[17.4,54.3]],["C",[17.3,47.7,20,42.8]],["C",[22.7,37.9,29.5,37.8]],["C",[36.6,37.9,39.2,42.8]],["C",[41.7,47.7,41.7,54.3]],["C",[41.7,60.7,39.2,65.5]],["C",[36.6,70.7,29.5,70.8]],["C",[22.7,70.7,20,65.5]],["C",[17.3,60.7,17.4,54.3]]]);
		this.motifs.set("p",[["M",[5.2,98.2]],["L",[19,98.2]],["L",[19,73.7]],["L",[19.2,73.7]],["C",[21.8,77.3,25.8,79.3]],["C",[29.7,81.4,34.2,81.4]],["C",[45.2,81.2,50.8,73.2]],["C",[56.2,65.4,56.2,54.8]],["C",[56.2,43.3,50.7,35.4]],["C",[45.1,27.3,33.4,27.1]],["C",[23.8,27.1,18.5,34.9]],["L",[18.3,34.9]],["L",[18.3,28.3]],["L",[5.2,28.3]],["L",[5.2,98.2]],["M",[30.5,70.8]],["C",[24,70.7,21.2,65.6]],["C",[18.4,60.9,18.5,54.4]],["C",[18.4,47.8,21.1,42.8]],["C",[23.9,37.9,30.4,37.8]],["C",[37,38,39.8,42.9]],["C",[42.4,48,42.4,54.4]],["C",[42.4,57.5,41.9,60.4]],["C",[41.4,63.4,39.9,65.6]],["C",[37.3,70.7,30.5,70.8]]]);
		this.motifs.set("q",[["M",[54.1,28.3]],["L",[41,28.3]],["L",[41,34.9]],["L",[40.8,34.9]],["C",[38.3,30.6,34.4,28.7]],["C",[30.3,27.1,25.6,27.1]],["C",[14.2,27.3,8.6,35.5]],["C",[3.1,43.7,3.1,54.6]],["C",[3.1,61.9,5.2,67.1]],["C",[7.1,72.2,10.2,75.4]],["C",[13.5,78.5,17.2,79.9]],["C",[20.9,81.4,24.3,81.4]],["C",[28.9,81.4,33.3,79.5]],["C",[37.7,77.6,40.1,73.5]],["L",[40.3,73.5]],["L",[40.3,98.2]],["L",[54.1,98.2]],["L",[54.1,28.3]],["M",[16.8,54.3]],["C",[16.8,47.7,19.7,42.8]],["C",[22.5,37.9,29.1,37.8]],["C",[35.5,37.9,38.2,43]],["C",[40.8,48.1,40.8,54.5]],["C",[40.8,61,38.2,65.7]],["C",[35.3,70.7,28.8,70.8]],["C",[22.2,70.7,19.5,65.5]],["C",[16.7,60.7,16.8,54.3]]]);
		this.motifs.set("r",[["M",[5.2,80]],["L",[19,80]],["L",[19,56.8]],["C",[18.9,49.7,22,45]],["C",[25.1,40.4,32.6,40.3]],["C",[35.4,40.3,37.5,40.8]],["L",[37.5,27.6]],["C",[36,27.1,34.5,27.1]],["C",[29.3,27.2,25,29.9]],["C",[20.5,32.8,18.5,37.9]],["L",[18.3,37.9]],["L",[18.3,28.3]],["L",[5.2,28.3]],["L",[5.2,80]]]);
		this.motifs.set("s",[["M",[2.7,63.3]],["C",[3.5,73.3,10.4,77.3]],["C",[17.3,81.4,26.4,81.4]],["C",[35.3,81.4,42.2,77.5]],["C",[49.1,73.5,49.3,63.5]],["C",[49.3,59.9,48,57.4]],["C",[46.7,54.9,44.4,53.3]],["C",[42.2,51.6,39.4,50.7]],["C",[36.5,49.6,33.3,49]],["L",[27.7,47.5]],["C",[24.9,46.9,22.7,46.3]],["C",[20.4,45.5,19,44.4]],["C",[17.7,43.1,17.7,41.3]],["C",[17.8,38.3,20.4,37.4]],["C",[22.9,36.6,25.4,36.6]],["C",[29.2,36.6,31.9,37.9]],["C",[34.4,39.5,34.8,43.6]],["L",[47.9,43.6]],["C",[46.9,34.2,40.6,30.5]],["C",[34.3,27,25.8,27.1]],["C",[21.8,27.1,17.9,27.8]],["C",[14,28.5,10.9,30.4]],["C",[7.9,32.2,6,35.5]],["C",[4,38.7,4,43.7]],["C",[4,46.9,5.4,49.2]],["C",[6.7,51.6,9,53.2]],["C",[11.2,54.7,14.2,55.7]],["C",[15.6,56.2,17,56.5]],["C",[18.4,56.9,19.9,57.4]],["C",[27.3,58.9,31.5,60.5]],["C",[35.5,62.2,35.5,65.4]],["C",[35.4,69.1,32.5,70.4]],["C",[29.6,72,26.4,71.9]],["C",[22.2,71.9,19.1,69.8]],["C",[16.1,67.8,15.8,63.3]],["L",[2.7,63.3]]]);
		this.motifs.set("t",[["M",[22.7,12.8]],["L",[8.9,12.8]],["L",[8.9,28.3]],["L",[0.5,28.3]],["L",[0.5,37.8]],["L",[8.9,37.8]],["L",[8.9,68.3]],["C",[8.9,72,10.3,74.4]],["C",[11.4,76.9,13.7,78.3]],["C",[15.9,79.6,18.8,80]],["C",[21.6,80.6,24.7,80.6]],["C",[29.1,80.6,32.7,80.1]],["L",[32.7,69.1]],["C",[30.6,69.5,28.5,69.5]],["C",[25,69.6,23.8,68.2]],["C",[22.6,67,22.7,63.4]],["L",[22.7,37.8]],["L",[32.7,37.8]],["L",[32.7,28.3]],["L",[22.7,28.3]],["L",[22.7,12.8]]]);
		this.motifs.set("u",[["M",[52.2,28.3]],["L",[38.4,28.3]],["L",[38.4,55.4]],["C",[38.5,70.6,27.8,70.3]],["C",[18.8,70.3,19,57.5]],["L",[19,28.3]],["L",[5.2,28.3]],["L",[5.2,60.1]],["C",[5.1,69.8,9,75.5]],["C",[12.8,81.3,23.5,81.4]],["C",[28,81.4,32.1,79.2]],["C",[36.1,77.1,38.8,72.8]],["L",[39.1,72.8]],["L",[39.1,80]],["L",[52.2,80]],["L",[52.2,28.3]]]);
		this.motifs.set("v",[["M",[49.9,28.3]],["L",[36.2,28.3]],["L",[25.7,63.6]],["L",[25.5,63.6]],["L",[14.9,28.3]],["L",[0.5,28.3]],["L",[17.7,80]],["L",[32.9,80]],["L",[49.9,28.3]]]);
		this.motifs.set("w",[["M",[78.2,28.3]],["L",[63.6,28.3]],["C",[58.8,45.8,54.1,63.3]],["L",[53.9,63.3]],["L",[45.1,28.3]],["L",[31.3,28.3]],["L",[22.7,63.4]],["L",[22.5,63.4]],["C",[17.7,45.9,13,28.3]],["L",[-2,28.3]],["L",[14.4,80]],["L",[29.1,80]],["L",[37.9,45.3]],["L",[38.1,45.3]],["C",[42.7,62.6,47.3,80]],["L",[61.9,80]],["L",[78.2,28.3]]]);
		this.motifs.set("x",[["L",[15.9,80]],["L",[26.7,63.7]],["L",[37.5,80]],["L",[53.7,80]],["C",[44.2,66.2,34.6,52.5]],["L",[51.6,28.3]],["L",[35.9,28.3]],["L",[26.9,41.8]],["L",[17.8,28.3]],["L",[1.6,28.3]],["L",[18.6,52.8]],["C",[9.3,66.4,0,80]]]);
		this.motifs.set("y",[["M",[50.9,28.3]],["L",[36.6,28.3]],["L",[25.7,63.7]],["L",[25.5,63.7]],["L",[14.2,28.3]],["L",[-0.6,28.3]],["L",[17.4,76.8]],["C",[18.7,80,17.4,82.9]],["C",[16.3,85.9,12.5,86.5]],["C",[8.3,86.5,4.2,86]],["L",[4.2,97.7]],["C",[8.5,98.2,12.7,98.2]],["C",[26.2,98.4,29.9,86.5]],["C",[40.4,57.4,50.9,28.3]]]);
		this.motifs.set("z",[["M",[2.1,80]],["L",[48.1,80]],["L",[48.1,69.4]],["L",[19.4,69.4]],["C",[32.9,54.2,46.3,38.9]],["L",[46.3,28.3]],["L",[4.1,28.3]],["L",[4.1,38.9]],["L",[28.2,38.9]],["C",[15.2,54.2,2.1,69.4]],["L",[2.1,80]]]);
		this.motifs.set("{",[["M",[32.3,6.9]],["L",[20,6.9]],["C",[16.4,6.9,12.4,10.2]],["C",[10.6,11.8,9.4,14.4]],["C",[8,16.9,8,20.4]],["L",[8,39.2]],["C",[8,41.6,7.2,43.3]],["C",[6.3,45.1,4.7,46.1]],["C",[3.4,47.1,1.9,47.6]],["C",[0.2,48.2,-0.9,48.2]],["L",[-0.9,56.9]],["C",[1.7,56.9,4.7,58.7]],["C",[6.3,59.6,7.2,61.2]],["C",[8,62.8,8,65.2]],["L",[8,84.7]],["C",[8,88,9.4,90.6]],["C",[10.6,93.1,12.4,94.8]],["C",[14.3,96.4,16.4,97.3]],["C",[18.3,98.2,20,98.2]],["L",[32.3,98.2]],["L",[32.3,87.1]],["L",[27,87.1]],["C",[23.6,87,22.7,84.6]],["C",[21.7,82.3,21.8,79.8]],["L",[21.8,63.7]],["C",[21.8,60.6,20.8,58.5]],["C",[19.7,56.4,18,55.1]],["C",[16.5,53.8,14.7,53.2]],["C",[13.1,52.8,11.9,52.8]],["L",[11.9,52.5]],["C",[13.1,52.3,14.7,51.7]],["C",[16.5,51.1,18,50]],["C",[19.7,48.7,20.8,46.4]],["C",[21.8,44.2,21.8,40.6]],["L",[21.8,25.4]],["C",[21.7,22.8,22.7,20.5]],["C",[23.6,18.1,27,18]],["L",[32.3,18]],["L",[32.3,6.9]]]);
		this.motifs.set("|",[["M",[5.6,101.4]],["L",[16,101.4]],["L",[16,1.4]],["L",[5.6,1.4]],["L",[5.6,101.4]]]);
		this.motifs.set("}",[["M",[0,98.2]],["L",[12.3,98.2]],["C",[16,98.2,20,94.8]],["C",[24,91.5,24.2,84.7]],["L",[24.2,65.2]],["C",[24.3,60.6,27.5,58.7]],["C",[29.1,57.6,30.5,57.2]],["C",[32,56.9,33.1,56.9]],["L",[33.1,48.2]],["C",[30.5,48.3,27.5,46.1]],["C",[26.2,45.1,25.2,43.3]],["C",[24.2,41.6,24.2,39.2]],["L",[24.2,20.4]],["C",[24,13.5,20,10.2]],["C",[16,6.9,12.3,6.9]],["L",[0,6.9]],["L",[0,18]],["L",[5.3,18]],["C",[8.6,18.1,9.7,20.5]],["C",[10.4,22.8,10.4,25.4]],["L",[10.4,40.6]],["C",[10.4,44.2,11.6,46.4]],["C",[12.7,48.7,14.3,50]],["C",[15.9,51.1,17.4,51.7]],["C",[18.9,52.3,20.1,52.5]],["L",[20.1,52.8]],["C",[17.6,52.8,14.3,55.1]],["C",[12.7,56.4,11.6,58.5]],["C",[10.4,60.6,10.4,63.7]],["L",[10.4,79.8]],["C",[10.4,82.3,9.7,84.6]],["C",[8.6,87,5.3,87.1]],["L",[0,87.1]],["L",[0,98.2]]]);
		this.motifs.set("~",[["M",[47.8,45.6]],["C",[46.2,48.3,44.1,50.4]],["C",[42.1,52.7,39.2,52.8]],["C",[37.3,52.8,34.8,51.6]],["C",[32.1,50.5,29.3,49.2]],["C",[26.5,47.8,23.9,46.9]],["C",[21.1,46,18.6,46]],["C",[13.9,46.1,10.9,48.7]],["C",[8.1,51.3,6.5,54.6]],["C",[8.4,59.2,10.4,63.9]],["C",[11.6,61.1,13.5,58.9]],["C",[15.3,56.8,18.5,56.7]],["C",[21.9,56.7,24.6,57.7]],["C",[27.3,58.8,29.6,60.2]],["C",[32,61.6,34.5,62.5]],["C",[36.9,63.5,39.5,63.5]],["C",[43.9,63.5,46.7,60.7]],["C",[48.2,59.4,49.4,57.9]],["C",[50.6,56.4,51.6,54.9]],["C",[49.7,50.3,47.8,45.6]]]);
		this.motifs.set(" ",[]);
		this.motifs.set("¡",[["M",[21.4,27]],["L",[5.7,27]],["L",[5.7,42.3]],["L",[21.4,42.3]],["L",[21.4,27]],["M",[6.1,98.3]],["L",[20.4,98.3]],["L",[20.4,79.1]],["L",[16.7,48.3]],["L",[9.9,48.3]],["L",[6.1,79.1]],["L",[6.1,98.3]]]);
		this.motifs.set("¢",[["M",[25.2,37.9]],["L",[25.2,70.8]],["C",[19.7,68.8,17.4,64]],["C",[15.2,59.1,15.3,53.7]],["C",[15.3,48.3,17.6,43.9]],["C",[19.9,39.3,25.2,37.9]],["M",[25.2,91.5]],["L",[30.9,91.5]],["L",[30.9,81.4]],["C",[39.9,80.5,45.9,75]],["C",[51.9,69.3,52.7,59.8]],["L",[39.3,59.8]],["C",[39.2,63.6,37,66.8]],["C",[34.5,69.8,30.9,70.8]],["L",[30.9,37.8]],["C",[34.3,38.1,36.5,40.5]],["C",[38.7,43,39.1,46.7]],["L",[52.5,46.7]],["C",[52,37.7,45.6,32.4]],["C",[39.2,27.2,30.9,27.1]],["L",[30.9,18.6]],["L",[25.2,18.6]],["L",[25.2,27.1]],["C",[13.7,28.2,7.7,35.9]],["C",[1.5,43.5,1.5,55.1]],["C",[1.6,65.8,8.1,73.2]],["C",[14.5,80.4,25.2,81.4]],["L",[25.2,91.5]]]);
		this.motifs.set("£",[["M",[8.4,81.7]],["C",[11.4,79.5,14.2,78.6]],["C",[16.9,77.9,19.6,77.9]],["C",[22.8,77.9,25,78.5]],["C",[27.1,79.1,29.2,79.9]],["C",[31.3,80.6,33.8,81.1]],["C",[36.2,81.7,39.8,81.7]],["C",[43.7,81.7,47.6,80.2]],["C",[51.5,78.7,55,75.3]],["L",[49.2,65.2]],["C",[46.7,67.9,44.6,68.7]],["C",[42.7,69.5,40.7,69.5]],["C",[36.9,69.4,33.1,68.3]],["C",[29.3,67.4,25.5,67.3]],["C",[24.2,67.3,22.7,67.5]],["C",[21.1,68,18.8,69.6]],["L",[18.7,69.4]],["C",[22,66.8,24.3,63.3]],["C",[26.5,59.9,26.6,55.3]],["C",[26.6,52,25.8,49.1]],["L",[36,49.1]],["L",[36,40.6]],["L",[23.2,40.6]],["C",[20.5,35.3,19.9,32.6]],["C",[19.2,29.9,19.3,27.8]],["C",[19.3,23.5,22,21.1]],["C",[24.5,18.6,28.7,18.6]],["C",[32.4,18.6,34.5,20]],["C",[36.6,21.5,37.5,23.7]],["C",[38.5,25.8,38.8,28]],["C",[39.1,30.3,39.1,31.9]],["L",[52.2,31.9]],["C",[51.5,7.1,28.5,6.9]],["C",[16.3,7,10,12.8]],["C",[3.6,18.6,3.6,26.8]],["C",[3.6,31.2,5.2,34.9]],["C",[6.5,38.6,8.1,40.6]],["L",[2.1,40.6]],["L",[2.1,49.1]],["L",[11.7,49.1]],["C",[13.4,52.4,13.5,55.8]],["C",[13.4,61.2,10.1,65.4]],["C",[6.8,69.6,2.5,72.4]],["C",[5.5,77.1,8.4,81.7]]]);
		this.motifs.set("¤",[["M",[2,65.1]],["L",[7.4,70.7]],["L",[12.8,64.9]],["C",[18.2,69.8,27,69.8]],["C",[35.6,69.8,40.9,64.8]],["L",[46.4,70.6]],["C",[49.1,67.8,51.8,65.1]],["C",[49.1,62.3,46.4,59.5]],["C",[50.9,53.5,50.9,44.9]],["C",[50.9,40.6,49.8,36.8]],["C",[48.6,33.2,46.4,30.6]],["L",[52,25.2]],["C",[49,22.1,46,19.1]],["L",[40.4,24.7]],["C",[35.5,20.3,27.1,20.2]],["C",[18.4,20.3,13,24.9]],["C",[10.2,22.1,7.5,19.3]],["L",[2,24.9]],["L",[7.5,30.6]],["C",[5.2,33.2,4,36.9]],["C",[2.8,40.8,2.8,45.1]],["C",[2.8,53.6,7.5,59.3]],["L",[2,65.1]],["M",[27.1,30.9]],["C",[33.1,31,36,35.2]],["C",[38.9,39.4,38.9,44.9]],["C",[38.9,50.5,36,54.7]],["C",[33.1,59.1,27.1,59.2]],["C",[21.1,59.1,18.1,54.9]],["C",[14.8,50.7,14.8,45.1]],["C",[14.8,39.3,18.1,35.2]],["C",[21,31,27.1,30.9]]]);
		this.motifs.set("¥",[["M",[34.8,80]],["L",[34.8,66.2]],["L",[50.1,66.2]],["L",[50.1,56.7]],["L",[34.8,56.7]],["L",[34.8,52.1]],["L",[36.2,49.2]],["L",[50.1,49.2]],["L",[50.1,39.7]],["L",[40.9,39.7]],["L",[55.9,8.6]],["L",[40.2,8.6]],["L",[27.7,39.7]],["L",[14.9,8.6]],["L",[-0.9,8.6]],["C",[6.5,24.1,14,39.7]],["L",[4.8,39.7]],["L",[4.8,49.2]],["L",[18.7,49.2]],["L",[20,52.1]],["L",[20,56.7]],["L",[4.8,56.7]],["L",[4.8,66.2]],["L",[20,66.2]],["L",[20,80]],["L",[34.8,80]]]);
		this.motifs.set("¦",[["M",[5.6,88.9]],["L",[16,88.9]],["L",[16,63.9]],["L",[5.6,63.9]],["L",[5.6,88.9]],["M",[16,13.9]],["L",[5.6,13.9]],["L",[5.6,38.9]],["L",[16,38.9]],["L",[16,13.9]]]);
		this.motifs.set("§",[["M",[36.7,51.2]],["C",[38.5,52.2,39.8,53.6]],["C",[41.1,55.2,41.1,57.5]],["C",[41.1,59.2,39.8,61.1]],["C",[39.2,61.8,38.4,62.4]],["C",[37.5,63.1,36.6,63.1]],["C",[34.7,63.1,33.7,62.4]],["L",[16.1,52.6]],["C",[13,50.7,13,47.7]],["C",[13,45.2,14.5,43.2]],["C",[15.8,41.1,18,40.9]],["C",[19.4,41,20.6,42]],["C",[28.7,46.6,36.7,51.2]],["M",[47.9,26.1]],["C",[47.8,16.8,42,11.8]],["C",[36.3,6.9,27.6,6.9]],["C",[19.8,6.9,13.9,11.3]],["C",[7.6,15.6,7.4,24.2]],["C",[7.4,30.1,11.7,34.3]],["C",[1.1,38,1,48.9]],["C",[1.1,56.2,6.3,60.6]],["C",[11.5,65,17.9,67.9]],["C",[24.6,70.9,29.4,73.8]],["C",[31.8,75.2,33.1,77]],["C",[34.4,78.7,34.4,80.9]],["C",[34.3,84.2,32.4,85.9]],["C",[30.5,87.6,27.3,87.6]],["C",[18.5,87.6,17.9,78.8]],["L",[5.9,78.8]],["C",[6.1,88.9,12.3,93.5]],["C",[18.3,98.2,27.6,98.2]],["C",[35.3,98.2,41.6,94]],["C",[47.9,89.8,48.1,81.4]],["C",[48.1,74.1,42.6,69.6]],["C",[52.8,65.6,53.1,55]],["C",[53,47.9,48.2,43.7]],["C",[43.3,39.5,36.9,36.5]],["C",[30.8,33.7,25.8,30.7]],["C",[23.4,29.3,22.1,27.7]],["C",[20.5,26,20.5,23.9]],["C",[20.5,21,22.9,19.3]],["C",[25.1,17.5,27.8,17.5]],["C",[31.7,17.6,33.8,19.9]],["C",[35.9,22.2,35.9,26.1]],["L",[47.9,26.1]]]);
		this.motifs.set("¨",[["M",[16,20.3]],["L",[29.1,20.3]],["L",[29.1,8.6]],["L",[16,8.6]],["L",[16,20.3]],["M",[-4.6,20.3]],["L",[8.4,20.3]],["L",[8.4,8.6]],["L",[-4.6,8.6]],["L",[-4.6,20.3]]]);
		this.motifs.set("©",[["M",[1,44.3]],["C",[1.2,61.4,12.4,71.4]],["C",[23.1,81.6,38.4,81.7]],["C",[53.9,81.6,64.7,71.4]],["C",[75.6,61.4,75.9,44.3]],["C",[75.6,27,64.7,17]],["C",[53.9,7,38.4,6.9]],["C",[23.1,7,12.4,17]],["C",[1.2,27,1,44.3]],["M",[10.9,44.3]],["C",[11,31.1,19,23.1]],["C",[26.7,15,38.5,14.9]],["C",[50.2,15,58.1,23.1]],["C",[65.9,31.1,66.1,44.3]],["C",[65.9,57.3,58.1,65.3]],["C",[50.2,73.6,38.5,73.7]],["C",[26.7,73.6,19,65.3]],["C",[11,57.3,10.9,44.3]],["M",[49.9,50.5]],["C",[49.4,54.1,46.9,56.1]],["C",[44.3,58.3,40.1,58.3]],["C",[34.8,58.2,31.8,54]],["C",[28.6,49.9,28.6,43.9]],["C",[28.6,37.6,31.6,33.7]],["C",[34.4,29.8,39.9,29.7]],["C",[43.8,29.7,46.5,31.6]],["C",[49.1,33.6,49.9,37.2]],["L",[57.4,37.2]],["C",[56.3,29.5,51.5,25.6]],["C",[46.8,21.7,39.9,21.7]],["C",[30.2,21.8,24.8,28]],["C",[19.3,34.2,19.3,44.1]],["C",[19.4,53.6,25,59.8]],["C",[30.6,66.2,40.1,66.3]],["C",[46.8,66.3,51.7,62.1]],["C",[56.4,58,57.8,50.5]],["L",[49.9,50.5]]]);
		this.motifs.set("ª",[["M",[22.3,28.5]],["C",[22.3,29.6,22.2,30.8]],["C",[21.9,32.2,21.2,33.5]],["C",[19.9,36,15.2,36.1]],["C",[13.9,36.1,12.4,35.3]],["C",[10.8,34.3,10.8,32.3]],["C",[10.8,30.4,12.4,29.5]],["C",[13.8,28.7,15.8,28.3]],["L",[19.4,27.6]],["C",[21.2,27.3,22.3,26.5]],["L",[22.3,28.5]],["M",[11.8,19.5]],["C",[12,18.2,12.5,17.4]],["C",[12.9,16.5,13.6,16]],["C",[14.9,15.1,16.6,15.1]],["C",[19,15.1,20.7,15.6]],["C",[22.4,16.5,22.4,19]],["C",[22.3,21.2,19.5,21.7]],["C",[16.5,22.3,12,22.8]],["C",[7.8,23.1,4.6,25.1]],["C",[1.1,27.1,1,32.5]],["C",[1.1,37.7,4.2,40.1]],["C",[7.2,42.5,11.8,42.5]],["C",[14.6,42.5,17.4,41.6]],["C",[20.2,40.7,22.3,38.5]],["C",[22.4,40,22.9,41.6]],["L",[32.7,41.6]],["C",[31.5,39.3,31.5,34.1]],["L",[31.5,17.5]],["C",[31.5,14.7,30.3,12.9]],["C",[28.9,11.1,26.9,10.2]],["C",[22.5,8.5,17,8.6]],["C",[11.6,8.6,7.3,10.8]],["C",[5.3,11.9,3.9,14]],["C",[2.4,16.1,2,19.5]],["C",[6.9,19.5,11.8,19.5]]]);
		this.motifs.set("«",[["M",[39.2,72]],["L",[39.2,60]],["C",[34.7,56.4,30.2,52.8]],["C",[34.7,49.3,39.2,45.7]],["L",[39.2,33.7]],["L",[23.5,46]],["L",[23.5,59.5]],["L",[39.2,72]],["M",[18.9,72]],["L",[18.9,60]],["L",[9.9,52.8]],["L",[18.9,45.7]],["L",[18.9,33.7]],["L",[3.2,46]],["L",[3.2,59.5]],["L",[18.9,72]]]);
		this.motifs.set("¬",[["M",[53.5,39.5]],["L",[4.6,39.5]],["L",[4.6,50.1]],["L",[43.1,50.1]],["L",[43.1,70.1]],["L",[53.5,70.1]],["L",[53.5,39.5]]]);
		this.motifs.set("­",[["M",[5.1,58.8]],["L",[34.2,58.8]],["L",[34.2,46.6]],["L",[5.1,46.6]],["L",[5.1,58.8]]]);
		this.motifs.set("®",[["M",[1.6,44.2]],["C",[1.8,61.5,12.8,71.4]],["C",[23.5,81.6,38.7,81.7]],["C",[54.1,81.6,64.7,71.4]],["C",[75.6,61.5,75.9,44.2]],["C",[75.6,26.9,64.7,17]],["C",[54.1,7,38.7,6.9]],["C",[23.5,7,12.8,17]],["C",[1.8,26.9,1.6,44.2]],["M",[11.4,44.2]],["C",[11.5,31.2,19.5,23.1]],["C",[27.1,15,38.7,14.9]],["C",[50.3,15,58.1,23.1]],["C",[65.9,31.2,66.1,44.2]],["C",[65.9,57.2,58.1,65.3]],["C",[50.3,73.6,38.7,73.7]],["C",[27.1,73.6,19.5,65.3]],["C",[11.5,57.2,11.4,44.2]],["M",[24.3,65.1]],["L",[32.3,65.1]],["L",[32.3,47.2]],["L",[37.4,47.2]],["C",[42.3,56.1,47.3,65.1]],["L",[55.7,65.1]],["C",[50.3,56,44.9,46.8]],["C",[49.5,46.4,52.5,43.8]],["C",[55.4,41.3,55.5,35.6]],["C",[55.3,22.9,39.6,23.2]],["L",[24.3,23.2]],["L",[24.3,65.1]],["M",[32.3,29.7]],["L",[39.1,29.7]],["C",[42.1,29.7,44.8,30.4]],["C",[47.4,31.6,47.5,34.9]],["C",[47.5,38.5,45.3,39.7]],["C",[43.1,40.8,39.6,40.7]],["L",[32.3,40.7]],["L",[32.3,29.7]]]);
		this.motifs.set("¯",[["M",[-5.5,18.4]],["L",[30.6,18.4]],["L",[30.6,10.9]],["L",[-5.5,10.9]],["L",[-5.5,18.4]]]);
		this.motifs.set("°",[["M",[5,23.4]],["C",[5.2,29.7,9.3,33.8]],["C",[13.3,38.1,19.4,38.2]],["C",[25.5,38.1,29.5,33.8]],["C",[33.6,29.7,33.7,23.4]],["C",[33.6,17.1,29.5,12.9]],["C",[25.5,8.7,19.4,8.6]],["C",[13.3,8.7,9.3,12.9]],["C",[5.2,17.1,5,23.4]],["M",[11.3,23.4]],["C",[11.3,19.7,13.8,17.2]],["C",[16.1,14.7,19.4,14.6]],["C",[22.7,14.7,25,17.2]],["C",[27.3,19.7,27.4,23.4]],["C",[27.3,27.1,25,29.7]],["C",[22.7,32.2,19.4,32.2]],["C",[16.1,32.2,13.8,29.7]],["C",[11.3,27.1,11.3,23.4]]]);
		this.motifs.set("±",[["M",[34.3,29.5]],["L",[23.9,29.5]],["L",[23.9,42.5]],["L",[4.6,42.5]],["L",[4.6,53.2]],["L",[23.9,53.2]],["L",[23.9,66.3]],["L",[34.3,66.3]],["L",[34.3,53.2]],["L",[53.6,53.2]],["L",[53.6,42.5]],["L",[34.3,42.5]],["L",[34.3,29.5]],["M",[4.6,80]],["L",[53.6,80]],["L",[53.6,69.4]],["L",[4.6,69.4]],["L",[4.6,80]]]);
		this.motifs.set("²",[["M",[12.6,26]],["C",[12.4,22.8,14.1,19.7]],["C",[15.6,16.7,19.6,16.6]],["C",[22.4,16.6,23.9,18.3]],["C",[25.5,20,25.5,22.8]],["C",[25.2,26.6,22.3,28.9]],["C",[20.9,30.1,19.3,31]],["C",[17.6,32,16.2,33.1]],["C",[10.4,36.4,6.7,40.7]],["C",[2.9,45,2.6,52.7]],["L",[35,52.7]],["L",[35,44.7]],["L",[14.7,44.7]],["C",[17.3,41.3,20.8,39.1]],["C",[24.2,36.9,27.5,34.9]],["C",[30.9,32.7,33.1,29.6]],["C",[35.3,26.7,35.4,22.1]],["C",[35.3,15.3,30.9,11.9]],["C",[26.6,8.6,20.3,8.6]],["C",[11.5,8.7,7.1,13.3]],["C",[2.7,18.1,2.7,26]],["L",[12.6,26]]]);
		this.motifs.set("³",[["M",[15.9,33.5]],["L",[19.3,33.5]],["C",[21.1,33.6,22.6,34.2]],["C",[24,34.6,25.1,35.8]],["C",[26,37,26,39.3]],["C",[25.9,42.1,23.9,43.8]],["C",[21.9,45.6,18.8,45.6]],["C",[15.3,45.6,13.5,43]],["C",[11.6,40.8,11.4,37.5]],["L",[2.1,37.5]],["C",[2.6,53.5,19,53.6]],["C",[26.1,53.6,30.9,49.9]],["C",[35.7,46.3,35.8,39.1]],["C",[35.8,35.5,33.7,32.9]],["C",[31.5,30.4,27.7,29.7]],["L",[27.7,29.5]],["C",[31,28.5,32.7,26.2]],["C",[34.3,23.9,34.3,20.9]],["C",[34.1,14.7,29.6,11.6]],["C",[25,8.6,18.9,8.6]],["C",[4.2,8.9,3.4,23.8]],["L",[12.6,23.8]],["C",[12.6,20.7,14.4,18.7]],["C",[16,16.7,19.1,16.6]],["C",[21.5,16.6,23.3,18]],["C",[25,19.3,25,21.9]],["C",[25,25.2,21.9,26]],["C",[18.9,26.7,15.9,26.6]],["C",[15.9,30,15.9,33.5]]]);
		this.motifs.set("´",[["M",[29.7,7.7]],["L",[14.5,7.7]],["L",[5.2,21.8]],["L",[14.8,21.8]],["L",[29.7,7.7]]]);
		this.motifs.set("µ",[["M",[52.2,28.3]],["L",[38.4,28.3]],["L",[38.4,55.4]],["C",[38.5,70.6,27.8,70.3]],["C",[18.8,70.3,19,57.5]],["L",[19,28.3]],["L",[5.2,28.3]],["L",[5.2,98.2]],["L",[19,98.2]],["L",[19,79]],["C",[20.7,81.3,26.3,81.4]],["C",[28.8,81.4,32.5,79.2]],["C",[36.1,77.1,38.8,72.9]],["L",[39.1,72.9]],["L",[39.1,80]],["L",[52.2,80]],["L",[52.2,28.3]]]);
		this.motifs.set("¶",[["M",[21.4,96.6]],["L",[31.3,96.6]],["L",[31.3,16.6]],["L",[41.9,16.6]],["L",[41.9,96.6]],["L",[51.8,96.6]],["L",[51.8,8.6]],["L",[23.4,8.6]],["C",[13.2,8.5,6.8,12.4]],["C",[0.3,16.4,0.2,26.8]],["C",[0.4,43.9,21.4,44.3]],["L",[21.4,96.6]]]);
		this.motifs.set("·",[["M",[5.3,51.3]],["C",[5.3,54.8,7.8,57.2]],["C",[10.2,59.7,13.6,59.7]],["C",[16.8,59.6,19.3,57]],["C",[21.5,54.6,21.6,51.3]],["C",[21.5,47.7,19.3,45.2]],["C",[16.8,42.9,13.5,42.8]],["C",[10.2,42.9,7.8,45.2]],["C",[5.3,47.6,5.3,51.3]]]);
		this.motifs.set("¸",[["M",[1.1,99.6]],["C",[3.8,100.5,6.4,101.1]],["C",[8.8,101.7,13.2,101.8]],["C",[17.7,101.8,21,99.7]],["C",[24.4,97.5,24.5,91.9]],["C",[24.4,88.1,21.8,86.4]],["C",[19.1,84.8,15.6,84.8]],["C",[13.2,84.8,12.3,85.4]],["L",[12.1,85.4]],["L",[15.9,79.9]],["L",[11.2,79.9]],["L",[5.5,88.3]],["C",[6.4,89.5,7.5,90.7]],["C",[9.2,90,11.4,90]],["C",[15,89.8,15.2,93.2]],["C",[15.1,96.6,11.4,96.6]],["C",[8.9,96.5,6.9,95.9]],["C",[4.8,95.4,3.2,94.8]],["C",[2.1,97.2,1.1,99.6]]]);
		this.motifs.set("¹",[["M",[28,9.5]],["L",[19.9,9.5]],["C",[19.1,14.2,15.7,16.1]],["C",[12.2,18,7.5,17.8]],["L",[7.5,25.3]],["L",[18.1,25.3]],["L",[18.1,52.7]],["L",[28,52.7]],["L",[28,9.5]]]);
		this.motifs.set("º",[["M",[1.2,25.7]],["C",[1.6,42.2,17.7,42.5]],["C",[34,42.2,34.4,25.6]],["C",[34,8.9,17.7,8.6]],["C",[1.6,8.9,1.2,25.7]],["M",[11.5,25.7]],["C",[11.5,22,13,19.2]],["C",[14.5,16.2,17.7,16.1]],["C",[21.1,16.2,22.7,19.2]],["C",[24,22,24,25.7]],["C",[24,29,22.7,31.9]],["C",[21.1,34.9,17.7,35]],["C",[14.5,34.9,13,31.9]],["C",[11.5,29,11.5,25.7]]]);
		this.motifs.set("»",[["M",[23.5,33.7]],["L",[23.5,45.7]],["C",[28,49.3,32.5,52.8]],["C",[28,56.4,23.5,60]],["L",[23.5,72]],["L",[39.2,59.5]],["L",[39.2,46]],["L",[23.5,33.7]],["M",[3.2,33.7]],["L",[3.2,45.7]],["L",[12.2,52.8]],["L",[3.2,60]],["L",[3.2,72]],["L",[18.9,59.5]],["L",[18.9,46]],["L",[3.2,33.7]]]);
		this.motifs.set("¼",[["M",[14.7,82.2]],["L",[23.1,82.2]],["L",[63.1,7.8]],["L",[54.8,7.8]],["C",[34.8,45,14.7,82.2]],["M",[22.9,9.4]],["L",[14.7,9.4]],["C",[14.1,14.2,10.5,16.1]],["C",[7.1,18,2.3,17.8]],["L",[2.3,25.3]],["L",[13,25.3]],["L",[13,52.7]],["L",[22.9,52.7]],["L",[22.9,9.4]],["M",[66.7,80]],["L",[76,80]],["L",[76,71.2]],["L",[81.5,71.2]],["L",[81.5,63.2]],["L",[76,63.2]],["L",[76,38.1]],["L",[66.4,38.1]],["C",[57.2,49.9,48.1,61.8]],["L",[48.1,71.2]],["L",[66.7,71.2]],["L",[66.7,80]],["M",[66.7,63.2]],["L",[55.5,63.2]],["C",[61,56,66.6,48.8]],["L",[66.7,48.8]],["L",[66.7,63.2]]]);
		this.motifs.set("½",[["M",[14.7,82.2]],["L",[23.1,82.2]],["L",[63,7.8]],["L",[54.8,7.8]],["C",[34.8,45,14.7,82.2]],["M",[22.9,9.4]],["L",[14.7,9.4]],["C",[14.1,14.2,10.5,16.1]],["C",[7.1,18,2.3,17.8]],["L",[2.3,25.3]],["C",[7.7,25.4,13,25.4]],["L",[13,52.7]],["L",[22.9,52.7]],["L",[22.9,9.4]],["M",[59.2,53.3]],["C",[59,50.1,60.6,47]],["C",[62.2,44.1,66.2,44]],["C",[68.9,44,70.5,45.7]],["C",[72.1,47.3,72.1,50.2]],["C",[71.9,54,68.8,56.3]],["C",[67.5,57.4,65.9,58.4]],["C",[64.3,59.3,62.8,60.5]],["C",[57,63.7,53.3,68]],["C",[49.5,72.3,49.2,80]],["L",[81.5,80]],["L",[81.5,72]],["L",[61.3,72]],["C",[63.9,68.6,67.4,66.4]],["C",[70.8,64.2,74.1,62.2]],["C",[77.5,60,79.7,57]],["C",[81.8,54.1,81.9,49.4]],["C",[81.8,42.6,77.5,39.2]],["C",[73.1,36,66.8,36]],["C",[58.1,36.1,53.7,40.6]],["C",[49.3,45.4,49.3,53.3]],["L",[59.2,53.3]]]);
		this.motifs.set("¾",[["M",[23.1,82.2]],["L",[31.6,82.2]],["C",[51.5,45,71.5,7.8]],["L",[63.2,7.8]],["L",[23.1,82.2]],["M",[17.5,33.5]],["L",[20.9,33.5]],["C",[22.7,33.6,24.2,34.2]],["C",[25.6,34.6,26.7,35.8]],["C",[27.6,37,27.6,39.3]],["C",[27.5,42.1,25.5,43.8]],["C",[23.5,45.6,20.5,45.6]],["C",[16.9,45.6,15.1,43]],["C",[13.3,40.8,13,37.5]],["L",[3.8,37.5]],["C",[4.2,53.5,20.7,53.6]],["C",[27.7,53.6,32.5,49.9]],["C",[37.3,46.3,37.5,39.1]],["C",[37.5,35.5,35.4,32.9]],["C",[33.1,30.4,29.3,29.7]],["L",[29.3,29.5]],["C",[32.6,28.5,34.3,26.2]],["C",[35.9,23.9,35.9,20.9]],["C",[35.7,14.7,31.2,11.6]],["C",[26.7,8.6,20.6,8.6]],["C",[5.8,8.9,4.9,23.8]],["L",[14.2,23.8]],["C",[14.2,20.7,16,18.7]],["C",[17.6,16.7,20.7,16.6]],["C",[23.1,16.6,24.9,18]],["C",[26.6,19.3,26.7,21.9]],["C",[26.6,25.2,23.5,26]],["C",[20.5,26.7,17.5,26.6]],["L",[17.5,33.5]],["M",[68.7,80]],["L",[78,80]],["L",[78,71.1]],["L",[83.5,71.1]],["L",[83.5,63.1]],["L",[78,63.1]],["L",[78,37.9]],["L",[68.3,37.9]],["C",[59.1,49.8,50,61.7]],["L",[50,71.1]],["L",[68.7,71.1]],["L",[68.7,80]],["M",[68.7,63.1]],["L",[57.4,63.1]],["C",[62.9,55.8,68.5,48.7]],["L",[68.7,48.7]],["L",[68.7,63.1]]]);
		this.motifs.set("¿",[["M",[36.8,74.9]],["C",[36.8,80.2,34.4,84]],["C",[31.8,87.8,26.5,87.9]],["C",[17.9,87.9,17.8,78.8]],["C",[17.8,74.9,20.1,72.4]],["C",[22.2,70.1,25.1,68]],["C",[26.7,66.9,28.2,65.4]],["C",[29.6,63.9,30.8,62.1]],["C",[33.3,58.7,33.8,52.4]],["L",[33.8,47.9]],["L",[20.7,47.9]],["L",[20.7,51.6]],["C",[20,55.8,17,58.5]],["C",[14.2,61.1,10.7,63.3]],["C",[9.1,64.5,7.6,65.9]],["C",[6,67.5,4.8,69.4]],["C",[2.1,73.1,2.1,80.3]],["C",[2.1,83.2,3.3,86.4]],["C",[4.6,89.7,7.4,92.8]],["C",[10.4,95.7,15.1,97.6]],["C",[19.9,99.5,26.9,99.6]],["C",[38,99.5,44.4,92.6]],["C",[50.8,85.8,51.1,74.9]],["L",[36.8,74.9]],["M",[35.2,27]],["L",[19.4,27]],["L",[19.4,42.3]],["L",[35.2,42.3]],["L",[35.2,27]]]);
		this.motifs.set("À",[["M",[-0.7,80]],["L",[14.7,80]],["L",[20.1,64.1]],["L",[46,64.1]],["L",[51.2,80]],["L",[67,80]],["L",[41.1,8.6]],["L",[25.6,8.6]],["L",[-0.7,80]],["M",[33.1,26.1]],["L",[33.3,26.1]],["L",[42,52.4]],["L",[24.1,52.4]],["L",[33.1,26.1]],["M",[32,2.2]],["L",[41.7,2.2]],["C",[37,-4.9,32.3,-12]],["L",[17.1,-12]],["C",[24.6,-4.9,32,2.2]]]);
		this.motifs.set("Á",[["M",[-0.7,80]],["L",[14.7,80]],["L",[20.1,64.1]],["L",[46,64.1]],["L",[51.2,80]],["L",[67,80]],["L",[41.1,8.6]],["L",[25.6,8.6]],["L",[-0.7,80]],["M",[33.1,26.1]],["L",[33.3,26.1]],["L",[42,52.4]],["L",[24.1,52.4]],["L",[33.1,26.1]],["M",[51.9,-12]],["L",[36.6,-12]],["L",[27.3,2.2]],["L",[36.9,2.2]],["L",[51.9,-12]]]);
		this.motifs.set("Â",[["M",[-0.7,80]],["L",[14.7,80]],["L",[20.1,64.1]],["L",[46,64.1]],["L",[51.2,80]],["L",[67,80]],["L",[41.1,8.6]],["L",[25.6,8.6]],["L",[-0.7,80]],["M",[33.1,26.1]],["L",[33.3,26.1]],["L",[42,52.4]],["L",[24.1,52.4]],["L",[33.1,26.1]],["M",[17.2,2.2]],["L",[28,2.2]],["L",[34.4,-5.9]],["C",[37.5,-1.9,40.6,2.2]],["L",[52.3,2.2]],["L",[41.3,-12]],["L",[28.3,-12]],["L",[17.2,2.2]]]);
		this.motifs.set("Ã",[["M",[-0.7,80]],["L",[14.7,80]],["L",[20.1,64.1]],["L",[46,64.1]],["L",[51.2,80]],["L",[67,80]],["L",[41.1,8.6]],["L",[25.6,8.6]],["L",[-0.7,80]],["M",[33.1,26.1]],["L",[33.3,26.1]],["L",[42,52.4]],["L",[24.1,52.4]],["L",[33.1,26.1]],["M",[45.6,-11.1]],["C",[45.8,-7.7,41.5,-7.5]],["C",[38.2,-7.7,35.2,-9.4]],["C",[33.7,-10.1,32.2,-10.6]],["C",[30.7,-11.1,28.9,-11.1]],["C",[25.7,-11.1,23.7,-10.1]],["C",[21.6,-9,20.2,-7.2]],["C",[19,-5.4,18.1,-3.3]],["C",[17.3,-1.2,16.7,1.1]],["L",[22.6,1.1]],["C",[23,-0.9,24,-2]],["C",[24.9,-3.1,26.7,-3.1]],["C",[30,-3,33.5,-1.4]],["C",[35.3,-0.8,37.4,-0.3]],["C",[39.3,0.3,41.4,0.3]],["C",[44.4,0.3,46.2,-0.9]],["C",[48.1,-2,49.2,-3.7]],["C",[50.4,-5.4,51.1,-7.5]],["C",[51.9,-9.4,52.2,-11.1]],["L",[45.6,-11.1]]]);
		this.motifs.set("Ä",[["M",[-0.7,80]],["L",[14.7,80]],["L",[20.1,64.1]],["L",[46,64.1]],["L",[51.2,80]],["L",[67,80]],["L",[41.1,8.6]],["L",[25.6,8.6]],["L",[-0.7,80]],["M",[33.1,26.1]],["L",[33.3,26.1]],["L",[42,52.4]],["L",[24.1,52.4]],["L",[33.1,26.1]],["M",[37.9,0.7]],["L",[51,0.7]],["L",[51,-11.1]],["L",[37.9,-11.1]],["L",[37.9,0.7]],["M",[17.3,0.7]],["L",[30.4,0.7]],["L",[30.4,-11.1]],["L",[17.3,-11.1]],["L",[17.3,0.7]]]);
		this.motifs.set("Å",[["M",[-0.7,80]],["L",[14.7,80]],["L",[20.1,64.1]],["L",[46,64.1]],["L",[51.2,80]],["L",[67,80]],["L",[41.1,8.6]],["L",[25.6,8.6]],["L",[-0.7,80]],["M",[33.1,26.1]],["L",[33.3,26.1]],["L",[42,52.4]],["L",[24.1,52.4]],["L",[33.1,26.1]],["M",[28.5,-5.3]],["C",[28.5,-8.4,30.2,-10.4]],["C",[31.9,-12.3,34.6,-12.3]],["C",[37.5,-12.3,39.2,-10.4]],["C",[40.8,-8.4,40.8,-5.3]],["C",[40.8,-2.4,39.2,-0.4]],["C",[37.5,1.7,34.6,1.7]],["C",[31.9,1.7,30.2,-0.4]],["C",[28.5,-2.4,28.5,-5.3]],["M",[22.8,-5.3]],["C",[22.8,-0.2,26.4,3.2]],["C",[29.7,6.9,34.6,6.9]],["C",[39.6,6.9,43.1,3.2]],["C",[46.4,-0.2,46.5,-5.3]],["C",[46.4,-10.6,43.1,-14]],["C",[39.6,-17.4,34.6,-17.5]],["C",[29.7,-17.4,26.4,-14]],["C",[22.8,-10.6,22.8,-5.3]]]);
		this.motifs.set("Æ",[["M",[40.5,21.8]],["C",[42.1,21.7,43.8,21.7]],["L",[43.8,52.4]],["L",[27.1,52.4]],["C",[33.7,37.1,40.5,21.8]],["M",[-1.9,80]],["L",[14.8,80]],["L",[22.1,64.1]],["L",[43.8,64.1]],["L",[43.8,80]],["L",[91.5,80]],["L",[91.5,66.8]],["L",[58.5,66.8]],["L",[58.5,49.3]],["L",[88.8,49.3]],["L",[88.8,37.1]],["L",[58.5,37.1]],["L",[58.5,21.8]],["L",[90.7,21.8]],["L",[90.7,8.6]],["L",[31.9,8.6]],["L",[-1.9,80]]]);
		this.motifs.set("Ç",[["M",[67.5,32.6]],["C",[66,20.1,57.6,13.5]],["C",[49.3,7,37.6,6.9]],["C",[21.4,7.1,12.5,17.7]],["C",[3.5,28.3,3.4,44.6]],["C",[3.4,59.3,11.4,69.4]],["C",[19.1,79.6,33.4,81.4]],["L",[28.7,88.3]],["L",[30.8,90.7]],["C",[32.5,90,34.7,90]],["C",[38.4,89.8,38.6,93.2]],["C",[38.5,96.7,34.8,96.7]],["C",[32.4,96.6,30.4,96]],["C",[28.3,95.4,26.7,94.8]],["C",[25.7,97.2,24.7,99.6]],["C",[27.3,100.6,29.9,101.1]],["C",[32.3,101.7,36.6,101.8]],["C",[41.1,101.8,44.4,99.7]],["C",[47.8,97.5,47.9,91.9]],["C",[47.8,88.1,45.1,86.4]],["C",[42.4,84.8,39,84.8]],["C",[36.6,84.8,35.7,85.4]],["L",[35.5,85.4]],["C",[36.8,83.6,38,81.8]],["C",[64.6,80.2,68.1,52.6]],["L",[53.5,52.6]],["C",[52.6,59.7,48.7,64]],["C",[44.8,68.4,37.9,68.5]],["C",[27.8,68.3,23.5,61.1]],["C",[19,53.8,19.1,44.6]],["C",[19,34.8,23.4,27.6]],["C",[27.8,20.3,37.8,20.1]],["C",[43.6,20.2,47.8,23.6]],["C",[52,27.1,52.8,32.6]],["L",[67.5,32.6]]]);
		this.motifs.set("È",[["M",[6.4,80]],["L",[59.4,80]],["L",[59.4,66.8]],["L",[22.1,66.8]],["L",[22.1,49.3]],["L",[55.7,49.3]],["L",[55.7,37.1]],["L",[22.1,37.1]],["L",[22.1,21.8]],["L",[58.7,21.8]],["L",[58.7,8.6]],["L",[6.4,8.6]],["L",[6.4,80]],["M",[29.9,2.2]],["L",[39.6,2.2]],["C",[34.9,-4.9,30.2,-12]],["L",[15,-12]],["L",[29.9,2.2]]]);
		this.motifs.set("É",[["M",[6.4,80]],["L",[59.4,80]],["L",[59.4,66.8]],["L",[22.1,66.8]],["L",[22.1,49.3]],["L",[55.7,49.3]],["L",[55.7,37.1]],["L",[22.1,37.1]],["L",[22.1,21.8]],["L",[58.7,21.8]],["L",[58.7,8.6]],["L",[6.4,8.6]],["L",[6.4,80]],["M",[49.9,-12]],["L",[34.6,-12]],["L",[25.3,2.2]],["L",[34.9,2.2]],["L",[49.9,-12]]]);
		this.motifs.set("Ê",[["M",[6.4,80]],["L",[59.4,80]],["L",[59.4,66.8]],["L",[22.1,66.8]],["L",[22.1,49.3]],["L",[55.7,49.3]],["L",[55.7,37.1]],["L",[22.1,37.1]],["L",[22.1,21.8]],["L",[58.7,21.8]],["L",[58.7,8.6]],["L",[6.4,8.6]],["L",[6.4,80]],["M",[15.1,2.2]],["L",[25.9,2.2]],["L",[32.3,-5.9]],["C",[35.4,-1.9,38.5,2.2]],["L",[50.2,2.2]],["L",[39.2,-12]],["L",[26.2,-12]],["L",[15.1,2.2]]]);
		this.motifs.set("Ë",[["M",[6.4,80]],["L",[59.4,80]],["L",[59.4,66.8]],["L",[22.1,66.8]],["L",[22.1,49.3]],["L",[55.7,49.3]],["L",[55.7,37.1]],["L",[22.1,37.1]],["L",[22.1,21.8]],["L",[58.7,21.8]],["L",[58.7,8.6]],["L",[6.4,8.6]],["L",[6.4,80]],["M",[35.6,0.7]],["L",[48.7,0.7]],["L",[48.7,-11.1]],["L",[35.6,-11.1]],["L",[35.6,0.7]],["M",[15,0.7]],["L",[28.1,0.7]],["L",[28.1,-11.1]],["L",[15,-11.1]],["L",[15,0.7]]]);
		this.motifs.set("Ì",[["M",[6.4,80]],["L",[22.1,80]],["L",[22.1,8.6]],["L",[6.4,8.6]],["L",[6.4,80]],["M",[11.7,2.2]],["L",[21.3,2.2]],["C",[16.6,-4.9,12,-12]],["L",[-3.2,-12]],["L",[11.7,2.2]]]);
		this.motifs.set("Í",[["M",[6.4,80]],["L",[22.1,80]],["L",[22.1,8.6]],["L",[6.4,8.6]],["L",[6.4,80]],["M",[31.5,-12]],["L",[16.3,-12]],["L",[7,2.2]],["L",[16.6,2.2]],["L",[31.5,-12]]]);
		this.motifs.set("Î",[["M",[6.4,80]],["L",[22.1,80]],["L",[22.1,8.6]],["L",[6.4,8.6]],["L",[6.4,80]],["M",[-3.2,2.2]],["L",[7.6,2.2]],["L",[14,-5.9]],["C",[17.1,-1.9,20.2,2.2]],["L",[31.9,2.2]],["L",[20.9,-12]],["L",[7.9,-12]],["L",[-3.2,2.2]]]);
		this.motifs.set("Ï",[["M",[6.4,80]],["L",[22.1,80]],["L",[22.1,8.6]],["L",[6.4,8.6]],["L",[6.4,80]],["M",[17.6,0.7]],["L",[30.7,0.7]],["L",[30.7,-11.1]],["L",[17.6,-11.1]],["L",[17.6,0.7]],["M",[-3,0.7]],["L",[10.1,0.7]],["L",[10.1,-11.1]],["L",[-3,-11.1]],["L",[-3,0.7]]]);
		this.motifs.set("Ð",[["M",[6.4,80]],["L",[36.5,80]],["C",[52.4,79.9,60.4,69.6]],["C",[68.2,59.7,68.2,43.9]],["C",[68,26.1,59.1,17.3]],["C",[50.4,8.6,36.5,8.6]],["L",[6.4,8.6]],["L",[6.4,37.3]],["L",[0,37.3]],["L",[0,48.9]],["L",[6.4,48.9]],["L",[6.4,80]],["M",[22.1,21.8]],["L",[32.8,21.8]],["C",[43.9,21.9,48.2,28.2]],["C",[52.5,34.5,52.4,45.4]],["C",[52.4,51.2,51.1,55.3]],["C",[49.8,59.5,47.3,62]],["C",[45,64.5,41.9,65.6]],["C",[38.8,66.8,35.5,66.8]],["L",[22.1,66.8]],["L",[22.1,49]],["L",[37.4,49]],["L",[37.4,37.3]],["L",[22.1,37.3]],["L",[22.1,21.8]]]);
		this.motifs.set("Ñ",[["M",[6.7,80]],["L",[20.9,80]],["L",[20.9,32.2]],["L",[21.1,32.2]],["C",[35.5,56.1,49.9,80]],["L",[65.1,80]],["L",[65.1,8.6]],["L",[50.8,8.6]],["L",[50.8,56.5]],["L",[50.6,56.5]],["L",[21.8,8.6]],["L",[6.7,8.6]],["L",[6.7,80]],["M",[48.1,-11.1]],["C",[48.3,-7.7,44.1,-7.5]],["C",[40.8,-7.7,37.7,-9.4]],["C",[36.3,-10.1,34.8,-10.6]],["C",[33.3,-11.1,31.5,-11.1]],["C",[28.3,-11.1,26.3,-10.1]],["C",[24.2,-9,22.8,-7.2]],["C",[21.6,-5.4,20.7,-3.3]],["C",[19.9,-1.2,19.3,1.1]],["L",[25.2,1.1]],["C",[25.6,-0.9,26.6,-2]],["C",[27.4,-3.1,29.2,-3.1]],["C",[32.6,-3,36.1,-1.4]],["C",[37.9,-0.8,39.9,-0.3]],["C",[41.9,0.3,44,0.3]],["C",[47,0.3,48.8,-0.9]],["C",[50.7,-2,51.8,-3.7]],["C",[53,-5.4,53.7,-7.5]],["C",[54.4,-9.4,54.8,-11.1]],["L",[48.1,-11.1]]]);
		this.motifs.set("Ò",[["M",[3.4,44.6]],["C",[3.5,60.4,12.5,70.8]],["C",[21.5,81.5,37.7,81.7]],["C",[54.1,81.5,62.9,70.8]],["C",[71.8,60.4,71.9,44.6]],["C",[71.8,28.3,62.9,17.7]],["C",[54.1,7.1,37.7,6.9]],["C",[21.5,7.1,12.5,17.7]],["C",[3.5,28.3,3.4,44.6]],["M",[19.1,44.6]],["C",[19,34.8,23.4,27.6]],["C",[27.8,20.3,37.7,20.1]],["C",[47.8,20.3,52.1,27.6]],["C",[56.2,34.8,56.2,44.6]],["C",[56.2,53.8,52.1,61.1]],["C",[47.8,68.3,37.7,68.5]],["C",[27.8,68.3,23.4,61.1]],["C",[19,53.8,19.1,44.6]],["M",[36.8,2.2]],["L",[46.4,2.2]],["C",[41.7,-4.9,37.1,-12]],["L",[21.9,-12]],["L",[36.8,2.2]]]);
		this.motifs.set("Ó",[["M",[3.4,44.6]],["C",[3.5,60.4,12.5,70.8]],["C",[21.5,81.5,37.7,81.7]],["C",[54.1,81.5,62.9,70.8]],["C",[71.8,60.4,71.9,44.6]],["C",[71.8,28.3,62.9,17.7]],["C",[54.1,7.1,37.7,6.9]],["C",[21.5,7.1,12.5,17.7]],["C",[3.5,28.3,3.4,44.6]],["M",[19.1,44.6]],["C",[19,34.8,23.4,27.6]],["C",[27.8,20.3,37.7,20.1]],["C",[47.8,20.3,52.1,27.6]],["C",[56.2,34.8,56.2,44.6]],["C",[56.2,53.8,52.1,61.1]],["C",[47.8,68.3,37.7,68.5]],["C",[27.8,68.3,23.4,61.1]],["C",[19,53.8,19.1,44.6]],["M",[56.5,-12]],["L",[41.3,-12]],["L",[32,2.2]],["L",[41.6,2.2]],["L",[56.5,-12]]]);
		this.motifs.set("Ô",[["M",[3.4,44.6]],["C",[3.5,60.4,12.5,70.8]],["C",[21.5,81.5,37.7,81.7]],["C",[54.1,81.5,62.9,70.8]],["C",[71.8,60.4,71.9,44.6]],["C",[71.8,28.3,62.9,17.7]],["C",[54.1,7.1,37.7,6.9]],["C",[21.5,7.1,12.5,17.7]],["C",[3.5,28.3,3.4,44.6]],["M",[19.1,44.6]],["C",[19,34.8,23.4,27.6]],["C",[27.8,20.3,37.7,20.1]],["C",[47.8,20.3,52.1,27.6]],["C",[56.2,34.8,56.2,44.6]],["C",[56.2,53.8,52.1,61.1]],["C",[47.8,68.3,37.7,68.5]],["C",[27.8,68.3,23.4,61.1]],["C",[19,53.8,19.1,44.6]],["M",[21.9,2.2]],["L",[32.7,2.2]],["L",[39.1,-5.9]],["C",[42.2,-1.9,45.3,2.2]],["L",[57,2.2]],["L",[46,-12]],["L",[33,-12]],["L",[21.9,2.2]]]);
		this.motifs.set("Õ",[["M",[3.4,44.6]],["C",[3.5,60.4,12.5,70.8]],["C",[21.5,81.5,37.7,81.7]],["C",[54.1,81.5,62.9,70.8]],["C",[71.8,60.4,71.9,44.6]],["C",[71.8,28.3,62.9,17.7]],["C",[54.1,7.1,37.7,6.9]],["C",[21.5,7.1,12.5,17.7]],["C",[3.5,28.3,3.4,44.6]],["M",[19.1,44.6]],["C",[19,34.8,23.4,27.6]],["C",[27.8,20.3,37.7,20.1]],["C",[47.8,20.3,52.1,27.6]],["C",[56.2,34.8,56.2,44.6]],["C",[56.2,53.8,52.1,61.1]],["C",[47.8,68.3,37.7,68.5]],["C",[27.8,68.3,23.4,61.1]],["C",[19,53.8,19.1,44.6]],["M",[50.2,-11.1]],["C",[50.4,-7.7,46.2,-7.5]],["C",[42.9,-7.7,39.8,-9.4]],["C",[38.4,-10.1,36.9,-10.6]],["C",[35.4,-11.1,33.6,-11.1]],["C",[30.4,-11.1,28.4,-10.1]],["C",[26.3,-9,24.9,-7.2]],["C",[23.7,-5.4,22.8,-3.3]],["C",[22,-1.2,21.4,1.1]],["L",[27.3,1.1]],["C",[27.7,-0.9,28.7,-2]],["C",[29.5,-3.1,31.3,-3.1]],["C",[34.7,-3,38.2,-1.4]],["C",[40,-0.8,42,-0.3]],["C",[44,0.3,46.1,0.3]],["C",[49.1,0.3,50.9,-0.9]],["C",[52.8,-2,53.9,-3.7]],["C",[55.1,-5.4,55.8,-7.5]],["C",[56.5,-9.4,56.9,-11.1]],["L",[50.2,-11.1]]]);
		this.motifs.set("Ö",[["M",[3.4,44.6]],["C",[3.5,60.4,12.5,70.8]],["C",[21.5,81.5,37.7,81.7]],["C",[54.1,81.5,62.9,70.8]],["C",[71.8,60.4,71.9,44.6]],["C",[71.8,28.3,62.9,17.7]],["C",[54.1,7.1,37.7,6.9]],["C",[21.5,7.1,12.5,17.7]],["C",[3.5,28.3,3.4,44.6]],["M",[19.1,44.6]],["C",[19,34.8,23.4,27.6]],["C",[27.8,20.3,37.7,20.1]],["C",[47.8,20.3,52.1,27.6]],["C",[56.2,34.8,56.2,44.6]],["C",[56.2,53.8,52.1,61.1]],["C",[47.8,68.3,37.7,68.5]],["C",[27.8,68.3,23.4,61.1]],["C",[19,53.8,19.1,44.6]],["M",[42.6,0.7]],["L",[55.7,0.7]],["L",[55.7,-11.1]],["L",[42.6,-11.1]],["L",[42.6,0.7]],["M",[22,0.7]],["L",[35.1,0.7]],["L",[35.1,-11.1]],["L",[22,-11.1]],["L",[22,0.7]]]);
		this.motifs.set("×",[["M",[13.6,78.3]],["L",[29.1,62.2]],["L",[44.6,78.3]],["C",[48.3,74.5,52,70.7]],["L",[35.9,54.7]],["L",[52,38.7]],["C",[48.3,34.9,44.6,31.1]],["L",[29.1,47.1]],["C",[21.4,39.1,13.8,31.1]],["L",[6.4,38.7]],["L",[22.3,54.7]],["L",[6.2,70.7]],["C",[9.9,74.5,13.6,78.3]]]);
		this.motifs.set("Ø",[["M",[3.1,79]],["L",[7.9,83.3]],["L",[15.9,74.1]],["C",[24.1,81.5,37.7,81.7]],["C",[54.1,81.5,62.9,70.8]],["C",[71.8,60.4,71.9,44.6]],["C",[71.8,29.6,64,19.4]],["L",[72.4,10.1]],["C",[69.9,7.9,67.4,5.7]],["L",[59.6,14.6]],["C",[51.2,7,37.7,6.9]],["C",[21.5,7.1,12.5,17.7]],["C",[3.5,28.3,3.4,44.6]],["C",[3.4,51.9,5.5,58.2]],["C",[7.6,64.6,11.7,69.6]],["L",[3.1,79]],["M",[21.8,58.2]],["C",[19,51.9,19.1,44.6]],["C",[19,34.8,23.4,27.6]],["C",[27.8,20.3,37.7,20.1]],["C",[45.8,20.2,50.1,25.2]],["L",[21.8,58.2]],["M",[53.7,31]],["C",[56.2,37.3,56.2,44.6]],["C",[56.2,53.8,52.1,61.1]],["C",[47.8,68.3,37.7,68.5]],["C",[29.8,68.4,25.4,63.6]],["L",[53.7,31]]]);
		this.motifs.set("Ù",[["M",[65.6,8.6]],["L",[49.9,8.6]],["L",[49.9,53]],["C",[49.9,61,46.8,64.7]],["C",[43.7,68.5,35.8,68.5]],["C",[31.4,68.5,28.7,67.2]],["C",[25.8,65.7,24.3,63.6]],["C",[22.9,61.3,22.4,58.7]],["C",[21.8,55.9,21.8,53]],["L",[21.8,8.6]],["L",[6.1,8.6]],["L",[6.1,53]],["C",[6.5,81.8,35.8,81.7]],["C",[65.1,81.7,65.6,53]],["L",[65.6,8.6]],["M",[34.8,2.2]],["L",[44.4,2.2]],["C",[39.7,-4.9,35.1,-12]],["L",[19.9,-12]],["C",[27.3,-4.9,34.8,2.2]]]);
		this.motifs.set("Ú",[["M",[65.6,8.6]],["L",[49.9,8.6]],["L",[49.9,53]],["C",[49.9,61,46.8,64.7]],["C",[43.7,68.5,35.8,68.5]],["C",[31.4,68.5,28.7,67.2]],["C",[25.8,65.7,24.3,63.6]],["C",[22.9,61.3,22.4,58.7]],["C",[21.8,55.9,21.8,53]],["L",[21.8,8.6]],["L",[6.1,8.6]],["L",[6.1,53]],["C",[6.5,81.8,35.8,81.7]],["C",[65.1,81.7,65.6,53]],["L",[65.6,8.6]],["M",[54.5,-12]],["L",[39.3,-12]],["L",[30,2.2]],["L",[39.6,2.2]],["L",[54.5,-12]]]);
		this.motifs.set("Û",[["M",[65.6,8.6]],["L",[49.9,8.6]],["L",[49.9,53]],["C",[49.9,61,46.8,64.7]],["C",[43.7,68.5,35.8,68.5]],["C",[31.4,68.5,28.7,67.2]],["C",[25.8,65.7,24.3,63.6]],["C",[22.9,61.3,22.4,58.7]],["C",[21.8,55.9,21.8,53]],["L",[21.8,8.6]],["L",[6.1,8.6]],["L",[6.1,53]],["C",[6.5,81.8,35.8,81.7]],["C",[65.1,81.7,65.6,53]],["L",[65.6,8.6]],["M",[19.9,2.2]],["L",[30.7,2.2]],["L",[37.1,-5.9]],["C",[40.2,-1.9,43.3,2.2]],["L",[55,2.2]],["L",[44,-12]],["L",[31,-12]],["L",[19.9,2.2]]]);
		this.motifs.set("Ü",[["M",[65.6,8.6]],["L",[49.9,8.6]],["L",[49.9,53]],["C",[49.9,61,46.8,64.7]],["C",[43.7,68.5,35.8,68.5]],["C",[31.4,68.5,28.7,67.2]],["C",[25.8,65.7,24.3,63.6]],["C",[22.9,61.3,22.4,58.7]],["C",[21.8,55.9,21.8,53]],["L",[21.8,8.6]],["L",[6.1,8.6]],["L",[6.1,53]],["C",[6.5,81.8,35.8,81.7]],["C",[65.1,81.7,65.6,53]],["L",[65.6,8.6]],["M",[40.5,0.7]],["L",[53.6,0.7]],["L",[53.6,-11.1]],["L",[40.5,-11.1]],["L",[40.5,0.7]],["M",[19.9,0.7]],["L",[33,0.7]],["L",[33,-11.1]],["L",[19.9,-11.1]],["L",[19.9,0.7]]]);
		this.motifs.set("Ý",[["M",[24.3,80]],["L",[40,80]],["L",[40,52.6]],["L",[65.7,8.6]],["L",[48.6,8.6]],["L",[32.4,36.8]],["L",[16.1,8.6]],["L",[-1.1,8.6]],["C",[11.6,30.4,24.3,52.2]],["L",[24.3,80]],["M",[50.9,-12]],["L",[35.7,-12]],["L",[26.4,2.2]],["L",[36,2.2]],["L",[50.9,-12]]]);
		this.motifs.set("Þ",[["M",[6.4,80]],["L",[22.1,80]],["L",[22.1,64.1]],["L",[38,64.1]],["C",[50.7,63.9,56.4,57]],["C",[61.8,50.3,61.8,41.2]],["C",[61.8,32.1,56.4,25.3]],["C",[50.7,18.5,38,18.3]],["L",[22.1,18.3]],["L",[22.1,8.6]],["L",[6.4,8.6]],["L",[6.4,80]],["M",[22.1,30.5]],["L",[33.8,30.5]],["C",[39.4,30.4,43.1,32.4]],["C",[47,34.5,47.1,41.2]],["C",[47,47.8,43.1,49.9]],["C",[41.4,51.1,39,51.5]],["C",[36.6,51.9,33.8,51.9]],["L",[22.1,51.9]],["L",[22.1,30.5]]]);
		this.motifs.set("ß",[["M",[5.4,80]],["L",[19.2,80]],["L",[19.2,28.4]],["C",[19.2,23.8,21.5,21.2]],["C",[23.7,18.6,27.8,18.6]],["C",[30.3,18.5,33.5,19.8]],["C",[36.8,21.4,37,27.5]],["C",[36.9,32.1,34,34.2]],["C",[31,36.4,26.9,36.4]],["C",[25.9,36.4,24.7,36.2]],["L",[24.7,45.6]],["C",[26.5,45.4,28.2,45.4]],["C",[34.3,45.5,37.2,48.7]],["C",[40,52.1,40,57.6]],["C",[39.9,62.7,36.9,66.1]],["C",[33.8,69.6,28.8,69.7]],["C",[26.7,69.7,24.8,69.2]],["L",[24.8,80.8]],["C",[28.8,81.4,32.7,81.4]],["C",[42.1,81.2,47.9,74.3]],["C",[53.7,67.7,53.8,58.1]],["C",[53.8,51.5,50.6,46.6]],["C",[47.3,41.7,40.7,40.2]],["L",[40.7,40]],["C",[45,38.5,47.6,34.7]],["C",[50,30.8,50,26.1]],["C",[49.9,16.2,43.5,11.5]],["C",[37.1,6.9,28.1,6.9]],["C",[21,7,16.6,9]],["C",[12,11.2,9.6,14.7]],["C",[7.2,18.2,6.3,22.4]],["C",[5.4,26.6,5.4,30.9]],["L",[5.4,80]]]);
		this.motifs.set("à",[["M",[36.4,54.8]],["L",[36.4,60]],["C",[36.4,61.2,36.2,63.2]],["C",[35.9,65.2,35,67.2]],["C",[34,69.2,31.7,70.4]],["C",[29.3,71.9,25.2,71.9]],["C",[21.9,71.9,19.5,70.5]],["C",[16.9,69.2,16.8,65.4]],["C",[16.8,61.5,19.4,59.8]],["C",[21.7,58.3,25,57.7]],["C",[28.3,57.1,31.5,56.7]],["C",[34.6,56.2,36.4,54.8]],["M",[18.4,44.3]],["C",[19.4,36.5,27.5,36.6]],["C",[31.3,36.6,33.8,37.7]],["C",[36.3,39,36.4,43.5]],["C",[36.3,47.5,31.5,48.5]],["C",[29.2,48.9,26.3,49.2]],["C",[23.4,49.6,20.1,50.2]],["C",[16.9,50.6,13.9,51.5]],["C",[10.9,52.3,8.4,54.1]],["C",[6,55.7,4.6,58.6]],["C",[3.1,61.4,3.1,65.9]],["C",[3.2,73.8,8.1,77.5]],["C",[12.8,81.4,20.1,81.4]],["C",[24.9,81.4,29.2,79.9]],["C",[33.7,78.4,37,75]],["C",[37.2,77.6,38,80]],["L",[52,80]],["C",[51,78.3,50.7,75.1]],["C",[50.2,72,50.2,68.5]],["L",[50.2,41.8]],["C",[50.2,37.1,48.2,34.2]],["C",[46.3,31.3,43,29.7]],["C",[39.8,28.1,35.9,27.5]],["C",[32.1,27.1,28.2,27.1]],["C",[19.5,27,12.6,30.7]],["C",[5.6,34.5,4.6,44.4]],["C",[11.5,44.3,18.4,44.3]],["M",[26.4,21.8]],["L",[36,21.8]],["C",[31.3,14.8,26.7,7.7]],["L",[11.5,7.7]],["C",[18.9,14.8,26.4,21.8]]]);
		this.motifs.set("á",[["M",[36.4,54.8]],["L",[36.4,60]],["C",[36.4,61.2,36.2,63.2]],["C",[35.9,65.2,35,67.2]],["C",[34,69.2,31.7,70.4]],["C",[29.3,71.9,25.2,71.9]],["C",[21.9,71.9,19.5,70.5]],["C",[16.9,69.2,16.8,65.4]],["C",[16.8,61.5,19.4,59.8]],["C",[21.7,58.3,25,57.7]],["C",[28.3,57.1,31.5,56.7]],["C",[34.6,56.2,36.4,54.8]],["M",[18.4,44.3]],["C",[19.4,36.5,27.5,36.6]],["C",[31.3,36.6,33.8,37.7]],["C",[36.3,39,36.4,43.5]],["C",[36.3,47.5,31.5,48.5]],["C",[29.2,48.9,26.3,49.2]],["C",[23.4,49.6,20.1,50.2]],["C",[16.9,50.6,13.9,51.5]],["C",[10.9,52.3,8.4,54.1]],["C",[6,55.7,4.6,58.6]],["C",[3.1,61.4,3.1,65.9]],["C",[3.2,73.8,8.1,77.5]],["C",[12.8,81.4,20.1,81.4]],["C",[24.9,81.4,29.2,79.9]],["C",[33.7,78.4,37,75]],["C",[37.2,77.6,38,80]],["L",[52,80]],["C",[51,78.3,50.7,75.1]],["C",[50.2,72,50.2,68.5]],["L",[50.2,41.8]],["C",[50.2,37.1,48.2,34.2]],["C",[46.3,31.3,43,29.7]],["C",[39.8,28.1,35.9,27.5]],["C",[32.1,27.1,28.2,27.1]],["C",[19.5,27,12.6,30.7]],["C",[5.6,34.5,4.6,44.4]],["C",[11.5,44.3,18.4,44.3]],["M",[46.1,7.7]],["L",[30.9,7.7]],["L",[21.6,21.8]],["L",[31.2,21.8]],["L",[46.1,7.7]]]);
		this.motifs.set("â",[["M",[36.4,54.8]],["L",[36.4,60]],["C",[36.4,61.2,36.2,63.2]],["C",[35.9,65.2,35,67.2]],["C",[34,69.2,31.7,70.4]],["C",[29.3,71.9,25.2,71.9]],["C",[21.9,71.9,19.5,70.5]],["C",[16.9,69.2,16.8,65.4]],["C",[16.8,61.5,19.4,59.8]],["C",[21.7,58.3,25,57.7]],["C",[28.3,57.1,31.5,56.7]],["C",[34.6,56.2,36.4,54.8]],["M",[18.4,44.3]],["C",[19.4,36.5,27.5,36.6]],["C",[31.3,36.6,33.8,37.7]],["C",[36.3,39,36.4,43.5]],["C",[36.3,47.5,31.5,48.5]],["C",[29.2,48.9,26.3,49.2]],["C",[23.4,49.6,20.1,50.2]],["C",[16.9,50.6,13.9,51.5]],["C",[10.9,52.3,8.4,54.1]],["C",[6,55.7,4.6,58.6]],["C",[3.1,61.4,3.1,65.9]],["C",[3.2,73.8,8.1,77.5]],["C",[12.8,81.4,20.1,81.4]],["C",[24.9,81.4,29.2,79.9]],["C",[33.7,78.4,37,75]],["C",[37.2,77.6,38,80]],["L",[52,80]],["C",[51,78.3,50.7,75.1]],["C",[50.2,72,50.2,68.5]],["L",[50.2,41.8]],["C",[50.2,37.1,48.2,34.2]],["C",[46.3,31.3,43,29.7]],["C",[39.8,28.1,35.9,27.5]],["C",[32.1,27.1,28.2,27.1]],["C",[19.5,27,12.6,30.7]],["C",[5.6,34.5,4.6,44.4]],["C",[11.5,44.3,18.4,44.3]],["M",[11.5,21.8]],["L",[22.3,21.8]],["L",[28.7,13.8]],["C",[31.8,17.8,34.9,21.8]],["L",[46.6,21.8]],["L",[35.6,7.7]],["L",[22.6,7.7]],["L",[11.5,21.8]]]);
		this.motifs.set("ã",[["M",[36.4,54.8]],["L",[36.4,60]],["C",[36.4,61.2,36.2,63.2]],["C",[35.9,65.2,35,67.2]],["C",[34,69.2,31.7,70.4]],["C",[29.3,71.9,25.2,71.9]],["C",[21.9,71.9,19.5,70.5]],["C",[16.9,69.2,16.8,65.4]],["C",[16.8,61.5,19.4,59.8]],["C",[21.7,58.3,25,57.7]],["C",[28.3,57.1,31.5,56.7]],["C",[34.6,56.2,36.4,54.8]],["M",[18.4,44.3]],["C",[19.4,36.5,27.5,36.6]],["C",[31.3,36.6,33.8,37.7]],["C",[36.3,39,36.4,43.5]],["C",[36.3,47.5,31.5,48.5]],["C",[29.2,48.9,26.3,49.2]],["C",[23.4,49.6,20.1,50.2]],["C",[16.9,50.6,13.9,51.5]],["C",[10.9,52.3,8.4,54.1]],["C",[6,55.7,4.6,58.6]],["C",[3.1,61.4,3.1,65.9]],["C",[3.2,73.8,8.1,77.5]],["C",[12.8,81.4,20.1,81.4]],["C",[24.9,81.4,29.2,79.9]],["C",[33.7,78.4,37,75]],["C",[37.2,77.6,38,80]],["L",[52,80]],["C",[51,78.3,50.7,75.1]],["C",[50.2,72,50.2,68.5]],["L",[50.2,41.8]],["C",[50.2,37.1,48.2,34.2]],["C",[46.3,31.3,43,29.7]],["C",[39.8,28.1,35.9,27.5]],["C",[32.1,27.1,28.2,27.1]],["C",[19.5,27,12.6,30.7]],["C",[5.6,34.5,4.6,44.4]],["C",[11.5,44.3,18.4,44.3]],["M",[39.6,8.6]],["C",[39.8,12,35.6,12.1]],["C",[32.3,12,29.2,10.3]],["C",[27.8,9.6,26.3,9.1]],["C",[24.8,8.6,23,8.6]],["C",[19.8,8.6,17.8,9.6]],["C",[15.7,10.7,14.3,12.5]],["C",[13.1,14.2,12.2,16.3]],["C",[11.4,18.5,10.8,20.8]],["L",[16.7,20.8]],["C",[17.1,18.8,18.1,17.7]],["C",[18.9,16.6,20.8,16.6]],["C",[24.1,16.7,27.6,18.3]],["C",[29.4,18.9,31.4,19.4]],["C",[33.4,20,35.5,20]],["C",[38.5,20,40.3,18.8]],["C",[42.2,17.7,43.3,16]],["C",[44.5,14.2,45.2,12.2]],["C",[45.9,10.3,46.3,8.6]],["L",[39.6,8.6]]]);
		this.motifs.set("ä",[["M",[36.4,54.8]],["L",[36.4,60]],["C",[36.4,61.2,36.2,63.2]],["C",[35.9,65.2,35,67.2]],["C",[34,69.2,31.7,70.4]],["C",[29.3,71.9,25.2,71.9]],["C",[21.9,71.9,19.5,70.5]],["C",[16.9,69.2,16.8,65.4]],["C",[16.8,61.5,19.4,59.8]],["C",[21.7,58.3,25,57.7]],["C",[28.3,57.1,31.5,56.7]],["C",[34.6,56.2,36.4,54.8]],["M",[18.4,44.3]],["C",[19.4,36.5,27.5,36.6]],["C",[31.3,36.6,33.8,37.7]],["C",[36.3,39,36.4,43.5]],["C",[36.3,47.5,31.5,48.5]],["C",[29.2,48.9,26.3,49.2]],["C",[23.4,49.6,20.1,50.2]],["C",[16.9,50.6,13.9,51.5]],["C",[10.9,52.3,8.4,54.1]],["C",[6,55.7,4.6,58.6]],["C",[3.1,61.4,3.1,65.9]],["C",[3.2,73.8,8.1,77.5]],["C",[12.8,81.4,20.1,81.4]],["C",[24.9,81.4,29.2,79.9]],["C",[33.7,78.4,37,75]],["C",[37.2,77.6,38,80]],["L",[52,80]],["C",[51,78.3,50.7,75.1]],["C",[50.2,72,50.2,68.5]],["L",[50.2,41.8]],["C",[50.2,37.1,48.2,34.2]],["C",[46.3,31.3,43,29.7]],["C",[39.8,28.1,35.9,27.5]],["C",[32.1,27.1,28.2,27.1]],["C",[19.5,27,12.6,30.7]],["C",[5.6,34.5,4.6,44.4]],["C",[11.5,44.3,18.4,44.3]],["M",[32.1,20.3]],["L",[45.2,20.3]],["L",[45.2,8.6]],["L",[32.1,8.6]],["L",[32.1,20.3]],["M",[11.5,20.3]],["L",[24.6,20.3]],["L",[24.6,8.6]],["L",[11.5,8.6]],["L",[11.5,20.3]]]);
		this.motifs.set("å",[["M",[36.4,54.8]],["L",[36.4,60]],["C",[36.4,61.2,36.2,63.2]],["C",[35.9,65.2,35,67.2]],["C",[34,69.2,31.7,70.4]],["C",[29.3,71.9,25.2,71.9]],["C",[21.9,71.9,19.5,70.5]],["C",[16.9,69.2,16.8,65.4]],["C",[16.8,61.5,19.4,59.8]],["C",[21.7,58.3,25,57.7]],["C",[28.3,57.1,31.5,56.7]],["C",[34.6,56.2,36.4,54.8]],["M",[18.4,44.3]],["C",[19.4,36.5,27.5,36.6]],["C",[31.3,36.6,33.8,37.7]],["C",[36.3,39,36.4,43.5]],["C",[36.3,47.5,31.5,48.5]],["C",[29.2,48.9,26.3,49.2]],["C",[23.4,49.6,20.1,50.2]],["C",[16.9,50.6,13.9,51.5]],["C",[10.9,52.3,8.4,54.1]],["C",[6,55.7,4.6,58.6]],["C",[3.1,61.4,3.1,65.9]],["C",[3.2,73.8,8.1,77.5]],["C",[12.8,81.4,20.1,81.4]],["C",[24.9,81.4,29.2,79.9]],["C",[33.7,78.4,37,75]],["C",[37.2,77.6,38,80]],["L",[52,80]],["C",[51,78.3,50.7,75.1]],["C",[50.2,72,50.2,68.5]],["L",[50.2,41.8]],["C",[50.2,37.1,48.2,34.2]],["C",[46.3,31.3,43,29.7]],["C",[39.8,28.1,35.9,27.5]],["C",[32.1,27.1,28.2,27.1]],["C",[19.5,27,12.6,30.7]],["C",[5.6,34.5,4.6,44.4]],["C",[11.5,44.3,18.4,44.3]],["M",[22.6,14.4]],["C",[22.6,11.3,24.3,9.3]],["C",[26,7.4,28.7,7.4]],["C",[31.5,7.4,33.3,9.3]],["C",[34.9,11.3,34.9,14.4]],["C",[34.9,17.3,33.3,19.3]],["C",[31.5,21.4,28.7,21.4]],["C",[26,21.4,24.3,19.3]],["C",[22.6,17.3,22.6,14.4]],["M",[16.9,14.4]],["C",[16.9,19.5,20.5,22.9]],["C",[23.8,26.6,28.7,26.6]],["C",[33.7,26.6,37.2,22.9]],["C",[40.5,19.5,40.6,14.4]],["C",[40.5,9.1,37.2,5.7]],["C",[33.7,2.3,28.7,2.2]],["C",[23.8,2.3,20.5,5.7]],["C",[16.9,9.1,16.9,14.4]]]);
		this.motifs.set("æ",[["M",[37.3,54.8]],["L",[37.3,61.2]],["C",[37.3,64,36.4,66]],["C",[35.3,67.9,33.6,69.4]],["C",[32,70.7,29.9,71.3]],["C",[27.9,71.9,26,71.9]],["C",[22.8,72,20.2,70.4]],["C",[17.5,69.1,17.4,65.3]],["C",[17.5,61.5,20,60]],["C",[22.4,58.5,25.5,58]],["C",[28.8,57.4,32.1,56.9]],["C",[35.4,56.4,37.3,54.8]],["M",[85.1,57.6]],["C",[85.1,45.1,79.9,36.3]],["C",[74.5,27.3,62,27.1]],["C",[50.6,27.1,45.2,34.1]],["C",[42.5,30.1,37.9,28.5]],["C",[33.2,27.1,28.7,27.1]],["C",[19.6,27.1,12.7,30.9]],["C",[5.9,35,5,44.6]],["L",[18.8,44.6]],["C",[19.1,40.2,21.8,38.3]],["C",[24.4,36.6,28.4,36.6]],["C",[31.9,36.6,34.6,37.8]],["C",[37.2,39.2,37.3,43.2]],["C",[37.3,46.9,33.3,48]],["C",[29.2,49.3,20.5,50.4]],["C",[17.3,50.8,14.4,51.7]],["C",[12.9,52.1,11.6,52.7]],["C",[10.2,53.4,9,54.3]],["C",[6.5,55.9,5.2,58.8]],["C",[3.7,61.7,3.7,66.2]],["C",[3.8,74.6,9.5,78.1]],["C",[15,81.6,22.4,81.6]],["C",[28.2,81.6,33.7,79.5]],["C",[39.2,77.4,42.8,72.7]],["C",[44.4,75,46.6,76.6]],["C",[48.6,78.4,51.1,79.5]],["C",[56.1,81.6,61.5,81.6]],["C",[69.9,81.5,76.2,76.8]],["C",[82.5,72.2,84.6,63.8]],["L",[71.2,63.8]],["C",[70.1,71.9,61.2,72]],["C",[58.5,72,56.3,70.6]],["C",[54,69.4,52.4,67.3]],["C",[49.2,63,49.3,57.6]],["L",[85.1,57.6]],["M",[49.3,48.6]],["C",[49.5,43.7,52.4,40.2]],["C",[55.2,36.7,60.5,36.6]],["C",[65.8,36.7,68.6,40.2]],["C",[71.4,43.7,71.3,48.6]],["L",[49.3,48.6]]]);
		this.motifs.set("ç",[["M",[52.8,46.7]],["C",[52,36.7,45.2,31.9]],["C",[38.5,27.1,29.2,27.1]],["C",[16.9,27.2,10.4,34.9]],["C",[3.7,42.6,3.7,55]],["C",[3.8,65.7,9.8,72.9]],["C",[15.6,79.9,25.6,81.1]],["L",[20.7,88.3]],["L",[22.8,90.7]],["C",[24.5,90,26.7,90]],["C",[30.3,89.8,30.5,93.2]],["C",[30.4,96.7,26.6,96.7]],["C",[24.2,96.6,22.2,96]],["C",[20.1,95.4,18.5,94.8]],["C",[17.4,97.2,16.5,99.6]],["C",[19,100.6,21.7,101.1]],["C",[24.1,101.7,28.5,101.8]],["C",[33,101.8,36.3,99.7]],["C",[39.7,97.5,39.8,91.9]],["C",[39.7,88.1,37.1,86.4]],["C",[34.4,84.8,30.9,84.8]],["C",[28.5,84.8,27.6,85.4]],["L",[27.4,85.4]],["C",[28.8,83.4,30.1,81.3]],["C",[49.8,80.4,53.1,60.3]],["L",[39.8,60.3]],["C",[38.4,70.5,28.8,70.8]],["C",[25.6,70.8,23.5,69.2]],["C",[21.4,67.6,20,65.3]],["C",[17.3,60.3,17.4,54.5]],["C",[17.3,48.5,20,43.2]],["C",[22.7,38,29.1,37.8]],["C",[37.8,37.9,39.3,46.7]],["L",[52.8,46.7]]]);
		this.motifs.set("è",[["M",[52.7,57.6]],["C",[53.2,51.5,51.9,46]],["C",[51.1,43.2,50.1,40.8]],["C",[48.9,38.4,47.4,36.3]],["C",[41.3,27.3,28.4,27.1]],["C",[16.8,27.2,10,34.8]],["C",[2.9,42.5,2.8,54.3]],["C",[2.9,66.4,9.8,73.8]],["C",[16.5,81.3,28.4,81.4]],["C",[45.8,81.6,51.9,64]],["L",[39.7,64]],["C",[39,66.6,36.1,68.5]],["C",[33.1,70.8,28.9,70.8]],["C",[17.2,70.9,16.6,57.6]],["L",[52.7,57.6]],["M",[16.6,48.6]],["C",[16.6,45.3,19,41.6]],["C",[20.3,39.9,22.7,38.8]],["C",[24.8,37.8,28,37.8]],["C",[33,37.8,35.6,40.4]],["C",[38.2,43.2,38.9,48.6]],["L",[16.6,48.6]],["M",[26.3,21.8]],["L",[35.9,21.8]],["C",[31.2,14.8,26.6,7.7]],["L",[11.4,7.7]],["C",[18.8,14.8,26.3,21.8]]]);
		this.motifs.set("é",[["M",[52.7,57.6]],["C",[53.2,51.5,51.9,46]],["C",[51.1,43.2,50.1,40.8]],["C",[48.9,38.4,47.4,36.3]],["C",[41.3,27.3,28.4,27.1]],["C",[16.8,27.2,10,34.8]],["C",[2.9,42.5,2.8,54.3]],["C",[2.9,66.4,9.8,73.8]],["C",[16.5,81.3,28.4,81.4]],["C",[45.8,81.6,51.9,64]],["L",[39.7,64]],["C",[39,66.6,36.1,68.5]],["C",[33.1,70.8,28.9,70.8]],["C",[17.2,70.9,16.6,57.6]],["L",[52.7,57.6]],["M",[16.6,48.6]],["C",[16.6,45.3,19,41.6]],["C",[20.3,39.9,22.7,38.8]],["C",[24.8,37.8,28,37.8]],["C",[33,37.8,35.6,40.4]],["C",[38.2,43.2,38.9,48.6]],["L",[16.6,48.6]],["M",[46.1,7.7]],["L",[30.9,7.7]],["L",[21.6,21.8]],["L",[31.2,21.8]],["L",[46.1,7.7]]]);
		this.motifs.set("ê",[["M",[52.7,57.6]],["C",[53.2,51.5,51.9,46]],["C",[51.1,43.2,50.1,40.8]],["C",[48.9,38.4,47.4,36.3]],["C",[41.3,27.3,28.4,27.1]],["C",[16.8,27.2,10,34.8]],["C",[2.9,42.5,2.8,54.3]],["C",[2.9,66.4,9.8,73.8]],["C",[16.5,81.3,28.4,81.4]],["C",[45.8,81.6,51.9,64]],["L",[39.7,64]],["C",[39,66.6,36.1,68.5]],["C",[33.1,70.8,28.9,70.8]],["C",[17.2,70.9,16.6,57.6]],["L",[52.7,57.6]],["M",[16.6,48.6]],["C",[16.6,45.3,19,41.6]],["C",[20.3,39.9,22.7,38.8]],["C",[24.8,37.8,28,37.8]],["C",[33,37.8,35.6,40.4]],["C",[38.2,43.2,38.9,48.6]],["L",[16.6,48.6]],["M",[11.4,21.8]],["L",[22.2,21.8]],["L",[28.6,13.8]],["C",[31.7,17.8,34.8,21.8]],["L",[46.5,21.8]],["L",[35.5,7.7]],["L",[22.5,7.7]],["L",[11.4,21.8]]]);
		this.motifs.set("ë",[["M",[52.7,57.6]],["C",[53.2,51.5,51.9,46]],["C",[51.1,43.2,50.1,40.8]],["C",[48.9,38.4,47.4,36.3]],["C",[41.3,27.3,28.4,27.1]],["C",[16.8,27.2,10,34.8]],["C",[2.9,42.5,2.8,54.3]],["C",[2.9,66.4,9.8,73.8]],["C",[16.5,81.3,28.4,81.4]],["C",[45.8,81.6,51.9,64]],["L",[39.7,64]],["C",[39,66.6,36.1,68.5]],["C",[33.1,70.8,28.9,70.8]],["C",[17.2,70.9,16.6,57.6]],["L",[52.7,57.6]],["M",[16.6,48.6]],["C",[16.6,45.3,19,41.6]],["C",[20.3,39.9,22.7,38.8]],["C",[24.8,37.8,28,37.8]],["C",[33,37.8,35.6,40.4]],["C",[38.2,43.2,38.9,48.6]],["L",[16.6,48.6]],["M",[32,20.3]],["L",[45.1,20.3]],["L",[45.1,8.6]],["L",[32,8.6]],["L",[32,20.3]],["M",[11.4,20.3]],["L",[24.5,20.3]],["L",[24.5,8.6]],["L",[11.4,8.6]],["L",[11.4,20.3]]]);
		this.motifs.set("ì",[["M",[5.6,80]],["L",[19.4,80]],["L",[19.4,28.3]],["L",[5.6,28.3]],["L",[5.6,80]],["M",[10.1,21.8]],["L",[19.7,21.8]],["C",[15,14.8,10.4,7.7]],["L",[-4.8,7.7]],["L",[10.1,21.8]]]);
		this.motifs.set("í",[["M",[5.6,80]],["L",[19.4,80]],["L",[19.4,28.3]],["L",[5.6,28.3]],["L",[5.6,80]],["M",[29.7,7.7]],["L",[14.5,7.7]],["L",[5.2,21.8]],["L",[14.8,21.8]],["L",[29.7,7.7]]]);
		this.motifs.set("î",[["M",[5.6,80]],["L",[19.4,80]],["L",[19.4,28.3]],["L",[5.6,28.3]],["L",[5.6,80]],["M",[-4.7,21.8]],["L",[6.1,21.8]],["L",[12.5,13.8]],["C",[15.6,17.8,18.7,21.8]],["L",[30.4,21.8]],["L",[19.3,7.7]],["L",[6.3,7.7]],["L",[-4.7,21.8]]]);
		this.motifs.set("ï",[["M",[5.6,80]],["L",[19.4,80]],["L",[19.4,28.3]],["L",[5.6,28.3]],["L",[5.6,80]],["M",[15.8,20.3]],["L",[28.9,20.3]],["L",[28.9,8.6]],["L",[15.8,8.6]],["L",[15.8,20.3]],["M",[-4.8,20.3]],["L",[8.3,20.3]],["L",[8.3,8.6]],["L",[-4.8,8.6]],["L",[-4.8,20.3]]]);
		this.motifs.set("ð",[["M",[29.5,70.8]],["C",[22.7,70.7,20,65.5]],["C",[17.3,60.7,17.4,54.2]],["C",[17.3,48.4,20.1,43.8]],["C",[22.8,39.1,29.4,38.9]],["C",[36,39,39,43.7]],["C",[41.7,48.3,41.7,54.2]],["C",[41.7,60.7,39.2,65.5]],["C",[36.6,70.7,29.5,70.8]],["M",[12.8,20.7]],["L",[18.5,26.3]],["L",[29.3,20.7]],["C",[31.9,22.8,34.7,26]],["C",[37.4,29.2,39.2,33.4]],["L",[39,33.4]],["C",[35.6,31,32.2,30.2]],["C",[28.9,29.4,25.9,29.4]],["C",[14.4,29.7,9.1,37.7]],["C",[3.7,45.5,3.7,55.3]],["C",[3.8,66.9,10.8,74]],["C",[17.6,81.3,29.6,81.4]],["C",[41.6,81.2,48.5,73.1]],["C",[55.4,65.2,55.5,52.7]],["C",[55.4,30.1,39.6,15.4]],["C",[45.1,12.6,50.6,9.7]],["L",[45.5,3.8]],["C",[39.6,7,33.6,10]],["C",[29.2,6.4,24,3.4]],["L",[15,10.3]],["C",[19.1,12.3,23.2,15.3]],["L",[12.8,20.7]]]);
		this.motifs.set("ñ",[["M",[5.2,80]],["L",[19,80]],["L",[19,53]],["C",[18.8,38.1,29.6,38.3]],["C",[38.6,38.3,38.4,50.9]],["L",[38.4,80]],["L",[52.2,80]],["L",[52.2,48.3]],["C",[52.3,38.5,48.6,32.9]],["C",[44.6,27.2,33.9,27.1]],["C",[29.4,27.1,25.5,29]],["C",[21.3,31.1,18.6,35.5]],["L",[18.3,35.5]],["L",[18.3,28.3]],["L",[5.2,28.3]],["L",[5.2,80]],["M",[40.5,8.6]],["C",[40.7,12,36.5,12.1]],["C",[33.2,12,30.1,10.3]],["C",[28.7,9.6,27.2,9.1]],["C",[25.6,8.6,23.9,8.6]],["C",[20.7,8.6,18.7,9.6]],["C",[16.6,10.7,15.2,12.5]],["C",[14,14.2,13,16.3]],["C",[12.3,18.5,11.7,20.8]],["L",[17.6,20.8]],["C",[18,18.8,18.9,17.7]],["C",[19.8,16.6,21.6,16.6]],["C",[25,16.7,28.5,18.3]],["C",[30.3,18.9,32.3,19.4]],["C",[34.3,20,36.4,20]],["C",[39.4,20,41.2,18.8]],["C",[43.1,17.7,44.2,16]],["C",[45.4,14.2,46,12.2]],["C",[46.8,10.3,47.2,8.6]],["L",[40.5,8.6]]]);
		this.motifs.set("ò",[["M",[3.7,54.3]],["C",[3.8,66.8,10.8,73.9]],["C",[17.6,81.3,29.6,81.4]],["C",[41.6,81.3,48.5,73.9]],["C",[55.4,66.8,55.5,54.3]],["C",[55.4,41.8,48.5,34.4]],["C",[41.6,27.2,29.6,27.1]],["C",[17.6,27.2,10.8,34.4]],["C",[3.8,41.8,3.7,54.3]],["M",[17.4,54.3]],["C",[17.3,47.7,20,42.8]],["C",[22.7,37.9,29.5,37.8]],["C",[36.6,37.9,39.2,42.8]],["C",[41.7,47.7,41.7,54.3]],["C",[41.7,60.7,39.2,65.5]],["C",[36.6,70.7,29.5,70.8]],["C",[22.7,70.7,20,65.5]],["C",[17.3,60.7,17.4,54.3]],["M",[28.1,21.8]],["L",[37.7,21.8]],["C",[33,14.8,28.4,7.7]],["L",[13.2,7.7]],["L",[28.1,21.8]]]);
		this.motifs.set("ó",[["M",[3.7,54.3]],["C",[3.8,66.8,10.8,73.9]],["C",[17.6,81.3,29.6,81.4]],["C",[41.6,81.3,48.5,73.9]],["C",[55.4,66.8,55.5,54.3]],["C",[55.4,41.8,48.5,34.4]],["C",[41.6,27.2,29.6,27.1]],["C",[17.6,27.2,10.8,34.4]],["C",[3.8,41.8,3.7,54.3]],["M",[17.4,54.3]],["C",[17.3,47.7,20,42.8]],["C",[22.7,37.9,29.5,37.8]],["C",[36.6,37.9,39.2,42.8]],["C",[41.7,47.7,41.7,54.3]],["C",[41.7,60.7,39.2,65.5]],["C",[36.6,70.7,29.5,70.8]],["C",[22.7,70.7,20,65.5]],["C",[17.3,60.7,17.4,54.3]],["M",[47.9,7.7]],["L",[32.7,7.7]],["L",[23.4,21.8]],["L",[33,21.8]],["L",[47.9,7.7]]]);
		this.motifs.set("ô",[["M",[3.7,54.3]],["C",[3.8,66.8,10.8,73.9]],["C",[17.6,81.3,29.6,81.4]],["C",[41.6,81.3,48.5,73.9]],["C",[55.4,66.8,55.5,54.3]],["C",[55.4,41.8,48.5,34.4]],["C",[41.6,27.2,29.6,27.1]],["C",[17.6,27.2,10.8,34.4]],["C",[3.8,41.8,3.7,54.3]],["M",[17.4,54.3]],["C",[17.3,47.7,20,42.8]],["C",[22.7,37.9,29.5,37.8]],["C",[36.6,37.9,39.2,42.8]],["C",[41.7,47.7,41.7,54.3]],["C",[41.7,60.7,39.2,65.5]],["C",[36.6,70.7,29.5,70.8]],["C",[22.7,70.7,20,65.5]],["C",[17.3,60.7,17.4,54.3]],["M",[13.2,21.8]],["L",[24,21.8]],["L",[30.4,13.8]],["C",[33.5,17.8,36.6,21.8]],["L",[48.3,21.8]],["L",[37.3,7.7]],["L",[24.3,7.7]],["L",[13.2,21.8]]]);
		this.motifs.set("õ",[["M",[3.7,54.3]],["C",[3.8,66.8,10.8,73.9]],["C",[17.6,81.3,29.6,81.4]],["C",[41.6,81.3,48.5,73.9]],["C",[55.4,66.8,55.5,54.3]],["C",[55.4,41.8,48.5,34.4]],["C",[41.6,27.2,29.6,27.1]],["C",[17.6,27.2,10.8,34.4]],["C",[3.8,41.8,3.7,54.3]],["M",[17.4,54.3]],["C",[17.3,47.7,20,42.8]],["C",[22.7,37.9,29.5,37.8]],["C",[36.6,37.9,39.2,42.8]],["C",[41.7,47.7,41.7,54.3]],["C",[41.7,60.7,39.2,65.5]],["C",[36.6,70.7,29.5,70.8]],["C",[22.7,70.7,20,65.5]],["C",[17.3,60.7,17.4,54.3]],["M",[41.6,8.6]],["C",[41.7,12,37.5,12.1]],["C",[34.2,12,31.2,10.3]],["C",[29.7,9.6,28.2,9.1]],["C",[26.7,8.6,24.9,8.6]],["C",[21.7,8.6,19.7,9.6]],["C",[17.6,10.7,16.2,12.5]],["C",[15,14.2,14.1,16.3]],["C",[13.3,18.5,12.7,20.8]],["L",[18.6,20.8]],["C",[19,18.8,20,17.7]],["C",[20.8,16.6,22.7,16.6]],["C",[26,16.7,29.5,18.3]],["C",[31.3,18.9,33.3,19.4]],["C",[35.3,20,37.4,20]],["C",[40.4,20,42.2,18.8]],["C",[44.1,17.7,45.2,16]],["C",[46.4,14.2,47.1,12.2]],["C",[47.9,10.3,48.2,8.6]],["L",[41.6,8.6]]]);
		this.motifs.set("ö",[["M",[3.7,54.3]],["C",[3.8,66.8,10.8,73.9]],["C",[17.6,81.3,29.6,81.4]],["C",[41.6,81.3,48.5,73.9]],["C",[55.4,66.8,55.5,54.3]],["C",[55.4,41.8,48.5,34.4]],["C",[41.6,27.2,29.6,27.1]],["C",[17.6,27.2,10.8,34.4]],["C",[3.8,41.8,3.7,54.3]],["M",[17.4,54.3]],["C",[17.3,47.7,20,42.8]],["C",[22.7,37.9,29.5,37.8]],["C",[36.6,37.9,39.2,42.8]],["C",[41.7,47.7,41.7,54.3]],["C",[41.7,60.7,39.2,65.5]],["C",[36.6,70.7,29.5,70.8]],["C",[22.7,70.7,20,65.5]],["C",[17.3,60.7,17.4,54.3]],["M",[34,20.3]],["L",[47.1,20.3]],["L",[47.1,8.6]],["L",[34,8.6]],["L",[34,20.3]],["M",[13.4,20.3]],["L",[26.5,20.3]],["L",[26.5,8.6]],["L",[13.4,8.6]],["L",[13.4,20.3]]]);
		this.motifs.set("÷",[["M",[4.6,60]],["L",[53.5,60]],["L",[53.5,49.4]],["L",[4.6,49.4]],["L",[4.6,60]],["M",[20.9,34]],["C",[20.9,37.5,23.5,39.9]],["C",[25.9,42.4,29.2,42.4]],["C",[32.5,42.3,35,39.7]],["C",[37.2,37.3,37.3,34]],["C",[37.2,30.4,35,27.9]],["C",[32.5,25.6,29.2,25.5]],["C",[25.8,25.6,23.5,27.9]],["C",[20.9,30.3,20.9,34]],["M",[20.9,75.5]],["C",[20.9,79,23.5,81.4]],["C",[25.9,83.9,29.2,84]],["C",[32.5,83.9,35,81.3]],["C",[37.2,78.8,37.3,75.5]],["C",[37.2,72,35,69.5]],["C",[32.5,67.2,29.2,67.1]],["C",[25.8,67.2,23.5,69.5]],["C",[20.9,71.8,20.9,75.5]]]);
		this.motifs.set("ø",[["M",[18.8,62.9]],["C",[17.3,59,17.4,54.3]],["C",[17.3,47.7,20,42.8]],["C",[22.7,37.9,29.5,37.8]],["C",[34.9,37.9,37.6,40.9]],["L",[18.8,62.9]],["M",[40.2,45.2]],["C",[41.7,49.4,41.7,54.3]],["C",[41.7,60.7,39.2,65.5]],["C",[36.6,70.7,29.5,70.8]],["C",[24,70.8,21.3,67.4]],["L",[40.2,45.2]],["M",[4.1,79.9]],["L",[7.8,83.1]],["C",[10.6,79.8,13.6,76.4]],["C",[20.1,81.4,29.5,81.4]],["C",[41.6,81.3,48.5,73.9]],["C",[55.4,66.8,55.5,54.3]],["C",[55.4,42.3,48.7,35]],["C",[51.4,32,54.1,29]],["L",[50.5,25.8]],["L",[45.3,31.9]],["C",[38.9,27.2,29.5,27.1]],["C",[17.6,27.2,10.8,34.5]],["C",[3.8,41.8,3.7,54.3]],["C",[3.7,65.9,10.1,73.2]],["L",[4.1,79.9]]]);
		this.motifs.set("ù",[["M",[52.2,28.3]],["L",[38.4,28.3]],["L",[38.4,55.4]],["C",[38.5,70.6,27.8,70.3]],["C",[18.8,70.3,19,57.5]],["L",[19,28.3]],["L",[5.2,28.3]],["L",[5.2,60.1]],["C",[5.1,69.8,9,75.5]],["C",[12.8,81.3,23.5,81.4]],["C",[28,81.4,32.1,79.2]],["C",[36.1,77.1,38.8,72.8]],["L",[39.1,72.8]],["L",[39.1,80]],["L",[52.2,80]],["L",[52.2,28.3]],["M",[27.1,21.8]],["L",[36.7,21.8]],["C",[32,14.8,27.3,7.7]],["L",[12.2,7.7]],["L",[27.1,21.8]]]);
		this.motifs.set("ú",[["M",[52.2,28.3]],["L",[38.4,28.3]],["L",[38.4,55.4]],["C",[38.5,70.6,27.8,70.3]],["C",[18.8,70.3,19,57.5]],["L",[19,28.3]],["L",[5.2,28.3]],["L",[5.2,60.1]],["C",[5.1,69.8,9,75.5]],["C",[12.8,81.3,23.5,81.4]],["C",[28,81.4,32.1,79.2]],["C",[36.1,77.1,38.8,72.8]],["L",[39.1,72.8]],["L",[39.1,80]],["L",[52.2,80]],["L",[52.2,28.3]],["M",[46.8,7.7]],["L",[31.6,7.7]],["L",[22.3,21.8]],["L",[31.9,21.8]],["L",[46.8,7.7]]]);
		this.motifs.set("û",[["M",[52.2,28.3]],["L",[38.4,28.3]],["L",[38.4,55.4]],["C",[38.5,70.6,27.8,70.3]],["C",[18.8,70.3,19,57.5]],["L",[19,28.3]],["L",[5.2,28.3]],["L",[5.2,60.1]],["C",[5.1,69.8,9,75.5]],["C",[12.8,81.3,23.5,81.4]],["C",[28,81.4,32.1,79.2]],["C",[36.1,77.1,38.8,72.8]],["L",[39.1,72.8]],["L",[39.1,80]],["L",[52.2,80]],["L",[52.2,28.3]],["M",[12.2,21.8]],["L",[23,21.8]],["L",[29.4,13.8]],["C",[32.5,17.8,35.6,21.8]],["L",[47.3,21.8]],["L",[36.3,7.7]],["L",[23.3,7.7]],["L",[12.2,21.8]]]);
		this.motifs.set("ü",[["M",[52.2,28.3]],["L",[38.4,28.3]],["L",[38.4,55.4]],["C",[38.5,70.6,27.8,70.3]],["C",[18.8,70.3,19,57.5]],["L",[19,28.3]],["L",[5.2,28.3]],["L",[5.2,60.1]],["C",[5.1,69.8,9,75.5]],["C",[12.8,81.3,23.5,81.4]],["C",[28,81.4,32.1,79.2]],["C",[36.1,77.1,38.8,72.8]],["L",[39.1,72.8]],["L",[39.1,80]],["L",[52.2,80]],["L",[52.2,28.3]],["M",[32.8,20.3]],["L",[45.8,20.3]],["L",[45.8,8.6]],["L",[32.8,8.6]],["L",[32.8,20.3]],["M",[12.2,20.3]],["L",[25.2,20.3]],["L",[25.2,8.6]],["L",[12.2,8.6]],["L",[12.2,20.3]]]);
		this.motifs.set("ý",[["M",[50.9,28.3]],["L",[36.6,28.3]],["L",[25.7,63.7]],["L",[25.5,63.7]],["L",[14.2,28.3]],["L",[-0.6,28.3]],["L",[17.4,76.8]],["C",[18.7,80,17.4,82.9]],["C",[16.3,85.9,12.5,86.5]],["C",[8.3,86.5,4.2,86]],["L",[4.2,97.7]],["C",[8.5,98.2,12.7,98.2]],["C",[26.2,98.4,29.9,86.5]],["C",[40.4,57.4,50.9,28.3]],["M",[43.4,7.7]],["L",[28.1,7.7]],["L",[18.8,21.8]],["L",[28.4,21.8]],["L",[43.4,7.7]]]);
		this.motifs.set("þ",[["M",[5.2,98.2]],["L",[19,98.2]],["L",[19,73.7]],["L",[19.2,73.7]],["C",[21.8,77.3,25.8,79.3]],["C",[29.7,81.4,34.2,81.4]],["C",[45.2,81.2,50.8,73.2]],["C",[56.2,65.4,56.2,54.8]],["C",[56.2,43.3,50.8,35.4]],["C",[45.1,27.3,33.4,27.1]],["C",[29.2,27.1,25.6,29]],["C",[21.7,30.9,19.2,35.1]],["L",[19,35.1]],["L",[19,8.6]],["L",[5.2,8.6]],["L",[5.2,98.2]],["M",[42.4,54.4]],["C",[42.4,57.5,41.9,60.4]],["C",[41.4,63.4,39.9,65.6]],["C",[37.3,70.7,30.5,70.8]],["C",[24,70.7,21.2,65.6]],["C",[18.4,60.9,18.5,54.4]],["C",[18.4,47.8,21.1,42.8]],["C",[23.9,37.9,30.4,37.8]],["C",[37,38,39.8,42.9]],["C",[42.4,48,42.4,54.4]]]);
		this.motifs.set("ÿ",[["M",[50.9,28.3]],["L",[36.6,28.3]],["L",[25.7,63.7]],["L",[25.5,63.7]],["L",[14.2,28.3]],["L",[-0.6,28.3]],["L",[17.4,76.8]],["C",[18.7,80,17.4,82.9]],["C",[16.3,85.9,12.5,86.5]],["C",[8.3,86.5,4.2,86]],["L",[4.2,97.7]],["C",[8.5,98.2,12.7,98.2]],["C",[26.2,98.4,29.9,86.5]],["C",[40.4,57.4,50.9,28.3]],["M",[29.3,20.3]],["L",[42.4,20.3]],["L",[42.4,8.6]],["L",[29.3,8.6]],["L",[29.3,20.3]],["M",[8.7,20.3]],["L",[21.8,20.3]],["L",[21.8,8.6]],["L",[8.7,8.6]],["L",[8.7,20.3]]]);
		this.motifs.set("Œ",[["M",[52.7,80]],["L",[101.8,80]],["L",[101.8,66.8]],["L",[66.8,66.8]],["L",[66.8,49.3]],["L",[98.3,49.3]],["L",[98.3,37.1]],["L",[66.8,37.1]],["L",[66.8,21.8]],["L",[101.2,21.8]],["L",[101.2,8.6]],["L",[52.6,8.6]],["L",[52.6,13.7]],["L",[52.4,13.7]],["C",[49.5,10,45.1,8.4]],["C",[40.6,6.9,36,6.9]],["C",[20.5,7.2,12.1,18.3]],["C",[3.4,29.3,3.4,44.7]],["C",[3.4,60,12,70.6]],["C",[20.3,81.4,35.7,81.7]],["C",[40.4,81.6,44.9,79.8]],["C",[49.4,78,52.5,74.6]],["L",[52.7,74.6]],["L",[52.7,80]],["M",[52.1,52.3]],["C",[52,59.5,48.1,63.9]],["C",[44,68.5,37,68.5]],["C",[27.5,68.3,23.2,60.9]],["C",[19,53.6,19.1,44.6]],["C",[19,35.1,23.2,27.8]],["C",[27.5,20.3,37.3,20.1]],["C",[43.9,20.2,48,24.2]],["C",[52,28.3,52.1,35.2]],["L",[52.1,52.3]]]);
		this.motifs.set("œ",[["M",[51.2,48.6]],["C",[51.5,43.9,54.2,40.8]],["C",[57,37.9,62.1,37.8]],["C",[72.9,38.1,73.1,48.6]],["L",[51.2,48.6]],["M",[28.1,70.8]],["C",[25,70.8,23,69.2]],["C",[21,67.6,19.8,65.3]],["C",[17.3,60.1,17.4,54.5]],["C",[17.3,48.2,19.8,43.1]],["C",[22.3,38,28.4,37.8]],["C",[31.9,37.8,34,39.2]],["C",[36.2,40.7,37.3,43.2]],["C",[39.3,48.5,39.2,54.1]],["C",[39.2,56.9,38.8,59.8]],["C",[38.4,62.7,37.2,65.2]],["C",[36.1,67.5,33.9,69.2]],["C",[31.6,70.8,28.1,70.8]],["M",[86.9,57.6]],["C",[87,44.9,81.4,36.2]],["C",[75.5,27.3,62.3,27.1]],["C",[57.6,27.1,53,29.1]],["C",[48.3,31.2,45.5,35.3]],["C",[42.7,30.8,38.1,28.9]],["C",[33.3,27.1,28.3,27.1]],["C",[16.9,27.2,10.4,34.7]],["C",[3.7,42.4,3.7,54]],["C",[3.7,65.3,9.7,73.2]],["C",[15.6,81.2,27.2,81.4]],["C",[32.4,81.4,37.4,79.3]],["C",[42.2,77.2,44.9,72.6]],["C",[47.9,77.3,52.9,79.4]],["C",[57.8,81.4,63,81.4]],["C",[80.9,81.1,86.5,63.6]],["L",[73.1,63.6]],["C",[70.6,70.8,63.1,70.8]],["C",[57.1,70.7,54.2,66.9]],["C",[51.2,63.2,51.2,57.6]],["L",[86.9,57.6]]]);
		this.motifs.set("Š",[["M",[2.2,56.3]],["C",[2.5,69.4,11.3,75.5]],["C",[19.8,81.7,31.8,81.7]],["C",[46,81.6,53.3,75.1]],["C",[60.6,68.7,60.6,58.8]],["C",[60.5,52.7,58.3,48.8]],["C",[55.8,44.9,52.3,42.7]],["C",[48.8,40.4,45.5,39.4]],["C",[42.1,38.4,40,38]],["C",[27.4,34.8,23.2,32.8]],["C",[21.1,31.7,20.2,30.4]],["C",[19.4,29.1,19.4,27.2]],["C",[19.5,22.7,22.9,20.8]],["C",[26,19.1,29.8,19.1]],["C",[35.4,19,39.3,21.2]],["C",[43.1,23.6,43.5,29.9]],["L",[58.2,29.9]],["C",[58,17.5,49.9,12.1]],["C",[41.8,6.9,30.5,6.9]],["C",[20.7,6.9,12.9,12.2]],["C",[4.8,17.6,4.6,28.5]],["C",[4.6,33.4,6.5,36.8]],["C",[8.3,40.2,11.2,42.5]],["C",[14.2,44.7,17.9,46.2]],["C",[21.5,47.8,25.3,48.8]],["C",[33.3,50.6,39.5,52.8]],["C",[42.5,53.9,44.2,55.7]],["C",[45.9,57.6,45.9,60.6]],["C",[45.9,63.3,44.6,64.9]],["C",[43.3,66.7,41.2,67.7]],["C",[39.2,68.7,36.8,69.1]],["C",[34.5,69.5,32.4,69.5]],["C",[26,69.5,21.6,66.4]],["C",[17,63.3,16.9,56.3]],["L",[2.2,56.3]],["M",[49.5,-12]],["L",[38.8,-12]],["L",[32.5,-3.9]],["L",[26.3,-12]],["L",[15.5,-12]],["L",[26.2,2.2]],["L",[38.8,2.2]],["C",[44.1,-4.9,49.5,-12]]]);
		this.motifs.set("š",[["M",[2.7,63.3]],["C",[3.5,73.3,10.4,77.3]],["C",[17.3,81.4,26.4,81.4]],["C",[35.3,81.4,42.2,77.5]],["C",[49.1,73.5,49.3,63.5]],["C",[49.3,59.9,48,57.4]],["C",[46.7,54.9,44.4,53.3]],["C",[42.2,51.6,39.4,50.7]],["C",[36.5,49.6,33.3,49]],["L",[27.7,47.5]],["C",[24.9,46.9,22.7,46.3]],["C",[20.4,45.5,19,44.4]],["C",[17.7,43.1,17.7,41.3]],["C",[17.8,38.3,20.4,37.4]],["C",[22.9,36.6,25.4,36.6]],["C",[29.2,36.6,31.9,37.9]],["C",[34.4,39.5,34.8,43.6]],["L",[47.9,43.6]],["C",[46.9,34.2,40.6,30.5]],["C",[34.3,27,25.8,27.1]],["C",[21.8,27.1,17.9,27.8]],["C",[14,28.5,10.9,30.4]],["C",[7.9,32.2,6,35.5]],["C",[4,38.7,4,43.7]],["C",[4,46.9,5.4,49.2]],["C",[6.7,51.6,9,53.2]],["C",[11.2,54.7,14.2,55.7]],["C",[15.6,56.2,17,56.5]],["C",[18.4,56.9,19.9,57.4]],["C",[27.3,58.9,31.5,60.5]],["C",[35.5,62.2,35.5,65.4]],["C",[35.4,69.1,32.5,70.4]],["C",[29.6,72,26.4,71.9]],["C",[22.2,71.9,19.1,69.8]],["C",[16.1,67.8,15.8,63.3]],["L",[2.7,63.3]],["M",[43.7,7.7]],["L",[33,7.7]],["L",[26.7,15.8]],["L",[20.5,7.7]],["L",[9.7,7.7]],["L",[20.4,21.8]],["L",[33,21.8]],["L",[43.7,7.7]]]);
		this.motifs.set("Ÿ",[["M",[24.3,80]],["L",[40,80]],["L",[40,52.6]],["L",[65.7,8.6]],["L",[48.6,8.6]],["L",[32.4,36.8]],["L",[16.1,8.6]],["L",[-1.1,8.6]],["C",[11.6,30.4,24.3,52.2]],["L",[24.3,80]],["M",[36.9,0.7]],["L",[50,0.7]],["L",[50,-11.1]],["L",[36.9,-11.1]],["L",[36.9,0.7]],["M",[16.3,0.7]],["L",[29.3,0.7]],["L",[29.3,-11.1]],["L",[16.3,-11.1]],["L",[16.3,0.7]]]);
		this.motifs.set("ƒ",[["M",[-0.5,96.7]],["C",[3.3,96.9,6.6,96.9]],["C",[17.1,96.9,21.3,92.1]],["C",[25.5,87.2,26.9,77.3]],["L",[32.4,46.3]],["L",[42.1,46.3]],["L",[43.7,36.8]],["L",[34.1,36.8]],["C",[35.4,30.3,36.5,23.8]],["C",[37,20.5,38.7,19]],["C",[40.2,17.5,43.9,17.5]],["C",[45.8,17.5,47.8,18.2]],["C",[48.6,12.9,49.5,7.6]],["C",[45.9,6.9,42.3,6.9]],["C",[33,6.9,28.5,10.7]],["C",[23.8,14.8,22.3,24.1]],["C",[21.1,30.5,20,36.8]],["L",[11.2,36.8]],["L",[9.4,46.3]],["L",[18.3,46.3]],["C",[15.2,62.8,12.2,79.2]],["C",[11.7,82.7,10.4,84.5]],["C",[8.9,86.3,5.2,86.3]],["C",[3.3,86.3,1.4,86]],["L",[-0.5,96.7]]]);
		this.motifs.set("ˆ",[["M",[-4.6,21.8]],["L",[6.2,21.8]],["L",[12.6,13.8]],["C",[15.7,17.8,18.8,21.8]],["L",[30.5,21.8]],["L",[19.5,7.7]],["L",[6.5,7.7]],["L",[-4.6,21.8]]]);
		this.motifs.set("˜",[["M",[23.6,8.6]],["C",[23.8,12,19.6,12.1]],["C",[16.3,12,13.2,10.3]],["C",[11.8,9.6,10.3,9.1]],["C",[8.7,8.6,7,8.6]],["C",[3.8,8.6,1.8,9.6]],["C",[-0.3,10.7,-1.7,12.5]],["C",[-2.9,14.2,-3.9,16.3]],["C",[-4.6,18.5,-5.2,20.8]],["L",[0.7,20.8]],["C",[1.1,18.8,2.1,17.7]],["C",[2.9,16.6,4.7,16.6]],["C",[8.1,16.7,11.6,18.3]],["C",[13.4,18.9,15.4,19.4]],["C",[17.4,20,19.5,20]],["C",[22.5,20,24.3,18.8]],["C",[26.2,17.7,27.3,16]],["C",[28.5,14.2,29.2,12.2]],["C",[29.9,10.3,30.3,8.6]],["L",[23.6,8.6]]]);
		this.motifs.set("μ",[["M",[5,80]],["L",[5,28.8]],["L",[45,28.8]],["L",[45,80]],["L",[5,80]],["M",[5.8,79.2]],["L",[44.2,79.2]],["L",[44.2,29.6]],["L",[5.8,29.6]],["L",[5.8,79.2]]]);
		this.motifs.set("–",[["M",[0,58.8]],["L",[48.4,58.8]],["L",[48.4,46.6]],["L",[0,46.6]],["L",[0,58.8]]]);
		this.motifs.set("—",[["M",[12.6,58.8]],["L",[84.3,58.8]],["L",[84.3,46.6]],["L",[12.6,46.6]],["L",[12.6,58.8]]]);
		this.motifs.set("‘",[["M",[20.4,25.3]],["L",[13.8,25.3]],["C",[13.7,21.5,15.3,19]],["C",[16.7,16.4,20.4,15.2]],["L",[20.4,8.6]],["C",[14.3,9.5,10.5,14]],["C",[6.6,18.6,6.6,25.4]],["L",[6.6,40.6]],["L",[20.4,40.6]],["L",[20.4,25.3]]]);
		this.motifs.set("’",[["M",[6.6,23.9]],["L",[13,23.9]],["C",[13,27.6,11.8,30.1]],["C",[10.4,32.6,6.6,34.1]],["L",[6.6,40.6]],["C",[12.8,39.7,16.7,35.1]],["C",[20.5,30.5,20.4,23.8]],["L",[20.4,8.6]],["L",[6.6,8.6]],["L",[6.6,23.9]]]);
		this.motifs.set("‚",[["M",[6.6,80]],["L",[13,80]],["C",[13,83.6,11.8,86.2]],["C",[10.4,88.6,6.6,90.1]],["L",[6.6,96.7]],["C",[12.8,95.6,16.7,91]],["C",[20.5,86.5,20.4,79.9]],["L",[20.4,64.6]],["L",[6.6,64.6]],["L",[6.6,80]]]);
		this.motifs.set("“",[["M",[39.6,25.3]],["L",[33,25.3]],["C",[32.9,21.5,34.5,19]],["C",[35.9,16.4,39.6,15.2]],["L",[39.6,8.6]],["C",[33.5,9.5,29.8,14]],["C",[25.9,18.6,25.9,25.4]],["L",[25.9,40.6]],["L",[39.6,40.6]],["L",[39.6,25.3]],["M",[18.3,25.3]],["L",[11.7,25.3]],["C",[11.6,21.5,13.2,19]],["C",[14.6,16.4,18.3,15.2]],["L",[18.3,8.6]],["C",[12.2,9.5,8.4,14]],["C",[4.5,18.6,4.5,25.4]],["L",[4.5,40.6]],["L",[18.3,40.6]],["L",[18.3,25.3]]]);
		this.motifs.set("”",[["M",[25.9,23.9]],["L",[32.3,23.9]],["C",[32.3,27.6,31,30.1]],["C",[29.7,32.6,25.9,34.1]],["L",[25.9,40.6]],["C",[32.1,39.7,35.9,35.1]],["C",[39.7,30.5,39.6,23.8]],["L",[39.6,8.6]],["L",[25.9,8.6]],["L",[25.9,23.9]],["M",[4.5,23.9]],["L",[10.9,23.9]],["C",[10.9,27.6,9.7,30.1]],["C",[8.3,32.6,4.5,34.1]],["L",[4.5,40.6]],["C",[10.7,39.7,14.6,35.1]],["C",[18.4,30.5,18.3,23.8]],["L",[18.3,8.6]],["L",[4.5,8.6]],["L",[4.5,23.9]]]);
		this.motifs.set("„",[["M",[25.9,80]],["L",[32.3,80]],["C",[32.3,83.6,31,86.2]],["C",[29.7,88.6,25.9,90.1]],["L",[25.9,96.7]],["C",[32.1,95.6,35.9,91]],["C",[39.7,86.5,39.6,79.9]],["L",[39.6,64.6]],["L",[25.9,64.6]],["L",[25.9,80]],["M",[4.5,80]],["L",[10.9,80]],["C",[10.9,83.6,9.7,86.2]],["C",[8.3,88.6,4.5,90.1]],["L",[4.5,96.7]],["C",[10.7,95.6,14.6,91]],["C",[18.4,86.5,18.3,79.9]],["L",[18.3,64.6]],["L",[4.5,64.6]],["L",[4.5,80]]]);
		this.motifs.set("†",[["M",[20.4,96.6]],["L",[33.4,96.6]],["L",[33.4,40]],["L",[51.5,40]],["L",[51.5,28.3]],["L",[33.4,28.3]],["L",[33.4,8.6]],["L",[20.4,8.6]],["L",[20.4,28.3]],["L",[2.3,28.3]],["L",[2.3,40]],["L",[20.4,40]],["L",[20.4,96.6]]]);
		this.motifs.set("‡",[["M",[20.4,96.6]],["L",[33.4,96.6]],["L",[33.4,77.3]],["L",[51.5,77.3]],["L",[51.5,65.6]],["L",[33.4,65.6]],["L",[33.4,40]],["L",[51.5,40]],["L",[51.5,28.3]],["L",[33.4,28.3]],["L",[33.4,8.6]],["L",[20.4,8.6]],["L",[20.4,28.3]],["L",[2.3,28.3]],["L",[2.3,40]],["L",[20.4,40]],["L",[20.4,65.6]],["L",[2.3,65.6]],["L",[2.3,77.3]],["L",[20.4,77.3]],["L",[20.4,96.6]]]);
		this.motifs.set("•",[["M",[7,44.4]],["C",[7.1,51.9,12.1,56.9]],["C",[16.9,62.1,24.2,62.2]],["C",[31.7,62.1,36.5,56.9]],["C",[41.4,51.9,41.6,44.4]],["C",[41.4,36.6,36.5,31.7]],["C",[31.7,26.6,24.2,26.5]],["C",[16.9,26.6,12.1,31.7]],["C",[7.1,36.6,7,44.4]]]);
		this.motifs.set("…",[["M",[7.2,80]],["L",[22.9,80]],["L",[22.9,64.7]],["L",[7.2,64.7]],["L",[7.2,80]],["M",[40.5,80]],["L",[56.3,80]],["L",[56.3,64.7]],["L",[40.5,64.7]],["L",[40.5,80]],["M",[73.8,80]],["L",[89.6,80]],["L",[89.6,64.7]],["L",[73.8,64.7]],["L",[73.8,80]]]);
		this.motifs.set("‰",[["M",[51.9,62.8]],["C",[51.8,59.7,52.7,56.6]],["C",[53.5,53.6,57,53.5]],["C",[60.4,53.6,61.2,56.8]],["C",[61.9,60.1,61.8,64.2]],["C",[61.9,68,61.2,71.4]],["C",[60.5,74.9,56.8,75]],["C",[53.5,74.9,52.7,71]],["C",[51.8,67.3,51.9,62.8]],["M",[76.2,64.6]],["C",[76.2,72.1,79.9,76.6]],["C",[83.6,81.3,90.3,81.4]],["C",[97.8,81.3,101.2,76.4]],["C",[104.4,71.7,104.4,64.5]],["C",[104.4,56.9,101.4,52.1]],["C",[98.2,47.1,90.4,47]],["C",[82.9,47.1,79.5,52.3]],["C",[76.2,57.2,76.2,64.6]],["M",[84.9,62.8]],["C",[84.8,59.7,85.7,56.6]],["C",[86.6,53.6,90.5,53.5]],["C",[94.3,53.6,95.1,56.8]],["C",[95.8,60.1,95.7,64.2]],["C",[95.8,68,95.1,71.4]],["C",[94.4,74.9,90.3,75]],["C",[86.6,74.9,85.7,71]],["C",[84.8,67.3,84.9,62.8]],["M",[6.7,26.1]],["C",[6.7,33.7,10.5,38.2]],["C",[14.2,42.9,20.8,43]],["C",[28.4,42.9,31.8,38]],["C",[35,33.3,35,26]],["C",[35,18.4,32,13.6]],["C",[28.8,8.7,20.9,8.6]],["C",[13.5,8.7,10.1,13.8]],["C",[6.7,18.8,6.7,26.1]],["M",[15.4,24.4]],["C",[15.3,21.3,16.2,18.1]],["C",[17.1,15.2,21,15.1]],["C",[24.8,15.2,25.7,18.4]],["C",[26.4,21.7,26.3,25.8]],["C",[26.4,29.6,25.7,32.9]],["C",[24.9,36.4,20.8,36.5]],["C",[17.1,36.4,16.2,32.5]],["C",[15.3,28.8,15.4,24.4]],["M",[14.8,82.2]],["L",[23.5,82.2]],["L",[63.4,7.8]],["L",[55.1,7.8]],["L",[14.8,82.2]],["M",[43.2,64.6]],["C",[43.2,72.1,46.8,76.6]],["C",[50.4,81.3,56.8,81.4]],["C",[64.1,81.3,67.3,76.4]],["C",[70.5,71.7,70.5,64.5]],["C",[70.5,56.9,67.6,52.1]],["C",[64.5,47.1,56.9,47]],["C",[49.7,47.1,46.4,52.3]],["C",[43.2,57.2,43.2,64.6]]]);
		this.motifs.set("‹",[["M",[19.5,72]],["L",[19.5,60]],["L",[10.5,52.8]],["L",[19.5,45.7]],["L",[19.5,33.7]],["L",[3.8,46]],["L",[3.8,59.5]],["L",[19.5,72]]]);
		this.motifs.set("›",[["M",[3.8,33.7]],["L",[3.8,45.7]],["C",[8.3,49.3,12.8,52.8]],["L",[3.8,60]],["L",[3.8,72]],["L",[19.5,59.5]],["L",[19.5,46]],["L",[3.8,33.7]]]);
		this.motifs.set("€",[["M",[57.6,12.8]],["C",[54.6,19.1,51.5,25.3]],["C",[44.4,20.8,38.4,20.8]],["C",[27.9,20.8,24.4,34.5]],["L",[48.8,34.5]],["C",[47.3,38.1,45.7,41.7]],["L",[23.3,41.7]],["L",[23.2,45.9]],["L",[44.5,45.9]],["C",[43,49.5,41.4,53.1]],["L",[24,53.1]],["C",[27.2,68.9,38.8,68.9]],["C",[46.2,68.9,54.2,62.6]],["L",[54.1,77.7]],["C",[47.4,81.7,38.7,81.7]],["C",[26,81.7,18.4,73.5]],["C",[11.4,66.2,9.3,53.1]],["L",[1.6,53.1]],["C",[3.2,49.5,4.7,45.9]],["L",[8.7,45.9]],["L",[8.7,43.3]],["C",[8.7,42,8.8,41.7]],["L",[1.5,41.7]],["C",[3.1,38.1,4.6,34.5]],["L",[9.7,34.5]],["C",[12.1,22.5,19.6,15.4]],["C",[27.5,7.8,39.4,7.8]],["C",[47.8,7.8,57.6,12.8]]]);
		this.motifs.set("™",[["M",[89.9,8.6]],["L",[76.9,8.6]],["C",[71.8,22.1,66.8,35.7]],["L",[56.9,8.6]],["L",[43.7,8.6]],["L",[43.7,49.8]],["L",[53,49.8]],["L",[53,20.6]],["L",[53.2,20.6]],["C",[58.3,35.2,63.5,49.8]],["L",[70.2,49.8]],["L",[80.4,20.6]],["L",[80.6,20.6]],["L",[80.6,49.8]],["L",[89.9,49.8]],["L",[89.9,8.6]],["M",[38.5,8.6]],["L",[6,8.6]],["L",[6,16.6]],["L",[17.3,16.6]],["L",[17.3,49.8]],["L",[27.2,49.8]],["L",[27.2,16.6]],["L",[38.5,16.6]],["L",[38.5,8.6]]]);
		this.motifs.set("骨",[["M",[5,80]],["L",[5,28.8]],["L",[45,28.8]],["L",[45,80]],["L",[5,80]],["M",[5.8,79.2]],["L",[44.2,79.2]],["L",[44.2,29.6]],["L",[5.8,29.6]],["L",[5.8,79.2]]]);
	}
	,initializeWidths: function() {
		this.widths.set("\x05",25.9);
		this.widths.set("\x07",25.9);
		this.widths.set("\x11",25.8);
		this.widths.set("\x13",25.9);
		this.widths.set("\x16",25.9);
		this.widths.set("\x1A",25.9);
		this.widths.set("\x1E",25.9);
		this.widths.set(" ",27.8);
		this.widths.set("!",27.8);
		this.widths.set("\"",46.3);
		this.widths.set("#",55.6);
		this.widths.set("$",55.6);
		this.widths.set("%",100);
		this.widths.set("&",68.5);
		this.widths.set("'",27.8);
		this.widths.set("(",29.6);
		this.widths.set(")",29.6);
		this.widths.set("*",40.7);
		this.widths.set("+",60);
		this.widths.set(",",27.8);
		this.widths.set("-",40.7);
		this.widths.set(".",27.8);
		this.widths.set("/",37.1);
		this.widths.set("0",55.6);
		this.widths.set("1",55.6);
		this.widths.set("2",55.6);
		this.widths.set("3",55.6);
		this.widths.set("4",55.6);
		this.widths.set("5",55.6);
		this.widths.set("6",55.6);
		this.widths.set("7",55.6);
		this.widths.set("8",55.6);
		this.widths.set("9",55.6);
		this.widths.set(":",27.8);
		this.widths.set(";",27.8);
		this.widths.set("<",60);
		this.widths.set("=",60);
		this.widths.set(">",60);
		this.widths.set("?",55.6);
		this.widths.set("@",80);
		this.widths.set("A",68.5);
		this.widths.set("B",70.4);
		this.widths.set("C",74.1);
		this.widths.set("D",74.1);
		this.widths.set("E",64.8);
		this.widths.set("F",59.3);
		this.widths.set("G",75.9);
		this.widths.set("H",74.1);
		this.widths.set("I",29.5);
		this.widths.set("J",55.6);
		this.widths.set("K",72.2);
		this.widths.set("L",59.3);
		this.widths.set("M",90.7);
		this.widths.set("N",74.1);
		this.widths.set("O",77.8);
		this.widths.set("P",66.7);
		this.widths.set("Q",77.8);
		this.widths.set("R",72.2);
		this.widths.set("S",64.9);
		this.widths.set("T",61.1);
		this.widths.set("U",74.1);
		this.widths.set("V",63);
		this.widths.set("W",94.4);
		this.widths.set("X",66.7);
		this.widths.set("Y",66.7);
		this.widths.set("Z",64.8);
		this.widths.set("[",33.3);
		this.widths.set("\\",37.1);
		this.widths.set("]",33.3);
		this.widths.set("^",60);
		this.widths.set("_",50);
		this.widths.set("`",25.9);
		this.widths.set("a",57.4);
		this.widths.set("b",61.1);
		this.widths.set("c",57.4);
		this.widths.set("d",61.1);
		this.widths.set("e",57.4);
		this.widths.set("f",33.3);
		this.widths.set("g",61.1);
		this.widths.set("h",59.3);
		this.widths.set("i",25.8);
		this.widths.set("j",27.8);
		this.widths.set("k",57.4);
		this.widths.set("l",25.8);
		this.widths.set("m",90.6);
		this.widths.set("n",59.3);
		this.widths.set("o",61.1);
		this.widths.set("p",61.1);
		this.widths.set("q",61.1);
		this.widths.set("r",38.9);
		this.widths.set("s",53.7);
		this.widths.set("t",35.2);
		this.widths.set("u",59.3);
		this.widths.set("v",52);
		this.widths.set("w",81.4);
		this.widths.set("x",53.7);
		this.widths.set("y",51.9);
		this.widths.set("z",51.9);
		this.widths.set("{",33.3);
		this.widths.set("|",22.3);
		this.widths.set("}",33.3);
		this.widths.set("~",60);
		this.widths.set(" ",27.8);
		this.widths.set("¡",27.8);
		this.widths.set("¢",55.6);
		this.widths.set("£",55.6);
		this.widths.set("¤",55.6);
		this.widths.set("¥",55.6);
		this.widths.set("¦",22.3);
		this.widths.set("§",55.6);
		this.widths.set("¨",25.9);
		this.widths.set("©",80);
		this.widths.set("ª",34.4);
		this.widths.set("«",44.4);
		this.widths.set("¬",60);
		this.widths.set("­",40.7);
		this.widths.set("®",80);
		this.widths.set("¯",25.9);
		this.widths.set("°",40);
		this.widths.set("±",60);
		this.widths.set("²",39.2);
		this.widths.set("³",39.2);
		this.widths.set("´",25.9);
		this.widths.set("µ",59.3);
		this.widths.set("¶",62);
		this.widths.set("·",27.8);
		this.widths.set("¸",25.9);
		this.widths.set("¹",39.2);
		this.widths.set("º",36.7);
		this.widths.set("»",44.4);
		this.widths.set("¼",89.2);
		this.widths.set("½",88.9);
		this.widths.set("¾",88.9);
		this.widths.set("¿",55.6);
		this.widths.set("À",68.5);
		this.widths.set("Á",68.5);
		this.widths.set("Â",68.5);
		this.widths.set("Ã",68.5);
		this.widths.set("Ä",68.5);
		this.widths.set("Å",68.5);
		this.widths.set("Æ",98.1);
		this.widths.set("Ç",74.1);
		this.widths.set("È",64.8);
		this.widths.set("É",64.8);
		this.widths.set("Ê",64.8);
		this.widths.set("Ë",64.8);
		this.widths.set("Ì",29.5);
		this.widths.set("Í",29.5);
		this.widths.set("Î",29.5);
		this.widths.set("Ï",29.5);
		this.widths.set("Ð",74.1);
		this.widths.set("Ñ",74.1);
		this.widths.set("Ò",77.8);
		this.widths.set("Ó",77.8);
		this.widths.set("Ô",77.8);
		this.widths.set("Õ",77.8);
		this.widths.set("Ö",77.8);
		this.widths.set("×",60);
		this.widths.set("Ø",77.8);
		this.widths.set("Ù",74.1);
		this.widths.set("Ú",74.1);
		this.widths.set("Û",74.1);
		this.widths.set("Ü",74.1);
		this.widths.set("Ý",66.7);
		this.widths.set("Þ",66.7);
		this.widths.set("ß",61.1);
		this.widths.set("à",57.4);
		this.widths.set("á",57.4);
		this.widths.set("â",57.4);
		this.widths.set("ã",57.4);
		this.widths.set("ä",57.4);
		this.widths.set("å",57.4);
		this.widths.set("æ",90.7);
		this.widths.set("ç",57.4);
		this.widths.set("è",57.4);
		this.widths.set("é",57.4);
		this.widths.set("ê",57.4);
		this.widths.set("ë",57.4);
		this.widths.set("ì",25.8);
		this.widths.set("í",25.8);
		this.widths.set("î",25.8);
		this.widths.set("ï",25.8);
		this.widths.set("ð",61.1);
		this.widths.set("ñ",59.3);
		this.widths.set("ò",61.1);
		this.widths.set("ó",61.1);
		this.widths.set("ô",61.1);
		this.widths.set("õ",61.1);
		this.widths.set("ö",61.1);
		this.widths.set("÷",60);
		this.widths.set("ø",61.1);
		this.widths.set("ù",59.3);
		this.widths.set("ú",59.3);
		this.widths.set("û",59.3);
		this.widths.set("ü",59.3);
		this.widths.set("ý",51.9);
		this.widths.set("þ",61.1);
		this.widths.set("ÿ",51.9);
		this.widths.set("Œ",109.3);
		this.widths.set("œ",92.6);
		this.widths.set("Š",64.9);
		this.widths.set("š",53.7);
		this.widths.set("Ÿ",66.7);
		this.widths.set("ƒ",55.6);
		this.widths.set("ˆ",25.9);
		this.widths.set("˜",25.9);
		this.widths.set("μ",59.3);
		this.widths.set("–",50);
		this.widths.set("—",100);
		this.widths.set("‘",27.8);
		this.widths.set("’",27.8);
		this.widths.set("‚",27.8);
		this.widths.set("“",46.3);
		this.widths.set("”",46.3);
		this.widths.set("„",46.3);
		this.widths.set("†",55.6);
		this.widths.set("‡",55.6);
		this.widths.set("•",50.1);
		this.widths.set("…",100);
		this.widths.set("‰",114.7);
		this.widths.set("‹",24.1);
		this.widths.set("›",24.1);
		this.widths.set("€",55.6);
		this.widths.set("™",100);
		this.widths.set("骨",25.9);
	}
});
var three = {};
three.Face = function() { };
three.Face.__name__ = true;
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
String.__name__ = true;
Array.__name__ = true;
var q = window.jQuery;
js.JQuery = q;
MainDrawer.SCALE = 2;
_Three.CullFace_Impl_.None = 0;
_Three.CullFace_Impl_.Back = 1;
_Three.CullFace_Impl_.Front = 2;
_Three.CullFace_Impl_.FrontBack = 3;
_Three.FrontFaceDirection_Impl_.CW = 0;
_Three.FrontFaceDirection_Impl_.CCW = 1;
_Three.ShadowMapType_Impl_.BasicShadowMap = 0;
_Three.ShadowMapType_Impl_.PCFShadowMap = 1;
_Three.ShadowMapType_Impl_.PCFSoftShadowMap = 2;
_Three.Side_Impl_.FrontSide = 0;
_Three.Side_Impl_.BackSide = 1;
_Three.Side_Impl_.DoubleSide = 2;
_Three.Shading_Impl_.NoShading = 0;
_Three.Shading_Impl_.FlatShading = 1;
_Three.Shading_Impl_.SmoothShading = 2;
_Three.Colors_Impl_.NoColors = 0;
_Three.Colors_Impl_.FaceColors = 1;
_Three.Colors_Impl_.VertexColors = 2;
_Three.BlendMode_Impl_.NoBlending = 0;
_Three.BlendMode_Impl_.NormalBlending = 1;
_Three.BlendMode_Impl_.AdditiveBlending = 2;
_Three.BlendMode_Impl_.SubtractiveBlending = 3;
_Three.BlendMode_Impl_.MultiplyBlending = 4;
_Three.BlendMode_Impl_.CustomBlending = 5;
_Three.BlendingEquation_Impl_.AddEquation = 100;
_Three.BlendingEquation_Impl_.SubtractEquation = 101;
_Three.BlendingEquation_Impl_.ReverseSubtractEquation = 102;
_Three.BlendingDestinationFactor_Impl_.ZeroFactor = 200;
_Three.BlendingDestinationFactor_Impl_.OneFactor = 201;
_Three.BlendingDestinationFactor_Impl_.SrcColorFactor = 202;
_Three.BlendingDestinationFactor_Impl_.OneMinusSrcColorFactor = 203;
_Three.BlendingDestinationFactor_Impl_.SrcAlphaFactor = 204;
_Three.BlendingDestinationFactor_Impl_.OneMinusSrcAlphaFactor = 205;
_Three.BlendingDestinationFactor_Impl_.DstAlphaFactor = 206;
_Three.BlendingDestinationFactor_Impl_.OneMinusDstAlphaFactor = 207;
_Three.BlendingDestinationFactor_Impl_.DstColorFactor = 208;
_Three.BlendingDestinationFactor_Impl_.OneMinusDstColorFactor = 209;
_Three.BlendingDestinationFactor_Impl_.SrcAlphaSaturateFactor = 210;
_Three.TextureConstant_Impl_.MultiplyOperation = 0;
_Three.TextureConstant_Impl_.MixOperation = 1;
_Three.TextureConstant_Impl_.AddOperation = 2;
_Three.WrappingMode_Impl_.RepeatWrapping = 1000;
_Three.WrappingMode_Impl_.ClampToEdgeWrapping = 1001;
_Three.WrappingMode_Impl_.MirroredRepeatWrapping = 1002;
_Three.Filter_Impl_.NearestFilter = 1003;
_Three.Filter_Impl_.NearestMipMapNearestFilter = 1004;
_Three.Filter_Impl_.NearestMipMapLinearFilter = 1005;
_Three.Filter_Impl_.LinearFilter = 1006;
_Three.Filter_Impl_.LinearMipMapNearestFilter = 1007;
_Three.Filter_Impl_.LinearMipMapLinearFilter = 1008;
_Three.DataType_Impl_.UnsignedByteType = 1009;
_Three.DataType_Impl_.ByteType = 1010;
_Three.DataType_Impl_.ShortType = 1011;
_Three.DataType_Impl_.UnsignedShortType = 1012;
_Three.DataType_Impl_.IntType = 1013;
_Three.DataType_Impl_.UnsignedIntType = 1014;
_Three.DataType_Impl_.FloatType = 1015;
_Three.PixelType_Impl_.UnsignedShort4444Type = 1016;
_Three.PixelType_Impl_.UnsignedShort5551Type = 1017;
_Three.PixelType_Impl_.UnsignedShort565Type = 1018;
_Three.PixelFormat_Impl_.AlphaFormat = 1019;
_Three.PixelFormat_Impl_.RGBFormat = 1020;
_Three.PixelFormat_Impl_.RGBAFormat = 1021;
_Three.PixelFormat_Impl_.LuminanceFormat = 1022;
_Three.PixelFormat_Impl_.LuminanceAlphaFormat = 1023;
_Three.TextureFormat_Impl_.RGB_S3TC_DXT1_Format = 2001;
_Three.TextureFormat_Impl_.RGBA_S3TC_DXT1_Format = 2002;
_Three.TextureFormat_Impl_.RGBA_S3TC_DXT3_Format = 2003;
_Three.TextureFormat_Impl_.RGBA_S3TC_DXT5_Format = 2004;
_Three.LineType_Impl_.LineStrip = 0;
_Three.LineType_Impl_.LinePieces = 1;
Three.CullFaceNone = 0;
Three.CullFaceBack = 1;
Three.CullFaceFront = 2;
Three.CullFaceFrontBack = 3;
Three.FrontFaceDirectionCW = 0;
Three.FrontFaceDirectionCCW = 1;
Three.BasicShadowMap = 0;
Three.PCFShadowMap = 1;
Three.PCFSoftShadowMap = 2;
Three.FrontSide = 0;
Three.BackSide = 1;
Three.DoubleSide = 2;
Three.NoShading = 0;
Three.FlatShading = 1;
Three.SmoothShading = 2;
Three.NoColors = 0;
Three.FaceColors = 1;
Three.VertexColors = 2;
Three.NoBlending = 0;
Three.NormalBlending = 1;
Three.AdditiveBlending = 2;
Three.SubtractiveBlending = 3;
Three.MultiplyBlending = 4;
Three.CustomBlending = 5;
Three.AddEquation = 100;
Three.SubtractEquation = 101;
Three.ReverseSubtractEquation = 102;
Three.ZeroFactor = 200;
Three.OneFactor = 201;
Three.SrcColorFactor = 202;
Three.OneMinusSrcColorFactor = 203;
Three.SrcAlphaFactor = 204;
Three.OneMinusSrcAlphaFactor = 205;
Three.DstAlphaFactor = 206;
Three.OneMinusDstAlphaFactor = 207;
Three.MultiplyOperation = 0;
Three.MixOperation = 1;
Three.AddOperation = 2;
Three.RepeatWrapping = 1000;
Three.ClampToEdgeWrapping = 1001;
Three.MirroredRepeatWrapping = 1002;
Three.NearestFilter = 1003;
Three.NearestMipMapNearestFilter = 1004;
Three.NearestMipMapLinearFilter = 1005;
Three.LinearFilter = 1006;
Three.LinearMipMapNearestFilter = 1007;
Three.LinearMipMapLinearFilter = 1008;
Three.UnsignedByteType = 1009;
Three.ByteType = 1010;
Three.ShortType = 1011;
Three.UnsignedShortType = 1012;
Three.IntType = 1013;
Three.UnsignedIntType = 1014;
Three.FloatType = 1015;
Three.UnsignedShort4444Type = 1016;
Three.UnsignedShort5551Type = 1017;
Three.UnsignedShort565Type = 1018;
Three.AlphaFormat = 1019;
Three.RGBFormat = 1020;
Three.RGBAFormat = 1021;
Three.LuminanceFormat = 1022;
Three.LuminanceAlphaFormat = 1023;
Three.RGB_S3TC_DXT1_Format = 2001;
Three.RGBA_S3TC_DXT1_Format = 2002;
Three.RGBA_S3TC_DXT3_Format = 2003;
Three.RGBA_S3TC_DXT5_Format = 2004;
Three.LineStrip = 0;
Three.LinePieces = 1;
data.MotionData.R1 = new data.MotionData(0,0,0.5);
data.MotionData.R2 = new data.MotionData(0,0,-0.5);
data.MotionData.Y1 = new data.MotionData(0,1,0);
data.MotionData.Y2 = new data.MotionData(0,-1,0);
data.MotionData.XY1 = new data.MotionData(0.25,-1,0);
data.MotionData.XY2 = new data.MotionData(-0.25,1,0);
data.MotionData.XYR = new data.MotionData(0,0.25,0.5);
data.MotionData.XYR2 = new data.MotionData(0.25,1,0.5);
data.MotionData.LOCAL1 = new data.MotionData(0,0,0,0.4);
data.MotionData.LOCAL2 = new data.MotionData(0,-0.5,0,-0.4);
data.MotionData.LOCAL3 = new data.MotionData(0,0,0,-0.4);
data.MotionData.list = [data.MotionData.R1,data.MotionData.R2,data.MotionData.R1,data.MotionData.R2,data.MotionData.Y1,data.MotionData.Y2,data.MotionData.XY1,data.MotionData.XY2,data.MotionData.XYR,data.MotionData.XYR2,data.MotionData.LOCAL1,data.MotionData.LOCAL2,data.MotionData.LOCAL3];
Main.main();
})();
