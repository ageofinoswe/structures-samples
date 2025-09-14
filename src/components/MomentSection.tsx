interface MomentProps {
    x: number,
    y: number,
    magnitude: number,
    plan?: boolean,
}

function MomentSection({x, y, magnitude}: MomentProps) {
    const clockwise = magnitude >= 0 ? true : false;
    const radius = 2;
    const pathProps = {
        fill: 'none',
        stroke: 'blue',
        'stroke-width': 0.2,
    };

    const arrowHeadLength = 0.6;
    const semiCircle = `M ${x - radius},${y} A 1,1 0,0,1 ${x + radius},${y}`;
    const arrowClockwise = `M ${x + radius},${y} L ${x + radius - arrowHeadLength},${y - arrowHeadLength}
                            M ${x + radius},${y} L ${x + radius + arrowHeadLength},${y - arrowHeadLength}`
    const arrowCounterClockWise = `M ${x - radius},${y} L ${x - radius - arrowHeadLength},${y - arrowHeadLength}
                                    M ${x - radius},${y} L ${x - radius + arrowHeadLength},${y - arrowHeadLength}`

    return (
        <>
            {<path d={semiCircle} {...pathProps}/>}
            {<path d={clockwise ? arrowClockwise : arrowCounterClockWise} {...pathProps}/>}
        </>
    )
}

export default MomentSection