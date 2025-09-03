interface ArrowProps {
    horizontalShift: number,
    verticalShift: number,
    magnitude: number,
};

function Arrow({horizontalShift, verticalShift, magnitude}: ArrowProps) {

    const down: boolean = magnitude >= 0 ? true : false;

    return (
        <>
            <line x1={horizontalShift} x2={horizontalShift} y1={-20 + verticalShift} y2={verticalShift} stroke='black' stroke-width={0.5}></line>
            <line x1={-2 + horizontalShift} x2={horizontalShift} y1={down ? -3 + verticalShift : -20 + 3 + verticalShift} y2={down ? verticalShift : -20 + verticalShift} stroke='black' stroke-width={0.5}></line>
            <line x1={2 + horizontalShift} x2={horizontalShift} y1={down ? -3 + verticalShift : -20 + 3 + verticalShift} y2={down ? verticalShift : -20 + verticalShift} stroke='black' stroke-width={0.5}></line>
        </>
    )
}

export default Arrow
