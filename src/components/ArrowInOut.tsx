interface ArrowProps {
    horizontalShift: number,
    verticalShift: number,
    magnitude: number,
};


function ArrowInOut({horizontalShift, verticalShift, magnitude}: ArrowProps) {

    const into: boolean = magnitude >= 0 ? true : false;

    return (
        <>
            {!into && <circle cx={horizontalShift} cy={verticalShift} r={1} fill='none' stroke={'black'} stroke-width={0.3}></circle>}
            {into && <line x1={-1 + horizontalShift} x2={1 + horizontalShift} y1={-1 + verticalShift} y2={1 + verticalShift} stroke='black' stroke-width={0.5}></line>}
            {into && <line x1={-1 + horizontalShift} x2={1 + horizontalShift} y1={1 + verticalShift} y2={-1 + verticalShift} stroke='black' stroke-width={0.5}></line>}
        </>
    )
}

export default ArrowInOut
