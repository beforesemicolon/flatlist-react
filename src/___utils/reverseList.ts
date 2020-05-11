const reverseList = (list: any[]) => list.map((item, i, l: any[]) => l[l.length - (i + 1)]);

export default reverseList;
