import { Player } from "./Player";
import { Card } from "./Card";
import { Random } from "./Random";

export class Demon extends Player{
    demonkey: number = Math.random();
    declare herokey?: number;
    randGenerator: Random = new Random();
    heroRandList: number[] = [];
    demonRandList: number[] = [];
    heroCardList: Card[] = [];
    demonCardList: Card[] = [];
    scene: Phaser.Scene;

    constructor(scene: Phaser.Scene) {
        super(scene);
        this.scene = scene;
    }

    setHerokey(herokey: number) {
        this.herokey = herokey;
    }
}