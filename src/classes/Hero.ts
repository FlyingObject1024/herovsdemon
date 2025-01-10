import { Player } from "./Player.ts"
import { Random } from "./Random";


export class Hero extends Player{
    herokey: number;
    declare demonkey?: number;
    randGenerator: Random = new Random();
    scene: Phaser.Scene;    

    constructor(scene: Phaser.Scene){
        super(scene);
        this.scene = scene;
        this.maxlife = 15;
        this.life = 15;
        this.herokey = Math.random();
        this.maxcard = 7;
    }

    setDemonkey(demonkey: number){
        this.demonkey = demonkey;
    }
}