import { Hero } from "../classes/Hero";
import { Demon } from "../classes/Demon";

export class HeroChooseScene extends Phaser.Scene { 
  hero!: Hero;
  demon!: Demon;

  constructor() {
    // シーンのkeyを指定
    super('hero_choose');
  }
  init(hero: Hero, demon: Demon) {
    this.hero = hero;
    this.demon = demon;
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
