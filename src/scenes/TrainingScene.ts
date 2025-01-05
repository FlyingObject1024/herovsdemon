export class TrainingScene extends Phaser.Scene {
  constructor() {
    // シーンのkeyを指定
    super('training');
  }
  preload() {
    console.log("Training");
  }
  // preload内のアセットのロード後実行される
  create() {
    const { width, height } = this.game.canvas;

    //this.add.image(width/2, height/2, 'logo');
    this.add.text(width / 2, height / 64, '修行モード').setOrigin(0.5);
    this.add.text(width / 2, height / 2 + height / 12, '勇者の修行をする(工事中)').setOrigin(0.5);
    this.add.text(width / 2, height / 2 + 2 * height / 12, '魔王の修行をする(工事中)').setOrigin(0.5);

    var backToTitle = this.add.text(0, height, 'タイトルへ戻る').setOrigin(0.0, 1.0);
    this.add.text(width, height, '右下').setOrigin(1.0);

    // trainingをクリックできるように設定
    backToTitle.setInteractive({
      useHandCursor: true  // マウスオーバーでカーソルが指マークになる
    });

    // backToTitleをクリックしたらEntranceSceneに遷移
    backToTitle.on('pointerdown', () => {
      this.scene.start('entrance', { timelineID: 'start' });
    });
  }
}
