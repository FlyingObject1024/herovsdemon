import { Hero } from "../classes/Hero";
import { Demon } from "../classes/Demon";
import { Button } from "../classes/Button";
import { gaussianDistribution } from "../classes/ExtraMath";
import { positiveMod } from "../classes/ExtraMath";
import { Card } from "../classes/Card";
import { DemonEventCard, pickDemonNameCardList } from "../classes/DemonCards";
import { DotIndicator } from "../classes/DotIndicator";
import { CrystalIndicator } from "../classes/CrystalIndicator";

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

  gobutton!: Button;

  dotIndicator!: DotIndicator;
  crystalIndicatior!: CrystalIndicator;

  partyIcon!: Phaser.GameObjects.Image;
  partyImgList: Phaser.GameObjects.Image[] = [];

  trashIcon!: Phaser.GameObjects.Image;
  trashImgList: Phaser.GameObjects.Image[] = [];

  cardBuffer!: Card;
  isChooseTrash: boolean = false;
  isChooseCost: boolean = false;

  constructor() {
    // シーンのkeyを指定
    super("strategy");
  }

  // constructorが使えないので代わりにdataを受け取る
  init(data: { hero: Hero; demon: Demon; }) {
    this.jointime = new Date();
    this.hero = data.hero;
    this.demon = data.demon;
    this.timeText = this.add.text(0, 0, "残り時間 ", { color: '#000000', fontSize: '28px', fontFamily: 'BestTen-CRT' }).setOrigin(0.0, 0.0);
    this.alertText = this.add.text(
      this.game.canvas.width / 2, 0,
      this.demon.strategyTurn + "ターン目のカードを選んでください ",
      { color: '#000000', fontSize: '28px', fontFamily: 'BestTen-CRT' }
    ).setOrigin(0.5, 0.0);

    this.partyIcon = this.add.image(
      this.game.canvas.width / 5,
      this.game.canvas.height * 3 / 8,
      "icon_party"
    ).setOrigin(0.5, 0.5);

    this.partyIcon.setDisplaySize(this.partyIcon.width * 2.0, this.partyIcon.height * 2.0);

    this.trashIcon = this.add.image(
      this.game.canvas.width * 3 / 5,
      this.game.canvas.height * 3 / 8,
      "icon_trash"
    ).setOrigin(0.5, 0.5);

    this.trashIcon.setDisplaySize(this.partyIcon.width * 2.0, this.partyIcon.height * 2.0);

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
      String(this.demon.strategyTurn),
      { color: '#000000', fontSize: '28px', fontFamily: 'BestTen-CRT' }
    ).setOrigin(0.5, 0.5);

    this.downbutton = new Button(this, Number(this.game.canvas.width) / 10, Number(this.game.canvas.height) / 4 + Number(this.game.canvas.height) / 8, 2.0, "button_down", {
      onClick: () => {
        console.log("down");
        this.changeTurn(1);
      }
    });

    this.dotIndicator = new DotIndicator(
      this,
      Number(this.game.canvas.width) / 10 - Number(this.game.canvas.width) / 12,
      Number(this.game.canvas.height) / 4,
      (Number(this.game.canvas.height) / 4) / this.demon.maxturn,
      this.demon.maxturn,
      this.demon.strategyTurn - 1,
      false
    );

    this.crystalIndicatior = new CrystalIndicator(
      this,
      Number(this.game.canvas.width) / 2,
      Number(this.game.canvas.height) / 12,
      20,
      this.demon.strategyTurn,
      this.demon.strategyNowCost,
      true,
      2.0
    );


    this.gobutton = new Button(this, Number(this.game.canvas.width) - Number(this.game.canvas.width) / 12, Number(this.game.canvas.height) / 2, 2.5, "button_go", {
      onClick: () => {
        console.log("go");
        this.progressPhase();
      }
    });
    this.gobutton.visible = true;
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
    if (this.input?.keyboard) {
      this.input.keyboard.off("keydown-LEFT");
      this.input.keyboard.on("keydown-LEFT", () => {
        this.cardLeftShift();
      });
      this.input.keyboard.off("keydown-RIGHT");
      this.input.keyboard.on("keydown-RIGHT", () => {
        this.cardRightShift();
      });
      this.input.keyboard.off("keydown-SPACE");
      this.input.keyboard.on("keydown-SPACE", () => {
        this.chooseCard();
      });
      this.input.keyboard.off("keydown-UP");
      this.input.keyboard.on("keydown-UP", () => {
        this.changeTurn(-1);
      });
      this.input.keyboard.off("keydown-DOWN");
      this.input.keyboard.on("keydown-DOWN", () => {
        this.changeTurn(1);
      });
    }
  }

  changeTurn(diff: number) {
    this.isChooseTrash = false;
    this.demon.strategyTurn += diff;
    if (this.demon.strategyTurn < 1) {
      this.demon.strategyTurn = 1;
    }
    else if (this.demon.strategyTurn > this.demon.maxturn) {
      this.demon.strategyTurn = this.demon.maxturn;
    }
    this.turnText.setText(String(this.demon.strategyTurn));
    this.dotIndicator.setCurrentdot(this.demon.strategyTurn - 1);
    this.moveChosenCards();
    this.moveUnchosenCards();
  }

  moveChosenCards() {
    let index = 0;
    this.demon.strategyCardList.forEach((cards) => {
      let s: string = String(index) + ": ";
      let depth = 1;
      let length = cards.length;
      cards.forEach((card) => {
        if (index == this.demon.strategyTurn){
          card.img.visible = true;
          card.img.depth = depth;
          if (this.game.canvas.width / 10 + card.defaultwidth * length >= this.game.canvas.width) {
            card.moveDirectly(
              this.game.canvas.width / 8 + ((this.game.canvas.width - this.game.canvas.width / 10) / length) * depth,
              this.game.canvas.height / 5,
              1.3
            );
          }
          else {
            card.moveDirectly(
              this.game.canvas.width / 8 + card.defaultwidth * depth,
              this.game.canvas.height / 5,
              1.3
            );
          }
        }
        else {
          card.img.visible = false;
          card.img.depth = depth;
        }
        s += card.cardName + "(" + card.nowcost + "," + card.num + "),";

        const turn: number = Number(this.demon.strategyTurn);
        card.setOnClick(() => {
          this.demon.removeChosenCard(turn, card);
          this.moveUnchosenCards();
          this.moveChosenCards();
        });
        depth++;
      });
      console.log(s);
      index++;
    });
    /*
    index = 0;
    this.demon.strategyPartyCardList.forEach((cards) => {
      let depth = 1;
      let length = cards.length;
      cards.some((card) => {
        if (index == this.demon.strategyTurn){
          if(this.demon.strategyPartyCardList[this.demon.strategyTurn].includes(card)){
            return false;
          }
          card.img.visible = true;
          card.img.depth = depth;
          console.log(depth);
          if (this.game.canvas.width / 10 + card.defaultwidth * length >= this.game.canvas.width) {
            card.moveDirectly(
              this.game.canvas.width / 5 + ((this.game.canvas.width/3) / length) * (depth - 1),
              this.game.canvas.height * 3 / 8,
              1.0
            );
          }
          else {
            card.moveDirectly(
              this.game.canvas.width / 5 + ((this.game.canvas.width/3) / length) * (depth - 1),
              this.game.canvas.height * 3 / 8,
              1.0
            );
          }
        }
        else {
          card.img.visible = false;
          card.img.depth = depth;
        }

        depth++;
      });
      index++;
    });*/
  }

  moveUnchosenCards() {
    if (this.forcusCardIndex >= this.demon.chosenDemonCardList.length) {
      this.forcusCardIndex = 0;
    }

    if(this.isChooseTrash){
      this.alertText.setText(
        "捨て札にするカードを選んでください"
      );
    }
    else{
      this.alertText.setText(
        this.demon.strategyTurn + "ターン目のカードを選んでください"
      );
    }

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

      if (!this.demon.chosenDemonCardList[i].strategyCanUse()) {
        this.demon.chosenDemonCardList[i].img.setAlpha(0.5);
      }
      else if(this.isChooseTrash){
        this.cardBuffer.img.setAlpha(0.5);
      }
      else {
        this.demon.chosenDemonCardList[i].img.setAlpha(1.0);
      }

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
    if (!this.demon.chosenDemonCardList[this.forcusCardIndex].strategyCanUse()) {
      return;
    }
    // this.strategyCardList が undefined の場合、空の二次元配列として初期化
    if (!this.demon.strategyCardList) {
      this.demon.strategyCardList = [];
    }

    // this.turn に対応する配列が undefined の場合、空配列をセット
    if (!this.demon.strategyCardList[this.demon.strategyTurn]) {
      this.demon.strategyCardList[this.demon.strategyTurn] = [];
    }

    if(!this.isChooseTrash && (
      this.demon.chosenDemonCardList[this.forcusCardIndex].cardName == "王、失脚" 
      || this.demon.chosenDemonCardList[this.forcusCardIndex].cardName == "家族狩り"
    )){
      this.cardBuffer = this.demon.chosenDemonCardList[this.forcusCardIndex];
      this.isChooseTrash = true;
      this.moveChosenCards();
      this.moveUnchosenCards();
      return;
    }

    if(this.isChooseTrash){
      if(this.demon.chosenDemonCardList[this.forcusCardIndex].num != this.cardBuffer.num){
        // カードを抽出し、選択列へ
        const card: Card = pickDemonNameCardList(this, -300, -300, this.demon.chosenDemonCardList[this.forcusCardIndex].num) as DemonEventCard;
        card.setDemon(this.demon);
        const eventcard: DemonEventCard = pickDemonNameCardList(this, -300, -300, this.cardBuffer.num) as DemonEventCard;
        eventcard.setChosenCard(card);

        this.demon.strategyCardList[this.demon.strategyTurn].push(eventcard);
      }
      this.isChooseTrash = false;
      this.moveChosenCards();
      this.moveUnchosenCards();
      return;
    }
    else{
      // カードを抽出し、選択列へ
      const card: Card = pickDemonNameCardList(this, -300, -300, this.demon.chosenDemonCardList[this.forcusCardIndex].num);
      card.setDemon(this.demon);
  
      this.demon.strategyCardList[this.demon.strategyTurn].push(card);
    }

    // カードの位置と処理を変更する
    this.moveChosenCards();
    this.moveUnchosenCards();
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
    this.demon.strategyCardList.forEach((cards) => {
      cards.forEach((card) => {
        card.update();
      });
    });

    this.crystalIndicatior.setCurrentNum(
      this.demon.getStrategyTurnCost(),
      this.demon.strategyCostList[this.demon.strategyTurn],
      this.demon.getStrategyTurnCost() - this.demon.strategyTurn
    );
  }
}
