package data;

/**
 * ...
 * @author nabe
 */
class MapData
{

	public var id:String = "";
	public var image:String = "";
	public var map:String = "";
	public var title:String = "";
	public var region:String = "";
	
	public function new(o:Dynamic) 
	{
		
		if (o.region != "") {
			title = o.region +", " +o.country;
			region = o.region;
		}else {
			title = o.country;
			region = o.country;			
		}
		
		
		
		image = o.image;
		//image = "20160528125235.png";
		
		var imgAry:Array<String> = image.split("/");
		id = imgAry[imgAry.length - 1].split(".")[0];
		title = title.toUpperCase();
		
		map = o.map;//map url
		
		/*
		{
        "country":"Australia",
        "image":"https://www.gstatic.com/prettyearth/assets/full/1003.jpg",
        "map":"https://www.google.com/maps/@-10.040181,143.560709,12z/data=!3m1!1e3",
        "region":""
		*/
    

	}
	
}