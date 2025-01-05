import { Card } from "../classes/Card";

function getRandomNumbers(rangeStart: number, rangeEnd: number, count: number): number[] {
  const numbers: number[] = [];
  for (let i = rangeStart; i <= rangeEnd; i++) {
      numbers.push(i);
  }

  const result: number[] = [];
  while (result.length < count) {
      const randomIndex = Math.floor(Math.random() * numbers.length);
      result.push(numbers[randomIndex]);
      numbers.splice(randomIndex, 1); // 選ばれた数を除去して重複を防ぐ
  }

  return result;
}

function generateRandomArray(): number[] {
  const part1 = getRandomNumbers(1, 8, 4);  // 1~8から4つ選ぶ
  const part2 = getRandomNumbers(9, 30, 11); // 9~30から11つ選ぶ
  return [...part1, ...part2]; // 結合して1つの配列にする
}


export class OneDeviceBattleScene extends Phaser.Scene { 
  public shufflecardlist: number[] | undefined;
  public demoncardlist: Card[] | undefined;
  public herocardlist: Card[] | undefined;

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
    this.shufflecardlist = generateRandomArray();

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
