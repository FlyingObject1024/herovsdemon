import { Hero } from "../classes/Hero";
import { Demon } from "../classes/Demon";

export class OneDeviceBattleScene extends Phaser.Scene { 
  hero: Hero = new Hero(this);
  demon: Demon = new Demon(this);

  constructor() {
    // シーンのkeyを指定
    super('one_device_battle');
  }
  preload() {
    console.log("one_devide_battle");
  }
  // preload内のアセットのロード後実行される
  create() {
    var { width, height } = this.game.canvas;

    var backToTitle = this.add.text(0, height, 'タイトルへ戻る').setOrigin(0.0, 1.0);
    this.add.text(width, height, '右下').setOrigin(1.0);

    // 各クラスでキーを生成
    this.hero.setDemonkey(this.demon.demonkey);
    this.demon.setHerokey(this.hero.herokey);

    // 各クラスの初期化を完了する
    this.hero.completeInit();
    this.demon.completeInit();

    //this.scene.launch("hero_choose");

    backToTitle.setInteractive({
      useHandCursor: true
    });
    backToTitle.on('pointerdown', () => {
      this.scene.start('entrance', { timelineID: 'start' });
    });
  }

  update(){

  }
}
