import { Hero } from "../classes/Hero";
import { Demon } from "../classes/Demon";

export class OneDeviceBattleScene extends Phaser.Scene { 
  hero!: Hero;
  demon!: Demon;

  constructor() {
    // シーンのkeyを指定
    super('one_device_battle');
  }

  init(){
    console.log("init");
    this.hero = new Hero(this);
    this.demon = new Demon(this);
  }

  preload() {
    console.log("one_devide_battle");
  }
  // preload内のアセットのロード後実行される
  create() {
    var { width, height } = this.game.canvas;

    var backToTitle = this.add.text(0, height, 'タイトルへ戻る').setOrigin(0.0, 1.0);
    this.add.text(width, height, '右下').setOrigin(1.0);

    // 各クラスへキーを受け渡し
    this.hero.setDemonkey(this.demon.demonkey);
    this.demon.setHerokey(this.hero.herokey);

    // 各クラスの初期化を完了する
    this.hero.completeInit(this.hero, this.demon);
    this.demon.completeInit(this.hero, this.demon);

    this.scene.launch("hero_choose", {hero: this.hero, demon: this.demon});

    backToTitle.setInteractive({
      useHandCursor: true
    });
    backToTitle.on('pointerdown', () => {
      this.scene.stop('hero_choose');
      this.scene.stop('demon_choose');
      this.scene.start('entrance', { timelineID: 'start' });
    });
  }

  update(){
    
  }
}
