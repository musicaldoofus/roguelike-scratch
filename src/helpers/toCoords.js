const toCoords = (i, dimensionality) => {
    const x = i % dimensionality;
    const y = Math.floor(i / dimensionality);
    return {
        x,
        y
    };
};

export default toCoords;