interface ArrowProps {
    x: number,
    y: number,
    magnitude: number,
};

function Arrow({x, y, magnitude}: ArrowProps) {
    const arrowDown = magnitude >= 0 ? true : false;

    const arrowProps = {
        fill: 'none',
        stroke: 'black',
        'stroke-width': 0.2,
    };

    const arrowLength = 5;
    const arrowLine = {
        x1: x,
        y1: y,
        x2: x,
        y2: y - arrowLength,
    }

    const arrowHeadLength = .75;
    const arrowHeadDown =   `M ${x},${y}
                            L ${x - arrowHeadLength},${y - arrowHeadLength}
                            M ${x},${y}
                            L ${x + arrowHeadLength}, ${y - arrowHeadLength}`
    const arrowHeadUp =   `M ${x},${y - arrowLength}
                            L ${x - arrowHeadLength},${y - arrowLength + arrowHeadLength}
                            M ${x},${y - arrowLength}
                            L ${x + arrowHeadLength}, ${y - arrowLength + arrowHeadLength}`
                            
    return (
        <>
            <line {...arrowLine} {...arrowProps}></line>
            <path d={arrowDown ? arrowHeadDown : arrowHeadUp} {...arrowProps}></path>
        </>
    )
}

export default Arrow
