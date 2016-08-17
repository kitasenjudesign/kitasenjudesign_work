(function () { "use strict";
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var Jiku = function() {
};
Jiku.init = function() {
	Jiku.params = { radius : 100, phase : 1, phaseY : 1, ampX : 300, ampY : 500, phaseR : 1, length : 5000};
};
Jiku.getPos = function(r,rad,oRot) {
	if(r <= 0) r = 0;
	if(r >= 1) r = 1;
	var v1 = Jiku.getPos1(r);
	Jiku.obj.position.x = v1.x;
	Jiku.obj.position.y = v1.y;
	Jiku.obj.position.z = v1.z;
	var v2 = Jiku.getPos1(r + 0.01);
	Jiku.obj.lookAt(v2);
	var amp = 300 + Jiku.params.radius * Math.sin(r * Math.PI * 2 * Jiku.params.phase);
	var v3 = new THREE.Vector3();
	v3.x = amp * Math.sin(rad + r * 2 * Math.PI * Jiku.params.phaseR + oRot);
	v3.y = amp * Math.cos(rad + r * 2 * Math.PI * Jiku.params.phaseR + oRot);
	v3.z = 0;
	Jiku.obj.updateMatrixWorld();
	var out = Jiku.obj.localToWorld(v3);
	return out;
};
Jiku.setRandom = function() {
	TweenMax.to(Jiku.params,1,{ radius : 100 + 200 * Math.random(), phase : 0.5 + 1.5 * Math.random(), phaseY : 0.2 + 3.2 * Math.random(), phaseR : 2.5 * Math.random(), ampY : 400 * Math.random(), ampX : 300 + 500 * Math.random(), length : 4000 + 2000 * Math.random()});
};
Jiku.getPos1 = function(r) {
	var v = new THREE.Vector3();
	v.x = Jiku.params.ampX * Math.cos(r * Math.PI * 2);
	var rr = (1 - Jiku.params.ampY / 400) * 0.6 + 0.4;
	v.y = Jiku.params.ampY * Math.sin(r * Math.PI * 2 * Jiku.params.phaseY * rr);
	v.z = Jiku.params.length * (r - 0.5);
	return v;
};
Jiku.update = function(rx,ry) {
	Jiku.mouseX = rx * 2 * Math.PI;
	Jiku.mouseY = ry * 2 * Math.PI;
};
var Main = function() {
	this._yy = 100;
	this._rad = 0;
	this._oldSec = 0;
	this._flag = true;
	this._amp = 400;
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
		clock.DigitManager.init();
		Main.isCanvas = false;
		if(Main.isCanvas) this._renderer = new THREE.CanvasRenderer({ antialias : false}); else this._renderer = new THREE.WebGLRenderer({ antialias : false});
		Jiku.init();
		this._scene = new THREE.Scene();
		this._camera = new camera.ExCamera(30,window.innerWidth / window.innerHeight,10,50000);
		this._camera.init(this._renderer.domElement);
		this._renderer.setSize(window.innerWidth,window.innerHeight);
		window.document.body.appendChild(this._renderer.domElement);
		var obj = new THREE.Object3D();
		this._scene.add(obj);
		Jiku.obj = obj;
		this._planes = new clock.DigitPlanes();
		this._planes.init();
		this._scene.add(this._planes);
		this._run();
		window.onresize = $bind(this,this._onResize);
		this._onResize(null);
	}
	,_run: function() {
		window.requestAnimationFrame($bind(this,this._run));
		Jiku.update(this._camera._mouseX / window.innerWidth,this._camera._mouseY / window.innerHeight);
		this._planes.update();
		if(this._camera != null) this._camera.update();
		this._renderer.render(this._scene,this._camera);
	}
	,_onResize: function(object) {
		if(this._camera != null) {
		}
		this._renderer.setSize(window.innerWidth,window.innerHeight);
		this._camera.resize();
	}
};
var OsChecker = function() {
};
OsChecker.isMobile = function() {
	var s = OsChecker.osis();
	return s == OsChecker.IOS || s == OsChecker.ANDROID;
};
OsChecker.osis = function() {
	if(OsChecker._check("iPhone") >= 0 || OsChecker._check("iPad") >= 0 || OsChecker._check("iPod") >= 0) return OsChecker.IOS;
	if(OsChecker._check("Mac") >= 0) return OsChecker.MAC;
	if(OsChecker._check("Win") >= 0) return OsChecker.WIN;
	if(OsChecker._check("android") >= 0) return OsChecker.ANDROID;
	return OsChecker.ANDROID;
};
OsChecker._check = function(str) {
	return window.navigator.platform.indexOf(str);
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
var camera = {};
camera.ExCamera = function(fov,aspect,near,far) {
	this.tgtOffsetY = 0;
	this._isMobile = false;
	this.isActive = false;
	this.radY = 0;
	this.radX = -Math.PI / 2;
	this.amp = 3000.0;
	this._oRadY = 0;
	this._oRadX = 0;
	this._height = 0;
	this._width = 0;
	this._mouseY = 0;
	this._mouseX = 0;
	this._downY = 0;
	this._downX = 0;
	this._down = false;
	THREE.PerspectiveCamera.call(this,fov,aspect,near,far);
};
camera.ExCamera.__super__ = THREE.PerspectiveCamera;
camera.ExCamera.prototype = $extend(THREE.PerspectiveCamera.prototype,{
	init: function(dom) {
		this._camera = this;
		this._isMobile = OsChecker.isMobile();
		this.target = new THREE.Vector3();
		dom.onmousemove = $bind(this,this.onMouseMove);
		dom.onmousewheel = $bind(this,this.onMouseWheel);
		dom.ontouchmove = $bind(this,this.onMouseMove);
		dom.ontouchend = $bind(this,this.onMouseUp);
		window.addEventListener("DOMMouseScroll",$bind(this,this.onMouseWheelFF));
		this._dom = dom;
	}
	,getDist: function(w) {
		var hh = w / this.aspect * 0.5;
		var rad = this.fov * Math.PI / 180 / 2;
		var dist = hh / Math.tan(rad);
		return dist;
	}
	,_onResize: function() {
	}
	,onMouseWheelFF: function(e) {
	}
	,onMouseWheel: function(e) {
	}
	,onMouseUp: function(e) {
		e.preventDefault();
		this._down = false;
	}
	,onMouseDown: function(e) {
		e.preventDefault();
		this._down = true;
		if(this._isMobile) {
			var touch = e.touches[0];
			if(e.touches.length <= 1) {
				this._downX = touch.pageX;
				this._downY = touch.pageY;
			}
		} else {
			this._downX = e.clientX;
			this._downY = e.clientY;
		}
		this._oRadX = this.radX;
		this._oRadY = this.radY;
	}
	,onMouseMove: function(e) {
		e.preventDefault();
		if(this._isMobile) {
			var touch = e.touches[0];
			if(e.touches.length <= 1) {
				this._mouseX = touch.pageX;
				this._mouseY = touch.pageY;
			}
		} else {
			this._mouseX = e.clientX;
			this._mouseY = e.clientY;
		}
	}
	,update: function() {
		if(this._down) {
			var dx = -(this._mouseX - this._downX);
			var dy = this._mouseY - this._downY;
			this.radX = this._oRadX + dx / 100;
			this.radY = this._oRadY + dy / 100;
			if(this.radY > Math.PI / 6) this.radY = Math.PI / 6;
			if(this.radY < -Math.PI / 6) this.radY = -Math.PI / 6;
		}
		if(this._camera != null) this._updatePosition(0.25);
	}
	,setFOV: function(fov) {
		console.log("setFOV = " + fov);
		this._camera.fov = fov;
		this._camera.updateProjectionMatrix();
	}
	,resize: function() {
		this._width = window.innerWidth;
		this._height = window.innerHeight;
		this._camera.aspect = this._width / this._height;
		this._camera.updateProjectionMatrix();
		this.amp = this.getDist(3500);
	}
	,reset: function(target) {
		var p = this._camera.position;
		this.amp = Math.sqrt(p.x * p.x + p.y * p.y + p.z * p.z);
		this.radX = Math.atan2(p.x,p.z);
		this.radY = Math.atan2(p.y,p.z);
		this._updatePosition();
		if(target != null) this._camera.lookAt(target);
	}
	,setPolar: function(a,rx,ry) {
		this.amp = a;
		this.radX = rx;
		this.radY = ry;
		this._updatePosition();
	}
	,kill: function() {
		this._dom.onmousedown = null;
		this._dom.onmouseup = null;
		this._dom.onmousemove = null;
		this._dom.onmousewheel = null;
		window.removeEventListener("DOMMouseScroll",$bind(this,this.onMouseWheelFF));
	}
	,_updatePosition: function(spd) {
		if(spd == null) spd = 1;
		var amp1 = this.amp * Math.cos(this.radY);
		var x = this.target.x + amp1 * Math.sin(this.radX);
		var y = this.target.y + this.amp * Math.sin(this.radY);
		var z = this.target.z + amp1 * Math.cos(this.radX);
		this._camera.position.x += (x - this._camera.position.x) * spd;
		this._camera.position.y += (y - this._camera.position.y) * spd;
		this._camera.position.z += (z - this._camera.position.z) * spd;
		var t = this.target.clone();
		t.y += this.tgtOffsetY;
		this.target2 = t;
		this._camera.lookAt(t);
	}
});
var clock = {};
clock.DigitManager = function() {
};
clock.DigitManager.init = function() {
	clock.DigitManager.textures = [];
	var _g = 0;
	while(_g < 10) {
		var i = _g++;
		var tt = THREE.ImageUtils.loadTexture("./helv/w" + i + ".png");
		tt.magFilter = 1003;
		clock.DigitManager.textures.push(tt);
	}
	clock.DigitManager.digitMaterialsA = [];
	var _g1 = 0;
	while(_g1 < 10) {
		var i1 = _g1++;
		var m = clock.DigitManager._getMaterial(clock.DigitManager.textures[i1]);
		clock.DigitManager.digitMaterialsA.push(m);
	}
	clock.DigitManager.digitMaterialsB = [];
	var _g2 = 0;
	while(_g2 < 10) {
		var i2 = _g2++;
		var m2 = clock.DigitManager._getMaterial(clock.DigitManager.textures[i2]);
		m2.side = 1;
		m2.color.setHex(5592405);
		clock.DigitManager.digitMaterialsB.push(m2);
	}
	var tx = THREE.ImageUtils.loadTexture("./helv/wKoron.png");
	clock.DigitManager.koronA = clock.DigitManager._getMaterial(tx);
	clock.DigitManager.koronB = clock.DigitManager._getMaterial(tx);
	clock.DigitManager.koronB.side = 1;
	clock.DigitManager.koronB.color.setHex(5592405);
};
clock.DigitManager._getMaterial = function(tt) {
	return new THREE.MeshBasicMaterial({ alphaTest : 0.5, transparent : true, map : tt, shading : 1});
};
clock.DigitPlane = function() {
	this.SEGY = 14;
	this.SEGX = 20;
	this.rx = 0;
	this.offsetRot = 0;
	this._ww = 0.055;
	this._tgtR = 0;
	THREE.Object3D.call(this);
};
clock.DigitPlane.__super__ = THREE.Object3D;
clock.DigitPlane.prototype = $extend(THREE.Object3D.prototype,{
	init: function(xx) {
		this.rx = xx;
		var g = new THREE.PlaneGeometry(2000,500,this.SEGX,this.SEGY);
		var m1 = clock.DigitManager.digitMaterialsA[0];
		this._mesh1 = new THREE.Mesh(g,m1);
		this._mesh1.frustumCulled = false;
		this.add(this._mesh1);
		var m2 = clock.DigitManager.digitMaterialsB[0];
		this._mesh2 = new THREE.Mesh(g,m2);
		this._mesh2.frustumCulled = false;
		this.add(this._mesh2);
	}
	,update: function(r) {
		r += this.rx;
		r = r % 1;
		r = 0.05 + r * 0.9;
		this._mesh1.geometry.verticesNeedUpdate = true;
		this.offsetRot += (this._tgtR - this.offsetRot) / 10;
		var _g1 = 0;
		var _g = this.SEGX + 1;
		while(_g1 < _g) {
			var i = _g1++;
			var _g3 = 0;
			var _g2 = this.SEGY + 1;
			while(_g3 < _g2) {
				var j = _g3++;
				var index = j * (this.SEGX + 1) + i % (this.SEGX + 1);
				var vv = this._mesh1.geometry.vertices[index];
				var ratioX = 1 - i / this.SEGX;
				var ratioY = 1 - j / this.SEGY;
				var vec = Jiku.getPos(r - (ratioX - 0.5) * this._ww,ratioY * Math.PI,this.offsetRot);
				vv.x = vec.x;
				vv.y = vec.y;
				vv.z = vec.z;
			}
		}
	}
	,tweenRot: function(ratio,tgtR) {
		TweenMax.to(this,0.3,{ delay : ratio * 0.2, _tgtR : tgtR + this._tgtR});
	}
	,setNo: function(idx) {
		this._mesh1.material = clock.DigitManager.digitMaterialsA[idx];
		this._mesh2.material = clock.DigitManager.digitMaterialsB[idx];
	}
});
clock.DigitPlanes = function() {
	this._corons = [];
	this._nums = [];
	this._offset = 0;
	this._index = 0;
	this._sum = 0;
	this._keta1 = -1;
	THREE.Object3D.call(this);
};
clock.DigitPlanes.__super__ = THREE.Object3D;
clock.DigitPlanes.prototype = $extend(THREE.Object3D.prototype,{
	init: function() {
		this._planes = [];
		var _g = 0;
		while(_g < 3) {
			var i = _g++;
			var rr = 0.33;
			var or = i * 0.333;
			this._createDigit(or + rr * 0.10,false);
			this._createDigit(or + rr * 0.24,false);
			this._createDigit(or + rr * 0.33,true);
			this._createDigit(or + rr * 0.42,false);
			this._createDigit(or + rr * 0.56,false);
			this._createDigit(or + rr * 0.65,true);
			this._createDigit(or + rr * 0.74,false);
			this._createDigit(or + rr * 0.88,false);
		}
		this._calcTime();
		this._calcTime();
		this._calcTime();
		this.updateTime();
	}
	,_createDigit: function(r,koron) {
		var d;
		if(koron) d = new clock.KoronPlane(); else d = new clock.DigitPlane();
		d.init(r);
		this.add(d);
		d.update(0);
		this._planes.push(d);
		if(!koron) this._nums.push(d); else this._corons.push(d);
	}
	,updateTime: function() {
		this._calcTime();
		TweenMax.to(this,0.8,{ _offset : this._offset + 0.333333333333333315});
		var _g1 = 0;
		var _g = this._corons.length;
		while(_g1 < _g) {
			var i = _g1++;
			this._corons[i].visible = false;
		}
		haxe.Timer.delay($bind(this,this._tenmetsu),700);
		haxe.Timer.delay($bind(this,this.updateTime),1000);
	}
	,_tenmetsu: function() {
		var _g1 = 0;
		var _g = this._corons.length;
		while(_g1 < _g) {
			var i = _g1++;
			this._corons[i].visible = true;
		}
	}
	,_calcTime: function() {
		Jiku.setRandom();
		var date = new Date();
		var hh = date.getHours();
		var mm = date.getMinutes();
		var ss = date.getSeconds();
		this._index = this._index % 3;
		var n = (2 - this._index) * 6;
		this._nums[n].setNo(this._getKeta2(hh));
		this._nums[n + 1].setNo(this._getKeta1(hh));
		this._nums[n + 2].setNo(this._getKeta2(mm));
		this._nums[n + 3].setNo(this._getKeta1(mm));
		this._nums[n + 4].setNo(this._getKeta2(ss));
		this._nums[n + 5].setNo(this._getKeta1(ss));
		var _g = 0;
		while(_g < 3) {
			var nn = _g++;
			var tgtR = Math.PI * 0.4 + Math.random() * Math.PI;
			var _g1 = 0;
			while(_g1 < 8) {
				var i = _g1++;
				this._planes[nn * 8 + i].tweenRot(i / 8,tgtR);
			}
		}
		this._index++;
	}
	,_getKeta1: function(n) {
		return n % 10;
	}
	,_getKeta2: function(n) {
		return Math.floor(n / 10);
	}
	,update: function() {
		this._offset = this._offset % 1;
		var _g1 = 0;
		var _g = this._planes.length;
		while(_g1 < _g) {
			var i = _g1++;
			var d = this._planes[i];
			d.update(this._offset);
		}
	}
});
clock.KoronPlane = function() {
	clock.DigitPlane.call(this);
};
clock.KoronPlane.__super__ = clock.DigitPlane;
clock.KoronPlane.prototype = $extend(clock.DigitPlane.prototype,{
	init: function(xx) {
		this._ww = 0.01375;
		this.rx = xx;
		var g = new THREE.PlaneGeometry(2000,125.,this.SEGX,this.SEGY);
		var m1 = clock.DigitManager.koronA;
		this._mesh1 = new THREE.Mesh(g,m1);
		this._mesh1.frustumCulled = false;
		this.add(this._mesh1);
		var m2 = clock.DigitManager.koronB;
		this._mesh2 = new THREE.Mesh(g,m2);
		this._mesh2.frustumCulled = false;
		this.add(this._mesh2);
	}
	,setNo: function(idx) {
	}
});
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
Jiku.mouseX = 0;
Jiku.mouseY = 0;
Main.isCanvas = false;
OsChecker.WIN = "win";
OsChecker.MAC = "mac";
OsChecker.IOS = "ios";
OsChecker.ANDROID = "android";
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
clock.DigitPlanes.MAX_KETA = 9;
three._WebGLRenderer.RenderPrecision_Impl_.highp = "highp";
three._WebGLRenderer.RenderPrecision_Impl_.mediump = "mediump";
three._WebGLRenderer.RenderPrecision_Impl_.lowp = "lowp";
Main.main();
})();
