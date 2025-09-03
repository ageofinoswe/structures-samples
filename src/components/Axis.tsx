interface Shift {
    horizontalShift: number,
    verticalShift: number,
    rotate? : boolean
}

function Axis({horizontalShift, verticalShift, rotate = false} : Shift) {
        return(
            <>
                <line x1={0 + horizontalShift} x2={0 + horizontalShift} y1={0 + verticalShift} y2={rotate ? 3 + verticalShift : -3 + verticalShift} stroke='black' stroke-width={0.25}></line>
                <line x1={0 + horizontalShift} x2={3 + horizontalShift} y1={0 + verticalShift} y2={0 + verticalShift} stroke='black' stroke-width={0.25}></line>
            </>
        )
}

export default Axis