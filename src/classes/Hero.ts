import { Player } from "./Player.ts"
import { Card } from "./Card";
import { Random } from "./Random";


export class Hero extends Player{
    herokey: number = Math.random();
    declare demonkey?: number;
    randGenerator: Random = new Random();
    heroRandList: number[] = [];
    demonRandList: number[] = [];
    heroCardList: Card[] = [];
    demonCardList: Card[] = [];
    scene: Phaser.Scene;

    constructor(scene: Phaser.Scene){
        super(scene);
        this.scene = scene;
    }

    setDemonkey(demonkey: number){
        this.demonkey = demonkey;
    }
}