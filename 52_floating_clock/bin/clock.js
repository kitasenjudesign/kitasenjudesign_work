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
	add: function(m) {
		console.log("このメソッドはdebugじゃないと動作しないよ");
	}
	,remove: function(m) {
		console.log("このメソッドはdebugじゃないと動作しないよ");
	}
	,init: function(json,callback) {
		FontShapeMaker.font = new net.badimon.five3D.typography.GenTypography3D();
		if(callback == null) FontShapeMaker.font.initByString(json); else FontShapeMaker.font.init(json,callback);
	}
	,getWidth: function(moji) {
		return FontShapeMaker.font.getWidth(moji);
	}
	,getHeight: function() {
		return FontShapeMaker.font.getHeight();
	}
	,getGeometry: function(moji,isCentering) {
		if(isCentering == null) isCentering = true;
		var shapes = this.getShapes(moji,isCentering);
		var geo = new THREE.ShapeGeometry(shapes,{ });
		return geo;
	}
	,getShapes: function(moji,isCentering,scale) {
		if(scale == null) scale = 1;
		if(isCentering == null) isCentering = false;
		var shapes = [];
		var shape = null;
		var g = null;
		var motif = FontShapeMaker.font.motifs.get(moji);
		var ox = 0;
		var oy = 0;
		var s = scale;
		if(isCentering) {
			ox = -FontShapeMaker.font.widths.get(moji) / 2;
			oy = -FontShapeMaker.font.height / 2;
		}
		var len = motif.length;
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			var tgt = motif[i][0];
			if(tgt == "M" || tgt == "H") {
				if(tgt == "H") {
					g = new THREE.Path();
					shape.holes.push(g);
				} else {
					shape = new THREE.Shape();
					shapes.push(shape);
					g = shape;
				}
				g.moveTo(s * (motif[i][1][0] + ox),-s * (motif[i][1][1] + oy));
			} else if(tgt == "L") g.lineTo(s * (motif[i][1][0] + ox),-s * (motif[i][1][1] + oy)); else if(tgt == "C") g.quadraticCurveTo(s * (motif[i][1][0] + ox),-s * (motif[i][1][1] + oy),s * (motif[i][1][2] + ox),-s * (motif[i][1][3] + oy));
		}
		return shapes;
	}
};
var HxOverrides = function() { };
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
var Main = function() {
	this._color = 13421772;
	this._boxHeight = 650;
	this._isDown = false;
	this._yy = 100;
	this._rad = 0;
	this._oldSec = 0;
	this._flag = true;
	this._amp = 2400;
	this._downY = 0;
	this._downX = 0;
	this._mouseY = 0;
	this._mouseX = 0;
	window.onload = $bind(this,this.initialize);
};
Main.main = function() {
	new Main();
};
Main.prototype = {
	initialize: function(e) {
		this._shape = new FontShapeMaker();
		this._shape.init("HelveticaNeueMedium.json",$bind(this,this._onLoadFont));
	}
	,_onLoadFont: function() {
		var _g = this;
		this._renderer = new THREE.WebGLRenderer({ antialias : true, devicePixelRatio : 1});
		this._renderer.shadowMapType = 2;
		this._scene = new THREE.Scene();
		this._camera = new THREE.PerspectiveCamera(20,window.innerWidth / window.innerHeight,10,5000);
		var ww = window.innerWidth * 0.3;
		var hh = window.innerHeight * 0.3;
		this._renderer.setClearColorHex(this._color,1);
		this._renderer.shadowMapEnabled = true;
		this._renderer.setSize(window.innerWidth,window.innerHeight);
		this._renderer.shadowMapType = 2;
		window.document.body.appendChild(this._renderer.domElement);
		var points = MojiPoints.getPoints();
		var L1 = new THREE.DirectionalLight(16777215);
		L1.position.x = 0;
		L1.position.y = 0;
		L1.position.z = 500;
		this._scene.add(L1);
		var light = new THREE.DirectionalLight(16777215);
		light.position.x = 0;
		light.position.y = 500;
		light.position.z = 0;
		light.onlyShadow = true;
		light.castShadow = true;
		light.shadowMapSize = 2048;
		light.shadowCameraRight = 700;
		light.shadowCameraLeft = -700;
		light.shadowCameraTop = 700;
		light.shadowCameraBottom = -700;
		light.shadowDarkness = 0.8;
		this._scene.add(light);
		var light2 = new THREE.AmbientLight(5592405);
		this._scene.add(light2);
		var box = new THREE.Mesh(new THREE.PlaneGeometry(2000,2000,20,20),new THREE.MeshBasicMaterial({ color : this._color, side : 1}));
		box.position.y = -this._boxHeight / 2;
		box.rotation.x = Math.PI / 20 + Math.PI / 2;
		var mate = box.material;
		this._scene.add(box);
		box.receiveShadow = true;
		var s = "0123456789";
		this.letters = [];
		var _g1 = 0;
		var _g2 = s.length;
		while(_g1 < _g2) {
			var i = _g1++;
			var shapes = this._shape.getShapes(HxOverrides.substr(s,i,1),true,3);
			var geo = new THREE.ExtrudeGeometry(shapes,{ amount : 24, bevelEnabled : false});
			var mesh = new THREE.Mesh(geo,new THREE.MeshLambertMaterial({ color : 16777215, side : 2}));
			this.letters.push(mesh);
		}
		this.nletters = [];
		var _g3 = 0;
		while(_g3 < 6) {
			var i1 = _g3++;
			var nLet = new clock.NumLetter();
			nLet.init(this.letters);
			nLet.position.x = (i1 - 2.5) * 210;
			this.nletters.push(nLet);
			this._scene.add(nLet);
		}
		window.document.addEventListener("mousemove",function(event) {
			_g._mouseX = (event.clientX - window.innerWidth / 2) / window.innerWidth;
			_g._mouseY = (event.clientY - window.innerHeight / 2) / window.innerHeight;
		},false);
		window.document.addEventListener("touchstart",function(e) {
			e.preventDefault();
			var touch = e.touches[0];
			if(e.touches.length <= 1) {
				_g._downX = touch.pageX / window.innerWidth - 0.5;
				_g._downY = touch.pageY / window.innerHeight - 0.5;
			}
		},false);
		window.document.addEventListener("touchmove",function(e1) {
			e1.preventDefault();
			var touch1 = e1.touches[0];
			if(e1.touches.length <= 1) {
				_g._mouseX = touch1.pageX / window.innerWidth - 0.5;
				_g._mouseY = touch1.pageY / window.innerHeight - 0.5;
			}
		},false);
		window.document.addEventListener("gestureend",function(e2) {
			if(e2.scale < 1) {
				_g._amp += 200;
				if(_g._amp < 200) _g._amp = 200;
			} else if(e2.scale > 1) _g._amp -= 200;
		},false);
		this._run();
		window.document.onmousewheel = function(e3) {
			_g._amp += e3.wheelDelta * 0.5;
			if(_g._amp < 100) _g._amp = 100;
		};
		window.onclick = function(e4) {
			_g._flag = !_g._flag;
		};
		window.onresize = $bind(this,this._onResize);
		this._onResize(null);
		this._tween();
	}
	,_tween: function() {
		var date = new Date();
		var hh = date.getHours();
		var mm = date.getMinutes();
		var ss = date.getSeconds();
		var _g = 0;
		var _g1 = this.nletters;
		while(_g < _g1.length) {
			var letter = _g1[_g];
			++_g;
			if(ss % 10 == 0) letter.force(true); else letter.force(false);
		}
		this.nletters[0].setNo(this._getKeta2(hh));
		this.nletters[1].setNo(this._getKeta1(hh));
		this.nletters[2].setNo(this._getKeta2(mm));
		this.nletters[3].setNo(this._getKeta1(mm));
		this.nletters[4].setNo(this._getKeta2(ss));
		this.nletters[5].setNo(this._getKeta1(ss));
		haxe.Timer.delay($bind(this,this._tween),1000);
	}
	,_getPoint: function(A,radX,radY) {
		var amp = A * Math.cos(radY);
		var xx = amp * Math.sin(radX);
		var yy = A * Math.sin(radY);
		var zz = amp * Math.cos(radX);
		return new THREE.Vector3(xx,yy,zz);
	}
	,_run: function() {
		this._rad = Math.PI / 2;
		this._yy = -this._boxHeight / 4 + this._boxHeight * 0.05;
		this._camera.position.x += (this._amp * Math.cos(this._rad) - this._camera.position.x) / 4;
		this._camera.position.y += (this._yy - this._camera.position.y) / 4;
		this._camera.position.z += (this._amp * Math.sin(this._rad) - this._camera.position.z) / 4;
		this._camera.lookAt(new THREE.Vector3(0,this._yy,0));
		var _g = 0;
		var _g1 = this.nletters;
		while(_g < _g1.length) {
			var letter = _g1[_g];
			++_g;
			letter.update();
		}
		this._renderer.render(this._scene,this._camera);
		window.requestAnimationFrame($bind(this,this._run));
	}
	,_getKeta1: function(n) {
		return n % 10;
	}
	,_getKeta2: function(n) {
		return Math.floor(n / 10);
	}
	,_onResize: function(object) {
		this._camera.aspect = window.innerWidth / window.innerHeight;
		this._camera.updateProjectionMatrix();
		this._renderer.setSize(window.innerWidth,window.innerHeight);
	}
};
var IMap = function() { };
var MojiPoints = function() {
};
MojiPoints.getPoints = function() {
	var points = [];
	points = [[[-146,144],[-95.6,144],[-66.8,76.39999999999998],[65.6,76.39999999999998],[94,144],[146,144],[22.80000000000001,-138],[-22.80000000000001,-138],[-146,144]],[[-48.8,32.80000000000001],[-0.8000000000000114,-79.19999999999999],[47.599999999999994,32.80000000000001],[-48.8,32.80000000000001]]];
	return points;
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
var _Three = {};
_Three.CullFace_Impl_ = function() { };
_Three.FrontFaceDirection_Impl_ = function() { };
_Three.ShadowMapType_Impl_ = function() { };
_Three.Side_Impl_ = function() { };
_Three.Shading_Impl_ = function() { };
_Three.Colors_Impl_ = function() { };
_Three.BlendMode_Impl_ = function() { };
_Three.BlendingEquation_Impl_ = function() { };
_Three.BlendingDestinationFactor_Impl_ = function() { };
_Three.TextureConstant_Impl_ = function() { };
_Three.WrappingMode_Impl_ = function() { };
_Three.Filter_Impl_ = function() { };
_Three.DataType_Impl_ = function() { };
_Three.PixelType_Impl_ = function() { };
_Three.PixelFormat_Impl_ = function() { };
_Three.TextureFormat_Impl_ = function() { };
_Three.LineType_Impl_ = function() { };
var Three = function() { };
Three.requestAnimationFrame = function(f) {
	return window.requestAnimationFrame(f);
};
Three.cancelAnimationFrame = function(f) {
	window.cancelAnimationFrame(id);
};
var clock = {};
clock.DigMesh = function(m) {
	this.mesh = m;
	this.mesh.castShadow = true;
	this._vertices = [];
	this._geo = this.mesh.geometry;
	this._map = new haxe.ds.StringMap();
	var _g1 = 0;
	var _g = this._geo.vertices.length;
	while(_g1 < _g) {
		var i = _g1++;
		var v = this._geo.vertices[i];
		this._vertices[i] = v.clone();
		var name = this.toString(v);
		if(this._map.get(name) == null) this._map.set(name,[]);
		this._map.get(name).push(i);
	}
};
clock.DigMesh.prototype = {
	update: function() {
	}
	,force: function() {
	}
	,toString: function(v) {
		return v.x + "_" + v.y + "_" + v.z;
	}
};
clock.NumLetter = function() {
	this.vz = 0;
	this.vy = 0;
	this.vx = 0;
	this._shoumen = false;
	THREE.Object3D.call(this);
};
clock.NumLetter.__super__ = THREE.Object3D;
clock.NumLetter.prototype = $extend(THREE.Object3D.prototype,{
	getCurrent: function() {
		return this._current;
	}
	,init: function(letters) {
		this._letters = [];
		var _g = 0;
		while(_g < letters.length) {
			var m = letters[_g];
			++_g;
			var mc = new clock.DigMesh(m.clone());
			this._letters.push(mc);
			this.add(mc.mesh);
			mc.mesh.visible = false;
		}
	}
	,setNo: function(n) {
		var _g = 0;
		var _g1 = this._letters;
		while(_g < _g1.length) {
			var m = _g1[_g];
			++_g;
			m.mesh.visible = false;
		}
		this._letters[n].mesh.visible = true;
		this._current = this._letters[n];
	}
	,force: function(shoumen) {
		this._shoumen = shoumen;
		if(this._shoumen) {
			this.rotation.x = this.rotation.x % (Math.PI * 2);
			this.rotation.y = this.rotation.y % (Math.PI * 2);
			this.rotation.z = this.rotation.z % (Math.PI * 2);
		}
		var v = new THREE.Vector3();
		v.x = Math.random() - 0.5;
		v.y = Math.random() - 0.5;
		v.z = Math.random() - 0.5;
		v.normalize();
		v.multiplyScalar(0.4);
		this.vx = v.x;
		this.vy = v.y;
		this.vz = v.z;
		if(this._current != null) this._current.force();
	}
	,update: function() {
		if(this._shoumen) {
			this.rotation.x += (0 - this.rotation.x) / 10;
			this.rotation.y += (0 - this.rotation.y) / 10;
			this.rotation.z += (0 - this.rotation.z) / 10;
		} else {
			this.rotation.x += this.vx;
			this.rotation.y += this.vy;
			this.rotation.z += this.vz;
			this.vx *= 0.92;
			this.vy *= 0.92;
			this.vz *= 0.92;
		}
		if(this._current != null) this._current.update();
	}
});
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
	}
	,_initAry: function(str) {
		var list = str.split(",");
		var out = [];
		out[0] = list[0];
		if(out[0] == "C") out[1] = [Std.parseFloat(list[1]),Std.parseFloat(list[2]),Std.parseFloat(list[3]),Std.parseFloat(list[4])]; else out[1] = [Std.parseFloat(list[1]),Std.parseFloat(list[2])];
		return out;
	}
});
var three = {};
three.Face = function() { };
three.IFog = function() { };
three.Mapping = function() { };
three.Renderer = function() { };
three._WebGLRenderer = {};
three._WebGLRenderer.RenderPrecision_Impl_ = function() { };
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
Main.isCanvas = false;
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
three._WebGLRenderer.RenderPrecision_Impl_.highp = "highp";
three._WebGLRenderer.RenderPrecision_Impl_.mediump = "mediump";
three._WebGLRenderer.RenderPrecision_Impl_.lowp = "lowp";
Main.main();
})();
