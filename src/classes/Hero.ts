import { Player } from "./Player.ts"
import { Random } from "./Random";


export class Hero extends Player{
    herokey: number;
    declare demonkey?: number;
    randGenerator: Random = new Random();
    scene: Phaser.Scene;

    defence: number = 0;

    constructor(scene: Phaser.Scene){
        super(scene);
        this.scene = scene;
        this.maxlife = 15;
        this.life = 15;
        this.herokey = Math.random();
        this.maxcard = 7;
        this.cost = 0;
    }

    setDemonkey(demonkey: number){
        this.demonkey = demonkey;
    }

    decreaceLife(damage: number){
        this.life -= damage;
    }
}