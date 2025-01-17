import { Card } from "./Card";
import { Demon } from "./Demon";
import { pickDemonNameCardList } from "./DemonCards";
import { Hero } from "./Hero";
import { pickHeroNameCardList } from "./HeroCards";
import { generateRandomSets, Random } from "./Random";

export class Player {
    scene: Phaser.Scene;

    herokey?: number;
    demonkey?: number;
    randGenerator: Random = new Random();
    randHeroCardList: Card[] = [];
    randDemonCardList: Card[] = [];
    chosenHeroCardList: Card[] = [];
    chosenDemonCardList: Card[] = [];

    gamelog: String = "";

    phase: String = "Nothing";

    turn: number = -1;
    maxturn: number = 6;

    life: number = -1;
    maxlife: number = -1;

    maxcard: number = 0;

    cost: number = 0;
    nowCost: number = 0;

    isturnend: boolean = false;


    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    completeInit(hero: Hero, demon: Demon) {
        this.phase = "cardlistGenerating";
        this.randGenerator.setseed(Number(this.herokey), Number(this.demonkey));
        console.log(Number(this.herokey) + ", " + Number(this.demonkey));
        this.generateCardList(hero, demon);
    }

    generateCardList(hero: Hero, demon: Demon) {
        // 2つのseedがそろっているなら、HeroとDemonにて生成されるリストは同じになるはず。
        const { selectedNumbers, remainingNumbers } = generateRandomSets(this.randGenerator);

        selectedNumbers.sort((a, b) => a - b);
        remainingNumbers.sort((a, b) => a - b);

        this.setHeroCards(selectedNumbers, hero, demon);
        this.setDemonCards(remainingNumbers, hero, demon);

        console.log("cardlist generated.");
    }

    setHeroCards(selectedNumbers: number[], hero: Hero, demon: Demon) {
        for (let index = 0; index < selectedNumbers.length; index++) {
            const card: Card = this.getHeroCardDefinition(selectedNumbers[index], hero, demon);
            this.randHeroCardList?.push(card);
        }
    }

    setDemonCards(remainingNumbers: number[], hero: Hero, demon: Demon) {
        for (let index = 0; index < remainingNumbers.length; index++) {
            const card: Card = this.getDemonCardDefinition(remainingNumbers[index], hero, demon);
            this.randDemonCardList?.push(card);
        }
    }

    getHeroCardDefinition(index: number, hero: Hero, demon: Demon) {
        const x = -300;
        const y = -300;
        

        let card: Card;
        card = pickHeroNameCardList(this.scene, x, y, index);
        card.setHero(hero);
        card.setDemon(demon);

        return card;
    }

    getDemonCardDefinition(index: number, hero: Hero, demon: Demon) {
        const x = -300;
        const y = -300;

        let card: Card;
        card = pickDemonNameCardList(this.scene, x, y, index);
        card.setHero(hero);
        card.setDemon(demon);

        return card;
    }
}