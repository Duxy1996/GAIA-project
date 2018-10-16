class radarAA
{
  constructor()
  {
    this.position     = THREE.Vector3();
    this.pitchAxis    = THREE.Vector3();
    this.rollAxis     = THREE.Vector3();

    this.listOfTracks = {};
    this.ownerId;
    this.ownerName;

    this.azimuth      =  0;
    this.azimuzJump;
    this.minAzimuth;
    this.maxAzimuth;

    this.pitch        =  0;
    this.pitchJump;
    this.maxPitch;
    this.minPitch;

    this.frecuency;

    this.maxRange;
    this.minRange;
    this.coneAngleDeg;

    this.error;
    this.incrementError;
  }

  initializeAzimuth(minAzimuth,maxAzimuth,azimuzJump)
  {
    this.minAzimuth = minAzimuth;
    this.maxAzimuth = maxAzimuth;
    this.azimuzJump = azimuzJump;
  }

  initializePitch(minPitch,maxPitch,pitchJump)
  {
    this.minPitch = minPitch;
    this.maxPitch = maxPitch;
    this.pitchJump = pitchJump;
  }

  initializeRange(maxRange,minRange,coneAngleDeg)
  {
    this.maxRange = maxRange;
    this.minRange = minRange;
    this.coneAngleDeg = coneAngleDeg/2;
  }

  incrementAzimuth()
  {
    this.azimuth = this.azimuth + this.azimuzJump;
    if (this.azimuth > this.maxAzimuth)
    {
      this.azimuth = this.maxAzimuth
    }
  }

  decrementAzmiuth()
  {
    this.azimuth = this.azimuth - this.azimuzJump;
    if (this.azimuth < this.minAzimuth)
    {
      this.azimuth = this.minAzimuth
    }
  }

  incrementPicth()
  {
    this.pitch = this.pitch + this.pitchJump;
    if (this.pitch > this.maxPitch)
    {
      this.pitch = this.maxPitch
    }
  }

  decrementPitch()
  {
    this.pitch = this.pitch - this.pitchJump;
    if (this.pitch < this.minPitch)
    {
      this.pitch = this.minPitch
    }
  }

  updatePosition(position, pitchAxis, rollAxis)
  {
    this.position = position;
    this.pitchAxis = pitchAxis;
    this.rollAxis = rollAxis;
  }

  substractPoints(pointA,pointB)
  {
    var posX = pointA.x - pointB.x;
    var posY = pointA.y - pointB.y;
    var posZ = pointA.z - pointB.z;

    var pRet = THREE.Vector3(posX,posY,posZ);

    return pRet;
  }

  getDistanceBetweenTwoPoints(pointA,pointB)
  {
    var posX = pointA.x - pointB.x;
    var posY = pointA.y - pointB.y;
    var posZ = pointA.z - pointB.z;
    var norm = Math.sqrt(posX*posX+posY*posY+posZ*posZ);
    return norm;
  }

  getAxisBetweenTwoPoints(pointA,pointB)
  {
    var posX = pointA.x - pointB.x;
    var posY = pointA.y - pointB.y;
    var posZ = pointA.z - pointB.z;

    var norm  = this.getDistanceBetweenTwoPoints(pointA,pointB);
    var axis  = new THREE.Vector3(posX/norm,posY/norm,posZ/norm);

    return axis;
  }

  updateTracks(listOfPlanes)
  {

    for (var planes in listOfPlanes)
    {
      if (this.position != listOfPlanes[planes].getTrackInfo().getposition())
      {
        var otPlanePos             = THREE.Vector3();
        var relativePositionVector = THREE.Vector3();
        var name = "";

        otPlanePos                 = listOfPlanes[planes].getTrackInfo().getposition();
        name                       = listOfPlanes[planes].getTrackInfo().getName();

        if (otPlanePos != undefined)
        {
          var distance = this.getDistanceBetweenTwoPoints(otPlanePos,this.position);
          relativePositionVector     = this.getAxisBetweenTwoPoints(otPlanePos,this.position);
          var rollAxisConverted = this.rollAxis.applyAxisAngle(this.pitchAxis,this.pitch);
          var angleDegPlane = (1/3.14)*180*(relativePositionVector.angleTo(rollAxisConverted));
          if((distance < this.maxRange) && (distance > this.minRange))
          {
            if(angleDegPlane < this.coneAngleDeg)
            {
              this.listOfTracks[name] = listOfPlanes[planes];
              console.log(this.listOfTracks[name].getTrackInfo().getName());
            }
          }
        }
      }
    }
  }

  returnTrackList()
  {
    return this.listOfTracks;
  }
}
