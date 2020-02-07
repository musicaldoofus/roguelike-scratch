const toCoords = (index, dimensionality) => {
    if (index !== 0 && !index) throw new Error(`Must include index with toCoords, ${JSON.stringify(index)}`);
    if (!dimensionality) throw new Error(`Must include dimensionality with toCoords`);
    return {
        x: index % dimensionality,
        y: Math.floor(index / dimensionality)
    }
};

const toIndex = (coords, dimensionality) => {
    //if (!coords.x  || !coords.y) throw new Error (`Must include valid coords in toIndex, ${JSON.stringify(coords)}`)
    return coords.y * dimensionality + coords.x;
}

export default toCoords;
export { toIndex };