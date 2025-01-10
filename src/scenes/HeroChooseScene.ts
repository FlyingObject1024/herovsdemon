import { Hero } from "../classes/Hero";
import { Demon } from "../classes/Demon";
import { Button } from "../classes/Button";
import { gaussianDistribution } from "../classes/ExtraMath";
import { positiveMod } from "../classes/ExtraMath";

export class HeroChooseScene extends Phaser.Scene{
  hero!: Hero;
  demon!: Demon;

  jointime!: Date;
  timelimit: number = 180;
  
  forcusCardIndex: number = 0;

  timeText!: Phaser.GameObjects.Text;
  alertText!: Phaser.GameObjects.Text;

  rightbutton!: Button;
  leftbutton!: Button;

  gobutton! :Button;

  constructor() {
    // シーンのkeyを指定
    super("hero_choose");
  }

  // constructorが使えないので代わりにdataを受け取る
  init(data: { hero: Hero; demon: Demon; }) {
    this.jointime = new Date();
    this.hero = data.hero;
    this.demon = data.demon;
    this.timeText = this.add.text(0, 0, "残り時間 ").setOrigin(0.0, 0.0);
    this.alertText= this.add.text(
      this.game.canvas.width/2,0,
      "あと"
      +String(this.hero.maxcard - this.hero.chosenDemonCardList.length)
      +"枚カードを選んでください "
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
    
    this.gobutton = new Button(this, Number(this.game.canvas.width) / 2, Number(this.game.canvas.height) * 3 / 4, 4.0, "button_go", {
      onClick: () => {
        console.log("go");
        this.progressPhase();
      }
    });

    this.gobutton.visible = false;
  }

  preload() {
    console.log("hero_choose");
  }

  // preload内のアセットのロード後実行される
  create() {
    if (this.input?.keyboard) {
      this.input.keyboard.off("keydown-left");
      this.input.keyboard.on("keydown-left", () =>{
        this.cardLeftShift();
      });
      this.input.keyboard.off("keydown-right");
      this.input.keyboard.on("keydown-right", () =>{
        this.cardRightShift();
      });
      this.input.keyboard.off("keydown-up");
      this.input.keyboard.on("keydown-up", () =>{
        this.chooseCard();
      });
      this.input.keyboard.off("keydown-space");
      this.input.keyboard.on("keydown-space", () =>{
        this.chooseCard();
      });
    }

    this.moveUnchosenCards();
  }

  moveChosenCards(){
    // foreachのやりかただと上手くいかない？
    for(let index = 0;index < this.hero.chosenHeroCardList.length;index++){
      this.hero.chosenHeroCardList[index].moveSmoothly(
        (this.game.canvas.width / this.hero.maxcard)*index + this.game.canvas.width / (this.hero.maxcard*2), 
        this.game.canvas.height/2 - this.game.canvas.height/4,
        20,
        (this.game.canvas.width / this.hero.maxcard)*0.8 / this.hero.chosenHeroCardList[index].defaultwidth
      );
      this.hero.chosenHeroCardList[index].setOnClick(() => {
        this.returnCard(index);
      });
      this.hero.chosenHeroCardList[index].hover_on();
    }
  }

  moveUnchosenCards() {
    if(this.forcusCardIndex >= this.hero.randHeroCardList.length){
      this.forcusCardIndex = 0;
    }
    
    this.alertText.setText(
      "あと"
      +String(this.hero.maxcard - this.hero.chosenHeroCardList.length)
      +"枚カードを選んでください "
    );

    if(this.hero.maxcard - this.hero.chosenHeroCardList.length == 0){
      this.gobutton.visible = true;
    }
    else{
      this.gobutton.visible = false;
    }
    
    const centerx = this.game.canvas.width / 2;
    const centery = this.game.canvas.height * 3 / 4;
    const margin =  this.game.canvas.width / 4;
    //const margin =  this.hero.randHeroCardList[this.forcusCardIndex].defaultwidth*4.0;

    for (let index = 0; index < this.hero.randHeroCardList.length; index++) {
      const i = positiveMod((this.forcusCardIndex + index - 5), this.hero.randHeroCardList.length);
      
      this.hero.randHeroCardList[i].setOnClick(() => {
        this.cardShift(i - this.forcusCardIndex);
      });

      this.hero.randHeroCardList[i].hover_off();

      if(true){
        this.hero.randHeroCardList[i].moveSmoothly(
          centerx + (index - 5) * margin,
          centery,
          20,
          (this.game.canvas.width / this.hero.maxcard)*0.8 / this.hero.randHeroCardList[index].defaultwidth
        );
      }
      else{
        this.hero.randHeroCardList[i].setX(centerx + (index - 5) * margin);
        this.hero.randHeroCardList[i].setY(centery);
      }
    }
    
    this.hero.randHeroCardList[this.forcusCardIndex].setOnClick(() => {
        this.chooseCard();
    });
  }

  // カード列をdiffずらす
  cardShift(diff: number = 0){
    this.forcusCardIndex += diff;
    this.forcusCardIndex = positiveMod(this.forcusCardIndex, this.hero.randHeroCardList.length);
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

  // カードを未選択列へ戻す
  returnCard(index: number){
    if(this.hero.chosenHeroCardList.length <= 0){
      return;
    };

    // カードを選択し、未選択列へ
    this.hero.randHeroCardList.push(this.hero.chosenHeroCardList.splice(index,1)[0]);
    
    // カードの位置と処理を変更する
    this.moveChosenCards();
    this.moveUnchosenCards();
  }

  // カードを選択列へ移す
  chooseCard(){
    if(this.hero.chosenHeroCardList.length >= this.hero.maxcard){
      return;
    };

    // カードを抽出し、選択列へ
    this.hero.chosenHeroCardList.push(this.hero.randHeroCardList.splice(this.forcusCardIndex,1)[0]);

    // カードの位置と処理を変更する
    this.moveChosenCards();
    this.moveUnchosenCards();
  }

  // 現フェーズの表示情報を片づけて終了する
  killPhase(){
    this.rightbutton.visible = false;
    this.leftbutton.visible = false;
    this.scene.stop();
  }

  // フェーズを進める
  progressPhase(){
    this.killPhase();
  }

  // 選択時間切れ
  timeup(){
    this.progressPhase();
  }


  // 残り時間カウンターの処理
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
    this.hero.randHeroCardList.forEach((card) => {
      // 中央はカードのサイズを大きくする
      card.defaultsize = gaussianDistribution((card.x - this.game.canvas.width / 2) / this.game.canvas.width, 0.5) * ((this.game.canvas.height/2)/this.hero.randHeroCardList[this.forcusCardIndex].defaultheight);
      card.img.depth = gaussianDistribution((card.x - this.game.canvas.width / 2) / this.game.canvas.width, 0.5)*100;
      card.update();
    });
    this.hero.chosenHeroCardList.forEach((card) => {
      card.update();
    });
  }
}
