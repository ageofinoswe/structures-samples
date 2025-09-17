interface PressureProps {
    foundationProps: SvgRectProps,
    qLeft: number,
    qRight: number,
    shape: Triangular | Trapezoidal
}
interface Triangular {
    type: 'triangular'
    effectiveWidth: number;
    reverse?: boolean,
}
interface Trapezoidal {
    type: 'trapezoidal'
}

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
    const pathProps = {
        fill: '#3f8b50ff',
        stroke: 'black',
        'strokeWidth': 0.1,
    };
    const scale: (pressure: number) => number = (pressure) => {
        const scaleFactor = 4;
        return pressure * (foundationProps.y / (qLeft > qRight ? qLeft : qRight)) / scaleFactor;
    }

    let originX: number;
    let originY: number;
    let start: [number, number];
    let q1: [number, number];
    let q2: [number, number];
    let end: [number, number];

    if(shape.type === 'trapezoidal'){
        originX = foundationProps.x;
        originY = foundationProps.y + foundationProps.height;
        start = [originX, originY];
        q1 = [originX, originY + scale(qLeft)];
        q2 = [originX + foundationProps.width, originY + scale(qRight)];
        end = [originX + foundationProps.width, originY];
        if(q1[1] > q2[1])
            [start, q1, q2, end] = [end, q2, q1, start] 
    }
    else{
        originX = foundationProps.x + (foundationProps.width - shape.effectiveWidth);
        originY = foundationProps.y + foundationProps.height;
        start = [originX, originY];
        q1 = [originX, originY + scale(qLeft)];
        q2 = [originX + shape.effectiveWidth, originY + scale(qRight)];
        end = [originX + shape.effectiveWidth, originY];
        if(shape.reverse ?? false){
            originX = foundationProps.x;
            originY = foundationProps.y + foundationProps.height;
            start = [originX, originY];
            q1 = [originX, originY + scale(qRight)];
            q2 = [originX + shape.effectiveWidth, originY + scale(qLeft)];
            end = [originX + shape.effectiveWidth, originY];
        }
    }

    const soilBearingPressureDrawing =  `M ${start[0]},${start[1]}
                                        L ${q1[0]},${q1[1]}
                                        L ${q2[0]},${q2[1]}
                                        L ${end[0]},${end[1]}`
    return (
        <>
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