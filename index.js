
var ef;
var camera;
var myscene;

window.onload = function()
{
  main();
};

function main()
{
  myscene = document.querySelector('a-scene');

  ef = new Plane();
  ef.addPlaneObject('./assets/models/eurofighter.obj','ef1');
  ef.addPlaneScale( 0.1 , 0.1 , 0.1 );
  ef.addColor(myscene);
  ef.addPosition( 0 , 5 , -5 );
  ef.addToScene(myscene);

  camera = new Camera();
  camera.attach(ef.getPlane());

  ef.setCameraTofront(camera.getCamera());
  //window.setTimeout(function(){ef.setCameraToBack(camera.getCamera());},5000);

  initGround();
  window.setInterval(function(){run();},5);
};

function run()
{
  ef.updateStatus();
}

function initGround()
{
  ground = document.createElement('a-plane');
  ground.setAttribute('height',50);
  ground.setAttribute('width',50);
  ground.setAttribute('position', {x: 0, y: 0, z: 0});
  ground.setAttribute('rotation', {x: -90, y: 0, z: 0});
  ground.setAttribute('color','green');
  myscene.appendChild(ground);
}

class Camera
{
  constructor()
  {
    this.camera = document.createElement('a-entity');
    this.camera.setAttribute('camera', 'active', true);
    this.camera.setAttribute('look-controls','enabled',true);
    this.camera.setAttribute('wasd-controls');
    //this.camera.setAttribute('data-aframe-default-camera');
    this.camera.setAttribute('id', 'camera');
  }

  addToScene(myscene)
  {
    myscene.appendChild(this.camera);
  }

  changePosition(x,y,z)
  {
    this.camera.setAttribute('position', {x: x, y: y, z: z});
  }

  attach(plane)
  {
    plane.appendChild(this.camera);
  }

  getCamera()
  {
    return this.camera
  }

}


class Plane
{
  constructor()
  {
    //this.radar               = radar;
    //this.cockpit             = cockpit;
    this.thrust              = 0;
    this.object              = document.createElement('a-entity');
    this.objectRepresetation = document.createElement('a-entity');
  }

  addPlaneObject( Objectpath, ObjectId )
  {
    this.object.setAttribute('src', Objectpath);
    this.object.setAttribute('id', ObjectId);
    this.objectRepresetation.setAttribute('obj-model', 'obj: #' + ObjectId);
    this.objectRepresetation.setAttribute('id', ObjectId + 'rep');
  }

  addPlaneScale( x , y , z )
  {
    this.objectRepresetation.setAttribute('scale', {x: x, y: y, z: z});
  }

  addColor()
  {
    this.objectRepresetation.setAttribute('material','color: #000000;');
  }

  addPosition( x , y , z )
  {
    this.objectRepresetation.setAttribute('position', {x: x, y: y, z: z} );
  }

  addToScene(myscene)
  {
    myscene.appendChild(this.object);
    myscene.appendChild(this.objectRepresetation);
  }

  setCameraTofront(camera)
  {
    camera.setAttribute('position', {x: 0, y: 1, z: -4} );
    camera.setAttribute('camera', 'active', true);
  }

  setCameraToBack(camera)
  {
    camera.setAttribute('position', {x: 0, y: 4, z: 4} );
    camera.setAttribute('camera', 'active', true);
  }

  getPlane()
  {
    return this.objectRepresetation;
  }

  updateStatus()
  {
    var position = this.objectRepresetation.getAttribute('position');
    var x = position.x;
    var y = position.y;
    var z = position.z;
    this.objectRepresetation.setAttribute('position', {x: x, y: y, z: z-+ this.thrust} );
  }

  setThrust(thrust)
  {
    this.thrust = thrust;
  }

}

class Radar
{

}

class Cockpit
{

}

window.addEventListener("keydown", function (event)
{
  //alert(event.key);
  if (event.key == "s")
  {
    ef.setCameraTofront(camera.getCamera());
  }
  if(event.key == "v"){
    ef.setCameraToBack(camera.getCamera());
  }
  if(event.key == "F4"){
    console.log("Full thrust");
    ef.setThrust(0.1);
  }
  console.log(event.key);
});