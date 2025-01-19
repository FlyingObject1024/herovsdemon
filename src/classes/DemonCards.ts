import * as Phaser from "phaser";
import { Card, NameToCardDict } from "./Card";

export const DemonCardNameList = [
    "",
    "悪魔の子誕生",
    "親からの拒絶",
    "死刑宣告",
    "故郷破壊",
    "力への渇望",
    "悪友集結",
    "魔王覚醒",
    "愛の目覚め",
    "甘(あま)汁",
    "色欲のドルチェ",
    "最後の切り札",
    "強欲のルフラン",
    "苦(にが)汁",
    "家族狩り",
    "貪欲のコーダ",
    "二者択零",
    "怠惰のフィーネ",
    "王、失脚",
    "スパイ潜入",
    "刀拳",
    "ブルループ",
    "刀拳",
    "ブルループ",
    "フルメラン",
    "抜刀拳",
    "ガダメキラ",
    "刀拳",
    "フルメラン",
    "抜刀拳",
    "刀拳",
];

export const DemonCardNameTypeDict: { [key: string]: string } = {
    "悪魔の子誕生": "ストーリー",
    "親からの拒絶": "ストーリー",
    "死刑宣告": "ストーリー",
    "故郷破壊": "ストーリー",
    "力への渇望": "ストーリー",
    "悪友集結": "ストーリー",
    "魔王覚醒": "ストーリー",
    "愛の目覚め": "ストーリー",
    "色欲のドルチェ": "なかま",
    "強欲のルフラン": "なかま",
    "貪欲のコーダ": "なかま",
    "怠惰のフィーネ": "なかま",
    "最後の切り札": "イベント",
    "家族狩り": "イベント",
    "二者択零": "イベント",
    "王、失脚": "イベント",
    "スパイ潜入": "イベント",
    "刀拳": "攻撃",
    "抜刀拳": "攻撃",
    "ブルループ": "攻撃",
    "フルメラン": "攻撃",
    "ガダメキラ": "攻撃",
    "甘(あま)汁": "どうぐ",
    "苦(にが)汁": "どうぐ",
};

export const DemonCardNameCostDict: { [key: string]: string } = {
    "悪魔の子誕生": "1",
    "親からの拒絶": "1",
    "死刑宣告": "1",
    "故郷破壊": "1",
    "力への渇望": "1",
    "悪友集結": "1",
    "魔王覚醒": "1",
    "愛の目覚め": "1",
    "色欲のドルチェ": "1",
    "強欲のルフラン": "1",
    "貪欲のコーダ": "0",
    "怠惰のフィーネ": "2",
    "最後の切り札": "1",
    "家族狩り": "x",
    "二者択零": "1",
    "王、失脚": "1",
    "スパイ潜入": "1",
    "刀拳": "1",
    "抜刀拳": "2",
    "ブルループ": "1",
    "フルメラン": "x",
    "ガダメキラ": "6",
    "甘(あま)汁": "1",
    "苦(にが)汁": "1",
};

export function pickDemonNameCardList(scene: Phaser.Scene, x: number, y: number, index: number) {
    let card: Card;
    let cardName: string = DemonCardNameList[index];
    const DemonNameCardDict: NameToCardDict = {
        "悪魔の子誕生": () => new DemonUpperAttackCard(scene, x, y, index, "demon", 2.0, 1),
        "親からの拒絶": () => new DemonUpperAttackCard(scene, x, y, index, "demon", 2.0, 1),
        "死刑宣告": () => new DemonUpperAttackCard(scene, x, y, index, "demon", 2.0, 1),
        "故郷破壊": () => new DemonUpperAttackCard(scene, x, y, index, "demon", 2.0, 1),
        "力への渇望": () => new DemonUpperAttackCard(scene, x, y, index, "demon", 2.0, 2),
        "悪友集結": () => new DemonUpperAttackCard(scene, x, y, index, "demon", 2.0, 2),
        "魔王覚醒": () => new DemonUpperAttackCard(scene, x, y, index, "demon", 2.0, 3),
        "愛の目覚め": () => new DemonUpperAttackCard(scene, x, y, index, "demon", 2.0, 3),
        "色欲のドルチェ": () => new DemonPartyCard(scene, x, y, index, "demon", 2.0),
        "強欲のルフラン": () => new DemonPartyCard(scene, x, y, index, "demon", 2.0),
        "貪欲のコーダ": () => new DemonPartyCard(scene, x, y, index, "demon", 2.0),
        "怠惰のフィーネ": () => new DemonPartyCard(scene, x, y, index, "demon", 2.0),
        "最後の切り札": () => new DemonEventCard(scene, x, y, index, "demon", 2.0),
        "家族狩り": () => new DemonEventCard(scene, x, y, index, "demon", 2.0),
        "二者択零": () => new DemonEventCard(scene, x, y, index, "demon", 2.0),
        "王、失脚": () => new DemonEventCard(scene, x, y, index, "demon", 2.0),
        "スパイ潜入": () => new DemonEventCard(scene, x, y, index, "demon", 2.0),
        "刀拳": () => new DemonNormalAttackCard(scene, x, y, index, "demon", 2.0),
        "抜刀拳": () => new DemonConstAttackCard(scene, x, y, index, "demon", 2.0),
        "ブルループ": () => new DemonConstAttackCard(scene, x, y, index, "demon", 2.0),
        "フルメラン": () => new DemonConstAttackCard(scene, x, y, index, "demon", 2.0),
        "ガダメキラ": () => new DemonConstAttackCard(scene, x, y, index, "demon", 2.0),
        "甘(あま)汁": () => new DemonHealCard(scene, x, y, index, "demon", 2.0),
        "苦(にが)汁": () => new DemonReduceHeroExpCard(scene, x, y, index, "demon", 2.0),
    };
    if (cardName in DemonNameCardDict) {
        card = DemonNameCardDict[cardName]();
    }
    else {
        card = new DemonErrorCard(scene, x, y, index, "demon", 2.0);
    }

    return card;
}

// 攻撃力を上げるカード
export class DemonUpperAttackCard extends Card {
    attackNumber: number = 1;

    constructor(scene: Phaser.Scene, x: number, y: number, num: number, side: string, size: number, attackNumber: number) {
        super(scene, x, y, num, side, size);
        this.attackNumber = attackNumber;

        this.cardName = DemonCardNameList[this.num];
        this.type = DemonCardNameTypeDict[this.cardName];
        this.defaultcost = DemonCardNameCostDict[this.cardName];
        if(this.defaultcost != "x"){
            this.nowcost = Number(this.defaultcost);
        }
    }

    update() {
        if (this.demon.turn >= 3) {
            this.attackNumber = 2;
        }
        super.update();
    }

    canUse() {
        if (super.canUse() == false) {
            return false;
        }

        if (5 <= this.num && this.num <= 6) {
            if (this.demon.turn <= 3) {
                return true;
            }
        }

        if (7 <= this.num && this.num <= 8) {
            if (4 <= this.demon.turn) {
                return true;
            }
        }

        return false;
    }

    action() {
        this.demon.attack += this.attackNumber;
    }
}

// 刀拳
export class DemonNormalAttackCard extends Card {
    constructor(scene: Phaser.Scene, x: number, y: number, num: number, side: string, size: number) {
        super(scene, x, y, num, side, size);

        this.cardName = DemonCardNameList[this.num];
        this.type = DemonCardNameTypeDict[this.cardName];
        this.defaultcost = DemonCardNameCostDict[this.cardName];
        this.nowcost = Number(this.defaultcost);
    }

    action() {
        this.hero.decreaceLife(this.demon.attack - this.hero.defence);
    }
}

// 固定ダメージカード(抜刀拳・ブルループ・フルメラン・ガタメキラ)
export class DemonConstAttackCard extends Card {
    constructor(scene: Phaser.Scene, x: number, y: number, num: number, side: string, size: number) {
        super(scene, x, y, num, side, size);

        this.cardName = DemonCardNameList[this.num];
        this.type = DemonCardNameTypeDict[this.cardName];
        this.defaultcost = DemonCardNameCostDict[this.cardName];
        if(this.defaultcost != "x"){
            this.nowcost = Number(this.defaultcost);
        }
        else{
            this.nowcost = 1;
        }
    }

    canUse() {
        return true;
    }

    update() {
        super.update();
    }

    // 抜刀拳
    flashbladeStrikeAction() {
        this.hero.decreaceLife(Math.ceil(this.demon.attack / 2));
    }

    // ブルループ
    glacialEchoAction() {
        this.hero.decreaceLife(3);
        this.demon.flashbladeStrikeFlag = true;
    }

    // フルメラン
    blazingFuryAction() {
        this.hero.decreaceLife(this.demon.nowCost + 1);
        this.demon.isturnend = true;
    }

    // ガタメキラ
    gottaMakeItLoveAction() {
        this.hero.decreaceLife(15);
        this.state = "trash";
    }

    action() {
        if (this.cardName == "抜刀拳") {
            this.flashbladeStrikeAction();
        }
        else if (this.cardName == "ブルループ") {
            this.glacialEchoAction();
        }
        else if (this.cardName == "フルメラン") {
            this.blazingFuryAction();
        }
        else if (this.cardName == "ガタメキラ") {
            this.gottaMakeItLoveAction();
        }
    }
}

// 回復カード
export class DemonHealCard extends Card {
    healNumber: number = 1;

    constructor(scene: Phaser.Scene, x: number, y: number, num: number, side: string, size: number) {
        super(scene, x, y, num, side, size);

        this.cardName = DemonCardNameList[this.num];
        this.type = DemonCardNameTypeDict[this.cardName];
        this.defaultcost = DemonCardNameCostDict[this.cardName];
        this.nowcost = Number(this.defaultcost);
    }

    action() {
        if (this.demon.life >= this.demon.maxlife) {
            return;
        }
        this.demon.life += this.healNumber;
    }
}

// なかまカード
export class DemonPartyCard extends Card {
    constructor(scene: Phaser.Scene, x: number, y: number, num: number, side: string, size: number) {
        super(scene, x, y, num, side, size);

        this.cardName = DemonCardNameList[this.num];
        this.type = DemonCardNameTypeDict[this.cardName];
        this.defaultcost = DemonCardNameCostDict[this.cardName];
        this.nowcost = Number(this.defaultcost);
    }

    action() {

    }
}

// イベントカード
export class DemonEventCard extends Card {
    usedTime: number   = 0;
    usedTurn: number   = 0;
    chosenCard!: Card;

    constructor(scene: Phaser.Scene, x: number, y: number, num: number, side: string, size: number) {
        super(scene, x, y, num, side, size);

        this.cardName = DemonCardNameList[this.num];
        this.type = DemonCardNameTypeDict[this.cardName];
        this.defaultcost = DemonCardNameCostDict[this.cardName];
        if(this.defaultcost != "x"){
            this.nowcost = Number(this.defaultcost);
        }
        else{
            this.nowcost = 1;
        }
    }

    setChosenCard(card: Card){
        this.chosenCard = card;
    }

    action() {

    }
}

export class DemonReduceHeroExpCard extends Card {
    constructor(scene: Phaser.Scene, x: number, y: number, num: number, side: string, size: number) {
        super(scene, x, y, num, side, size);

        this.cardName = DemonCardNameList[this.num];
        this.type = DemonCardNameTypeDict[this.cardName];
        this.defaultcost = DemonCardNameCostDict[this.cardName];
        if(this.defaultcost != "x"){
            this.nowcost = Number(this.defaultcost);
        }
    }

    action() {
        this.hero.cost -= Math.floor(this.hero.cost / 3);
        if (this.hero.cost < 0) {
            this.hero.cost = 0;
        }
    }
}

export class DemonErrorCard extends Card {
    constructor(scene: Phaser.Scene, x: number, y: number, num: number, side: string, size: number) {
        super(scene, x, y, num, side, size);
        this.cardName = "Error";
        this.type = "Error";
        this.defaultcost = "Error";
    }

    action() {
        console.log("This is error card!");
    }
}
