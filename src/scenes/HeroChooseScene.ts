import { Hero } from "../classes/Hero";
import { Demon } from "../classes/Demon";
import { Button } from "../classes/Button";
import { gaussianDistribution } from "../classes/ExtraMath";
import { positiveMod } from "../classes/ExtraMath";
import { Card } from "../classes/Card";

export class HeroChooseScene extends Phaser.Scene {
  hero!: Hero;
  demon!: Demon;

  jointime!: Date;
  timelimit: number = 180;
  timeText!: Phaser.GameObjects.Text;

  forcusCardIndex: number = 0;

  rightbutton!: Button;
  leftbutton!: Button;

  chosenCards: Card[] = [];

  constructor() {
    // シーンのkeyを指定
    super('hero_choose');
  }

  init(data: { hero: Hero; demon: Demon; }) {
    this.jointime = new Date();
    this.hero = data.hero;
    this.demon = data.demon;
  }

  preload() {
    this.timeText = this.add.text(0, 0, '残り時間 ').setOrigin(0.0, 0.0);
    console.log("hero_choose");
  }
  // preload内のアセットのロード後実行される
  create() {
    this.rightbutton = new Button(this, Number(this.game.canvas.width) / 2 + Number(this.game.canvas.width) / 4, Number(this.game.canvas.height) / 2, 3.0, "button_right", {
      onClick: () => {
        console.log("right");
        this.cardRightShift();
      }
    });

    this.leftbutton = new Button(this, Number(this.game.canvas.width) / 2 - Number(this.game.canvas.width) / 4, Number(this.game.canvas.height) / 2, 3.0, "button_left", {
      onClick: () => {
        console.log("left");
        this.cardLeftShift();
      }
    });

    if (this.input?.keyboard) {
      this.input.keyboard.off('keydown-left');
      this.input.keyboard.on('keydown-left', () =>
      {
        this.cardLeftShift();
      });
      this.input.keyboard.off('keydown-right');
      this.input.keyboard.on('keydown-right', () =>
      {
        this.cardRightShift();
      });
      this.input.keyboard.off('keydown-up');
      this.input.keyboard.on('keydown-up', () =>
      {
        this.chooseCard();
      });
      this.input.keyboard.off('keydown-space');
      this.input.keyboard.on('keydown-space', () =>
      {
        this.chooseCard();
      });
    }

    this.moveCard();
  }

  moveCard() {
    if(this.forcusCardIndex >= this.hero.heroCardList.length){
      this.forcusCardIndex = 0;
    }
    
    const centerx = this.game.canvas.width / 2;
    const centery = this.game.canvas.height * 4 / 5;
    const margin =  this.hero.heroCardList[this.forcusCardIndex].defaultwidth*4.0;

    for (let index = 0; index < this.hero.heroCardList.length; index++) {
      const i = positiveMod((this.forcusCardIndex + index - 5), this.hero.heroCardList.length);
      this.hero.heroCardList[i].setOnClick(
        () => {
          this.cardShift(i - this.forcusCardIndex);
        }
      );

      if(
        -5 <= i - this.forcusCardIndex
        &&
        i - this.forcusCardIndex <= 5
      ){
        this.hero.heroCardList[i].moveSmoothly(
          centerx + (index - 5) * margin,
          centery,
          20
        );
      }
      else{
        this.hero.heroCardList[i].moveSmoothly(
          centerx + (index - 5) * margin,
          centery,
          1
        );
      }
    }
    
    this.hero.heroCardList[this.forcusCardIndex].setOnClick(() => {
        this.chooseCard();
    });
  }

  cardShift(diff: number = 0){
    this.forcusCardIndex += diff;
    this.forcusCardIndex = positiveMod(this.forcusCardIndex, this.hero.heroCardList.length);
    this.moveCard();
  }

  cardRightShift(diff: number = 1) {
    this.cardShift(diff)
  }

  cardLeftShift(diff: number = 1) {
    this.cardShift(-diff)
  }

  backCard(){

  }

  chooseCard(){
    if(this.hero.chosenHeroCardList.length >= this.hero.maxcard){
      return;
    };

    this.hero.chosenHeroCardList.push(this.hero.heroCardList.splice(this.forcusCardIndex,1)[0]);

    let s:String = "";
    let index: number = 0;
    this.hero.chosenHeroCardList.forEach((card) => {
      s = s + String(card.num)+", ";
      card.moveSmoothly(
        (this.game.canvas.width / this.hero.maxcard)*index + this.game.canvas.width / (this.hero.maxcard*2), 
        this.game.canvas.height/2 - this.game.canvas.height/4,
        20,
        (this.game.canvas.width / this.hero.maxcard)*0.8 / card.defaultwidth
      );
      card.setOnClick(() => {
        this.backCard();
      });
      index++;
    });
    console.log(s);
    s = "";
    this.hero.heroCardList.forEach((card) => {
      s = s + String(card.num)+", ";
    });
    console.log(s);
    this.moveCard();
  }

  finishPhase(){

  }

  timeup(){
    this.finishPhase();
  }

  timecounter(){
    let now = new Date();
    let left = Math.ceil(this.timelimit - (now.getTime() - this.jointime.getTime())/1000);
    this.timeText.setText("残り時間 "+String(left)+"秒");
    if(left <= 0){
      this.timeup();
    }
  }

  update() {
    this.timecounter();
    this.hero.heroCardList.forEach((card) => {
      card.defaultsize = 1.0 + gaussianDistribution((card.x - this.game.canvas.width / 2) / this.game.canvas.width, 0.5) * 2.8;
      card.update();
    });
    this.hero.chosenHeroCardList.forEach((card) => {
      card.update();
    });

    this.hero.heroCardList[this.forcusCardIndex].update();
  }
}
