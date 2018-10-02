class radarAA
{
  constructor()
  {
    this.position = new THREE.Vector3();

    this.listOfTracks;
    this.ownerId;
    this.ownerName;

    this.azimuth;
    this.minAzimuth;
    this.maxAzimuth;

    this.pitch;
    this.maxPitch;
    this.minPitch;

    this.frecuency;
    this.listOfPositions;
    this.positions;

    this.maxRange;
    this.minrange;

    this.error;
    this.incrementError;
  }

  createDetectionCone()
  {

  }

  updatePosition(position)
  {
    this.position = position;
  }
}