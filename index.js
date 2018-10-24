//import TrackInfo from './models/trackInfo.js'


var ef;
var sp;
var ae;

var camera;
var myscene;

window.onload = function()
{
  main();
};

function main()
{

  myscene = document.querySelector('a-scene');

  ef = new Plane("ef");
  sp = new Plane("sp");

  ef.addPlaneObject('./assets/models/eurofighter.obj','ef1');
  sp.addPlaneObject('./assets/models/spitfire.obj','sp1');
  ef.addCockpit('./assets/models/EF2000.obj','ef1cp');
  //sp
  ef.addPlaneScale( 0.1 , 0.1 , 0.1 );
  sp.addPlaneScale( 0.01 , 0.01 , 0.01 );
  ef.addColor();
  sp.addColor();
  ef.addToScene(myscene);
  sp.addToScene(myscene);
  ef.setPosition( 0 , 5 , -5 );
  sp.setPosition( 2 , 5 , -10 );
  ef.setSimpleRotation( 0, 0, 0);
  sp.setSimpleRotation( 0, 0, 0);

  camera = new Camera();
  camera.attach(ef.getPlane());

  ef.setCameraTofront(camera.getCamera());
  initGround();
  window.setInterval(function(){run();},5);
};

function run()
{
  ef.updateStatus();
  sp.updateStatus();
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
    this.thrustInX = this.thrust * this.direction.x;
    this.thrustInY = this.thrust * this.direction.y;
    this.thrustInZ = this.thrust * this.direction.z;
  }

}

class Cockpit
{
  constructor()
  {

  }
}

class Plane
{
  constructor(pName)
  {
    this.roll                = 0;
    this.antroll             = 0;
    this.pitch               = 0;
    this.antpitch            = 0;
    this.yaw                 = 0;

    this.name                = pName;
    this.id                  = 0;

    this.radarAA             = new radarAA();

    this.radarAA.initializeAzimuth(10,10,1);
    this.radarAA.initializePitch(10,10,1);
    this.radarAA.initializeRange(30,5,100);

    this.trackInfo           = new trackInfo();

    this.pitchAxis = THREE.Vector3();
    this.rollAxis  = THREE.Vector3();
    this.yawAxis   = THREE.Vector3();

    this.counter             = 0;

    this.direction           = new THREE.Vector3();

    this.thrust              = 0;

    this.object              = document.createElement('a-entity');
    this.objectRepresetation = document.createElement('a-entity');

    // Cockpit class
    this.cockpitView         = document.createElement('a-entity');
    this.cockpitRep          = document.createElement('a-entity');

    this.axisA               = document.createElement('a-entity');
    this.axisB               = document.createElement('a-entity');
    this.axisC               = document.createElement('a-entity');
    this.axisD               = document.createElement('a-entity');
    this.axisE               = document.createElement('a-entity');
    this.axisF               = document.createElement('a-entity');

    this.engine              = new Engine(this.pitch,this.direction,this.roll);
    this.engine.updateThrust();

    this.setPosition(0,0,0);
    this.initTrackInfo();

  }

  addCockpit (CockpitPath, CockpitId)
  {
    this.cockpitView.setAttribute('src', CockpitPath);
    this.cockpitView.setAttribute('id', CockpitId);
    this.cockpitRep.setAttribute('obj-model', 'obj: #' + CockpitId);
    this.objectRepresetation.appendChild(this.cockpitRep);
    this.objectRepresetation.appendChild(this.cockpitView);
    this.objectRepresetation.setAttribute('material','opacity: 0.0; transparent: true');
    this.cockpitRep.setAttribute('material','color: #000000;');
    this.cockpitRep.setAttribute('scale', {x: 0.05, y: 0.05, z: 0.05});
    this.cockpitRep.setAttribute('position', {x: 0.5, y: -1, z: -8.1});
    this.cockpitRep.setAttribute('rotation', {x: -25, y: 0, z: 0});
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

  initTrackInfo()
  {
    this.trackInfo.setName(this.name);
    this.trackInfo.setId(this.id);
    //this.setDisNumber(this.id + this.name);
  }

  updateTrackInfo()
  {
    var position = this.objectRepresetation.getAttribute('position');
    this.trackInfo.setPosition(position);
    this.trackInfo.setPitchAxis(this.pitchAxis);
    this.trackInfo.setRollAxis(this.rollAxis);
    this.trackInfo.setDirection(this.direction);
  }

  getTrackInfo()
  {
    return this.trackInfo;
  }

  addColor()
  {
    this.objectRepresetation.setAttribute('material','color: #000000;');
  }

  setPosition( x , y , z )
  {
    this.objectRepresetation.setAttribute('position', {x: x, y: y, z: z} );
  }

  getAxisBetweenTwoPoints(pointA,pointB)
  {
    var posX = pointA.x - pointB.x;
    var posY = pointA.y - pointB.y;
    var posZ = pointA.z - pointB.z;

    var norm  = Math.sqrt(posX*posX+posY*posY+posZ*posZ);

    var axis  = new THREE.Vector3(posX/norm,posY/norm,posZ/norm);

    return axis;
  }

  setRotation()
  {
    var positionA = new THREE.Vector3();
    var positionB = new THREE.Vector3();

    var positionC = new THREE.Vector3();
    var positionD = new THREE.Vector3();

    var positionE = new THREE.Vector3();
    var positionF = new THREE.Vector3();

    positionA = this.axisA.object3D.getWorldPosition();
    positionB = this.axisB.object3D.getWorldPosition();

    positionC = this.axisC.object3D.getWorldPosition();
    positionD = this.axisD.object3D.getWorldPosition();

    positionE = this.axisE.object3D.getWorldPosition();
    positionF = this.axisF.object3D.getWorldPosition();

    this.pitchAxis     = this.getAxisBetweenTwoPoints(positionA,positionB);
    this.rollAxis      = this.getAxisBetweenTwoPoints(positionC,positionD);
    this.yawAxis       = this.getAxisBetweenTwoPoints(positionE,positionF);

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

    this.objectRepresetation.object3D.rotateOnWorldAxis(this.pitchAxis,THREE.Math.degToRad(-diff));
    this.objectRepresetation.object3D.rotateOnWorldAxis(this.rollAxis,THREE.Math.degToRad(-diffP));

    this.direction.copy(this.rollAxis);

  }

  setSimpleRotation( x, y, z)
  {
    this.objectRepresetation.setAttribute('rotation',{x: x, y: y, z:z});
  }


  addToScene(myscene)
  {
    this.objectRepresetation.appendChild(this.axisA);
    this.objectRepresetation.appendChild(this.axisB);

    this.objectRepresetation.appendChild(this.axisC);
    this.objectRepresetation.appendChild(this.axisD);

    this.objectRepresetation.appendChild(this.axisE);
    this.objectRepresetation.appendChild(this.axisF);

    this.axisA.setAttribute('position',{x: -2, y: 0, z: 0});
    this.axisB.setAttribute('position',{x: +2, y: 0, z: 0});

    this.axisC.setAttribute('position',{x: 0, y: 0, z: -2});
    this.axisD.setAttribute('position',{x: 0, y: 0, z: +2});

    this.axisE.setAttribute('position',{x: 0, y: +2, z: 0});
    this.axisF.setAttribute('position',{x: 0, y: -2, z: 0});

    myscene.appendChild(this.object);
    myscene.appendChild(this.objectRepresetation);
  }

  setCameraTofront(camera)
  {
    camera.setAttribute('position', {x: 0, y: 1, z: -4} );
    camera.setAttribute('camera', 'active', true);
    this.objectRepresetation.setAttribute('material','opacity: 0.0; transparent: true');
  }

  setCameraToBack(camera)
  {
    camera.setAttribute('position', {x: 0, y: 4, z: 4});
    camera.setAttribute('camera', 'active', true);
    this.objectRepresetation.setAttribute('material','opacity: 1.0; transparent: false');
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
    this.radarAA.updatePosition(position,this.pitchAxis,this.rollAxis,this.yawAxis);

    this.engine.updateThrust();

    this.updateTrackInfo();

    var listOfPlanes = [];
    listOfPlanes.push(ef);
    listOfPlanes.push(sp);

    this.radarAA.updateTracks(listOfPlanes);

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
    ef.setThrust(0.025);
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
  //console.log(event.key);
});