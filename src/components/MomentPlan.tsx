interface MomentProps {
    x: number,
    y: number,
    magnitude: number,
    along?: string,
    rotate?: boolean,
}

function MomentPlan({x, y, magnitude, along, rotate=false} : MomentProps) {
    interface lineProps {
        x1: number,
        y1: number,
        x2: number,
        y2: number
    }

    const drawingProps = {
        fill: 'none',
        stroke: 'blue',
        'strokeWidth': 0.2,
    };

    const direction = magnitude >= 0 ? 'clockwise' : 'counterclockwise'
    const radius = 2;
    const arrowHeadLength = 0.4;
    const arrowHeadOffset = 1;

    const momentArrow: lineProps[]= [
        // line
        {x1: radius,
        y1: 0,
        x2: -radius,
        y2: 0},
        // arrow head 1
        {x1: radius,
        y1: 0,
        x2: radius - arrowHeadLength,
        y2: -arrowHeadLength},
        // arrow head 2
        {x1: radius,
        y1: 0,
        x2: radius - arrowHeadLength,
        y2: arrowHeadLength},
        // arrow head 3
        {x1: radius - arrowHeadOffset,
        y1: 0,
        x2: radius - arrowHeadOffset - arrowHeadLength,
        y2: -arrowHeadLength},
        // arrow head 4
        {x1: radius - arrowHeadOffset,
        y1: 0,
        x2: radius - arrowHeadOffset - arrowHeadLength,
        y2: arrowHeadLength},
    ]
    const transformDirection: (line: lineProps) => lineProps = (line) => {
        return {x1: line.x1 * -1,
                y1: line.y1 * -1,
                x2: line.x2 * -1,
                y2: line.y2 * -1}
    }
    const transformAlong: (line: lineProps) => lineProps = (line) => {
        return {x1: line.y1 * -1,
                y1: line.x1 * -1,
                x2: line.y2 * -1,
                y2: line.x2 * -1}
    }
    const tranformRotate: (line: lineProps) => lineProps = (line) => {
        let tempLine = line;
        if (along === 'B'){
            tempLine = {x1: line.y1,
                        y1: line.x1,
                        x2: line.y2,
                        y2: line.x2}
        }
        if (along === 'L'){
            tempLine = {x1: line.y1 * -1,
                        y1: line.x1 * -1,
                        x2: line.y2 * -1,
                        y2: line.x2 * -1}
        }
        return tempLine;
    }
    const moveToOrigin: (line: lineProps) => lineProps = (line) => {
        return {x1: line.x1 + x,
                y1: line.y1 + y,
                x2: line.x2 + x,
                y2: line.y2 + y}
    }
    const drawMomentArrow: () => lineProps[] = () => {
        const directionTransformation = direction === 'counterclockwise' ? true : false;
        const alongTransformation = along === 'L' ? true : false;

        const lineTransformation = momentArrow.map(line => {
            let tempLine: lineProps = line;
            if(directionTransformation)
                tempLine = transformDirection(tempLine);
            if(alongTransformation)
                tempLine = transformAlong(tempLine);
            if(rotate)
                tempLine = tranformRotate(tempLine)
            tempLine = moveToOrigin(tempLine);
            return tempLine;
        })
        return lineTransformation;
    }

    return (
        <>
            {drawMomentArrow().map(line => <line {...line} {...drawingProps}/>)}
        </>
    )
}

export default MomentPlan