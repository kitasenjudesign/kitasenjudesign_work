package typo;
import js.Browser;

/**
 * ...
 * @author nabe
 */
class PCChecker
{

	
	private static var _isInit:Bool = false;
	private static var _out:Bool = false;
	
	public function new() 
	{
		
	}
	
	public static function isPC():Bool {
		
		if (_isInit) {
			return _out;
		}
		
		_isInit = true;
		
		if ((Browser.navigator.userAgent.indexOf('iPhone') > 0 && 
			Browser.navigator.userAgent.indexOf('iPad') == -1) || 
			Browser.navigator.userAgent.indexOf('iPod') > 0 || 
			Browser.navigator.userAgent.indexOf('Android') > 0) {
			//location.href = '/sp/';
			
			_out = false;
		}
		
		_out= true;
		
		return _out;
	}
	
}