interface SvgRectProps {
    x: number,
    y: number,
    width: number,
    height: number,
    fill: string,
    stroke: string,
    'strokeWidth': number
}

function CenterAxis({foundationProps}: {foundationProps: SvgRectProps}) {
    const lineProps = {
        stroke: 'purple',
        'strokeWidth': .1,
        'strokeDasharray': 1.5,
    }
    const extension = 0.75;
    return (
        <>
            <line   x1={foundationProps.x + foundationProps.width / 2} y1={foundationProps.y - extension}
                    x2={foundationProps.x + foundationProps.width / 2} y2={foundationProps.y + foundationProps.height + extension}
                    {...lineProps}/>
            <line   x1={foundationProps.x - extension} y1={foundationProps.y + foundationProps.height / 2}
                    x2={foundationProps.x + foundationProps.width + extension} y2={foundationProps.y + foundationProps.height / 2}
                    {...lineProps}/>
        </>
    )
}

export default CenterAxis