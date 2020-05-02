const areEqual = (prevProps: object, nextProps: object) => JSON.stringify(prevProps) === JSON.stringify(nextProps);

export default areEqual;
