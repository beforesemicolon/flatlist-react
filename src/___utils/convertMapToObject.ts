export default (map: Map<any, any>) =>
  Array.from(map).reduce(
    (obj: Record<string, unknown>, [key, value]) =>
      Object.assign(obj, { [key]: value }),
    {}
  );
