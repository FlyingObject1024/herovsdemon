// https://qiita.com/butchi_y/items/c400a06cbd15f0dad6fa
// 負をなくした余剰 a%b
export function positiveMod(a: number, b: number) {
    return (a % b) < 0 ? (a % b) + 0 + (b < 0 ? -b : b) : (a % b + 0);
}

// 正規分布の式
export function gaussianDistribution(x: number, sigma: number) {
    return Math.exp(-(x * x) / sigma);
}

// 滑らかにしたtanh
export function smoothsteptanh(x: number) {
    if (x < 0.0) return 0;
    else if (x > 1.0) return 1;

    return (Math.tanh(10 * (x - 0.5)) + 1) / 2;
}

// 滑らかにしたatanh(未検証)
export function smoothstepatanh(x: number) {
    if (x < 0.0) return 0;
    else if (x > 1.0) return 1;

    return (Math.atanh(2 * x - 1) / 10) + 0.5;
}