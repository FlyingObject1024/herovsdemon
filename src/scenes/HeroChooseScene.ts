import { Hero } from "../classes/Hero";
import { Demon } from "../classes/Demon";

export class HeroChooseScene extends Phaser.Scene { 
  hero!: Hero;
  demon!: Demon;
  timelimit: Number = 180;

  constructor() {
    // シーンのkeyを指定
    super('hero_choose');
  }
  init(data: { hero: Hero; demon: Demon; }) {
    this.hero = data.hero;
    this.demon = data.demon;
    console.log(String(this.hero.heroRandList));
    console.log(String(this.demon.demonRandList));
  }
  preload() {
    console.log("hero_choose");
  }
  // preload内のアセットのロード後実行される
  create() {

  }

  update(){
    
  }
}
