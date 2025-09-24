// draws point load svgs on the section, up or down, and annotate it
//         .
//   |    /*\
//   |     |
//   |     |
//  \*/    |
//   `
// rotate allows for 90 degree transformation
//                          \
//         ------------------}
//                          /
//


interface ArrowProps {
    x: number,
    y: number,
    magnitude: number,
    rotate? : boolean,
};

function Arrow({x, y, magnitude, rotate=false}: ArrowProps) {
    // determine the direction and define the svg props
    const arrowDown = magnitude >= 0 ? true : false;
    const arrowProps = {
        fill: 'none',
        stroke: 'black',
        'strokeWidth': 0.2,
    };
    const arrowLength = 8;
    const arrowLine = {
        x1: rotate ? y : x,
        y1: rotate ? x : y,
        x2: rotate ? y - arrowLength : x,
        y2: rotate ? x : y - arrowLength,
    }
    const arrowHeadLength = .75;
    
    // draw the arrows
    const arrowHeadDown =   `M ${x},${y}
                            L ${x - arrowHeadLength},${y - arrowHeadLength}
                            M ${x},${y}
                            L ${x + arrowHeadLength}, ${y - arrowHeadLength}`
    const arrowHeadUp =     `M ${x},${y - arrowLength}
                            L ${x - arrowHeadLength},${y - arrowLength + arrowHeadLength}
                            M ${x},${y - arrowLength}
                            L ${x + arrowHeadLength}, ${y - arrowLength + arrowHeadLength}`
    const arrowHeadRotated =    `M ${y},${x}
                                L ${y - arrowHeadLength},${x + arrowHeadLength}
                                M ${y},${x}
                                L ${y - arrowHeadLength}, ${x - arrowHeadLength}`
                            
    return (
        <>
            <line {...arrowLine} {...arrowProps}></line>
            <path d={arrowDown ? (rotate ? arrowHeadRotated : arrowHeadDown) : arrowHeadUp} {...arrowProps}></path>
            <text textAnchor='middle' fontSize={1.5} x={rotate ? y - arrowLength - 3 : x} y={ rotate ? x : y - arrowLength - 1}>{magnitude} kips</text>
        </>
    )
}

export default Arrow
