import { Card } from "./Card";
import { DemonEventCard } from "./DemonCards";
import { Player } from "./Player";
import { Random } from "./Random";

export class Demon extends Player {
    demonkey: number;
    declare herokey?: number;
    randGenerator: Random = new Random();
    scene: Phaser.Scene;

    attack: number = 0;
    strategyTurn: number = 1;
    strategyNowCost: number = 1;

    defenceFlag: boolean = false;
    flashbladeStrikeFlag: boolean = false;

    // maxturn由来にできないか
    strategyCardList: Card[][] = [[], [], [], [], [], [], []];
    strategyTrashCardList: Card[][] = [[], [], [], [], [], [], []];
    strategyPartyCardList: Card[][] = [[], [], [], [], [], [], []];
    strategyHeroPartyCardList: Card[][] = [[], [], [], [], [], [], []];
    strategyCostList: number[] = [0, 0, 0, 0, 0, 0, 0];

    constructor(scene: Phaser.Scene) {
        super(scene);
        this.scene = scene;
        this.maxlife = 3;
        this.life = 3;
        this.demonkey = Math.random();
        this.maxcard = 9;
        this.cost = 1;
    }

    setHerokey(herokey: number) {
        this.herokey = herokey;
    }

    decreaceLife(damage: number) {
        this.life -= damage;
    }

    updateStrategyList() {
        // clear
        for (let checkTurn = 1; checkTurn <= this.maxturn; checkTurn++) {
            this.strategyTrashCardList[checkTurn] = [];
            this.strategyPartyCardList[checkTurn] = [];
            this.strategyHeroPartyCardList[checkTurn] = [];
            this.strategyCostList[checkTurn] = 0;
        }

        for (let checkTurn = 1; checkTurn <= this.maxturn; checkTurn++) {

            this.strategyCardList[checkTurn]?.forEach((card) => {
                if (card.type == "なかま") {
                    this.updateStrategyPartyList(checkTurn);
                }
                else if (card.type == "イベント") {
                    this.updateEvent(checkTurn, card);
                }
                else if (card.cardName == "最後の切り札") {
                    this.setStrategyTrashList(checkTurn, card);
                }
                else if (card.cardName == "甘(あま)汁") {
                    this.setStrategyTrashList(checkTurn, card);
                }
                else if (card.cardName == "ガタメキラ") {
                    this.setStrategyTrashList(checkTurn, card);
                }
            });
            this.strategyCostList[checkTurn] = this.calcOneTurnCost(checkTurn);
        }
    }

    updateStrategyPartyList(turn: number) {
        this.strategyCardList[turn]?.forEach((card) => {
            if (card.cardName == "貪欲のコーダ") {
                this.setStrategyPartyList(turn, card);
                this.setStrategyTrashList(turn + 1, card);
            }
            else if (card.cardName == "強欲のルフラン") {
                this.setStrategyPartyList(turn, card);
                this.setStrategyPartyList(turn + 1, card);
                this.setStrategyTrashList(turn + 2, card);
            }
            else if (card.cardName == "色欲のドルチェ") {
                this.setStrategyPartyList(turn, card);
                this.setStrategyPartyList(turn + 1, card);
                this.setStrategyTrashList(turn + 2, card);
            }
            else if (card.cardName == "怠惰のフィーネ") {
                this.setStrategyPartyList(turn, card);
                this.setStrategyPartyList(turn + 1, card);
            }
        });
    }

    updateEvent(turn: number, card: Card) {
        // 型アサーション
        const eventcard = card as DemonEventCard;
        if (eventcard.cardName == "家族狩り") {
            if (!eventcard.chosenCard) {
                return;
            }
            if (!eventcard.chosenCard.strategyCanTrash()){
                this.removeChosenCard(turn, card);
                return;
            }
            this.setStrategyTrashList(turn, eventcard.chosenCard);
        }
        else if (eventcard.cardName == "王、失脚") {
            if (!eventcard.chosenCard) {
                return;
            }
            if (!eventcard.chosenCard.strategyCanTrash()){
                this.removeChosenCard(turn, card);
                return;
            }
            this.setStrategyTrashList(turn, eventcard.chosenCard);
        }
        else if (eventcard.cardName == "最後の切り札") {
            this.setStrategyTrashList(turn + 1, eventcard);
        }
        else if (eventcard.cardName == "二者択零") {
            for (let i = turn; i <= this.maxturn; i++) {
                this.setStrategyHeroPartyList(i, eventcard);
            }
        }
        else if (eventcard.cardName == "スパイ潜入") {
            for (let i = turn; i <= this.maxturn; i++) {
                this.setStrategyHeroPartyList(i, eventcard);
            }
        }
    }

    setStrategyPartyList(turn: number, card: Card) {
        if ((turn) > this.maxturn) {
            return;
        }
        if (!this.strategyPartyCardList[turn].includes(card)) {
            this.strategyPartyCardList[turn].push(card);
        }
    }

    setStrategyHeroPartyList(turn: number, card: Card) {
        if ((turn) > this.maxturn) {
            return;
        }
        if (!this.strategyHeroPartyCardList[turn].includes(card)) {
            this.strategyHeroPartyCardList[turn].push(card);
        }
    }

    setStrategyTrashList(turn: number, card: Card) {
        if (card.cardName == "ブルループ") {
            return;
        }
        for (let i = turn; i <= this.maxturn; i++) {
            if (i > this.maxturn) {
                return;
            }
            if (!this.strategyTrashCardList[i].includes(card)) {
                this.strategyTrashCardList[i].push(card);
            }
        }
    }

    isStrategyTurnEnd(): boolean {
        let result: boolean = false;
        this.strategyCardList[this.strategyTurn]?.forEach((card) => {
            if (card.cardName == "フルメラン") {
                result = true;
                return result;
            }
        });
        return result;
    }

    removeChosenCard(turn: number, card: Card) {
        // 削除対象のカードを特定
        console.log("remove: " + card.cardName + "(" + card.num + ")");

        let index = 0;
        this.strategyCardList[turn].forEach((checking) => {
            if (checking.num === card.num) {
                checking.img.visible = false;
                checking.visible = false;
                checking.update();
                checking.img.destroy();
                checking.destroy();
                this.strategyCardList[turn].splice(index, 1);
            }
            index++;
        });
    }

    calcOneTurnCost(turn: number) {
        let sumcost: number = 0;
        this.strategyCardList[turn]?.forEach((card) => {
            sumcost += card.nowcost;
        });
        return sumcost;
    }

    getStrategyTurnCost(): number {
        var cost: number = 0;
        cost = 0;
        cost += this.strategyTurn;
        this.strategyPartyCardList[this.strategyTurn]?.forEach((card) => {
            if (card.cardName == "貪欲のコーダ" || card.cardName == "強欲のルフラン") {
                cost += 1;
            }
        });
        return cost;
    }
}