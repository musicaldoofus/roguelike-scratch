const toCoords = (i, dimensionality) => {
    const x = i % dimensionality;
    const y = Math.floor(i / dimensionality);
    return {
        x,
        y
    };
};

const toIndex = (coords, dimensionality) => coords.y * dimensionality + coords.x;

export default toCoords;
export { toIndex };