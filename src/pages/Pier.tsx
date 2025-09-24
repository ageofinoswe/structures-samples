import {Grid, Stack, TextField} from "@mui/material"
import React from "react";
import Grade from "../components/Grade";
import PointLoadSection from "../components/PointLoadSection";

// INTERFACES
// text input props is used to specify the text input properties
interface TextInputProps {
    disabled?: boolean,
    id?: string,
    sx?: {},
    label?: string,
    value?: string,
    size?: 'small' | 'medium',
    variant?: 'standard' | 'outlined',
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void,
};
// svg rect props is used to specify the properties to draw an svg rectangle
interface SvgRectProps {
    x: number,
    y: number,
    width: number,
    height: number,
    fill: string,
    stroke: string,
    'strokeWidth': number
}
// svg props is used to specify the svg properties
interface SvgProps {
    viewBox: string,
    width: string,
    height: string,
}
// svg text props is used to specify svg text properies
interface SvgTextProps {
    x: number,
    y: number,
    fontSize: number,
    textAnchor?: string,
    dominantBaseline?: string,
}

function Pier() {
    // STATE VARIABLES
    // point load, height, diameter, passivePressure, maxPressure
    const [pointLoad, setPointLoad] = React.useState('0');
    const [height, setHeight] = React.useState('0');
    const [diameter, setDiameter] = React.useState('0');
    const [passivePressure, setPassivePressure] = React.useState('0');
    const [maxPressure, setMaxPressure] = React.useState('0');
    const [depth, setDepth] = React.useState('72');

    // STATE HANDLERS
    // updates point load and height applied
    const handlePointLoad: (event: React.ChangeEvent<HTMLInputElement>) => void = (event) => {
        if(!isNaN(parseInt(event.target.value)))
            setPointLoad(event.target.value);
        else
            setPointLoad('0');
    }
    const handleHeight: (event: React.ChangeEvent<HTMLInputElement>) => void = (event) => {
        if(!isNaN(parseInt(event.target.value)))
            setHeight(event.target.value);
        else
            setHeight('0');
    }
    // updates pier diameter, depth,  and allowable pressures
    const handleDiameter: (event: React.ChangeEvent<HTMLInputElement>) => void = (event) => {
        if(!isNaN(parseInt(event.target.value)))
            setDiameter(event.target.value);
        else
            setDiameter('0');
    }
    const handleDepth: (event: React.ChangeEvent<HTMLInputElement>) => void = (event) => {
        if(!isNaN(parseInt(event.target.value)))
            setDepth(event.target.value);
        else
            setDepth('0');    
    }
    const handlePassivePressure: (event: React.ChangeEvent<HTMLInputElement>) => void = (event) => {
        if(!isNaN(parseInt(event.target.value)))
            setPassivePressure(event.target.value);
        else
            setPassivePressure('0');    
    }
    const handleMaxPressure: (event: React.ChangeEvent<HTMLInputElement>) => void = (event) => {
        if(!isNaN(parseInt(event.target.value)))
            setMaxPressure(event.target.value);
        else
            setMaxPressure('0');    
    }

    // CONSTANTS
    // used to generate dimension input fields for the foundation
    const pierInput: TextInputProps[] = [
        {label: 'Point Load, kips (P)', value: pointLoad, size: 'small', variant: 'standard', onChange: handlePointLoad},
        {label: 'Height, ft (h)', value: height, size: 'small', variant: 'standard', onChange: handleHeight},
        {label: 'Diameter, in (D)', value: diameter, size: 'small', variant: 'standard', onChange: handleDiameter},
        {label: 'Depth, in (d)', disabled: true, value: depth, size: 'small', variant: 'standard', onChange: handleDepth},
        {label: 'Passive Pressure, psf/ft (qmin)', value: passivePressure, size: 'small', variant: 'standard', onChange: handlePassivePressure},
        {label: 'Max Pressure, psf (Q)', value: maxPressure, size: 'small', variant: 'standard', onChange: handleMaxPressure},

    ];
    
    // FUNCTIONS
    // determines the coordinates of foundation labeling (bottom of foundation, right side of foundation, and title below foundation)
    const getLabelLocations: (svgProps: SvgProps, fdnProps: SvgRectProps) => {bottom: SvgTextProps, perp: SvgTextProps, title: SvgTextProps} = (svgProps, fdnProps) => {
        const textAnchor: string = 'middle';
        const dominantBaseline: string = 'middle';
        const fontSize: number = 2;
        const offsetX: number = 2;
        const offsetY: number = 2;

        const bottomX: number = fdnProps.x + fdnProps.width / 2 ;
        const bottomY: number = fdnProps.y + fdnProps.height;
        const bottom: SvgTextProps = {x: bottomX, y: bottomY + offsetY, fontSize: fontSize, textAnchor: textAnchor};

        const perpX: number = fdnProps.x + fdnProps.width + 1;
        const perpY: number = fdnProps.y + fdnProps.height / 2 + 0.5;
        const perp: SvgTextProps = {x: perpX + offsetX, y: perpY, fontSize: fontSize, dominantBaseline: dominantBaseline, textAnchor: textAnchor};

        const viewBox: number[] = svgProps.viewBox.split(' ').map(value => parseInt(value))
        const titleX: number = viewBox[2] / 2;
        const titleY: number = viewBox[3];
        const title: SvgTextProps = {x: titleX, y: titleY, fontSize: fontSize, textAnchor: textAnchor};

        return {bottom, perp, title};
    }
    // generates a rectangle with svg properties based on the SvgProps provided and type of foundation desired
    // this will center the rectangle svg within the viewbox
    const pierProps: (svgProps: SvgProps) => {lever: SvgRectProps, pierSection: SvgRectProps} = (svgProps) => {
        const viewBox: number[] = svgProps.viewBox.split(' ').map( (index: string) => Number.parseInt(index));
        const offsetY = 3;
        const viewBoxWidth: number = viewBox[2];
        const viewBoxHeight: number = viewBox[3] - 2 * offsetY;
        
        const totalHeight: number = parseInt(height) * 12 + parseInt(depth);
        const scaleFactor = 0.95;

        const leverWidth: number = (2 / totalHeight) * viewBoxHeight * scaleFactor;
        const leverHeight: number = parseInt(height) === 0 ? 3 : (parseInt(height) * 12 / totalHeight) * viewBoxHeight * scaleFactor;
        const leverCoordX: number = ((viewBoxWidth - leverWidth) / 2);
        const leverCoordY: number = offsetY;
        const lever: SvgRectProps = {
            x: leverCoordX,
            y: leverCoordY,
            width: leverWidth,
            height: leverHeight,
            fill: 'white',
            stroke: 'black',
            'strokeWidth': 0.1
        }; 

        const rectWidth: number = (parseInt(diameter) / totalHeight) * viewBoxHeight * scaleFactor;
        const rectHeight: number = (parseInt(depth) / totalHeight) * viewBoxHeight * scaleFactor;
        const coordX: number = ((viewBoxWidth - rectWidth) / 2);
        const coordY: number = leverHeight + offsetY;
        const pierSection: SvgRectProps = {
            x: coordX,
            y: coordY,
            width: rectWidth,
            height: rectHeight,
            fill: '#949494ff',
            stroke: 'black',
            'strokeWidth': 0.1
        }; 
        return {lever: lever, pierSection: pierSection};
    }

    // CONSTANTS
    const SvgProps: SvgProps = {
        viewBox: '0 0 100 100',
        width: '40vw',
        height: '40vw',
    }
    const labelLocationsPier = getLabelLocations(SvgProps, pierProps(SvgProps).pierSection)
    const labelLocationsLever = getLabelLocations(SvgProps, pierProps(SvgProps).lever)

    return (
    <>
    <Grid container>
        <Grid size={2}>
            <Stack>
                {pierInput.map(field =>
                        <TextField sx={{mt:3}} {...field}/>
                )}
            </Stack>
        </Grid>
        <Grid size={5}>
            <svg {...SvgProps}>
                {parseInt(diameter) > 0
                    &&
                    <>
                        <Grade foundationProps={(pierProps(SvgProps).pierSection)}></Grade>
                        <text {...labelLocationsPier.bottom}>{diameter} in</text>
                        <text {...labelLocationsPier.perp}>{parseInt(depth)/12} ft</text>
                        <rect {...(pierProps(SvgProps).pierSection)}></rect>
                    </>
                    }
                <rect {...(pierProps(SvgProps).lever)}></rect>
                <text {...labelLocationsLever.perp}>{height} ft</text>
                {parseInt(pointLoad) > 0
                    && 
                    <>
                        <PointLoadSection x={(pierProps(SvgProps).lever.y)} y={(pierProps(SvgProps).lever.x)} magnitude={parseInt(pointLoad)} rotate={true}></PointLoadSection>
                    </>
                }
            </svg>
        </Grid>
        <Grid size={5}>
            <svg {...SvgProps}>
                <circle cx={parseInt(SvgProps.viewBox.split(' ')[2]) / 2} cy={parseInt(SvgProps.viewBox.split(' ')[3]) / 2} r={parseInt(diameter) / 2} fill='#949494ff' stroke='black' strokeWidth={0.1}></circle>
                <text x={parseInt(SvgProps.viewBox.split(' ')[2]) / 2} y={parseInt(SvgProps.viewBox.split(' ')[3])/2 + parseInt(diameter)/2 + 2} textAnchor='middle' fontSize={2}>Diameter = {diameter} in</text>
            </svg> 
        </Grid>
    </Grid>
    </>
    )
}

export default Pier
