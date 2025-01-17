import * as Phaser from "phaser";
import { Card, NameToCardDict } from "./Card";

export const HeroCardNameList = [
    "",
    "悪魔の子発見",
    "幸せな生活",
    "町のヒーロー",
    "両親との死別",
    "初めての敗北",
    "なかま集め",
    "最終決戦",
    "一筋の光",
    "鉄の剣",
    "鉄の剣",
    "鉄の剣",
    "鉄の剣",
    "父譲りの剣",
    "父譲りの剣",
    "聖剣",
    "聖剣",
    "戦士セレン",
    "戦士セレン",
    "踊り子ノア",
    "踊り子ノア",
    "忍者アポロ",
    "鉄の鎧",
    "鉄の鎧",
    "鉄の鎧",
    "母の加護",
    "母の加護",
    "神の審判",
    "神の審判",
    "ティンシャ",
    "ティンシャ",
];

export const HeroCardNameTypeDict: { [key: string]: string } = {
    "悪魔の子発見": "ストーリー",
    "幸せな生活": "ストーリー",
    "町のヒーロー": "ストーリー",
    "両親との死別": "ストーリー",
    "初めての敗北": "ストーリー",
    "なかま集め": "ストーリー",
    "最終決戦": "ストーリー",
    "一筋の光": "ストーリー",
    "鉄の剣": "攻撃",
    "父譲りの剣": "攻撃",
    "聖剣": "攻撃",
    "戦士セレン": "なかま",
    "踊り子ノア": "なかま",
    "忍者アポロ": "なかま",
    "鉄の鎧": "どうぐ",
    "母の加護": "どうぐ",
    "神の審判": "イベント",
    "ティンシャ": "どうぐ",
};

export const HeroCardNameCostDict: { [key: string]: string } = {
    "悪魔の子発見": "0",
    "幸せな生活": "0",
    "町のヒーロー": "0",
    "両親との死別": "0",
    "初めての敗北": "0",
    "なかま集め": "0",
    "最終決戦": "0",
    "一筋の光": "0",
    "鉄の剣": "3",
    "父譲りの剣": "8",
    "聖剣": "12",
    "戦士セレン": "3",
    "踊り子ノア": "2",
    "忍者アポロ": "4",
    "鉄の鎧": "0",
    "母の加護": "3",
    "神の審判": "5",
    "ティンシャ": "x",
}

export function pickHeroNameCardList(scene: Phaser.Scene, x: number, y: number, index: number) {
    let card: Card;
    let cardName: string = HeroCardNameList[index];
    const HeroNameCardDict: NameToCardDict = {
        "悪魔の子発見": () => new HeroChargeCard(scene, x, y, index, "hero", 2.0, 1),
        "幸せな生活": () => new HeroChargeCard(scene, x, y, index, "hero", 2.0, 1),
        "町のヒーロー": () => new HeroChargeCard(scene, x, y, index, "hero", 2.0, 1),
        "両親との死別": () => new HeroChargeCard(scene, x, y, index, "hero", 2.0, 1),
        "初めての敗北": () => new HeroChargeCard(scene, x, y, index, "hero", 2.0, 2),
        "なかま集め": () => new HeroChargeCard(scene, x, y, index, "hero", 2.0, 2),
        "最終決戦": () => new HeroChargeCard(scene, x, y, index, "hero", 2.0, 1),
        "一筋の光": () => new HeroChargeCard(scene, x, y, index, "hero", 2.0, 1),
        "鉄の剣": () => new HeroAttackCard(scene, x, y, index, "hero", 2.0, 1),
        "父譲りの剣": () => new HeroAttackCard(scene, x, y, index, "hero", 2.0, 2),
        "聖剣": () => new HeroAttackCard(scene, x, y, index, "hero", 2.0, 3),
        "戦士セレン": () => new HeroPartyCard(scene, x, y, index, "hero", 2.0),
        "踊り子ノア": () => new HeroPartyCard(scene, x, y, index, "hero", 2.0),
        "忍者アポロ": () => new HeroPartyCard(scene, x, y, index, "hero", 2.0),
        "鉄の鎧": () => new HeroUpperDefenceCard(scene, x, y, index, "hero", 2.0, 2),
        "母の加護": () => new HeroUpperDefenceCard(scene, x, y, index, "hero", 2.0, 2),
        "神の審判": () => new HeroEventCard(scene, x, y, index, "hero", 2.0),
        "ティンシャ": () => new HeroEventCard(scene, x, y, index, "hero", 2.0),
    };
    if (cardName in HeroNameCardDict) {
        card = HeroNameCardDict[cardName]();
    }
    else {
        card = new HeroErrorCard(scene, x, y, index, "hero", 2.0);
    }

    return card;
}

// 経験値をためるカード
export class HeroChargeCard extends Card {
    chargeNumber: number = 1;

    constructor(scene: Phaser.Scene, x: number, y: number, num: number, side: string, size: number, chargeNumber: number) {
        super(scene, x, y, num, side, size);
        this.chargeNumber = chargeNumber;

        this.cardName = HeroCardNameList[this.num];
        this.type = HeroCardNameTypeDict[this.cardName];
        this.defaultcost = HeroCardNameCostDict[this.cardName];
    }

    canUse(): boolean {
        return false;
    }

    action() {
        this.hero.cost += this.chargeNumber;
    }
}

// 攻撃を行うカード
export class HeroAttackCard extends Card {
    attackNumber: number = 1;

    constructor(scene: Phaser.Scene, x: number, y: number, num: number, side: string, size: number, attackNumber: number) {
        super(scene, x, y, num, side, size);
        this.attackNumber = attackNumber;

        this.cardName = HeroCardNameList[this.num];
        this.type = HeroCardNameTypeDict[this.cardName];
        this.defaultcost = HeroCardNameCostDict[this.cardName];
    }

    action() {
        this.demon.decreaceLife(this.attackNumber);
    }
}

// 防御力を上げるカード
export class HeroUpperDefenceCard extends Card {
    defenceNumber: number = 1;
    constructor(scene: Phaser.Scene, x: number, y: number, num: number, side: string, size: number, defenceNumber: number) {
        super(scene, x, y, num, side, size);
        this.defenceNumber = defenceNumber;

        this.cardName = HeroCardNameList[this.num];
        this.type = HeroCardNameTypeDict[this.cardName];
        this.defaultcost = HeroCardNameCostDict[this.cardName];
    }

    action() {
        this.hero.defence += this.defenceNumber;
    }
}

// なかまカード
export class HeroPartyCard extends Card {
    constructor(scene: Phaser.Scene, x: number, y: number, num: number, side: string, size: number) {
        super(scene, x, y, num, side, size);

        this.cardName = HeroCardNameList[this.num];
        this.type = HeroCardNameTypeDict[this.cardName];
        this.defaultcost = HeroCardNameCostDict[this.cardName];
    }

    action() {

    }
}

// イベントないしプレイヤーが数値やカードを選択するカード
export class HeroEventCard extends Card {
    constructor(scene: Phaser.Scene, x: number, y: number, num: number, side: string, size: number) {
        super(scene, x, y, num, side, size);

        this.cardName = HeroCardNameList[this.num];
        this.type = HeroCardNameTypeDict[this.cardName];
        this.defaultcost = HeroCardNameCostDict[this.cardName];
    }

    action() {

    }
}

export class HeroErrorCard extends Card {
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