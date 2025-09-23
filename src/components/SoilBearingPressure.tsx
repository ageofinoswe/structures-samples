// draws the soil bearing pressure under a foundation section

// pressure props interfaces requires the foundation properties, the soil bearing pressures, and the shape
interface PressureProps {
    foundationProps: SvgRectProps,
    qLeft: number,
    qRight: number,
    shape: Triangular | Trapezoidal
}
// triangular interface requires the type, an effective width, and direction/'reverse' (0 soil bearing on the left, or 0 soil bearing on the right)
interface Triangular {
    type: 'triangular'
    effectiveWidth: number;
    reverse?: boolean,
}
// trapezoidal interface requires the type only
interface Trapezoidal {
    type: 'trapezoidal'
}
// svg rect props requires these fields to draw the svg
interface SvgRectProps {
    x: number,
    y: number,
    width: number,
    height: number,
    fill: string,
    stroke: string,
    'strokeWidth': number
}

function SoilBearingPressure({foundationProps, qLeft, qRight, shape}:  PressureProps) {
    // define the svg properies
    const pathProps = {
        fill: '#3f8b50ff',
        stroke: 'black',
        'strokeWidth': 0.1,
    };
    // scales the maximum soil bearing pressure to the viewbox height of the svg, then scaled down to fit appropriately on screen
    const scale: (pressure: number) => number = (pressure) => {
        const scaleFactor = 4;
        return pressure * (foundationProps.y / (qLeft > qRight ? qLeft : qRight)) / scaleFactor;
    }

    // soil bearing pressure coordinates
    let originX: number;
    let originY: number;
    // begin at start coordinate
    let start: [number, number];
    // draw line to coordinate q1
    let q1: [number, number];
    // draw line to coordiante q2
    let q2: [number, number];
    // draw line to end coordinate
    let end: [number, number];

    // trapezoidal soil bearing pressure
    if(shape.type === 'trapezoidal'){
        // determine the origin/start coordinate
        originX = foundationProps.x;
        originY = foundationProps.y + foundationProps.height;
        start = [originX, originY];
        // determine the q1 coordinate, but scale the y-value to fit in viewbox
        q1 = [originX, originY + scale(qLeft)];
        // determine the q2 coordiante, but scale the y-value to fit in viewbox
        q2 = [originX + foundationProps.width, originY + scale(qRight)];
        // determine the end coordiante (end of foundation)
        end = [originX + foundationProps.width, originY];
        // if q1 is greater than q2, reverse the trapezoidal bearing pressure
        if(q1[1] > q2[1])
            [start, q1, q2, end] = [end, q2, q1, start] 
    }
    // triangulare soil bearing pressure
    else{
        // determine the origin/start coordinate
        originX = foundationProps.x + (foundationProps.width - shape.effectiveWidth);
        originY = foundationProps.y + foundationProps.height;
        start = [originX, originY];
        // determine the q1 coordinate, but scale the y-value to fit in viewbox
        q1 = [originX, originY + scale(qLeft)];
        // determine the q2 coordinate, but scale the y-value to fit in viewbox
        q2 = [originX + shape.effectiveWidth, originY + scale(qRight)];
        // determine the end coordinate (end of effective width/length)
        end = [originX + shape.effectiveWidth, originY];
        // if the triangular distribution is reversed/mirrored, determine new coordinates by swapping q1 and q2
        if(shape.reverse ?? false){
            // recalculate the origin/start coordinates
            originX = foundationProps.x;
            originY = foundationProps.y + foundationProps.height;
            start = [originX, originY];
            // recalculate the q1 coordinate, but scale the y-value to fit in viewbox
            q1 = [originX, originY + scale(qRight)];
            // recalculate the q2 coordinate, but scale the y-value to fit in viewbox
            q2 = [originX + shape.effectiveWidth, originY + scale(qLeft)];
            // recalculate the end coordinate (end of effective width/length)
            end = [originX + shape.effectiveWidth, originY];
        }
    }

    // draw soil bearing pressure svg
    const soilBearingPressureDrawing =  `M ${start[0]},${start[1]}
                                        L ${q1[0]},${q1[1]}
                                        L ${q2[0]},${q2[1]}
                                        L ${end[0]},${end[1]}`
    return (
        <>
        {/* triangular soil bearing pressures and annotations */}
            {<path d={soilBearingPressureDrawing} {...pathProps}/>}
            {(shape.type === 'triangular' && (shape.reverse ?? false))
                &&  <>  {<text x={q1[0]} y={q1[1] + 2} fontSize={1.5}>{Math.round(qRight*1000)} psf</text>}
                        {<text x={q2[0]} y={q2[1] + 2} fontSize={1.5}>{Math.round(qLeft*1000)} psf</text>}
                    </>
            }   
            {(shape.type === 'triangular' && !(shape.reverse ?? false))
                &&  <>  {<text x={q1[0] - 3} y={q1[1] + 2} fontSize={1.5}>{Math.round(qLeft*1000)} psf</text>}
                        {<text x={q2[0]} y={q2[1] + 3} fontSize={1.5}>{Math.round(qRight*1000)} psf</text>}
                    </>
            }
            {/* trapezoidal soil bearing pressures and annotations */}
            {(shape.type === 'trapezoidal' && qLeft <= qRight) 
                &&  <>
                        {<text x={q1[0]} y={q1[1] + 2} fontSize={1.5}>{Math.round(qLeft*1000)} psf</text>}
                        {<text x={q2[0]} y={q2[1] + 2} fontSize={1.5}>{Math.round(qRight*1000)} psf</text>}
                    </>
            }
            {(shape.type === 'trapezoidal' && qLeft > qRight) 
                &&  <>
                        {<text x={q1[0]} y={q1[1] + 2} fontSize={1.5}>{Math.round(qRight*1000)} psf</text>}
                        {<text x={q2[0]} y={q2[1] + 2} fontSize={1.5}>{Math.round(qLeft*1000)} psf</text>}
                    </>
            }

        </>
    )
}

export default SoilBearingPressure;