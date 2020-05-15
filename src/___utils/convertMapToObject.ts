export default (map: Map<any, any>) => Array.from(map)
    .reduce((obj: {}, [key, value]) => Object.assign(obj, { [key]: value }), {});
