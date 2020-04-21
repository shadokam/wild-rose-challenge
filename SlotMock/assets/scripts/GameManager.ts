const { ccclass, property } = cc._decorator;

@ccclass
export default class GameManager extends cc.Component {
  @property(cc.Node)
  machine = null;

  @property({ type: cc.AudioClip })
  audioClick = null;

  private block = false;
  private result = null;

  public oddRatio: number;
  public firstRow: number;
  public secondRow: number;
  public thirdRow: number;
  public gameWinning: number;
  public resultMatrix = [
  [1,2,3,4,5],
  [1,2,3,4,5],
  [1,2,3,4,5],
  [1,2,3,4,5],
  [1,2,3,4,5]];
  


  start(): void {
    this.machine.getComponent('Machine').createMachine();
  }

  update(): void {
    if (this.block && this.result != null) {
      this.informStop();
      this.result = null;
    }
  }

  // Calls for the Machine.ts methods
  click(): void {
    cc.audioEngine.playEffect(this.audioClick, false);

    if (this.machine.getComponent('Machine').spinning === false) {
      this.block = false;
      this.machine.getComponent('Machine').spin();
      this.requestResult();
    } else if (!this.block) {
      this.block = true;
      this.machine.getComponent('Machine').lock();
    }
  }

  async requestResult(): Promise<void> {
    this.result = null;
    this.result = await this.getAnswer();
  }

  getAnswer(): Promise<Array<Array<number>>> {
    return new Promise<Array<Array<number>>>(resolve => {
      setTimeout(() => {
        // Rng processing ----
        this.oddRatio = Math.floor(Math.random() * 100) + 1;
        this.firstRow = Math.floor(Math.random() * 30);        
        this.secondRow = Math.floor(Math.random() * 30);
        this.thirdRow = Math.floor(Math.random() * 30);
        this.gameWinning = Math.floor(Math.random() * 30);
        // ----

        // Odds processing ----
        if (this.oddRatio < 50) {
          console.log("Odd rate equals " + this.oddRatio);
        }

        if (this.oddRatio > 50 && this.oddRatio <= 83) {
          console.log("Odd rate equals " + this.oddRatio);
          this.oddBetween33();
        }
          
        if (this.oddRatio > 83 && this.oddRatio <= 93)  {
          console.log("Odd rate equals " + this.oddRatio);
          this.oddBetween10();
        }

        if (this.oddRatio > 93) {
          console.log("Odd rate equals " + this.oddRatio);
          this.oddBetween7();
        }
        // ---- 
        resolve(this.resultMatrix);
      }, 1000 + 500 * Math.random());
    });
  }

  /**
   * Sets the 33% chance tiles
   */
  oddBetween33(): void {
    this.firstRow = 100;
    this.thirdRow = 100;
    this.resultMatrix = [
      [1,2,3,4,5],
      [1,2,3,4,5],
      [1,2,3,4,5],
      [1,2,3,4,5],
      [1,2,3,4,5]];

      // Iterate rows and cols checking for the spots to fill with the tile.
    for (var row = 0; row < 5; row++) {
      for(var col = 0; col < 5; col++) {
        var auxRandom = Math.floor(Math.random() * 30);
        var columnCheck = (col == 1 && row == 0) || (col == 1 && row == 2) || (col == 1 && row == 4);
        var columnCheck3 = (col == 3 && row == 1) || (col == 3 && row == 3);

        if (columnCheck || columnCheck3) {
          this.resultMatrix[row][col] = this.secondRow;
        }
      }
    }
     /* Output
     this.resultMatrix = [
      [fill, this.gameWinning, fill, fill, fill],
      [fill, fill, fill, this.gameWinning, fill],
      fill, this.gameWinning, fill,fill, fill],
      fill, fill, fill, this.gameWinning, fill],
      [fill, this.gameWinning, fill, fill, fill]  
    ]
    */
  }

  /**
   * Sets the 10% chance tiles
   */
  oddBetween10(): void {
    this.firstRow = 100
    this.resultMatrix = [
      [1,2,3,4,5],
      [1,2,3,4,5],
      [1,2,3,4,5],
      [1,2,3,4,5],
      [1,2,3,4,5]];
      
      // Iterate rows and cols checking for the spots to fill with the tile.
    for (var row = 0; row < 5; row++) {
      for(var col = 0; col < 5; col++) {
        var columnCheck = (col == 1 && row == 0) || (col == 1 && row == 2) || (col == 1 && row == 4);  
        var columnCheck2 = (col == 2 && row == 0) || (col == 2 && row == 2) || (col == 2 && row == 4);
        var columnCheck3 = (col == 3 && row == 1) || (col == 3 && row == 3);
        var columnCheck4 = (col == 4 && row == 1) || (col == 4 && row == 3);

        if (columnCheck || columnCheck3) {
          this.resultMatrix[row][col] = this.secondRow;
        }

        if (columnCheck2 || columnCheck4) {
          this.resultMatrix[row][col] = this.thirdRow;
        }
      }
    }
    /* Output
    this.resultMatrix = [
      [fill, this.gameWinning, this.gameWinning, fill, fill],
      [fill, fill, fill, this.gameWinning, this.gameWinning],
      [fill, this.gameWinning, this.gameWinning, fill, fill],
      [fill, fill, fill, this.gameWinning, this.gameWinning],
      [fill, this.gameWinning, this.gameWinning, fill, fill]  
    ]
    */
  }

  oddBetween7(): void {
    this.resultMatrix = [
      [this.gameWinning, this.gameWinning, this.gameWinning, this.gameWinning, this.gameWinning],
      [this.gameWinning, this.gameWinning, this.gameWinning, this.gameWinning, this.gameWinning],
      [this.gameWinning, this.gameWinning, this.gameWinning, this.gameWinning, this.gameWinning],
      [this.gameWinning, this.gameWinning, this.gameWinning, this.gameWinning, this.gameWinning],
      [this.gameWinning, this.gameWinning, this.gameWinning, this.gameWinning, this.gameWinning]  
    ]
  }


  // Sends the stop sign back to the Machine
  informStop(): void {
    const resultRelayed = this.result;
    this.machine.getComponent('Machine').stop(resultRelayed);
  }
}
