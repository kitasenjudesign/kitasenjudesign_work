import js.html.Text;
import js.html.webgl.Texture;
import js.Lib;
import js.three.*;
import js.Browser;
import js.three.Geometry;
import js.three.MeshNormalMaterial;
import js.three.ParticleBasicMaterial;
import js.three.ParticleSystem;
import js.three.Scene;
import js.three.Vector3;
import js.three.Vertex;

// port of canvas_geometry_earth.html
class Main 
{
	static private var _daes:Array<Object3D>;
    public static function main(){
        var mouseX:Float = 0;
        var mouseY:Float = 0;
        var container = Browser.document.body;
        
		var scene:Scene = new Scene();
        var camera:PerspectiveCamera
			= new PerspectiveCamera(60, Browser.window.innerWidth / Browser.window.innerHeight, 100, 50000);
		
		var renderer = new WebGLRenderer();
		var meshes:Array<Mesh> = [];
		
        camera.position.z = 3500;
        scene.add(camera);
        
		var dae:Object3D;
		var daeGeo:Geometry;
		var daeGeoSrc:Geometry;
		var skin;
		var loader = untyped __js__("new THREE.ColladaLoader()");
		//var loader = untyped __js__("getColladaLoader()");
		loader.options.convertUpAxis = true;
		
		loader.load( 'mae_face.dae', function ( collada ) {
			
			dae = collada.scene;
			//trace("unko " + collada);
			dae.scale.x = dae.scale.y = dae.scale.z = 600;
			skin = collada.skins[ 0 ];
			dae.updateMatrix();
			//untyped dae.children[0].children[0].material = new MeshNormalMaterial( { overdraw: 0.5 } );				
			//untyped dae.children[0].children[0].material = new MeshBasicMaterial( { color:0x0000ff, wireframe:true, wireframeLineWidth:0.5 } );
			daeGeo = untyped dae.children[0].children[0].geometry;
			daeGeoSrc = daeGeo.clone();
			//scene.add(untyped dae);
			
			
			//dae.children[0].children[0].material
			var g:Geometry = untyped dae.children[0].children[0].geometry;
			for(i in 0...g.vertices.length){
				//g.vertices[i].x += 1 * (Math.random16() - 0.5);
				//g.vertices[i].y += 1 * (Math.random16() - 0.5);
				//g.vertices[i].z += 1 * (Math.random16() - 0.5);
			}
			//trace( "geometry " + collada.scene.children[0].children[0].geometry );
			_cloneDAE(scene,dae);	
			renderer.render(scene, camera);
			
		});
		
			
		
		
		
		var directionalLight = new DirectionalLight(/*Math.random() * 0xffffff*/0xffffff );
			directionalLight.position.x = 10000*(Math.random16() - 0.5);
			directionalLight.position.y = 10000*(Math.random16() - 0.5);
			directionalLight.position.z = 10000;
			directionalLight.position.normalize();
			scene.add( directionalLight );
		
		var pointLight:PointLight = new PointLight( 0xffffff, 1 );
		pointLight.position = directionalLight.position;
		scene.add( pointLight );
		
		
        
		//_makeParticle(scene);
		
		
		
        renderer.setSize(Browser.window.innerWidth, Browser.window.innerHeight);
        Browser.document.body.appendChild(renderer.domElement);
        // When will haxe support things
        untyped Browser.document.addEventListener("mousemove", function(event){
            mouseX = (event.clientX - Browser.window.innerWidth / 2);
            mouseY = (event.clientY - Browser.window.innerHeight / 2);
        }, false);
        var run = null;
		var w:Float = 0;
		var h:Float = 0;
        //var timer = new haxe.Timer(30);
        run = function(f):Bool{
            
			Three.requestAnimationFrame(run);
		
			
			untyped __js__("daeGeo.verticesNeedUpdate = true");
			for(i in 0...daeGeo.vertices.length){
				daeGeo.vertices[i].x = daeGeoSrc.vertices[i].x +0.05 * (Math.random16() - 0.5);
				daeGeo.vertices[i].y = daeGeoSrc.vertices[i].y +0.05 * (Math.random16() - 0.5);
				daeGeo.vertices[i].z = daeGeoSrc.vertices[i].z +0.85 * (Math.random16() - 0.5);
			}
			
			/*
			for(i in 0..._daes.length){
				var g:Geometry = untyped _daes[i].children[0].children[0].geometry;
				untyped __js__("g.verticesNeedUpdate = true");
				for(i in 0...g.vertices.length){
					g.vertices[i].x += 0.001 * (Math.random16() - 0.5);
					g.vertices[i].y += 0.001 * (Math.random16() - 0.5);
					g.vertices[i].z += 0.001 * (Math.random16() - 0.5);
				}
				//_daes[i].updateMatrix();
			}
			*/
			
            if(w!=Browser.window.innerWidth || h!=Browser.window.innerHeight){
			  renderer.setSize(Browser.window.innerWidth, Browser.window.innerHeight);
			}
			w = Browser.window.innerWidth;
			h = Browser.window.innerHeight;
					
			camera.position.x += (mouseX*10 - camera.position.x) * 0.05;
            camera.position.y += (-mouseY*10 - camera.position.y) * 0.05;
            camera.lookAt(scene.position);
				   
            renderer.render(scene, camera);
            return true;
        }
        run(0);
		
		untyped Browser.document.body.onclick = function() {
			
			if( untyped __js__("this.webkitRequestFullScreen")) {
				untyped __js__("this.webkitRequestFullScreen()");
			}
			else if (untyped __js__("this. mozRequestFullScreen")) {
				untyped __js__("this.mozRequestFullScreen()");
			}
			else{
				//alert("not found")
			}
			
		};
    }
	
	static private function _cloneDAE(scene:Scene, dae:Object3D) 
	{
		
		var num:Int = 100;
		var x_num:Int = 10;
		_daes = [];
		for (i in 0...num){
			
			var dae2:Object3D = dae.clone();
			scene.add(dae2);
			dae2.position.x = (i % x_num) * 1000-1000*x_num/2;
			dae2.position.y = (i/num-0.5) * 12000;
			dae2.position.z = 0;
			_daes.push(dae2);
		}
		
		//return;

		/*
		var container:Object3D = new Object3D();
		var geo:Geometry = new Geometry();
		var meshItem:Mesh = new Mesh(untyped dae.children[0].children[0].geometry); // 立方体個別の要素
		
		//trace( "mesh " + untyped dae.children[0].children[0].geometry);
		//var meshItem:Mesh = new Mesh(new CubeGeometry(100, 100, 100));

		for (i in 0...30) {
			//trace("hoge " + untyped dae.getChildByName("mae_face__2_"));
			meshItem.scale.x = 600+300*Math.random16();
			meshItem.scale.y = 600+300*Math.random16();
			meshItem.scale.z = 600+300*Math.random16();
			
			meshItem.position.x = 6000 * (Math.random16() - 0.5);
			meshItem.position.y = 6000 * (Math.random16() - 0.5);
			meshItem.position.z = 100 * (Math.random16() - 0.5);
			GeometryUtils.merge(geo, meshItem); // マージ
		}

		var mesh:Mesh = new Mesh(geo, new MeshNormalMaterial( { overdraw: 1 } ));				

		
		//untyped dae.children[0].children[0].material);
		container.add(mesh);
		scene.add(container);
		*/
	}
	
	
	
	
	static private function _makeParticle(scene:Scene) 
	{
		var g:Geometry = new Geometry();
		var numParticles = 3000;
		for(i in 0...numParticles) {
			g.vertices.push(new Vertex(
				Math.random16() * 15000 - 7500,
				Math.random16() * 15000 - 7500,
				Math.random16() * 15000 - 7500
			));
		}
 
		// マテリアルを作成
		var material:ParticleBasicMaterial = new ParticleBasicMaterial(
			{
				size: 4, color: 0xffffff,transparent: true, depthTest: false
			}
		);
 
		// 物体を作成
		var mesh:ParticleSystem = new ParticleSystem(g, material);
		mesh.position = new Vector3(0, 0, -0);
		mesh.sortParticles = false;
		scene.add(mesh);
	
	}
}