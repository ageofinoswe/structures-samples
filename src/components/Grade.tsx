interface SvgRectProps {
    x: number,
    y: number,
    width: number,
    height: number,
    fill: string,
    stroke: string,
    'stroke-width': number
}

function Grade({foundationProps}: {foundationProps: SvgRectProps}) {
    const lineProps = {
        stroke: 'black',
        'stroke-width': .2,
    }
    const extension = 8;
    return (
        <>
            <line   x1={foundationProps.x - extension} y1={foundationProps.y}
                    x2={foundationProps.x} y2={foundationProps.y}
                    {...lineProps}/>
            <line   x1={foundationProps.x + foundationProps.width} y1={foundationProps.y}
                    x2={foundationProps.x + foundationProps.width + extension} y2={foundationProps.y}
                    {...lineProps}/>
        </>
    )
}

export default Grade