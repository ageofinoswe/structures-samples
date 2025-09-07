interface MomentProps {
    horizontalShift: number,
    verticalShift: number,
    reverse?: boolean,
}


function Moment({horizontalShift, verticalShift, reverse=false} : MomentProps) {
    const displacement = 1.25;
    const semiCircle = {
        left: [-4 + horizontalShift, verticalShift],
        right: [4 + horizontalShift, verticalShift],
        arc: [1,1],
        props: [0,0,1]
    }
    const leftArrowLine = {
        origin: reverse ? semiCircle.left : semiCircle.right,
        displaceX: reverse ? semiCircle.left[0] - displacement : semiCircle.right[0] - displacement,
        displaceY: reverse ? semiCircle.left[1] - displacement : semiCircle.right[1] - displacement,
    }
    const rightArrowLine = {
        origin: semiCircle.right,
        displaceX: reverse ? semiCircle.left[0] + displacement : semiCircle.right[0] + displacement,
        displaceY: reverse ? semiCircle.right[1] - displacement : semiCircle.right[1] - displacement,
    }
    const dCircle = `M ${semiCircle.left.toString()} A ${semiCircle.arc.toString()} ${semiCircle.props.toString()} ${semiCircle.right.toString()}`
    const leftArrow = `M ${reverse ? semiCircle.left.toString() : semiCircle.right.toString()} L ${leftArrowLine.displaceX.toString()} ${leftArrowLine.displaceY.toString()}`
    const rightArrow = `M ${reverse ? semiCircle.left.toString() : semiCircle.right.toString()} L ${rightArrowLine.displaceX.toString()} ${rightArrowLine.displaceY.toString()}`
    return (

        <>
            <path d={dCircle} fill='none' stroke='black' strokeWidth={0.3}></path>
            <path d={leftArrow} fill='none' stroke='black' strokeWidth={0.3}></path>
            <path d={rightArrow} fill='none' stroke='black' strokeWidth={0.3}></path>
        </>
    )
}

export default Moment