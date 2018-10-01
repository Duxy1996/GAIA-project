
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
    console.log(this.direction);
    this.thrustInX = this.thrust * this.direction.x;
    this.thrustInY = this.thrust * this.direction.y;
    this.thrustInZ = this.thrust * this.direction.z;
  }

}

class Plane
{
  constructor()
  {
    //this.radar               = radar;
    //this.cockpit             = cockpit;

    this.roll                = 0;
    this.antroll             = 0;
    this.pitch               = 0;
    this.antpitch            = 0;
    this.yaw                 = 0;

    this.counter             = 0;

    this.direction           = new THREE.Vector3();

    this.thrust              = 0;

    this.object              = document.createElement('a-entity');
    this.objectRepresetation = document.createElement('a-entity');

    this.axisA               = document.createElement('a-entity');
    this.axisB               = document.createElement('a-entity');
    this.axisC               = document.createElement('a-entity');
    this.axisD               = document.createElement('a-entity');

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
    var positionA = new THREE.Vector3();
    var positionB = new THREE.Vector3();

    var positionC = new THREE.Vector3();
    var positionD = new THREE.Vector3();

    positionA = this.axisA.object3D.getWorldPosition();
    positionB = this.axisB.object3D.getWorldPosition();

    positionC = this.axisC.object3D.getWorldPosition();
    positionD = this.axisD.object3D.getWorldPosition();

    var posX = positionA.x - positionB.x;
    var posY = positionA.y - positionB.y;
    var posZ = positionA.z - positionB.z;

    var posXP = positionC.x - positionD.x;
    var posYP = positionC.y - positionD.y;
    var posZP = positionC.z - positionD.z;

    var norm  = Math.sqrt(posX*posX+posY*posY+posZ*posZ);
    var normP = Math.sqrt(posXP*posXP+posYP*posYP+posZP*posZP);

    var myAxis  = new THREE.Vector3(posX/norm,posY/norm,posZ/norm);
    var myAxisP = new THREE.Vector3(posXP/normP,posYP/normP,posZP/normP);

    var diffP = this.roll - this.antroll;
    var diff = this.pitch - this.antpitch;

    this.antpitch = this.pitch;
    this.antroll  = this.roll;

    if (Math.abs(diff) < 0.1)
    {
      diff = 0;
    }

    if (Math.abs(diffP) < 0.1)
    {
      diffP = 0;
    }

    this.objectRepresetation.object3D.rotateOnWorldAxis(myAxis,THREE.Math.degToRad(-diff));
    this.objectRepresetation.object3D.rotateOnWorldAxis(myAxisP,THREE.Math.degToRad(-diffP));

    this.direction.copy(myAxisP);

  }


  addToScene(myscene)
  {
    this.objectRepresetation.appendChild(this.axisA);
    this.objectRepresetation.appendChild(this.axisB);

    this.objectRepresetation.appendChild(this.axisC);
    this.objectRepresetation.appendChild(this.axisD);

    this.axisA.setAttribute('position',{x: -2, y: 0, z: 0});
    this.axisB.setAttribute('position',{x: +2, y: 0, z: 0});

    this.axisC.setAttribute('position',{x: 0, y: 0, z: -2});
    this.axisD.setAttribute('position',{x: 0, y: 0, z: +2});

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
  if (event.key == "s")
  {
    ef.setCameraTofront(camera.getCamera());
  }
  if(event.key == "v"){
    ef.setCameraToBack(camera.getCamera());
  }
  if(event.key == "F4"){
    ef.setThrust(0.05);
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