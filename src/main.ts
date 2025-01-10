import Phaser from "phaser";
import { Scenes } from "./scenes";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  // 解像度を倍々にする設定
  width: Math.min(window.innerWidth * window.devicePixelRatio, 1920),
  height: Math.min(window.innerHeight * window.devicePixelRatio, 1080),
  scale: {
    //アスペクト比の維持
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  render: {
    // スケールした時を想定した設定 画面を作ってから決める
    pixelArt: true,
    antialias: false,
    antialiasGL: false,
  },
  parent: 'app',
  backgroundColor: '#1a8dc7',
  // 導入するシーンの決定
  scene: Scenes,
};

new Phaser.Game(config);