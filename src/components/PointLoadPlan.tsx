// draws point load svgs on the plan. x = into the page, o = out of the page

interface ArrowProps {
    x: number,
    y: number,
    magnitude: number,
};


function ArrowInOut({x, y, magnitude}: ArrowProps) {
    // determine the direction and define the svg props
    const into = magnitude >= 0 ? true : false;
    const arrowProps = {
        fill: 'none',
        stroke: 'black',
        'strokeWidth': 0.2,
    };
    const arrowOutProps = {
        cx: x,
        cy: y,
        r: 0.75
    };
    const offset = .75;

    // draw the arrow
    const arrowInProps =   `M ${x},${y}
                            L ${x - offset},${y - offset} ${x + offset},${y + offset}
                            M ${x},${y}
                            L ${x - offset},${y + offset} ${x + offset},${y - offset}`

    return (
        <>
            {into && <path d={arrowInProps} {...arrowProps}></path>}
            {!into && <circle {...arrowOutProps} {...arrowProps}></circle>}
        </>
    )
}

export default ArrowInOut
