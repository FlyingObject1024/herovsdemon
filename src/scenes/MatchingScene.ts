export class MatchingScene extends Phaser.Scene {
  constructor() {
    // シーンのkeyを指定
    super('matching');
  }
  preload() {
    console.log("Matching");
  }
  // preload内のアセットのロード後実行される
  create() {
    const { width, height } = this.game.canvas;

    //this.add.image(width/2, height/2, 'logo');
    this.add.text(width / 2, height / 64, '対戦モード',{ color: '#000000', fontSize: '28px', fontFamily: 'BestTen-CRT' }).setOrigin(0.5);
    var oneDevice = this.add.text(width / 2, height / 2 +     height / 12, '１つのデバイスでプレイする',{ color: '#000000', fontSize: '28px', fontFamily: 'BestTen-CRT' }).setOrigin(0.5);
    this.add.text(width / 2, height / 2 + 2 * height / 12, '勇者としてオンライン対戦をする',{ color: '#000000', fontSize: '28px', fontFamily: 'BestTen-CRT' }).setOrigin(0.5);
    this.add.text(width / 2, height / 2 + 4 * height / 12, '魔王としてオンライン対戦をする',{ color: '#000000', fontSize: '28px', fontFamily: 'BestTen-CRT' }).setOrigin(0.5);

    
    oneDevice.setInteractive({
      useHandCursor: true
    });
    oneDevice.on('pointerdown', () => {
      this.scene.start('one_device_battle', { timelineID: 'start' });
    });

    var backToTitle = this.add.text(0, height, 'タイトルへ戻る').setOrigin(0.0, 1.0);
    this.add.text(width, height, '右下').setOrigin(1.0);

    backToTitle.setInteractive({
      useHandCursor: true
    });
    backToTitle.on('pointerdown', () => {
      this.scene.start('entrance', { timelineID: 'start' });
    });
  }
}
