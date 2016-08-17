package data;

/**
 * ...
 * @author watanabe
 */
class MotionData
{

	public var speedX:Float = 0;
	public var speedY:Float = 0;
	public var speedR:Float = 0;
	
	public static var R1:MotionData = new MotionData( 0, 0, 0.5 );
	public static var R2:MotionData = new MotionData( 0, 0, -0.5 );
	public static var Y1:MotionData = new MotionData( 0, 1, 0 );
	public static var Y2:MotionData = new MotionData( 0, -1, 0 );
	public static var XY1:MotionData = new MotionData( 0.25, -1, 0 );
	public static var XY2:MotionData = new MotionData( -0.25, 1, 0 );
	public static var XYR:MotionData = new MotionData( 0, 0.25, 0.5 );
	public static var XYR2:MotionData = new MotionData( 0.25, 1, 0.5 );
	
	
	private static var list:Array<MotionData> = [
		R1,R2,R1,R2,Y1,Y2,XY1,XY2,XYR,XYR2
	];
	//private static var 
	
	public function new(xx:Float,yy:Float,rr:Float) 
	{
		
		speedX = xx;
		speedY = yy;
		speedR = rr;
		
	}
	
	
	public static function getData():MotionData {
		
		return list[ Math.floor( Math.random() * list.length ) ];
		
	}
}