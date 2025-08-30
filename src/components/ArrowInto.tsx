interface Shift {
    horizontalShift: number,
    verticalShift: number,
};

function ArrowInto({horizontalShift, verticalShift}: Shift) {

    return (
        <>
            <line x1={-1 + horizontalShift} x2={1 + horizontalShift} y1={-1 + verticalShift} y2={1 + verticalShift} stroke='black' stroke-width={0.5}></line>
            <line x1={-1 + horizontalShift} x2={1 + horizontalShift} y1={1 + verticalShift} y2={-1 + verticalShift} stroke='black' stroke-width={0.5}></line>
        </>
    )
}

export default ArrowInto
