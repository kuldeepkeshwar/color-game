export class Util {
    public static randomNumberWithExcludes(min: number, max: number, count: number, excludes: Array<number>): Array<number> {
        let result: Array<number> = [];
        for (let i = 0; i < count; i++) {
            let n: number;
            while (true) {
                n = Util.getRandomInt(min, max);
                if (excludes.indexOf(n) == -1 && result.indexOf(n) == -1) {
                    break;
                }
            }
            result.push(n);
        }
        return result;
    }
    private static getRandomInt(min: number, max: number): number {
        if (min === max) return min;
        if (min > max) return Util.getRandomInt(max, min);
        return 0 | min + Math.random() * (max - min + 1);
    }
}
