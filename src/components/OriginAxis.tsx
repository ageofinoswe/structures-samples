// draws a coordinate axis at the origin of a rectangular svg and annotates it
// rotates the axis 90 degrees if needed
//      ________________
//      |              |
//      |              |
//      |              |
//   |  |              |
//  L|  |______________|
//   |______          
//      B

interface Shift {
    origin: number[]
    rotate? : boolean
}

function Axis({origin, rotate = false} : Shift) {
    const offset = 1;
    const length = 2;
    const lineProps = {
        stroke: 'black',
        'strokeWidth': 0.25
    }
    return(
        <>
            <line x1={origin[0] - offset} y1={origin[1] + (rotate ? -offset : offset)} x2={origin[0] - offset} y2={rotate ? length + origin[1] : -length + origin[1]} {...lineProps} stroke={rotate ? 'green' : 'red'}></line>
            <text x={origin[0] + (rotate ? -3*offset : 0)} y={origin[1] + (rotate ? 0.5 : 2.5*offset)} fontSize={2} dominantBaseline={'middle'}>B</text>

            <line x1={origin[0] - offset} y1={origin[1] + (rotate ? -offset : offset)} x2={length + origin[0]}  y2={origin[1] + (rotate ? -offset : offset)} {...lineProps} stroke={rotate ? 'red' : 'green'}></line>
            <text x={origin[0] + (rotate ? -0.3 : -3*offset)} y={origin[1] + (rotate ? -2*offset : 0)} fontSize={2} dominantBaseline={'middle'}>L</text>

        </>
    )
}

export default Axis