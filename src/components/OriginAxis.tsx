interface Shift {
    origin: number[]
    rotate? : boolean
}

function Axis({origin, rotate = false} : Shift) {
    const offset = 1;
    const length = 2;
    const lineProps = {
        stroke: 'black',
        'stroke-width': 0.25
    }
    return(
        <>
            <line x1={origin[0] - offset} y1={origin[1] + (rotate ? -offset : offset)} x2={origin[0] - offset} y2={rotate ? length + origin[1] : -length + origin[1]} {...lineProps}></line>
            <line x1={origin[0] - offset} y1={origin[1] + (rotate ? -offset : offset)} x2={length + origin[0]}  y2={origin[1] + (rotate ? -offset : offset)} {...lineProps}></line>
        </>
    )
}

export default Axis