import { Card } from "../classes/Card";

export class LabScene extends Phaser.Scene {
  hero1!: Card;
  card: Phaser.GameObjects.Image | undefined;
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
    const { width, height } = this.game.canvas;

    this.hero1 = new Card(this, width/2,height/4,22,"hero",2.0);

    this.add.text(width / 2, 0, '実験室').setOrigin(0.5, 0.0);

    var backToTitle = this.add.text(0, height, 'タイトルへ戻る').setOrigin(0.0, 1.0);
    this.add.text(width, height, '右下').setOrigin(1.0);

    // カードの比は 63x88 height = width*1.40
    this.card = this.add.image(width/2,height/2, "hero15");
    this.card.setDisplaySize(63, 88);

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
    this.hero1?.update();
    if(Number(this.x) < 3.0){
      this.x = Number(this.x) + 0.01;
    }
    else{
      this.x = 1.0;
    }
    this.hero1.size = Number(this.x);
    this.card?.setDisplaySize(63*Number(this.x),88*Number(this.x));
    console.log(this.x);
  }
}
