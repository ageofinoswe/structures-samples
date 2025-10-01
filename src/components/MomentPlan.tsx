// draws the svg for a moment on a foundation plan
// the moment in plan is a double arrow
//         ----->-->
// this function takes in the coordinate to draw it, the magnitude to determine direction, and 'along' to determine its orientation
// rotate is used to rotate it 90 degrees if needed (plan to rotated plan)

interface MomentProps {
    x: number,
    y: number,
    magnitude: number,
    along?: string,
    rotate?: boolean,
}

function MomentPlan({x, y, magnitude, along, rotate=false} : MomentProps) {
    // needed to draw an svg line
    interface lineProps {
        x1: number,
        y1: number,
        x2: number,
        y2: number
    }

    // drawing properties of the moment arrow
    const drawingProps = {
        fill: 'none',
        stroke: 'blue',
        'strokeWidth': 0.2,
    };

    // determine the direction and define the svg lengths
    const direction = magnitude >= 0 ? 'clockwise' : 'counterclockwise'
    const length = 2;
    const arrowHeadLength = 0.4;
    const arrowHeadOffset = 1;

    const momentArrow: lineProps[]= [
        // line
        {x1: length,
        y1: 0,
        x2: -length,
        y2: 0},
        // arrow head 1
        {x1: length,
        y1: 0,
        x2: length - arrowHeadLength,
        y2: -arrowHeadLength},
        // arrow head 2
        {x1: length,
        y1: 0,
        x2: length - arrowHeadLength,
        y2: arrowHeadLength},
        // arrow head 3
        {x1: length - arrowHeadOffset,
        y1: 0,
        x2: length - arrowHeadOffset - arrowHeadLength,
        y2: -arrowHeadLength},
        // arrow head 4
        {x1: length - arrowHeadOffset,
        y1: 0,
        x2: length - arrowHeadOffset - arrowHeadLength,
        y2: arrowHeadLength},
    ]
    // mirror direction
    const transformDirection: (line: lineProps) => lineProps = (line) => {
        return {x1: line.x1 * -1,
                y1: line.y1 * -1,
                x2: line.x2 * -1,
                y2: line.y2 * -1}
    }
    // transform from along B to along L 
    const transformAlong: (line: lineProps) => lineProps = (line) => {
        return {x1: line.y1 * -1,
                y1: line.x1 * -1,
                x2: line.y2 * -1,
                y2: line.x2 * -1}
    }
    // rotate 90 degrees
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
    // move to desired location
    const moveToLocation: (line: lineProps) => lineProps = (line) => {
        return {x1: line.x1 + x,
                y1: line.y1 + y,
                x2: line.x2 + x,
                y2: line.y2 + y}
    }
    // draw resulting moment arrow in plan view
    const drawMomentArrow: () => lineProps[] = () => {
        // determine direction as a boolean
        const directionTransformation = direction === 'counterclockwise' ? true : false;
        // determine if along L or along B
        const alongTransformation = along === 'L' ? true : false;
        // perform transformations
        const lineTransformation = momentArrow.map(line => {
            let tempLine: lineProps = line;
            // mirror if needed
            if(directionTransformation)
                tempLine = transformDirection(tempLine);
            // change along axis if needed
            if(alongTransformation)
                tempLine = transformAlong(tempLine);
            // rotate 90 degrees if needed
            if(rotate)
                tempLine = tranformRotate(tempLine)
            tempLine = moveToLocation(tempLine);
            return tempLine;
        })
        return lineTransformation;
    }

    return (
        <>
            {drawMomentArrow().map(line => <line key={line.x1 + line.x2 + line.y1 + line.y2} {...line} {...drawingProps}/>)}
        </>
    )
}

export default MomentPlan