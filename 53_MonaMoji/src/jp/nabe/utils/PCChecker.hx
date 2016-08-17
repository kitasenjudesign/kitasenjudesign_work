package jp.nabe.utils;
import js.Browser;

/**
 * ...
 * @author nabe
 */
class PCChecker
{

	public function new() 
	{
		
	}
	
	public static function isPC():Bool {
		
		if ((Browser.navigator.userAgent.indexOf('iPhone') > 0 && 
			Browser.navigator.userAgent.indexOf('iPad') == -1) || 
			Browser.navigator.userAgent.indexOf('iPod') > 0 || 
			Browser.navigator.userAgent.indexOf('Android') > 0) {
			//location.href = '/sp/';
			
			return false;
		}
		
		return true;
		
	}
	
}