class trackInfo
  {
    constructor()
    {
      this.name;
      this.id;
      this.disNumber = { kind:0, domain:0,
                        Country:0, Category:0,
                        Subcategory:0, Specific:0,
                        extra:0};
      this.position  = THREE.Vector3();
      this.pitchAxis = THREE.Vector3();
      this.rollAxis  = THREE.Vector3();
      this.direction = THREE.Vector3();
    }

    setdisNumber(disString)
    {
      var disSplitted = disString.split(":");
    }

    getDisNumber()
    {
      return this.disNumber;
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

    setPosition(position)
    {
      this.position = position;
    }

    getposition()
    {
      return this.position;
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
