// avoid "reverse" array method as it changes in place
// we need to create a new reversed list instead
const reverseList = <T>(list: T[]): T[] =>
  list.map((item: T, i: number, l: T[]) => l[l.length - (i + 1)]);

export default reverseList;
