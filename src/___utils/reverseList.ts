const reverseList = <T>(list: T[]): T[] => list.map((item: T, i: number, l: T[]) => l[l.length - (i + 1)]);

export default reverseList;
