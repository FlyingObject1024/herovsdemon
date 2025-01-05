export class EntranceScene extends Phaser.Scene {
    constructor() {
        // シーンのkeyを指定
        super('entrance');
    }
    preload() {
        console.log("Entrance");
        var { width, height } = this.game.canvas;
        const loading = this.add.text(width / 2, height / 2, 'Now Loading...').setOrigin(0.5, 0.0);
        // ロードしたアセットは他のシーンでも使用可
        for(let i:number = 1; i <= 30; i++){
          this.load.image("hero"+String(i), "assets/images/cards/hero/"+String(i)+".png");
          this.load.image("demon"+String(i), "assets/images/cards/demon/"+String(i)+".png");
        }
        loading.visible = false;
    }
    // preload内のアセットのロード後実行される
    create() {
        var { width, height } = this.game.canvas;

        // ウィンドウの大きさが変更された時の自動スケーリング(未解決)
        window.addEventListener('resize', () => {
          this.game.scale.resize(window.innerWidth, window.innerHeight);
          this.game.scale.refresh();
        });

        //this.add.image(width/2, height/2, 'logo');
        this.add.text(width / 2, height / 64, '勇者vs魔王').setOrigin(0.5, 0.0);
        var training = this.add.text(width / 2, height / 2 - height / 12, '修行モード(1人プレイ)').setOrigin(0.5);
        var matching = this.add.text(width / 2, height / 2 + height / 12, '対戦モード(2人プレイ)').setOrigin(0.5);
        var lab = this.add.text(width / 2, height / 2 + 2*height / 12, '開発用実験室').setOrigin(0.5);

        // trainingをクリックできるように設定
        training.setInteractive({
            useHandCursor: true  // マウスオーバーでカーソルが指マークになる
        });
        // trainingをクリックしたらTrainingSceneに遷移
        training.on('pointerdown', () => {
            this.scene.start('training', { timelineID: 'start' });
        });
        
        // matchingをクリックできるように設定
        matching.setInteractive({
            useHandCursor: true  // マウスオーバーでカーソルが指マークになる
        });
        matching.on('pointerdown', () => {
            this.scene.start('matching', { timelineID: 'start' });
        });
        
        lab.setInteractive({
            useHandCursor: true  // マウスオーバーでカーソルが指マークになる
        });
        lab.on('pointerdown', () => {
            this.scene.start('lab', { timelineID: 'start' });
        });
        
        this.add.text(0, height, '左下').setOrigin(0.0, 1.0);
        this.add.text(width, height, '2025@flying-object').setOrigin(1.0);
    }
}
