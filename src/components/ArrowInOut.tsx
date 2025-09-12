interface ArrowProps {
    x: number,
    y: number,
    magnitude: number,
};


function ArrowInOut({x, y, magnitude}: ArrowProps) {
    const into = magnitude >= 0 ? true : false;
    const arrowProps = {
        fill: 'none',
        stroke: 'black',
        'stroke-width': 0.3,
    };
    const arrowOutProps = {
        cx: x,
        cy: y,
        r: 1
    };
    
    const offset = 0.75;
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
