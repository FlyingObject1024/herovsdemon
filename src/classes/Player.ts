import { Card } from "./Card";
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
    
    constructor(scene: Phaser.Scene){
        this.scene = scene;
    }

    completeInit(){
        this.phase = "cardlistGenerating";
        this.randGenerator.setseed(Number(this.herokey), Number(this.demonkey));
        console.log(Number(this.herokey)+", "+Number(this.demonkey));
        this.generateCardList();
    }

    generateCardList(){
        // 2つのseedがそろっているなら、HeroとDemonにて生成されるリストは同じになるはず。
        const { selectedNumbers, remainingNumbers } = generateRandomSets(this.randGenerator);

        selectedNumbers.sort((a, b) => a - b);
        remainingNumbers.sort((a, b) => a - b);

        for(let index = 0;index < selectedNumbers.length;index++){
            this.randHeroCardList?.push(new Card(this.scene, -300, -300, selectedNumbers[index], "hero", 2.0));
        }

        for(let index = 0;index < remainingNumbers.length;index++){
            this.randDemonCardList?.push(new Card(this.scene, -300, -300, remainingNumbers[index], "demon", 2.0));
        }

        console.log("cardlist generated.");
    }
}