import { Hero } from "../classes/Hero";
import { Demon } from "../classes/Demon";
import { Button } from "../classes/Button";
import { gaussianDistribution } from "../classes/ExtraMath";
import { positiveMod } from "../classes/ExtraMath";

export class DemonChooseScene extends Phaser.Scene{
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
  
  spacekey!: Phaser.Input.Keyboard.Key;
  enterkey!: Phaser.Input.Keyboard.Key;
  upkey!: Phaser.Input.Keyboard.Key;
  downkey!: Phaser.Input.Keyboard.Key;
  leftkey!: Phaser.Input.Keyboard.Key;
  rightkey!: Phaser.Input.Keyboard.Key;

  constructor() {
    // シーンのkeyを指定
    super("demon_choose");
  }

  // constructorが使えないので代わりにdataを受け取る
  init(data: { hero: Hero; demon: Demon; }) {
    this.jointime = new Date();
    this.hero = data.hero;
    this.demon = data.demon;
    this.timeText = this.add.text(0, 0, "残り時間 ",{ color: '#000000', fontSize: '28px', fontFamily: 'BestTen-CRT' }).setOrigin(0.0, 0.0);
    this.alertText= this.add.text(
      this.game.canvas.width/2,0,
      "あと"
      +String(this.demon.maxcard - this.demon.chosenDemonCardList.length)
      +"枚カードを選んでください ",
      { color: '#000000', fontSize: '28px', fontFamily: 'BestTen-CRT' }
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

    this.spacekey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.enterkey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.upkey    = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.downkey  = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    this.leftkey  = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    this.rightkey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
  }

  preload() {
    console.log("demon_choose");
  }

  // preload内のアセットのロード後実行される
  create() {
    if (this.input?.keyboard) {
      this.input.keyboard.off("keydown-LEFT");
      this.input.keyboard.on("keydown-LEFT", () =>{
        this.cardLeftShift();
      });
      this.input.keyboard.off("keydown-RIGHT");
      this.input.keyboard.on("keydown-RIGHT", () =>{
        this.cardRightShift();
      });
      this.input.keyboard.off("keydown-SPACE");
      this.input.keyboard.on("keydown-SPACE", () =>{
        this.chooseCard();
      });
    }

    this.moveUnchosenCards();
  }

  moveChosenCards(){
    // foreachのやりかただと上手くいかない？
    for(let index = 0;index < this.demon.chosenDemonCardList.length;index++){
      this.demon.chosenDemonCardList[index].moveSmoothly(
        (this.game.canvas.width / this.demon.maxcard)*index + this.game.canvas.width / (this.demon.maxcard*2), 
        this.game.canvas.height/2 - this.game.canvas.height/4,
        20,
        (this.game.canvas.width / this.demon.maxcard)*0.8 / this.demon.chosenDemonCardList[index].defaultwidth
      );
      this.demon.chosenDemonCardList[index].setOnClick(() => {
        this.returnCard(index);
      });
      this.demon.chosenDemonCardList[index].hover_on();
    }
  }

  moveUnchosenCards() {
    if(this.forcusCardIndex >= this.demon.randDemonCardList.length){
      this.forcusCardIndex = 0;
    }
    
    this.alertText.setText(
      "あと"
      +String(this.demon.maxcard - this.demon.chosenDemonCardList.length)
      +"枚カードを選んでください "
    );

    if(this.demon.maxcard - this.demon.chosenDemonCardList.length == 0){
      this.gobutton.visible = true;
    }
    else{
      this.gobutton.visible = false;
    }
    
    const centerx = this.game.canvas.width / 2;
    const centery = this.game.canvas.height * 3 / 4;
    const margin =  this.game.canvas.width / 4;
    //const margin =  this.demon.randDemonCardList[this.forcusCardIndex].defaultwidth*4.0;

    for (let index = 0; index < this.demon.randDemonCardList.length; index++) {
      const i = positiveMod((this.forcusCardIndex + index - 5), this.demon.randDemonCardList.length);
      
      this.demon.randDemonCardList[i].setOnClick(() => {
        this.cardShift(i - this.forcusCardIndex);
      });

      this.demon.randDemonCardList[i].hover_off();

      if(true){
        this.demon.randDemonCardList[i].moveSmoothly(
          centerx + (index - 5) * margin,
          centery,
          20,
          (this.game.canvas.width / this.demon.maxcard)*0.8 / this.demon.randDemonCardList[index].defaultwidth
        );
      }
      else{
        this.demon.randDemonCardList[i].setX(centerx + (index - 5) * margin);
        this.demon.randDemonCardList[i].setY(centery);
      }
    }
    
    this.demon.randDemonCardList[this.forcusCardIndex].setOnClick(() => {
        this.chooseCard();
    });
  }

  // カード列をdiffずらす
  cardShift(diff: number = 0){
    this.forcusCardIndex += diff;
    this.forcusCardIndex = positiveMod(this.forcusCardIndex, this.demon.randDemonCardList.length);
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
    if(this.demon.chosenDemonCardList.length <= 0){
      return;
    };

    // カードを選択し、未選択列へ
    this.demon.randDemonCardList.push(this.demon.chosenDemonCardList.splice(index,1)[0]);
    
    // カードの位置と処理を変更する
    this.moveChosenCards();
    this.moveUnchosenCards();
  }

  // カードを選択列へ移す
  chooseCard(){
    if(this.demon.chosenDemonCardList.length >= this.demon.maxcard){
      return;
    };

    // カードを抽出し、選択列へ
    this.demon.chosenDemonCardList.push(this.demon.randDemonCardList.splice(this.forcusCardIndex,1)[0]);

    // カードの位置と処理を変更する
    this.moveChosenCards();
    this.moveUnchosenCards();
  }

  // 現フェーズの表示情報を片づけて終了する
  killPhase(){
    for (let index = 0; index < this.demon.randDemonCardList.length; index++) {
      this.demon.randDemonCardList[index].setX(-300);
      this.demon.randDemonCardList[index].setY(-300);
      this.demon.randDemonCardList[index].img.visible = false;
    }
    for (let index = 0; index < this.demon.chosenDemonCardList.length; index++) {
      this.demon.chosenDemonCardList[index].setX(-300);
      this.demon.chosenDemonCardList[index].setY(-300);
      this.demon.chosenDemonCardList[index].img.visible = false;
    }
    this.rightbutton.visible = false;
    this.leftbutton.visible = false;
    this.gobutton.visible = false;
    this.scene.stop();
  }

  // フェーズを進める
  progressPhase(){
    this.scene.launch("strategy", {hero: this.hero, demon: this.demon});
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
    this.demon.randDemonCardList.forEach((card) => {
      // 中央はカードのサイズを大きくする
      card.defaultsize = gaussianDistribution((card.x - this.game.canvas.width / 2) / this.game.canvas.width, 0.5) * ((this.game.canvas.height/2)/this.demon.randDemonCardList[this.forcusCardIndex].defaultheight);
      card.img.depth = gaussianDistribution((card.x - this.game.canvas.width / 2) / this.game.canvas.width, 0.5)*100;
      card.update();
    });
    this.demon.chosenDemonCardList.forEach((card) => {
      card.update();
    });
  }
}
