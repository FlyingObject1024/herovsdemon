import * as Phaser from "phaser";
import { smoothsteptanh } from "./ExtraMath";
import { Hero } from "./Hero";
import { Demon } from "./Demon";

export type NameToCardDict = {
  [key: string]: () => Card;
};

export abstract class Card extends Phaser.GameObjects.Container {
  hero!: Hero;
  demon!: Demon;

  num: number = 0;
  defaultcost: string = "0";
  nowcost: number = 0;

  // 手札・勇者なかまエリア・魔王なかまエリア・捨て札
  state: string = "nothing";

  side: string = "nothing";
  cardName: string = "";
  type: string = "";
  cardEffect: string = "";

  defaultsize: number = 1.0;
  expandedsize: number = 2.2;
  size: number = 1.0;
  moveable: boolean = true;
  scene: Phaser.Scene;
  defaultheight: number = 88;
  defaultwidth: number = 63;
  img: Phaser.GameObjects.Image;

  beforex: number = 0;
  beforey: number = 0;
  targetx: number = 0;
  targety: number = 0;
  moveframetime: number = 1;
  movingframe: number = 0;

  hoverflag: boolean = false;
  insidescreenflag: boolean = false;
  targetsize: number = 1.0;
  sizeframetime: number = 1;
  scalingframe: number = 0;

  constructor(scene: Phaser.Scene, x: number, y: number, num: number, side: string, size: number) {
    super(scene, x, y);

    this.num = num;
    this.side = side;
    this.size = size;
    this.defaultsize = size;
    this.expandedsize = size * this.expandedsize;

    this.x = x;
    this.x = y;

    this.scene = scene;
    this.scene.add.existing(this);

    this.img = this.scene.add.image(this.x, this.y, side + String(num));
    this.img.setDisplaySize(this.defaultwidth * this.size, this.defaultheight * this.size);
    this.setSize(this.defaultwidth * this.size, this.defaultheight * this.size).setInteractive();
  }

  setHero(hero: Hero) {
    this.hero = hero;
  }

  setDemon(demon: Demon) {
    this.demon = demon;
  }

  setDefaultCost(defaultcost: string) {
    this.defaultcost = defaultcost;
  }

  insidescreen_on() {
    this.insidescreenflag = true;
  }

  insidescreen_off() {
    this.insidescreenflag = false;
  }

  hover_on() {
    this.on('pointerover', () => {
      this.img.depth += 1;
      this.hoverflag = true;
    })
    this.on('pointerout', () => {
      this.img.depth += 1;
      this.hoverflag = false;
    })
  }

  hover_off() {
    this.hoverflag = false;
    this.off('pointerover');
    this.off('pointerout');
  }

  setOnClick(onClick: Function) {
    this.off('pointerup');
    this.on('pointerup', (p: any) => {
      onClick && onClick(p);
    })
  }

  moveSmoothly(x: number, y: number, f: number, defaultsize: number = this.defaultsize) {
    this.beforex = this.x;
    this.beforey = this.y;
    this.targetx = x;
    this.targety = y;

    this.defaultsize = defaultsize;

    this.moveframetime = f;
    this.movingframe = f;
  }


  moveDirectly(x: number, y: number, defaultsize: number = this.defaultsize) {
    this.x = x;
    this.y = y;
    this.defaultsize = defaultsize;
  }

  hover_scale() {
    if (this.hoverflag) {
      this.size += 0.2;
      if (this.size >= this.expandedsize) {
        this.size = this.expandedsize;
      }
    }
    else {
      this.size -= 0.2;
      if (this.size <= this.defaultsize) {
        this.size = this.defaultsize;
      }
    }
  }

  update() {
    if (this.moveable == false) {
      return;
    }
    else {
      this.hover_scale();
      this.img.setDisplaySize(this.defaultwidth * this.size, this.defaultheight * this.size);
      if (this.movingframe > 0) {
        this.movingframe -= 1;
        this.x = this.targetx + (this.beforex - this.targetx) * smoothsteptanh(this.movingframe / this.moveframetime);
        this.y = this.targety + (this.beforey - this.targety) * smoothsteptanh(this.movingframe / this.moveframetime);
        this.size = this.defaultsize + (this.size - this.defaultsize) * smoothsteptanh(this.movingframe / this.moveframetime);
        if (this.insidescreenflag) {
          let marginx = 0;
          let marginy = 0;
          if ((this.x + this.img.width / 2) > this.scene.game.canvas.width) {
            marginx = (this.x + this.img.width / 2) - this.scene.game.canvas.width;
          }
          else if ((this.x - this.img.width / 2) < 0) {
            marginx = -(this.x - this.img.width / 2);
          }
          if ((this.y + this.img.height / 2) > this.scene.game.canvas.height) {
            marginy = (this.y + this.img.height / 2) - this.scene.game.canvas.height;
          }
          else if ((this.y - this.img.height / 2) < 0) {
            marginy = -(this.y - this.img.height / 2);
          }
          this.img.setX(this.x + marginx);
          this.img.setY(this.y + marginy);
        }
        else {
          this.img.setX(this.x);
          this.img.setY(this.y);
        }
      }
      else {
        this.img.setX(this.x);
        this.img.setY(this.y);
      }
    }
  }

  canUse(): boolean {
    console.log("canUse");
    let result = false;
    if (this.state != "hand") {
      result = false;
      return result;
    }

    if (this.side == "hero") {
      if (this.hero.nowCost >= Number(this.nowcost)) {
        result = true;
      }
    }
    else if (this.side == "demon") {
      if (this.demon.nowCost >= Number(this.nowcost)) {
        result = true;
      }
    }
    return result;
  }

  strategyCanUse(): boolean {
    this.demon.updateStrategyList();

    // なかまエリアにいるかどうか
    if (this.isIncludedPartyCardList()) {
      console.log(this.cardName + " party");
      return false;
    }

    // 勇者なかまエリアにいるかどうか
    if (this.isIncludedHeroPartyCardList()) {
      console.log(this.cardName + " hero party");
      return false;
    }

    // 捨て札かどうか
    if (this.isIncludedTrashCardList()) {
      console.log(this.cardName + " trash");
      return false;
    }

    // フルメランを使っているか(ターンが終わっているか)
    if (this.demon.isStrategyTurnEnd()) {
      console.log(this.cardName + " turn ended");
      return false;
    }
    
    // コスト上限かどうか
    if ((this.demon.strategyCostList[this.demon.strategyTurn] + this.nowcost) > this.demon.getStrategyTurnCost()) {
      console.log(this.cardName + " costover");
      return false;
    }

    // 選択済みかどうか・ブルループを既に使っているか
    if (this.isIncludedInStrategyCardList()) {
      console.log(this.cardName + " include");
      return false;
    }

    // その他発動条件を満たしているか
    // 5, 6, 7, 8を直接比較して || でくくると構文解析上のエラーが起こる(?)
    // -> This comparison appears to be unintentional because the types '5 | 6' and '7' have no overlap.
    if (((5 <= this.num && this.num <= 6) && this.demon.strategyTurn > 3)) {
      console.log(this.cardName + "turn restriction");
      return false;
    }
    if (((7 <= this.num && this.num <= 8) && this.demon.strategyTurn < 4)) {
      console.log(this.cardName + "turn restriction");
      return false;
    }

    return true;
  }

  strategyCanTrash(): boolean{
    // なかまエリアにいるかどうか
    if (this.isIncludedPartyCardList()) {
      console.log(this.cardName + " party");
      return false;
    }

    // 勇者なかまエリアにいるかどうか
    if (this.isIncludedHeroPartyCardList()) {
      console.log(this.cardName + " hero party");
      return false;
    }

    // 捨て札かどうか
    if (this.isIncludedTrashCardList()) {
      console.log(this.cardName + " trash");
      return false;
    }
    return true;
  }

  isIncludedInStrategyCardList(): boolean {
    let result: boolean = false;
    // 直接 return true;にするとtrue扱いにならない → (コンパイラ)の問題か？

    this.demon.strategyCardList[this.demon.strategyTurn].forEach((checking) => {
      if (checking.num === this.num) {
        result = true;
        return result;
      }
      if (checking.cardName == "ブルループ" && this.cardName == "ブルループ") {
        result = true;
        return result;
      }
    });
    return result;
  }

  isIncludedTrashCardList(): boolean {
    let result: boolean = false;
    // 直接 return true;にするとtrue扱いにならない → (コンパイラ)の問題か？

    this.demon.strategyTrashCardList[this.demon.strategyTurn].forEach((checking) => {
      if (checking.num === this.num) {
        result = true;
        return result;
      }
    });
    return result;
  }

  isIncludedPartyCardList(): boolean {
    let result: boolean = false;
    // 直接 return true;にするとtrue扱いにならない → (コンパイラ)の問題か？

    this.demon.strategyPartyCardList[this.demon.strategyTurn].forEach((checking) => {
      if (checking.num === this.num) {
        result = true;
        return result;
      }
    });
    return result;
  }

  isIncludedHeroPartyCardList(): boolean {
    let result: boolean = false;
    // 直接 return true;にするとtrue扱いにならない → (コンパイラ)の問題か？

    this.demon.strategyHeroPartyCardList[this.demon.strategyTurn].forEach((checking) => {
      if (checking.num === this.num) {
        result = true;
        return result;
      }
    });
    return result;
  }

  decreaseCost() {
    if (this.side == "hero") {
      if (Number.isNaN(this.defaultcost)) {
        this.nowcost -= Number(this.defaultcost);
      }
    }
    else if (this.side == "demon") {
      if (Number.isNaN(this.defaultcost)) {
        this.nowcost -= Number(this.defaultcost);
      }
    }
  }

  action() {
    console.log("No action");
  }
}

