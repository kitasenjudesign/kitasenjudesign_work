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
	}
	,remove: function(m) {
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
	,getShapes: function(moji,isCentering) {
		if(isCentering == null) isCentering = false;
		var scale = 1;
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
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
};
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
var Main = function() { };
Main.main = function() {
	window.onload = Main._init;
};
Main._init = function() {
	Main._main = new Main3d();
	Main._main.init();
};
var Main3d = function() {
	this._frame = 0;
};
Main3d.prototype = {
	init: function() {
		common.Dat.init();
		this._mojis = new common.Mojis();
		this._mojis.init($bind(this,this._onInit0));
	}
	,_onInit0: function() {
		this._camera = new camera.ExCamera(33.235,Main3d.W / Main3d.H,10,10000);
		this._camera.amp = 1000;
		this._scene = new THREE.Scene();
		this._video = new video.VideoPlayer();
		this._video.init(this._scene,this._camera,$bind(this,this._onInit2));
	}
	,_onInit2: function() {
		this._scene.add(this._mojis);
		this._scene.add(this._video);
		this._renderer = new THREE.WebGLRenderer({ alpha : true, antialias : true, devicePixelRatio : 1});
		this._renderer.localClippingEnabled = true;
		this._renderer.shadowMap.enabled = true;
		this._renderer.shadowMap.type = THREE.BasicShadowMap;
		this._renderer.setClearColor(new THREE.Color(0),0);
		this._renderer.setSize(Main3d.W,Main3d.H);
		this._renderer.domElement.style.position = "absolute";
		this._renderer.domElement.style.zIndex = "100";
		this._camera.init(this._renderer.domElement);
		window.document.body.appendChild(this._renderer.domElement);
		var light = new THREE.SpotLight(16777215,1.5);
		light.position.x = 300;
		light.position.y = 2000;
		light.position.z = 100;
		light.castShadow = true;
		
			light.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera( 30, 1, 200, 2000 ) );
			light.shadow.bias = -0.000222;
			light.shadow.mapSize.width = 1024;
			light.shadow.mapSize.height = 1024;		
		;
		this._scene.add(light);
		var a = new THREE.AmbientLight(3355443);
		this._scene.add(a);
		this._skyboxMat = new common.SkyboxTexture();
		this._skyboxMat.init(THREE.ImageUtils.loadTexture("mae_face.jpg"));
		this._skyboxMat.update(this._renderer);
		this._video.setInitCallback($bind(this,this._updateTexture));
		this._updateTexture();
		this.cube = new THREE.Mesh(new THREE.BoxGeometry(150,150,150,5,5,5),new THREE.MeshPhongMaterial({ color : 16777215, side : 2, refractionRatio : 0.98, reflectivity : 1}));
		this.cube.material.needsUpdate = true;
		this.cube.position.x = 0;
		this.cube.position.y = 150;
		var mm = new THREE.ShadowMaterial();
		mm.opacity = 0.3;
		this._ground = new THREE.Mesh(new THREE.PlaneGeometry(500,500,5,5),mm);
		this._ground.receiveShadow = true;
		this._ground.rotation.x = -Math.PI / 2;
		this._scene.add(this._ground);
		common.Dat.gui.add(this,"_frame",0,300).onChange($bind(this,this._update));
		common.Dat.gui.add(this._camera.rotation,"x").name("rotX").listen();
		common.Dat.gui.add(this._camera.rotation,"y").name("rotY").listen();
		common.Dat.gui.add(this._camera.rotation,"z").name("rotZ").listen();
		common.Dat.gui.add(this._camera.position,"x").name("posX").listen();
		common.Dat.gui.add(this._camera.position,"y").name("posY").listen();
		common.Dat.gui.add(this._camera.position,"z").name("posZ").listen();
		common.Dat.gui.add(this,"_updateTexture");
		window.onresize = $bind(this,this._onResize);
		this._onResize(null);
		this._run(true);
	}
	,_updateTexture: function() {
		this._skyboxMat.init(this._video.getTexture());
	}
	,_update: function() {
		this._run(false);
	}
	,_onResize: function(d) {
		Main3d.W = window.innerWidth;
		Main3d.H = Math.floor(Main3d.W * 9 / 16);
		var oy = -(Main3d.H - window.innerHeight) / 2;
		this._renderer.domElement.width = Main3d.W;
		this._renderer.domElement.height = Main3d.H;
		this._renderer.domElement.style.top = oy + "px";
		this._renderer.setSize(Main3d.W,Main3d.H);
		this._camera.aspect = Main3d.W / Main3d.H;
		this._camera.updateProjectionMatrix();
		this._video.resize(Main3d.W,Main3d.H,oy);
	}
	,_run: function(loop) {
		if(loop == null) loop = false;
		this._skyboxMat.update(this._renderer);
		this.cube.material.envMap = this._skyboxMat.getTexture();
		this._mojis.setEnvMap(this._skyboxMat.getTexture());
		this._video.update(this._camera);
		if(!this._video.getEnded()) this._mojis.update();
		this._renderer.render(this._scene,this._camera);
		if(loop) window.requestAnimationFrame($bind(this,this._run));
	}
	,fullscreen: function() {
		this._renderer.domElement.requestFullscreen();
	}
};
var IMap = function() { };
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
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
};
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
var camera = {};
camera.ExCamera = function(fov,aspect,near,far) {
	this._flag = false;
	this.tgtOffsetY = 0;
	this._countSpeed = 0;
	this._rAmp = 0;
	this._count = 0;
	this.isActive = false;
	this.radY = 0.001;
	this.radX = 0.001;
	this.amp = 300.0;
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
		this.target = new THREE.Vector3();
		dom.onmousedown = $bind(this,this.onMouseDown);
		dom.onmouseup = $bind(this,this.onMouseUp);
		dom.onmousemove = $bind(this,this.onMouseMove);
		dom.onmousewheel = $bind(this,this.onMouseWheel);
		window.addEventListener("DOMMouseScroll",$bind(this,this.onMouseWheelFF));
	}
	,_onResize: function() {
	}
	,onMouseWheelFF: function(e) {
		this.amp += e.detail * 0.5;
		if(this.amp > 18000) this.amp = 18000;
		if(this.amp < 100) this.amp = 100;
	}
	,onMouseWheel: function(e) {
		this.amp += e.wheelDelta * 0.5;
		if(this.amp > 18000) this.amp = 18000;
		if(this.amp < 100) this.amp = 100;
	}
	,onMouseUp: function(e) {
		e.preventDefault();
		this._down = false;
	}
	,onMouseDown: function(e) {
		e.preventDefault();
		this._down = true;
		this._downX = e.clientX;
		this._downY = e.clientY;
		this._oRadX = this.radX;
		this._oRadY = this.radY;
	}
	,onMouseMove: function(e) {
		e.preventDefault();
		this._mouseX = e.clientX;
		this._mouseY = e.clientY;
	}
	,update: function() {
		if(this._down) {
			var dx = -(this._mouseX - this._downX);
			var dy = this._mouseY - this._downY;
			this.radX = this._oRadX + dx / 100;
			this.radY = this._oRadY + dy / 100;
			if(this.radY > Math.PI / 2) this.radY = Math.PI / 2;
			if(this.radY < -Math.PI / 2) this.radY = -Math.PI / 2;
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
	}
	,reset: function(target) {
		var p = this._camera.position;
		this.amp = Math.sqrt(p.x * p.x + p.y * p.y + p.z * p.z);
		this.radX = Math.atan2(p.x,p.z);
		this.radY = Math.atan2(p.y,p.z);
		this._updatePosition();
		if(this.radY > Math.PI / 2 * 0.96) this.radY = Math.PI / 2 * 0.96;
		if(this.radY < -Math.PI / 2 * 0.96) this.radY = -Math.PI / 2 * 0.96;
		if(target != null) this._camera.lookAt(target);
	}
	,setPolar: function(a,rx,ry) {
		this.amp = a;
		this.radX = rx;
		this.radY = ry;
		this._updatePosition();
	}
	,setRAmp: function(rAmp,countSpeed) {
		this._flag = true;
		this._rAmp += rAmp;
		this._countSpeed += countSpeed;
	}
	,_onAmp: function() {
		this._flag = false;
	}
	,_updatePosition: function(spd) {
		if(spd == null) spd = 1;
		var amp1 = this.amp * Math.cos(this.radY);
		this._count += this._countSpeed;
		var ox = this._rAmp * Math.cos(this._count / 30 * 2 * Math.PI);
		var oy = this._rAmp * Math.sin(this._count / 30 * 2 * Math.PI);
		this._rAmp *= 0.97;
		this._countSpeed *= 0.95;
		var x = this.target.x + amp1 * Math.sin(this.radX) + ox;
		var y = this.target.y + this.amp * Math.sin(this.radY) + oy;
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
var common = {};
common.Dat = function() {
};
common.Dat.init = function() {
	common.Dat.bg = window.location.hash == "#bg";
	common.Dat.socket = new common.WSocket();
	common.Dat.socket.init();
	common.Dat.gui = new dat.GUI({ autoPlace: false });
	window.document.body.appendChild(common.Dat.gui.domElement);
	common.Dat.gui.domElement.style.position = "absolute";
	common.Dat.gui.domElement.style.right = "0px";
	common.Dat.gui.domElement.style.top = "0px";
	common.Dat.gui.domElement.style.opacity = 0.7;
	common.Dat.gui.domElement.style.zIndex = 999999;
	window.document.addEventListener("keydown",common.Dat._onKeyDown);
	common.Dat.show();
};
common.Dat._onKeyDown = function(e) {
	var _g = Std.parseInt(e.keyCode);
	switch(_g) {
	case 65:
		common.Dat.socket.send("UNKO " + Math.random());
		break;
	case 68:
		if(common.Dat.gui.domElement.style.display == "block") common.Dat.hide(); else common.Dat.show();
		break;
	case 49:
		window.location.href = "../../01/bin/";
		break;
	case 50:
		window.location.href = "../../02/bin/";
		break;
	case 51:
		window.location.href = "../../03/bin/";
		break;
	case 52:
		window.location.href = "../../04/bin/";
		break;
	case 53:
		window.location.href = "../../05/bin/";
		break;
	case 54:
		window.location.href = "../../06/bin/";
		break;
	}
};
common.Dat.show = function() {
	common.Dat.gui.domElement.style.display = "block";
};
common.Dat.hide = function() {
	common.Dat.gui.domElement.style.display = "none";
};
common.Mojis = function() {
	this._rad = 0;
	THREE.Object3D.call(this);
};
common.Mojis.__super__ = THREE.Object3D;
common.Mojis.prototype = $extend(THREE.Object3D.prototype,{
	init: function(callback) {
		this._callback = callback;
		this._shape = new FontShapeMaker();
		this._shape.init("AOTFProM4.json",$bind(this,this._onInitA));
	}
	,_onInitA: function() {
		this._loader = new objects.MyDAELoader();
		this._loader.load("dede_c4d.dae",$bind(this,this._onInit0));
	}
	,_onInit0: function() {
		var all = "北千住デザイン";
		var list = [];
		var nn = 8;
		var _g1 = 0;
		var _g = Math.floor(all.length / nn + 1);
		while(_g1 < _g) {
			var i = _g1++;
			list.push(HxOverrides.substr(all,i * nn,nn));
		}
		var space = 200;
		var spaceY = 250;
		var g = new THREE.Geometry();
		var _g11 = 0;
		var _g2 = list.length;
		while(_g11 < _g2) {
			var i1 = _g11++;
			var src = list[i1];
			var _g3 = 0;
			var _g21 = src.length;
			while(_g3 < _g21) {
				var j = _g3++;
				var shapes = this._shape.getShapes(HxOverrides.substr(src,j,1),true);
				var geo = new THREE.ExtrudeGeometry(shapes,{ bevelEnabled : true, amount : 50});
				var mat4 = new THREE.Matrix4();
				mat4.multiply(new THREE.Matrix4().makeScale(2,2,2));
				var vv = new THREE.Vector3((j * space - (nn - 1) / 2 * space) * 0.5,-i1 * spaceY * 0.5,0);
				mat4.multiply(new THREE.Matrix4().makeTranslation(vv.x,vv.y,vv.z));
				g.merge(geo,mat4);
			}
		}
		var p = new THREE.Plane(new THREE.Vector3(0,1,0),0.8);
		this._material = new THREE.MeshPhongMaterial({ color : 16777215});
		this._material.clippingPlanes = [p];
		this._material.clipShadows = true;
		this._meshes = [];
		var _g4 = 0;
		while(_g4 < 4) {
			var i2 = _g4++;
			var m = new THREE.Mesh(g,this._material);
			m.castShadow = true;
			var rr = Math.random() * 0.1;
			m.scale.set(0.2 + rr,0.2 + rr,0.2 + rr);
			m.position.y += 60 * (Math.random() - 0.5);
			this.add(m);
			this._meshes.push(m);
		}
		this._face = new THREE.Mesh(this._loader.geometry,this._material);
		this._face.scale.set(70,70,70);
		this._face.position.y = 30;
		this._face.castShadow = true;
		this.add(this._face);
		if(this._callback != null) this._callback();
	}
	,setEnvMap: function(texture) {
		this._material.envMap = texture;
	}
	,update: function() {
		if(this._face != null) {
			this._face.rotation.x += 0.01;
			this._face.rotation.y += 0.012;
			this._face.rotation.z += 0.013;
			this._face.position.y = 120 * Math.sin(this._rad) - 20;
			this._rad += 0.01;
		}
		var _g1 = 0;
		var _g = this._meshes.length;
		while(_g1 < _g) {
			var i = _g1++;
			this._meshes[i].rotation.x += 0.003 * (i + 1);
			this._meshes[i].rotation.y += 0.008 * (i + 1);
			this._meshes[i].rotation.z += 0.011 * (i + 1);
			this._face.position.y = 100 * Math.sin(this._rad + Math.PI / 2) + i * 10;
		}
	}
});
common.SkyboxTexture = function() {
};
common.SkyboxTexture.prototype = {
	init: function(texture) {
		if(this._scene == null) {
			this._cubeCam = new THREE.CubeCamera(10,500,256);
			this._boxMaterial = new THREE.MeshBasicMaterial({ color : 16777215, side : 2});
			this._scene = new THREE.Scene();
			this._scene.add(this._cubeCam);
			this._box = new THREE.Mesh(new THREE.SphereGeometry(100,10,10),this._boxMaterial);
			this._scene.add(this._box);
		}
		this._boxMaterial.map = texture;
	}
	,getTexture: function() {
		return this._cubeCam.renderTarget.texture;
	}
	,update: function(renderer) {
		this._cubeCam.updateCubeMap(renderer,this._scene);
	}
};
common.WSocket = function() {
};
common.WSocket.prototype = {
	init: function() {
		var win = window;
		if(win.io != null) {
			this._socket = io.connect();
			this._socket.on("server_to_client",$bind(this,this._onRecieve));
		} else {
		}
	}
	,send: function(msg) {
		if(this._socket != null) this._socket.emit("client_to_server",{ value : msg});
	}
	,_onRecieve: function(data) {
	}
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
var objects = {};
objects.MyDAELoader = function() {
};
objects.MyDAELoader.prototype = {
	load: function(filename,callback) {
		this._callback = callback;
		var loader = new THREE.ColladaLoader();
		loader.options.convertUpAxis = true;
		loader.load(filename,$bind(this,this._onComplete));
	}
	,_onComplete: function(collada) {
		this.dae = collada.scene;
		this.dae.scale.x = this.dae.scale.y = this.dae.scale.z = 80;
		this.geometry = this.dae.children[0].children[0].geometry;
		if(this._callback != null) this._callback();
	}
};
var sound = {};
sound.MyAudio = function() {
	this.globalVolume = 0.899;
	this.isStart = false;
	this._impulse = [];
};
sound.MyAudio.prototype = {
	init: function(callback) {
		this._callback = callback;
		sound.MyAudio.a = this;
		var nav = window.navigator;
		nav.getUserMedia = nav.getUserMedia || nav.webkitGetUserMedia || nav.mozGetUserMedia || nav.msGetUserMedia;
		nav.getUserMedia({ audio : true},$bind(this,this._handleSuccess),$bind(this,this._handleError));
	}
	,_handleError: function(evt) {
		window.alert("err");
	}
	,_handleSuccess: function(evt) {
		var audioContext = new AudioContext();
		var source = audioContext.createMediaStreamSource(evt);
		this.analyser = audioContext.createAnalyser();
		this.analyser.fftSize = 64;
		this._impulse = [];
		this.subFreqByteData = [];
		this.freqByteDataAry = [];
		this._oldFreqByteData = [];
		var _g = 0;
		while(_g < 64) {
			var i = _g++;
			this.subFreqByteData[i] = 0;
			this._oldFreqByteData[i] = 0;
		}
		source.connect(this.analyser,0);
		this.isStart = true;
		common.Dat.gui.add(this,"globalVolume",0.1,3).step(0.1);
		common.Dat.gui.add(this,"setImpulse");
		this.setImpulse();
		this.update();
		this._callback();
	}
	,update: function() {
		if(!this.isStart) {
			console.log("not work");
			return;
		}
		this.freqByteData = new Uint8Array(this.analyser.frequencyBinCount);
		this.analyser.getByteFrequencyData(this.freqByteData);
		var _g1 = 0;
		var _g = this.freqByteData.length;
		while(_g1 < _g) {
			var i = _g1++;
			this.subFreqByteData[i] = this.freqByteData[i] - this._oldFreqByteData[i];
		}
		var _g11 = 0;
		var _g2 = this.freqByteData.length;
		while(_g11 < _g2) {
			var i1 = _g11++;
			this._oldFreqByteData[i1] = this.freqByteData[i1];
		}
		this.timeData = new Uint8Array(this.analyser.fftSize);
		this.analyser.getByteTimeDomainData(this.timeData);
		var _g12 = 0;
		var _g3 = this.freqByteData.length;
		while(_g12 < _g3) {
			var i2 = _g12++;
			this.freqByteData[i2] = Math.floor(this.freqByteData[i2] * this.globalVolume) + Math.floor(this._impulse[i2]);
		}
		var _g13 = 0;
		var _g4 = this.freqByteData.length;
		while(_g13 < _g4) {
			var i3 = _g13++;
			this.subFreqByteData[i3] = Math.floor(this.subFreqByteData[i3] * this.globalVolume);
		}
		var _g14 = 0;
		var _g5 = this.freqByteData.length;
		while(_g14 < _g5) {
			var i4 = _g14++;
			this.timeData[i4] = Math.floor(this.timeData[i4] * this.globalVolume);
		}
		var _g15 = 0;
		var _g6 = this.freqByteData.length;
		while(_g15 < _g6) {
			var i5 = _g15++;
			this.freqByteDataAry[i5] = this.freqByteData[i5];
		}
		this._updateInpulse();
	}
	,_updateInpulse: function() {
		var _g = 0;
		while(_g < 64) {
			var i = _g++;
			this._impulse[i] += (0 - this._impulse[i]) / 2;
		}
	}
	,setImpulse: function(stlength) {
		if(stlength == null) stlength = 1;
		var _g = 0;
		while(_g < 64) {
			var i = _g++;
			this._impulse[i] = 255 * Math.random() * stlength;
		}
	}
};
var three = {};
three.Face = function() { };
three.IFog = function() { };
three.Mapping = function() { };
three.Renderer = function() { };
three._WebGLRenderer = {};
three._WebGLRenderer.RenderPrecision_Impl_ = function() { };
var video = {};
video.CameraData = function() {
	this._fov = 0;
	this._qw = 0.001;
	this._qz = 0.001;
	this._qy = 0.001;
	this._qx = 0.001;
	this._rz = 0.001;
	this._ry = 0.001;
	this._rx = 0.001;
};
video.CameraData.prototype = {
	load: function(filename,callback) {
		this._callback = callback;
		this._http = new haxe.Http(filename);
		this._http.onData = $bind(this,this._onData);
		this._http.request();
	}
	,_onData: function(data) {
		var data1 = JSON.parse(data);
		this._frameData = data1.frames;
		this._points = data1.points;
		if(this._callback != null) this._callback();
	}
	,getPointsGeo: function() {
		var g = new THREE.Geometry();
		if(this._points == null) return g;
		var _g1 = 0;
		var _g = this._points.length;
		while(_g1 < _g) {
			var i = _g1++;
			g.vertices.push(new THREE.Vector3(this._points[i][0],this._points[i][1],-this._points[i][2]));
		}
		return g;
	}
	,getFrameData: function(frame) {
		return this._frameData[frame];
	}
	,update: function(f,cam) {
		if(f >= this._frameData.length) return;
		var q = this._frameData[f].q;
		var qtn = new THREE.Quaternion(q[0],q[1],q[2],q[3]);
		cam.quaternion.copy(qtn);
		cam.position.x = this._frameData[f].x;
		cam.position.y = this._frameData[f].y;
		cam.position.z = this._frameData[f].z;
		this._qx = q[0];
		this._qy = q[1];
		this._qz = q[2];
		if(Math.abs(this._fov - this._frameData[f].fov) > 0.5) {
			this._fov = this._frameData[f].fov;
			console.log("change fov");
			cam.setFOV(this._fov);
		}
	}
	,getV: function(f) {
		return new THREE.Vector3(this._frameData[f].x,this._frameData[f].y,this._frameData[f].z);
	}
	,getQ: function(f) {
		var q = this._frameData[f].q;
		var qtn = new THREE.Quaternion(q[0],q[1],q[2],q[3]);
		return qtn;
	}
	,_getMatrix: function(a) {
		var m = new THREE.Matrix4();
		m.set(a[0],a[1],a[2],a[3],a[4],a[5],a[6],a[7],a[8],a[9],a[10],a[11],a[12],a[13],a[14],a[15]);
		return m;
	}
};
video.Config = function() {
};
video.Config.prototype = {
	load: function(filename,callback) {
		this._callback = callback;
		this._http = new haxe.Http(filename);
		this._http.onData = $bind(this,this._onData);
		this._http.request();
	}
	,_onData: function(data) {
		var d = JSON.parse(data);
		this.list = [];
		var _g1 = 0;
		var _g = d.data.length;
		while(_g1 < _g) {
			var i = _g1++;
			this.list.push(new video.MovieData(d.data[i]));
		}
		if(this._callback != null) this._callback();
	}
};
video.MovieData = function(o) {
	this.offset = 0;
	if(o != null) {
		this.pathCam = o.cam;
		this.pathMov = o.mov;
		this.offset = o.offset;
	}
};
video.MovieData.prototype = {
	loadCamData: function(callback) {
		if(this.camData != null) {
			callback();
			return;
		}
		this.camData = new video.CameraData();
		this.camData.load(this.pathCam,callback);
	}
};
video.VideoPlayer = function() {
	this._isTweening = false;
	this._loading = false;
	this._fov = 34;
	this._index = 0;
	THREE.Object3D.call(this);
};
video.VideoPlayer.__super__ = THREE.Object3D;
video.VideoPlayer.prototype = $extend(THREE.Object3D.prototype,{
	init: function(scene,camera,callback) {
		this._scene = scene;
		this._tgt = new THREE.Vector3();
		this._camera = camera;
		this._callback = callback;
		this._config = new video.Config();
		this._config.load("config.json",$bind(this,this._onInit));
	}
	,_onInit: function() {
		this._list = this._config.list;
		var _this = window.document;
		this._video = _this.createElement("video");
		this._video.style.position = "absolute";
		this._video.style.zIndex = "0";
		this._video.style.top = "0";
		this._video.style.left = "0";
		window.document.body.appendChild(this._video);
		this.setInitCallback(this._callback);
		this._start();
	}
	,setInitCallback: function(cb) {
		this._callback2 = cb;
	}
	,_start: function() {
		this._loading = true;
		var nextIndex = Math.floor(Math.random() * this._list.length);
		if(this._index == nextIndex) {
			this._index = this._index + 1;
			this._index = this._index % this._list.length;
		} else this._index = nextIndex;
		this._video.src = "";
		this._movieData = this._list[this._index];
		this._movieData.loadCamData($bind(this,this._onLoad));
		window.onmousedown = $bind(this,this._onDown);
	}
	,_onDown: function(e) {
		if(!this._isTweening) this._onFinish(null);
	}
	,_onLoad: function() {
		this._video.src = this._movieData.pathMov;
		this._video.style.display = "none";
		this._video.addEventListener("canplay",$bind(this,this._onLoad2));
	}
	,_onLoad2: function(e) {
		this._camData = this._movieData.camData;
		var frameData = this._camData.getFrameData(0);
		this._plane2 = this._makePlane2(this._camData.getQ(0),this._camData.getV(0),frameData.fov,true);
		this._scene.add(this._plane2);
		this._isTweening = true;
		var o = new THREE.Object3D();
		var q = frameData.q;
		this._q = new THREE.Quaternion(q[0],q[1],q[2],q[3]);
		o.quaternion.copy(this._q);
		var camTgtPos = new THREE.Vector3(frameData.x,frameData.y,frameData.z);
		var time = 2.5;
		TweenMax.to(this,time,{ _fov : frameData.fov, onUpdateFov : $bind(this,this._onUpdateFov), ease : Sine.easeInOut});
		TweenMax.to(this._camera.position,time,{ x : camTgtPos.x, y : camTgtPos.y, z : camTgtPos.z, ease : Sine.easeInOut});
		TweenMax.to(this._camera.quaternion,time,{ x : this._q.x, y : this._q.y, z : this._q.z, w : this._q.w, onComplete : $bind(this,this._start2), ease : Power0.easeInOut});
		if(this._plane != null) TweenMax.to(this._plane.scale,time * 0.95,{ x : 0, y : 0, z : 0, ease : Sine.easeIn});
	}
	,_onUpdateLook: function() {
		this._camera.lookAt(this._tgt);
	}
	,_onUpdateFov: function() {
		this._camera.setFOV(this._fov);
	}
	,_start2: function() {
		if(this._plane != null) this._scene.remove(this._plane);
		if(this._plane2 != null) this._scene.remove(this._plane2);
		this._loading = false;
		this._isTweening = false;
		this._video.addEventListener("ended",$bind(this,this._onFinish));
		this._video.style.display = "block";
		this._video.play();
		window.document.addEventListener("keydown",$bind(this,this._onKeyDown));
		if(this._callback2 != null) this._callback2();
	}
	,_onKeyDown: function(e) {
		var _g = Std.parseInt(e.keyCode);
		switch(_g) {
		case 39:
			this._onFinish(null);
			break;
		}
	}
	,_onFinish: function(hoge) {
		this._video.removeEventListener("ended",$bind(this,this._onFinish));
		this._plane = this._makePlane(this._camera.quaternion,this._camera.position,this._camera.fov,false);
		this._scene.add(this._plane);
		this._start();
	}
	,_makePlane: function(q,lookPos,fov,isWire) {
		var tex = this.getTexture();
		tex.needsUpdate = true;
		return this._makePlane2(q,lookPos,fov,isWire,tex);
	}
	,_makePlane2: function(q,lookPos,fov,isWire,tex) {
		var p = new THREE.Mesh(new THREE.PlaneGeometry(960,540,3,3),new THREE.MeshBasicMaterial({ color : 16777215, side : 0, map : tex, wireframe : isWire}));
		var dis = this.getDist(this._camera,960,fov);
		var pos = new THREE.Vector3(0,0,-dis);
		pos.applyQuaternion(q);
		p.position.copy(lookPos.clone().add(pos));
		p.quaternion.copy(q.clone());
		return p;
	}
	,getTexture: function() {
		var canvas;
		var _this = window.document;
		canvas = _this.createElement("canvas");
		var ww = 512;
		var hh = 512;
		canvas.width = ww;
		canvas.height = hh;
		var contex = canvas.getContext("2d");
		contex.drawImage(this._video,0,0,960,540,0,0,ww,hh);
		var tex = new THREE.Texture(canvas);
		tex.needsUpdate = true;
		return tex;
	}
	,getDist: function(camera,width,fov) {
		var h = width / camera.aspect * 0.5;
		var rad = fov * Math.PI / 180 * 0.5;
		var dist = h / Math.tan(rad);
		return dist;
	}
	,next: function() {
	}
	,update: function(camera) {
		if(this._camData != null && !this._loading) this._camData.update(Math.floor(this._video.currentTime * 30) + this._movieData.offset,camera);
	}
	,getEnded: function() {
		if(this._video != null) return this._video.ended; else return true;
	}
	,resize: function(w,h,oy) {
		this._video.width = w;
		this._video.height = h;
		this._video.style.top = oy + "px";
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
Main3d.W = 960;
Main3d.H = 540;
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
common.Dat.UP = 38;
common.Dat.DOWN = 40;
common.Dat.LEFT = 37;
common.Dat.RIGHT = 39;
common.Dat.K1 = 49;
common.Dat.K2 = 50;
common.Dat.K3 = 51;
common.Dat.K4 = 52;
common.Dat.K5 = 53;
common.Dat.K6 = 54;
common.Dat.K7 = 55;
common.Dat.K8 = 56;
common.Dat.K9 = 57;
common.Dat.K0 = 58;
common.Dat.A = 65;
common.Dat.B = 66;
common.Dat.C = 67;
common.Dat.D = 68;
common.Dat.E = 69;
common.Dat.F = 70;
common.Dat.G = 71;
common.Dat.H = 72;
common.Dat.I = 73;
common.Dat.J = 74;
common.Dat.K = 75;
common.Dat.L = 76;
common.Dat.M = 77;
common.Dat.N = 78;
common.Dat.O = 79;
common.Dat.P = 80;
common.Dat.Q = 81;
common.Dat.R = 82;
common.Dat.S = 83;
common.Dat.T = 84;
common.Dat.U = 85;
common.Dat.V = 86;
common.Dat.W = 87;
common.Dat.X = 88;
common.Dat.Y = 89;
common.Dat.Z = 90;
common.Dat.hoge = 0;
common.Dat.bg = false;
common.Dat._showing = true;
sound.MyAudio.FFTSIZE = 64;
three._WebGLRenderer.RenderPrecision_Impl_.highp = "highp";
three._WebGLRenderer.RenderPrecision_Impl_.mediump = "mediump";
three._WebGLRenderer.RenderPrecision_Impl_.lowp = "lowp";
Main.main();
})();

//# sourceMappingURL=haxetest.js.map