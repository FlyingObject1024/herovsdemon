export class EntranceScene extends Phaser.Scene {
    constructor() {
        // シーンのkeyを指定
        super("entrance");
    }
    preload() {
        this.load.setBaseURL('./assets');
        console.log("Entrance");
        var { width, height } = this.game.canvas;
        width; height;

        //https://gpnotes.hatenablog.jp/entry/2019/01/22/170000
        
        //プログレスバー用のgraphics
        let progressBar = this.add.graphics();
        let progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width / 2 - width / 4, height / 2, width / 2, 30);

        let text = this.add.text(width / 2, 350, "load");
        text.setOrigin(0.5);

        //ロードが進行したときの処理
        this.load.on('progress', function (value: number) {
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(width / 2 - width / 4, height / 2, (width / 2) * value, 30);
        });

        //ファイルのロードに入ったときの処理
        this.load.on('fileprogress', function (file: { key: string; }) {
            text.text = file.key;
        });

        //すべてのロードが完了したときの処理
        this.load.on('complete', function () {
            text.text = 'complete';
            text.visible = false;
            progressBar.visible = false;
            progressBox.visible = false;
        });

        // ロードしたアセットは他のシーンでも使用可
        for (let i: number = 1; i <= 30; i++) {
            this.load.image("hero" + String(i), "/images/cards/hero/" + String(i) + ".png");
            this.load.image("demon" + String(i), "/images/cards/demon/" + String(i) + ".png");
        }

        let buttonlist = ["plain", "attack", "exit", "retry", "right", "left", "up", "down", "go"];
        for (let i = 0; i < buttonlist.length; i++) {
            this.load.image("button_" + buttonlist[i] + "_default", "/images/UI/button_" + buttonlist[i] + "_default.png");
            this.load.image("button_" + buttonlist[i] + "_hover", "/images/UI/button_" + buttonlist[i] + "_hover.png");
            this.load.image("button_" + buttonlist[i] + "_press", "/images/UI/button_" + buttonlist[i] + "_press.png");
        }

        let iconlist = ["heart", "sword", "shield", "hiddencrystal", "crystal", "redcrystal", "star", "arrow", "party", "trash"];
        for (let i = 0; i < iconlist.length; i++) {
            this.load.image("icon_" + iconlist[i], "/images/UI/icon_" + iconlist[i] + ".png");
        }

        this.load.image("dot_default", "/images/UI/dot_default.png");
        this.load.image("dot_pick", "/images/UI/dot_pick.png");
    }
    // preload内のアセットのロード後実行される
    create() {
        var { width, height } = this.game.canvas;

        // ウィンドウの大きさが変更された時の自動スケーリング(未解決)
        window.addEventListener("resize", () => {
            this.game.scale.resize(window.innerWidth, window.innerHeight);
            this.game.scale.refresh();
        });

        //this.add.image(width/2, height/2, 'logo');
        this.add.text(width / 2, height / 64, "勇者vs魔王",{ color: '#000000', fontSize: '28px', fontFamily: 'BestTen-CRT' }).setOrigin(0.5, 0.0);
        var training = this.add.text(width / 2, height / 2 - height / 12, "修行モード(1人プレイ)",{ color: '#000000', fontSize: '28px', fontFamily: 'BestTen-CRT' }).setOrigin(0.5);
        var matching = this.add.text(width / 2, height / 2 + height / 12, "対戦モード(2人プレイ)",{ color: '#000000', fontSize: '28px', fontFamily: 'BestTen-CRT' }).setOrigin(0.5);
        var lab = this.add.text(width / 2, height / 2 + 2 * height / 12, "開発用実験室",{ color: '#000000', fontSize: '28px', fontFamily: 'BestTen-CRT' }).setOrigin(0.5);

        // trainingをクリックできるように設定
        training.setInteractive({
            useHandCursor: true  // マウスオーバーでカーソルが指マークになる
        });
        // trainingをクリックしたらTrainingSceneに遷移
        training.on("pointerdown", () => {
            this.scene.start("training", { timelineID: "start" });
        });

        // matchingをクリックできるように設定
        matching.setInteractive({
            useHandCursor: true  // マウスオーバーでカーソルが指マークになる
        });
        matching.on("pointerdown", () => {
            this.scene.start("matching", { timelineID: "start" });
        });

        lab.setInteractive({
            useHandCursor: true  // マウスオーバーでカーソルが指マークになる
        });
        lab.on("pointerdown", () => {
            this.scene.start("lab", { timelineID: "start" });
        });

        this.add.text(0, height, "左下").setOrigin(0.0, 1.0);
        this.add.text(width, height, "2025@flying-object").setOrigin(1.0);
    }
}
