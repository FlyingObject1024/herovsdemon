import { Player } from "./Player";
import { Random } from "./Random";

export class Demon extends Player{
    demonkey: number;
    declare herokey?: number;
    randGenerator: Random = new Random();
    scene: Phaser.Scene;

    attack: number = 0;

    defenceFlag: boolean = false;
    flashbladeStrikeFlag: boolean = false;

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

    decreaceLife(damage: number){
        this.life -= damage;
    }
}