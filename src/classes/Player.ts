import { Card } from "./Card";
import { Demon } from "./Demon";
import { DemonConstAttackCard, DemonErrorCard, DemonEventCard, DemonHealCard, DemonNormalAttackCard, DemonPartyCard, DemonReduceHeroExpCard, DemonUpperAttackCard } from "./DemonCards";
import { Hero } from "./Hero";
import { HeroAttackCard, HeroChargeCard, HeroErrorCard, HeroEventCard, HeroPartyCard, HeroUpperDefenceCard } from "./HeroCards";
import { generateRandomSets, Random } from "./Random";

export class Player{
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
    
    constructor(scene: Phaser.Scene){
        this.scene = scene;
    }

    completeInit(hero: Hero, demon: Demon){
        this.phase = "cardlistGenerating";
        this.randGenerator.setseed(Number(this.herokey), Number(this.demonkey));
        console.log(Number(this.herokey)+", "+Number(this.demonkey));
        this.generateCardList(hero, demon);
    }

    generateCardList(hero: Hero, demon: Demon){
        // 2つのseedがそろっているなら、HeroとDemonにて生成されるリストは同じになるはず。
        const { selectedNumbers, remainingNumbers } = generateRandomSets(this.randGenerator);

        selectedNumbers.sort((a, b) => a - b);
        remainingNumbers.sort((a, b) => a - b);

        this.setHeroCards(selectedNumbers, hero, demon);
        this.setDemonCards(remainingNumbers, hero, demon);

        console.log("cardlist generated.");
    }

    setHeroCards(selectedNumbers: number[], hero: Hero, demon: Demon){
        for(let index = 0;index < selectedNumbers.length;index++){
            const card: Card = this.getHeroCardDefinition(selectedNumbers[index], hero, demon);
            this.randHeroCardList?.push(card);
        }
    }

    setDemonCards(remainingNumbers: number[], hero: Hero, demon: Demon){
        for(let index = 0;index < remainingNumbers.length;index++){
            const card: Card = this.getDemonCardDefinition(remainingNumbers[index], hero, demon);
            this.randDemonCardList?.push(card);
        }
    }

    getHeroCardDefinition(index: number, hero: Hero, demon: Demon){
        const x = -300;
        const y = -300;
        let card: Card;
        if(1 <= index && index <= 4){
            card = new HeroChargeCard(this.scene, x, y, index, "hero", 2.0, 1);
            card.setHero(hero);
            card.setDemon(demon);
            return card;
        }
        else if(5 <= index && index <= 6){
            card = new HeroChargeCard(this.scene, x, y, index, "hero", 2.0, 2);
            card.setHero(hero);
            card.setDemon(demon);
            return card;
        }
        else if(7 <= index && index <= 8){
            card = new HeroChargeCard(this.scene, x, y, index, "hero", 2.0, 1);
            card.setHero(hero);
            card.setDemon(demon);
            return card;
        }
        else if(9 <= index && index <= 12){
            card = new HeroAttackCard(this.scene, x, y, index, "hero", 2.0, 1);
            card.setHero(hero);
            card.setDemon(demon);
            return card;
        }
        else if(13 <= index && index <= 14){
            card = new HeroAttackCard(this.scene, x, y, index, "hero", 2.0, 2);
            card.setHero(hero);
            card.setDemon(demon);
            return card;
        }
        else if(15 <= index && index <= 16){
            card = new HeroAttackCard(this.scene, x, y, index, "hero", 2.0, 3);
            card.setHero(hero);
            card.setDemon(demon);
            return card;
        }
        else if(17 <= index && index <= 21){
            card = new HeroPartyCard(this.scene, x, y, index, "hero", 2.0);
            card.setHero(hero);
            card.setDemon(demon);
            return card;
        }
        else if(22 <= index && index <= 24){
            card = new HeroUpperDefenceCard(this.scene, x, y, index, "hero", 2.0, 2);
            card.setHero(hero);
            card.setDemon(demon);
            return card;
        }
        else if(25 <= index && index <= 26){
            card = new HeroUpperDefenceCard(this.scene, x, y, index, "hero", 2.0, 5);
            card.setHero(hero);
            card.setDemon(demon);
            return card;
        }
        else if(27 <= index && index <= 30){
            card = new HeroEventCard(this.scene, x, y, index, "hero", 2.0);
            card.setHero(hero);
            card.setDemon(demon);
            return card;
        }

        //異常
        return new HeroErrorCard(this.scene, x, y, index, "hero", 2.0);
    }
    
    getDemonCardDefinition(index: number, hero: Hero, demon: Demon){
        const x = -300;
        const y = -300;
        // 関数定義配列を用意し、クラスを増やした方が良い(特に攻撃カード)
        if(1 <= index && index <= 4){
            const card: Card = new DemonUpperAttackCard(this.scene, x, y, index, "demon", 2.0, 1);
            card.setHero(hero);
            card.setDemon(demon);
            return card;
        }
        else if(5 <= index && index <= 6){
            const card: Card = new DemonUpperAttackCard(this.scene, x, y, index, "demon", 2.0, 2);
            card.setHero(hero);
            card.setDemon(demon);
            return card;
        }
        else if(6 <= index && index <= 8){
            const card: Card = new DemonUpperAttackCard(this.scene, x, y, index, "demon", 2.0, 3);
            card.setHero(hero);
            card.setDemon(demon);
            return card;
        }
        else if(6 <= index && index <= 8){
            const card: Card = new DemonUpperAttackCard(this.scene, x, y, index, "demon", 2.0, 3);
            card.setHero(hero);
            card.setDemon(demon);
            return card;
        }
        else if(index == 9){
            const card: Card = new DemonHealCard(this.scene, x, y, index, "demon", 2.0);
            card.setHero(hero);
            card.setDemon(demon);
            return card;
        }
        else if(index == 10){
            const card: Card = new DemonPartyCard(this.scene, x, y, index, "demon", 2.0);
            card.setHero(hero);
            card.setDemon(demon);
            return card;
        }
        else if(index == 11){
            const card: Card = new DemonEventCard(this.scene, x, y, index, "demon", 2.0);
            card.setHero(hero);
            card.setDemon(demon);
            return card;
        }
        else if(index == 12){
            const card: Card = new DemonPartyCard(this.scene, x, y, index, "demon", 2.0);
            card.setHero(hero);
            card.setDemon(demon);
            return card;
        }
        else if(index == 13){
            const card: Card = new DemonReduceHeroExpCard(this.scene, x, y, index, "demon", 2.0);
            card.setHero(hero);
            card.setDemon(demon);
            return card;
        }
        else if(index == 14){
            const card: Card = new DemonEventCard(this.scene, x, y, index, "demon", 2.0);
            card.setHero(hero);
            card.setDemon(demon);
            return card;
        }
        else if(index == 15){
            const card: Card = new DemonPartyCard(this.scene, x, y, index, "demon", 2.0);
            card.setHero(hero);
            card.setDemon(demon);
            return card;
        }
        else if(index == 16){
            const card: Card = new DemonEventCard(this.scene, x, y, index, "demon", 2.0);
            card.setHero(hero);
            card.setDemon(demon);
            return card;
        }
        else if(index == 17){
            const card: Card = new DemonPartyCard(this.scene, x, y, index, "demon", 2.0);
            card.setHero(hero);
            card.setDemon(demon);
            return card;
        }
        else if(18 <= index && index <= 19){
            const card: Card = new DemonEventCard(this.scene, x, y, index, "demon", 2.0);
            card.setHero(hero);
            card.setDemon(demon);
            return card;
        }
        else if(index == 20){
            const card: Card = new DemonNormalAttackCard(this.scene, x, y, index, "demon", 2.0);
            card.setHero(hero);
            card.setDemon(demon);
            return card;
        }
        else if(index == 21){
            const card: Card = new DemonConstAttackCard(this.scene, x, y, index, "demon", 2.0);
            card.setHero(hero);
            card.setDemon(demon);
            return card;
        }
        else if(index == 22){
            const card: Card = new DemonNormalAttackCard(this.scene, x, y, index, "demon", 2.0);
            card.setHero(hero);
            card.setDemon(demon);
            return card;
        }
        else if(index == 23){
            const card: Card = new DemonConstAttackCard(this.scene, x, y, index, "demon", 2.0);
            card.setHero(hero);
            card.setDemon(demon);
            return card;
        }
        else if(index == 24){
            const card: Card = new DemonConstAttackCard(this.scene, x, y, index, "demon", 2.0);
            card.setHero(hero);
            card.setDemon(demon);
            return card;
        }
        else if(index == 25){
            const card: Card = new DemonConstAttackCard(this.scene, x, y, index, "demon", 2.0);
            card.setHero(hero);
            card.setDemon(demon);
            return card;
        }
        else if(index == 26){
            const card: Card = new DemonConstAttackCard(this.scene, x, y, index, "demon", 2.0);
            card.setHero(hero);
            card.setDemon(demon);
            return card;
        }
        else if(index == 27){
            const card: Card = new DemonNormalAttackCard(this.scene, x, y, index, "demon", 2.0);
            card.setHero(hero);
            card.setDemon(demon);
            return card;
        }
        else if(index == 28){
            const card: Card = new DemonConstAttackCard(this.scene, x, y, index, "demon", 2.0);
            card.setHero(hero);
            card.setDemon(demon);
            return card;
        }
        else if(index == 29){
            const card: Card = new DemonConstAttackCard(this.scene, x, y, index, "demon", 2.0);
            card.setHero(hero);
            card.setDemon(demon);
            return card;
        }
        else if(index == 30){
            const card: Card = new DemonNormalAttackCard(this.scene, x, y, index, "demon", 2.0);
            card.setHero(hero);
            card.setDemon(demon);
            return card;
        }

        return new DemonErrorCard(this.scene, x, y, index, "demon", 2.0);
    }
}