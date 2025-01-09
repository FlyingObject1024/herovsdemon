import { Button } from "../classes/Button";
import { Card } from "../classes/Card";

export class LabScene extends Phaser.Scene {
  width!: Number;
  height!: Number;
  hero1!: Card;
  button!: Button;
  exitbutton!: Button;
  rightbutton!: Button;
  leftbutton!: Button;
  x:Number = 1.0;

  constructor() {
    // シーンのkeyを指定
    super('lab');
  }
  preload() {
    console.log("Lab");
  }
  // preload内のアセットのロード後実行される
  create() {
    this.width = this.game.canvas.width;
    this.height = this.game.canvas.height;
    // カードの比は 63x88 height = width*1.40
    this.hero1 = new Card(this, Number(this.width)/2, Number(this.height)/4, 15, "hero",2.0);
    this.hero1.hover_on();

    this.add.text(Number(this.width) / 2, 0, '実験室').setOrigin(0.5, 0.0);

    var backToTitle = this.add.text(0, Number(this.height), 'タイトルへ戻る').setOrigin(0.0, 1.0);
    this.add.text(Number(this.width), Number(this.height), '右下').setOrigin(1.0);

    this.exitbutton = new Button(this, 100, 200, 2.0, "button_exit", {
      onClick: () =>{
        console.log("exit");
        this.hero1.moveSmoothly(Number(this.width)/2, Number(this.height)/4, 30);
      }
    });

    this.button = new Button(this, 100, 100, 2.0, "button_attack", {
      onClick: () =>{
        console.log("attack!!");
        this.hero1.moveSmoothly(Number(this.width)/2, Number(this.height) - Number(this.height)/4, 30);
      }
    });
    
    this.rightbutton = new Button(this, Number(this.width)/2 + Number(this.width)/4, Number(this.height) - Number(this.height)/10, 3.0, "button_right", {
      onClick: () =>{
        console.log("right");
        this.hero1.moveSmoothly(Number(this.width)/2 + Number(this.width)/4,Number(this.height)/2, 30);
      }
    });
    
    this.leftbutton = new Button(this, Number(this.width)/2 - Number(this.width)/4, Number(this.height) - Number(this.height)/10, 3.0, "button_left", {
      onClick: () =>{
        console.log("left");
        this.hero1.moveSmoothly(Number(this.width)/2 - Number(this.width)/4,Number(this.height)/2, 30);
      }
    });

    // backToTitleをクリックできるように設定
    backToTitle.setInteractive({
      useHandCursor: true  // マウスオーバーでカーソルが指マークになる
    });
    // backToTitleをクリックしたらEntranceSceneに遷移
    backToTitle.on('pointerdown', () => {
      this.scene.start('entrance', { timelineID: 'start' });
    });
  }
  update() {
    this.width = this.game.canvas.width;
    this.height = this.game.canvas.height;
    this.hero1?.update();
  }
}
