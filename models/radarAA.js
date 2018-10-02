class radarAA
{
  constructor()
  {
    this.position = new THREE.Vector3();

    this.listOfTracks;
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
    this.minrange;

    this.error;
    this.incrementError;
  }

  createDetectionCone()
  {

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

  updatePosition(position)
  {
    this.position = position;
  }
}