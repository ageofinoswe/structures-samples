interface Shift {
    horizontalShift: number,
    verticalShift: number,
};

function Arrow({horizontalShift, verticalShift}: Shift) {

    return (
        <>
            <line x1={0 + horizontalShift} x2={0 + horizontalShift} y1={-20 + verticalShift} y2={0 + verticalShift} stroke='black' stroke-width={0.5}></line>
            <line x1={-2 + horizontalShift} x2={0 + horizontalShift} y1={-3 + verticalShift} y2={0 + verticalShift} stroke='black' stroke-width={0.5}></line>
            <line x1={2 + horizontalShift} x2={0 + horizontalShift} y1={-3 + verticalShift} y2={0 + verticalShift} stroke='black' stroke-width={0.5}></line>
        </>
    )
}

export default Arrow
