class TrackInfo
  {
    constructor()
    {
      this.name;
      this.id;
      this.disNumber;
      this.position  = THREE.Vector3();
      this.pitchAxis = THREE.Vector3();
      this.rollAxis  = THREE.Vector3();
      this.direction = THREE.Vector3();
    }

    setName(name)
    {
      this.name = name;
    }

    getName()
    {
      return this.name;
    }

    setDisNumber(disNumber)
    {
      this.disNumber = disNumber;
    }

    getDisNumber()
    {
      return this.disNumber;
    }

    setId(id)
    {
      this.id = id;
    }

    getId()
    {
      return id;
    }

    setPitchAxis(pitchAxis)
    {
      this.pitchAxis = pitchAxis;
    }

    getPitchAxis()
    {
      return this.pitchAxis;
    }

    setRollAxis(rollAxis)
    {
      this.rollAxis = rollAxis;
    }

    getRollAxis()
    {
      return this.rollAxis;
    }

    setDirection(direction)
    {
      this.direction = direction;
    }

    getDirection()
    {
      return this.direction;
    }
  }
