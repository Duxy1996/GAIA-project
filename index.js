
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
  ef.setPosition( 0 , 5 , -5 );
  ef.addToScene(myscene);

  camera = new Camera();
  camera.attach(ef.getPlane());

  ef.setCameraTofront(camera.getCamera());
  //window.setTimeout(function(){ef.setCameraToBack(camera.getCamera());},5000);

  initGround();
  window.setInterval(function(){run();},50);
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

class Engine
{
  constructor(pitch,direction,roll)
  {
    this.direction           = direction;

    this.roll                = roll;
    this.pitch               = pitch;
    this.yaw                 = 0;

    this.thrust              = 0;
    this.thrustInX           = 0;
    this.thrustInY           = 0;
    this.thrustInZ           = 0;
  }


  setThrust(thrust)
  {
    this.thrust = thrust;
  }

  updateDirection(direction)
  {
    this.direction = direction;
  }

  updatePitch(pitch)
  {
    this.pitch = pitch;
  }

  updateThrust()
  {
    this.thrustInX = -Math.sin(THREE.Math.degToRad(this.direction)) * this.thrust * Math.cos(THREE.Math.degToRad(this.pitch));
    this.thrustInY =  Math.sin(THREE.Math.degToRad(this.pitch)) * this.thrust * Math.cos(THREE.Math.degToRad(this.roll));
    this.thrustInZ = -Math.cos(THREE.Math.degToRad(this.direction)) * this.thrust * Math.cos(THREE.Math.degToRad(this.pitch));

    //console.log(this.thrustInX,this.thrustInY,this.thrustInZ);
  }

}

class Plane
{
  constructor()
  {
    //this.radar               = radar;
    //this.cockpit             = cockpit;

    this.roll                = 0;
    this.pitch               = 0;
    this.yaw                 = 0;

    this.direction           = 0;

    this.thrust              = 0;
    this.object              = document.createElement('a-entity');
    this.objectRepresetation = document.createElement('a-entity');

    this.engine              = new Engine(this.pitch,this.direction,this.roll);
    this.engine.updateThrust();

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

  setPosition( x , y , z )
  {
    this.objectRepresetation.setAttribute('position', {x: x, y: y, z: z} );
  }

  setRotation()
  {
    var rollX = this.roll * Math.sin(THREE.Math.degToRad(this.direction)) * Math.cos(THREE.Math.degToRad(this.pitch)) * Math.cos(THREE.Math.degToRad(this.roll));
    var rollY = this.roll * Math.sin(THREE.Math.degToRad(this.pitch));
    var rollZ = this.roll * Math.cos(THREE.Math.degToRad(this.pitch)) * Math.cos(THREE.Math.degToRad(this.direction));

    var pitchX = this.pitch * Math.cos(THREE.Math.degToRad(this.roll)) * Math.cos(THREE.Math.degToRad(this.direction));
    var pitchY = this.pitch * Math.sin(THREE.Math.degToRad(this.roll));
    var pitchZ = this.pitch * Math.sin(THREE.Math.degToRad(this.direction)) * Math.sin(THREE.Math.degToRad(this.direction));

    console.log(this.pitch, this.direction, this.roll);
    console.log(rollX,pitchX,rollY , pitchY,rollZ , pitchZ);
    console.log(rollX + pitchX,rollY + pitchY,rollZ + pitchZ);

    this.objectRepresetation.setAttribute('rotation', {x: rollX + pitchX, y: rollY + pitchY, z: rollZ + pitchZ} );
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
    camera.setAttribute('position', {x: 0, y: 4, z: 4});
    camera.setAttribute('camera', 'active', true);
  }

  getPlane()
  {
    return this.objectRepresetation;
  }

  updateStatus()
  {
    this.setRotation();
    this.engine.updateDirection(this.direction);
    this.engine.updatePitch(this.pitch);
    var position = this.objectRepresetation.getAttribute('position');
    this.engine.updateThrust();
    var x = position.x + this.engine.thrustInX;
    var y = position.y + this.engine.thrustInY;
    var z = position.z + this.engine.thrustInZ;
    this.objectRepresetation.setAttribute('position', {x: x, y: y, z: z} );
    //console.log(this.pitch,this.roll);
    //console.log( Math.sin(THREE.Math.degToRad(this.pitch)) * Math.sin(THREE.Math.degToRad(this.roll)));
    this.direction = 90 * Math.sin(THREE.Math.degToRad(this.pitch)) * Math.sin(THREE.Math.degToRad(this.roll));

    //this.direction = this.direction +(90 * Math.sin(THREE.Math.degToRad(this.pitch)) * Math.sin(THREE.Math.degToRad(this.roll)));



  }

  setThrust(thrust)
  {
    this.thrust = thrust;
    this.engine.setThrust(thrust);
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
    ef.setThrust(0.01);
  }
  if(event.key == "F2"){
    ef.setThrust(0.0);
  }
  if(event.key == "6"){
    ef.roll = ef.roll - 1;
  }
  if(event.key == "4"){
    ef.roll = ef.roll + 1;
  }
  if(event.key == "8"){
    ef.pitch = ef.pitch - 1;
  }
  if(event.key == "2"){
    ef.pitch = ef.pitch + 1;
  }
  if(event.key == "9"){
    ef.direction = ef.direction - 1;
  }
  if(event.key == "7"){
    ef.direction = ef.direction + 1;
  }
  console.log(event.key);
});