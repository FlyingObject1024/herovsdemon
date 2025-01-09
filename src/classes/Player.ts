import { Card } from "./Card";
import { generateRandomSets, Random } from "./Random";

export class Player{
    herokey?: number;
    demonkey?: number;
    randGenerator: Random = new Random();
    heroRandList: number[] = [];
    demonRandList: number[] = [];
    heroCardList: Card[] = [];
    demonCardList: Card[] = [];
    scene: Phaser.Scene;
    
    constructor(scene: Phaser.Scene){
        this.scene = scene;
    }

    completeInit(){
        this.randGenerator.setseed(Number(this.herokey), Number(this.demonkey));
        this.generateCardList();
    }

    generateCardList(){
        // 2つのseedがそろっているなら、HeroとDemonにて生成されるリストは同じになるはず。
        const { selectedNumbers, remainingNumbers } = generateRandomSets(this.randGenerator);

        this.heroRandList = selectedNumbers; 
        this.demonRandList = remainingNumbers;

        for(let index = 0;index < this.heroRandList.length;index++){
            this.heroCardList?.push(new Card(this.scene, -300, -300, this.heroRandList[index], "hero", 2.0));
            const ch = this.heroCardList[index];

            console.log("hero: "+ch.side+"-"+ch.num);
        }
        for(let index = 0;index < this.demonRandList.length;index++){
            this.demonCardList?.push(new Card(this.scene, -300, -300, this.demonRandList[index], "demon", 2.0));
            const ch = this.demonCardList[index];

            console.log("hero: "+ch.side+"-"+ch.num);
        }
    }
}