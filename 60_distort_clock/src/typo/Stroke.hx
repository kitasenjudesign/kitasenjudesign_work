package typo;
import createjs.easeljs.Point;

/**
 * ...
 * @author nab
 */
class Stroke
{

		private var _points:Array = [];
		private var _distance:Float = 0;
		private var _currentDist:Float = 0;
		
		public function Stroke() 
		{
			
		}

		public function init(points:Array<Point>):void {
			
			_points = points;
			
			for (var i:int = 0; i < _points.length-1; i++) {
				var p1:Point = _points[i];
				var p2:Point = _points[i + 1];
				var dx:Float = p2.x - p1.x;
				var dy:Float = p2.y - p1.y;
				var d:Float = Math.sqrt(dx * dx + dy * dy);
				_distance += d;
			}

		}
		
		public function getNextPosition(dx:Float):Point {
			
			if (_currentDist >= _distance) _currentDist = 0;
			_currentDist += dx;
			return getPosition( _currentDist / _distance );
			
		}
		
		
		public function getPosition(ratio:Float):Point {
			
			if (ratio < 0) ratio = 0;
			if (ratio >= 1) ratio = 1;
			
			var n			:Float = ratio * (_points.length-1);
			var r			:Float = Math.ceil(n) - n;

			//線形補完
			var p1:Point = _points[ Math.floor( n ) ];
			var p2:Point = _points[ Math.floor( n ) + 1 ];
			var p:Point;
			
			if(p1 && p2){
				var xx:Float = r * p1.x + (1 - r) * p2.x;
				var yy:Float = r * p1.y + (1 - r) * p2.y;
				p = new Point(xx, yy);
			}else {
				if (p1) p = p1;
				if (p2) p = p2;
			}
			
			return p;
		}
		
		public function getDistance():Float 
		{
			return _distance;
		}
		
			
}