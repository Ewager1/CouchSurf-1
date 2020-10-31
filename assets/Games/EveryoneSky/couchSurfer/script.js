document.addEventListener('DOMContentLoaded', () => {
    const squares = document.querySelectorAll('.grid div')
    const resultDisplay = document.querySelector('#result')
    let width = 15
    let currentCouchIndex = 202
    let currentCovidIndex = 0
    let covidsTakenDown = []
    let result = 0
    let direction = 1
    let covidId
   
  
    //Array to hold covid objects
    const covids = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
        15,16,17,18,19,20,21,22,23,24,
        30,31,32,33,34,35,36,37,38,39
      ]
  
    //Draws covids
    covids.forEach( covid => squares[currentCovidIndex + covid].classList.add('covid'))
  
    //Adds the couch
    squares[currentCouchIndex].classList.add('couch')
  
    //Moves couch based on key pressed along grid left to right
    function moveCouch(e) {
      squares[currentCouchIndex].classList.remove('couch')
      switch(e.keyCode) {
        case 37:
          if(currentCouchIndex % width !== 0) currentCouchIndex -= 1
          break
        case 39:
          if(currentCouchIndex % width < width - 1) currentCouchIndex += 1
          break
      }
      squares[currentCouchIndex].classList.add('couch')
    }
    document.addEventListener('keydown', moveCouch)
  
    //Moves covids one way checks for screen edge moves down one and changes direction
    function moveCovids() {
      const leftEdge = covids[0] % width === 0
      const rightEdge = covids[covids.length - 1] % width === width - 1
  
        if((leftEdge && direction === -1) || (rightEdge && direction === 1)){
          direction = width
        } else if (direction === width) {
        if (leftEdge) direction = 1
        else direction = -1
        }
        for (let i = 0; i <= covids.length - 1; i++) {
          squares[covids[i]].classList.remove('covid')
        }
        for (let i = 0; i <= covids.length - 1; i++) {
          covids[i] += direction
        }
        for (let i = 0; i <= covids.length - 1; i++) {

        //Draws all the covids which have not been shot
          if (!covidsTakenDown.includes(i)){
            squares[covids[i]].classList.add('covid')
          }
        }
  
      if(squares[currentCouchIndex].classList.contains('covid', 'couch')) {
        resultDisplay.textContent = 'Game Over'
        squares[currentCouchIndex].classList.add('boom')
        clearInterval(covidId)
      }
  
      for (let i = 0; i <= covids.length - 1; i++){
        if(covids[i] > (squares.length - (width -1))){
          resultDisplay.textContent = 'Game Over'
          clearInterval(covidId)
        }
      }
  
      //Endgame results
      if(covidsTakenDown.length === covids.length) {
        resultDisplay.textContent = 'You Win'
        clearInterval(covidId)
      }
    }
    covidId = setInterval(moveCovids, 500)
  
    //Shoots projectile
    function shoot(e) {
      let projId
      let currentLaserIndex = currentCouchIndex

      //Move the laser from the couch up
      function moveLaser() {
        squares[currentLaserIndex].classList.remove('laser')
        currentLaserIndex -= width
        squares[currentLaserIndex].classList.add('laser')

        //Checks if the div also contain a covid
        if(squares[currentLaserIndex].classList.contains('covid')) {
          squares[currentLaserIndex].classList.remove('laser')
          squares[currentLaserIndex].classList.remove('covid')
          squares[currentLaserIndex].classList.add('boom')
            
          //For a quarter second the boom img will show
          setTimeout(() => squares[currentLaserIndex].classList.remove('boom'), 250)
          clearInterval(projId)
            
          //Calculates and shows score
          const covidTakenDown = covids.indexOf(currentLaserIndex)
          covidsTakenDown.push(covidTakenDown)
          result++
          resultDisplay.textContent = result
        }
        
        //Resets laser interval if still on screen 
        if(currentLaserIndex < width) {
          clearInterval(projId)
          setTimeout(() => squares[currentLaserIndex].classList.remove('laser'), 100)
        }
      }

      //Space bar starts laser interval
      switch(e.keyCode) {
        case 32:
          projId = setInterval(moveLaser, 100)
          break
      }
    }
  
    document.addEventListener('keyup', shoot)
  })