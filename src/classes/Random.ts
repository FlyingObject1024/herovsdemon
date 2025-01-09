//https://sbfl.net/blog/2017/06/01/javascript-reproducible-random/
export class Random {
    x: number;
    y: number;
    z: number;
    w: number;
    
    constructor() {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.w = 0;
    }

    setseed(heroseed: number, demonseed: number){
        this.x = 31415926535;
        this.y = 8979323846;
        this.z = heroseed;
        this.w = demonseed;
    }

    // XorShift
    next() {
        let t;

        t = this.x ^ (this.x << 11);
        this.x = this.y; this.y = this.z; this.z = this.w;
        return this.w = (this.w ^ (this.w >>> 19)) ^ (t ^ (t >>> 8));
    }

    // min以上max以下の乱数を生成する
    nextInt(min: number, max: number) {
        const r = Math.abs(this.next());
        return min + (r % (max + 1 - min));
    }

    // 0.0以上1.0未満の浮動小数点乱数を生成する
    nextFloat() {
        return Math.abs(this.next()) / 0xFFFFFFFF;
    }
}

export function getRandomSelection(randGenerator: Random, rangeStart: number, rangeEnd: number, count: number): { selected: number[], remaining: number[] } {
    const numbers: number[] = [];
    for (let i = rangeStart; i <= rangeEnd; i++) {
        numbers.push(i);
    }

    const selected: number[] = [];
    while (selected.length < count) {
        const randomIndex = Math.floor(randGenerator.nextFloat() * numbers.length);
        selected.push(numbers[randomIndex]);
        numbers.splice(randomIndex, 1); // 選ばれた数を除去して重複を防ぐ
    }

    return { selected, remaining: numbers };
}

export function generateRandomSets(randGenerator: Random) {
    // 1~8から4つ選び、残りも取得
    const { selected: part1, remaining: remainingPart1 } = getRandomSelection(randGenerator, 1, 8, 4);
    
    // 9~30から11つ選び、残りも取得
    const { selected: part2, remaining: remainingPart2 } = getRandomSelection(randGenerator, 9, 30, 11);
    
    const selectedNumbers = [...part1, ...part2]; // 選ばれた数を結合
    const remainingNumbers = [...remainingPart1, ...remainingPart2]; // 残りの数を結合

    return { selectedNumbers, remainingNumbers };
}