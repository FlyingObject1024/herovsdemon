import { Hero } from "../classes/Hero";
import { Demon } from "../classes/Demon";
import { Button } from "../classes/Button";
import { gaussianDistribution } from "../classes/ExtraMath";
import { positiveMod } from "../classes/ExtraMath";
import { Card } from "../classes/Card";
import { pickDemonNameCardList } from "../classes/DemonCards";

export class DemonStrategyScene extends Phaser.Scene {
  hero!: Hero;
  demon!: Demon;

  jointime!: Date;
  timelimit: number = 300;

  forcusCardIndex: number = 0;

  timeText!: Phaser.GameObjects.Text;
  alertText!: Phaser.GameObjects.Text;

  turnText!: Phaser.GameObjects.Text;

  rightbutton!: Button;
  leftbutton!: Button;
  upbutton!: Button;
  downbutton!: Button;

  nextbutton!: Button;

  turn: number = 1;

  strategyCardList: Card[][] = [[], [], [], [], [], []];

  constructor() {
    // シーンのkeyを指定
    super("strategy");
  }

  // constructorが使えないので代わりにdataを受け取る
  init(data: { hero: Hero; demon: Demon; }) {
    this.jointime = new Date();
    this.hero = data.hero;
    this.demon = data.demon;
    this.timeText = this.add.text(0, 0, "残り時間 ").setOrigin(0.0, 0.0);
    this.alertText = this.add.text(
      this.game.canvas.width / 2, 0,
      this.turn + "ターン目のカードを選んでください "
    ).setOrigin(0.5, 0.0);

    this.rightbutton = new Button(this, Number(this.game.canvas.width) / 2 + Number(this.game.canvas.width) / 4, Number(this.game.canvas.height) * 3 / 4, 4.0, "button_right", {
      onClick: () => {
        console.log("right");
        this.cardRightShift();
      }
    });

    this.leftbutton = new Button(this, Number(this.game.canvas.width) / 2 - Number(this.game.canvas.width) / 4, Number(this.game.canvas.height) * 3 / 4, 4.0, "button_left", {
      onClick: () => {
        console.log("left");
        this.cardLeftShift();
      }
    });

    
    this.upbutton = new Button(this, Number(this.game.canvas.width) / 10, Number(this.game.canvas.height) / 4 - Number(this.game.canvas.height) / 8, 2.0, "button_up", {
      onClick: () => {
        console.log("up");
        this.changeTurn(-1);
      }
    });
    
    this.turnText = this.add.text(
      Number(this.game.canvas.width) / 10, Number(this.game.canvas.height) / 4,
      String(this.turn),
    ).setOrigin(0.5, 0.0);

    this.downbutton = new Button(this, Number(this.game.canvas.width) / 10, Number(this.game.canvas.height) / 4 + Number(this.game.canvas.height) / 8, 2.0, "button_down", {
      onClick: () => {
        console.log("down");
        this.changeTurn(1);
      }
    });
  }

  preload() {
    console.log("strategy");
    this.demon.chosenDemonCardList.forEach((card) => {
      card.img.visible = true;
    });
    this.moveChosenCards();
    this.moveUnchosenCards();
  }

  // preload内のアセットのロード後実行される
  create() {
  }

  changeTurn(diff: number){
    this.turn += diff;
    if(this.turn < 1){
      this.turn = 1;
    }
    else if(this.turn > this.demon.maxturn){
      this.turn = this.demon.maxturn;
    }
    this.turnText.setText(String(this.turn));
    this.moveChosenCards();
  }

  moveChosenCards(){
    let index = 1;
    this.strategyCardList.forEach((cards) => {
      let s: string = String(index) + ": ";
      let depth = 1;
      let length = cards.length;
      cards.forEach((card) => {
        if(index == this.turn){
          if(this.game.canvas.width/10 + card.defaultwidth*length >= this.game.canvas.width){
            card.moveDirectly(
              this.game.canvas.width/10 + ((this.game.canvas.width - this.game.canvas.width/10)/length)*depth,
              this.game.canvas.height/4,
              1.0
            );
          }
          else{
            card.moveDirectly(
              this.game.canvas.width/10 + card.defaultwidth*depth,
              this.game.canvas.height/4,
              1.0
            );
          }
          card.img.visible = true;
          card.img.depth = depth;
        }
        else{
          card.img.visible = false;
          card.img.depth = depth;
        }
        s += card.cardName+"(" + card.num + "),";
        depth++;
      });
      console.log(s);
      index++;
    });
  }

  moveUnchosenCards() {
    if (this.forcusCardIndex >= this.demon.chosenDemonCardList.length) {
      this.forcusCardIndex = 0;
    }

    this.alertText.setText(
      this.turn + "ターン目のカードを選んでください "
    );

    const centerx = this.game.canvas.width / 2;
    const centery = this.game.canvas.height * 3 / 4;
    const margin = this.game.canvas.width / 4;
    //const margin =  this.demon.chosenDemonCardList[this.forcusCardIndex].defaultwidth*4.0;

    for (let index = 0; index < this.demon.chosenDemonCardList.length; index++) {
      const i = positiveMod((this.forcusCardIndex + index - 5), this.demon.chosenDemonCardList.length);

      this.demon.chosenDemonCardList[i].setOnClick(() => {
        this.cardShift(i - this.forcusCardIndex);
      });

      this.demon.chosenDemonCardList[i].hover_off();

      if (true) {
        this.demon.chosenDemonCardList[i].moveSmoothly(
          centerx + (index - 5) * margin,
          centery,
          20,
          (this.game.canvas.width / this.demon.maxcard) * 0.8 / this.demon.chosenDemonCardList[index].defaultwidth
        );
      }
      else {
        this.demon.chosenDemonCardList[i].setX(centerx + (index - 5) * margin);
        this.demon.chosenDemonCardList[i].setY(centery);
      }
    }

    this.demon.chosenDemonCardList[this.forcusCardIndex].setOnClick(() => {
      this.chooseCard();
    });
  }

  // カード列をdiffずらす
  cardShift(diff: number = 0) {
    this.forcusCardIndex += diff;
    this.forcusCardIndex = positiveMod(this.forcusCardIndex, this.demon.chosenDemonCardList.length);
    this.moveUnchosenCards();
  }

  // カード列を右へdiffずらす
  cardRightShift(diff: number = 1) {
    this.cardShift(diff)
  }

  // カード列を左へdiffずらす
  cardLeftShift(diff: number = 1) {
    this.cardShift(-diff)
  }

  // カードを選択列へ移す
  chooseCard() {
    // this.strategyCardList が undefined の場合、空の二次元配列として初期化
    if (!this.strategyCardList) {
      this.strategyCardList = [];
    }

    // this.turn に対応する配列が undefined の場合、空配列をセット
    if (!this.strategyCardList[this.turn-1]) {
      this.strategyCardList[this.turn-1] = [];
    }

    // カードを抽出し、選択列へ
    const card: Card = pickDemonNameCardList(this, -300, -300, this.demon.chosenDemonCardList[this.forcusCardIndex].num);
    card.setDemon(this.demon);

    this.strategyCardList[this.turn-1].push(card);

    // カードの位置と処理を変更する
    this.moveUnchosenCards();
    this.moveChosenCards();
  }

  // 現フェーズの表示情報を片づけて終了する
  killPhase() {
    this.rightbutton.visible = false;
    this.leftbutton.visible = false;
    this.scene.launch("strategy", { hero: this.hero, demon: this.demon });
    this.scene.stop();
  }

  // フェーズを進める
  progressPhase() {
    this.killPhase();
  }

  // 選択時間切れ
  timeup() {
    this.progressPhase();
  }


  // 残り時間カウンターの処理
  timecounter() {
    let now = new Date();
    let left = Math.ceil(this.timelimit - (now.getTime() - this.jointime.getTime()) / 1000);
    this.timeText.setText("残り時間 " + String(left) + "秒");
    if (left <= 0) {
      this.timeup();
    }
  }

  update() {
    this.timecounter();
    this.demon.chosenDemonCardList.forEach((card) => {
      // 中央はカードのサイズを大きくする
      card.defaultsize = gaussianDistribution((card.x - this.game.canvas.width / 2) / this.game.canvas.width, 0.5) * ((this.game.canvas.height / 2) / this.demon.chosenDemonCardList[this.forcusCardIndex].defaultheight);
      card.img.depth = gaussianDistribution((card.x - this.game.canvas.width / 2) / this.game.canvas.width, 0.5) * 100;
      card.update();
    });
    this.strategyCardList.forEach((cards) => {
      cards.forEach((card) => {
        card.update();
      });
    });
  }
}
