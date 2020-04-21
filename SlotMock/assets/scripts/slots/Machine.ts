import Aux from '../SlotEnum';

const { ccclass, property } = cc._decorator;

@ccclass
export default class Machine extends cc.Component {
  @property(cc.Node)
  public button: cc.Node = null;
  @property(cc.Node)
  public gameManager = null;
  @property(cc.Node)
  effectLine1 = null;
  @property(cc.Node)
  effectLine2 = null;
  @property(cc.Node)
  effectLine3 = null;

  @property(cc.Prefab)
  public _reelPrefab = null;

  @property({ type: cc.Prefab })
  get reelPrefab(): cc.Prefab {
    return this._reelPrefab;
  }

  set reelPrefab(newPrefab: cc.Prefab) {
    this._reelPrefab = newPrefab;
    this.node.removeAllChildren();

    if (newPrefab !== null) {
      this.createMachine();
    }
  }

  start(): void {
    this.gameManager.getComponent('GameManager');
  }

  @property({ type: cc.Integer })
  public _numberOfReels = 3;

  @property({ type: cc.Integer, range: [3, 6], slide: true })
  get numberOfReels(): number {
    return this._numberOfReels;
  }

  set numberOfReels(newNumber: number) {
    this._numberOfReels = newNumber;

    if (this.reelPrefab !== null) {
      this.createMachine();
    }
  }

  private reels = [];

  public spinning = false;


  createMachine(): void {
    this.node.destroyAllChildren();
    this.reels = [];

    let newReel: cc.Node;
    for (let i = 0; i < this.numberOfReels; i += 1) {
      newReel = cc.instantiate(this.reelPrefab);
      this.node.addChild(newReel);
      this.reels[i] = newReel;

      const reelScript = newReel.getComponent('Reel');
      reelScript.shuffle();
      reelScript.reelAnchor.getComponent(cc.Layout).enabled = false;
    }

    this.node.getComponent(cc.Widget).updateAlignment();
  }

  // Start input
  spin(): void {
    this.effectLine1.active = false;
    this.effectLine2.active = false;
    this.effectLine3.active = false;
    this.spinning = true;
    this.button.getChildByName('Label').getComponent(cc.Label).string = 'STOP';

    for (let i = 0; i < this.numberOfReels; i += 1) {
      const theReel = this.reels[i].getComponent('Reel');

      if (i % 2) {
        theReel.spinDirection = Aux.Direction.Down;
      } else {
        theReel.spinDirection = Aux.Direction.Up;
      }

      theReel.doSpin(0.03 * i);
    }
  }

  // Btn verification
  lock(): void {
    this.button.getComponent(cc.Button).interactable = false;
  }


  // Stop input
  stop(result: Array<Array<number>> = null): void {
    setTimeout(() => {
      if (this.gameManager.getComponent('GameManager').oddRatio > 50 && this.gameManager.getComponent('GameManager').oddRatio <= 83) {
        this.effectLine2.active = true;
      }
      if (this.gameManager.getComponent('GameManager').oddRatio > 83 && this.gameManager.getComponent('GameManager').oddRatio <= 93) {
        this.effectLine2.active = true;
        this.effectLine3.active = true;
      }
      if (this.gameManager.getComponent('GameManager').oddRatio > 93) {
        this.effectLine1.active = true;
        this.effectLine2.active = true;
        this.effectLine3.active = true;
      }
      this.spinning = false;
      this.button.getComponent(cc.Button).interactable = true;
      this.button.getChildByName('Label').getComponent(cc.Label).string = 'SPIN';
    }, 2500);

    const rngMod = Math.random() / 2;
    for (let i = 0; i < this.numberOfReels; i += 1) {
      const spinDelay = i < 2 + rngMod ? i / 4 : rngMod * (i - 2) + i / 4;
      const theReel = this.reels[i].getComponent('Reel');

      setTimeout(() => {
        theReel.readyStop(result[i]);
      }, spinDelay * 1000);
    }
  }
}
