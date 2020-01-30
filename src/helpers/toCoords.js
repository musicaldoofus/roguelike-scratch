const toCoords = (index, dimensionality) => ({
    x: index % dimensionality,
    y: Math.floor(index / dimensionality)
});

const toIndex = (coords, dimensionality) => coords.y * dimensionality + coords.x;

export default toCoords;
export { toIndex };