package video;
import camera.ExCamera;
import common.Dat;
import haxe.Http;
import haxe.Json;
import three.Geometry;
import three.Matrix3;
import three.Matrix4;
import three.PerspectiveCamera;
import three.Quaternion;
import three.Vector3;

/**
 * ...
 * @author watanabe
 */
class CameraData
{

	private var _frameData:Array<Dynamic>;
	private var _callback:Void->Void;
	private var _http:Http;
	
	private var _rx:Float = 0.001;
	private var _ry:Float = 0.001;
	private var _rz:Float = 0.001;

	private var _qx:Float = 0.001;
	private var _qy:Float = 0.001;
	private var _qz:Float = 0.001;
	private var _qw:Float = 0.001;

	private var _fov:Float = 0;
	private var _points:Array<Array<Float>>;
	
	public function new() 
	{
		
	}
	
	public function load(filename:String,callback:Void->Void):Void {
		_callback = callback;

		_http = new Http(filename);
		//_http = new Http("cam.json");
		
		_http.onData = _onData;
		_http.request();
		
		/*
		Dat.gui.add(this, "_rx",0,6.288).listen();
		Dat.gui.add(this, "_ry",0,6.288).listen();
		Dat.gui.add(this, "_rz",0,6.288).listen();
		Dat.gui.add(this, "_qx",0,6.288).listen();
		Dat.gui.add(this, "_qy",0,6.288).listen();
		Dat.gui.add(this, "_qz", 0, 6.288).listen();		
		*/
	}
	
	private function _onData(data:String):Void {
		var data:Dynamic = Json.parse(data);
		_frameData = data.frames;
		_points = data.points;
		if (_callback != null) {
			_callback();
		}
	}
	
	public function getPointsGeo():Geometry {
		var g:Geometry = new Geometry();
		if (_points == null) return g;
		
		for ( i in 0..._points.length) {
			g.vertices.push(new Vector3(
				_points[i][0],
				_points[i][1],
				-_points[i][2]				
			));
		}
		return g;
	}
	
	public function getFrameData(frame:Int):Dynamic {
		
		return _frameData[frame];
	}
	
	public function update(f:Int,cam:ExCamera):Void {
		
		//var f:Int = Math.floor( sec * 30 );
		//f = f + 1;
		if (f >= _frameData.length) {
			return;
		}
		
		//var m:Matrix4 = _getMatrix( cast _frameData[f].matrix );
		//var m3:Matrix3;

				
		//cam.quaternion.copy(new Quaternion());
		//cam.fov = 90;
		//cam.aspect = 960 / 540;
		//cam.updateProjectionMatrix();
		
		var q:Array<Float> = _frameData[f].q;
		var qtn:Quaternion = new Quaternion( q[0],q[1],q[2],q[3] );
		cam.quaternion.copy(qtn);
		//cam.matrixWorldNeedsUpdate = true;		
		
		cam.position.x = _frameData[f].x;
		cam.position.y = _frameData[f].y;
		cam.position.z = _frameData[f].z;
		//cam.lookAt(new Vector3());
		
		_qx = q[0];
		_qy = q[1];
		_qz = q[2];
		
		
		//cam.updateProjectionMatrix();
		
		
		if ( Math.abs(_fov - _frameData[f].fov)>0.5 ) {
			_fov = _frameData[f].fov;
			trace("change fov");
			cam.setFOV(_fov);
		}
		
		//cam.rotation.x = -_frameData[f].rx;// + Math.PI;/
		//cam.rotation.y = (_frameData[f].ry + Math.PI / 2);
		//cam.rotation.z = (_frameData[f].rz + Math.PI / 2);
		//1.5448059619901175 -0.07311934349048452 0.01731460889114662
		
		//cam.lookAt(new Vector3());
		//-1.534600629033358 1.444071496929365 1.5343082933466674
		
		//Math.PI=3.14
		//Math.PI/2=1.57
		
		//trace( f + "__" + cam.rotation.x + " " + cam.rotation.y + " " + cam.rotation.z );
		//trace( f + "__" + cam.position.x + " " + cam.position.y + " " + cam.position.z );
		
	}
	
	public function getV(f:Int):Vector3
	{
		return new Vector3(_frameData[f].x,_frameData[f].y,_frameData[f].z);
	}	
	
	public function getQ(f:Int):Quaternion
	{
		var q:Array<Float> = _frameData[f].q;
		var qtn:Quaternion = new Quaternion( q[0], q[1], q[2], q[3] );
		return qtn;
	}
	
	private function _getMatrix(a:Array<Float>):Matrix4 {
		
		 var m:Matrix4 = new Matrix4();
		 m.set(
			a[0], a[1], a[2], a[3],
			a[4], a[5], a[6], a[7],
			a[8], a[9], a[10], a[11],
			a[12], a[13], a[14], a[15]
		);
		return m;
	}
	
	
}