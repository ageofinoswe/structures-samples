// draws the svg for a moment on a foundation plan, and annotate it
// the moment in section is a semicircle
//         .-***-.
//         |     |
//               V
// this function takes in the coordinate to draw it, the magnitude to determine direction


interface MomentProps {
    x: number,
    y: number,
    magnitude: number,
    plan?: boolean,
}

function MomentSection({x, y, magnitude}: MomentProps) {
    // determine direction and define semicircle svg properties
    const clockwise = magnitude >= 0 ? true : false;
    const radius = 2;
    const pathProps = {
        fill: 'none',
        stroke: 'blue',
        'strokeWidth': 0.2,
    };
    const arrowHeadLength = 0.6;

    // draw semicircle with arrow head
    const semiCircle = `M ${x - radius},${y} A 1,1 0,0,1 ${x + radius},${y}`;
    const arrowClockwise = `M ${x + radius},${y} L ${x + radius - arrowHeadLength},${y - arrowHeadLength}
                            M ${x + radius},${y} L ${x + radius + arrowHeadLength},${y - arrowHeadLength}`
    const arrowCounterClockWise = `M ${x - radius},${y} L ${x - radius - arrowHeadLength},${y - arrowHeadLength}
                                    M ${x - radius},${y} L ${x - radius + arrowHeadLength},${y - arrowHeadLength}`

    return (
        <>
            {<path d={semiCircle} {...pathProps}/>}
            {<path d={clockwise ? arrowClockwise : arrowCounterClockWise} {...pathProps}/>}
            <text fontSize={1.5} x={x - radius - 1.5} y={y - 2.5}>{magnitude} kip-ft</text>
        </>
    )
}

export default MomentSection