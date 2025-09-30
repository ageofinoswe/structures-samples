import {Box, Button, Divider, FormControl, FormControlLabel, Grid, Radio, RadioGroup, Stack, TextField, Typography} from "@mui/material"
import React from "react";
import Grade from "../components/Grade";
import PointLoadSection from "../components/PointLoadSection";
import CalculationHeader from "../components/CalculationHeader";
import CalculationLine from "../components/CalculationLine";

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
    const [recalculate, setRecalculate] = React.useState(true);
    const [constrained, setConstrained] = React.useState(false);
    const [depthLimitation, setDepthLimitation] = React.useState(false);

    // STATE HANDLERS
    // updates point load and height applied
    const handlePointLoad: (event: React.ChangeEvent<HTMLInputElement>) => void = (event) => {
        if(!isNaN(parseFloat(event.target.value))){
            setPointLoad(event.target.value);
            setRecalculate(true);
        }
        else
            setPointLoad('0');
    }
    const handleHeight: (event: React.ChangeEvent<HTMLInputElement>) => void = (event) => {
        if(!isNaN(parseFloat(event.target.value))){
            setHeight(event.target.value);
            setRecalculate(true);
        }
        else
            setHeight('0');
    }
    // updates pier diameter, depth, and allowable pressures
    const handleDiameter: (event: React.ChangeEvent<HTMLInputElement>) => void = (event) => {
        if(!isNaN(parseFloat(event.target.value))){
            setDiameter(event.target.value);
            setRecalculate(true);
        }
        else
            setDiameter('0');
    }
    const handleDepth: (event: React.ChangeEvent<HTMLInputElement>) => void = (event) => {
        if(!isNaN(parseFloat(event.target.value)))
            setDepth(event.target.value);
        else
            setDepth('0');    
    }
    const handlePassivePressure: (event: React.ChangeEvent<HTMLInputElement>) => void = (event) => {
        if(!isNaN(parseFloat(event.target.value))){
            setPassivePressure(event.target.value);
            setRecalculate(true);
        }
        else
            setPassivePressure('0');    
    }
    const handleMaxPressure: (event: React.ChangeEvent<HTMLInputElement>) => void = (event) => {
        if(!isNaN(parseFloat(event.target.value))){
            setMaxPressure(event.target.value);
            setRecalculate(true);
        }
        else
            setMaxPressure('0');    
    }
    const handleConstrained: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void = (event) => {
        if(event.target.value === 'true')
            setConstrained(true);
        else
            setConstrained(false);
        setRecalculate(true);
    }
    const handleDepthLimitation: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void = (event) => {
        if(event.target.value === 'true'){
            setConstrained(false);
            setDepthLimitation(true);
        }
        else
            setDepthLimitation(false);
        setRecalculate(true);
    }
    const handleCalcDepth: () => void = () => {
        const delta = 0.25;
        let maxIterations = 500;
        let converged: boolean = false
        if(!constrained){
            for(let calcDepth = 0 ; calcDepth < maxIterations && !converged ; calcDepth += 0.1){
                let rhs = 0.5 * calcConvergence(calcDepth).A * (1 + Math.sqrt(1 + (4.36*calcs.h / calcConvergence(calcDepth).A)));
                if(Math.abs(calcDepth-rhs) <= delta){
                    converged = true;
                    setDepth((rhs*12).toString());
                }
            }
        }
        else if (constrained) {
            for(let calcDepth = 0 ; calcDepth < maxIterations && !converged ; calcDepth += 0.1){
                let rhs = Math.sqrt((4.25 * calcs.P * calcs.h) / (calcConvergence(calcDepth).S3 * calcs.b));
                if(Math.abs(calcDepth-rhs) <= delta){
                    converged = true;
                    setDepth((rhs*12).toString());
                }
            }            
        }
        setRecalculate(false);
    }

    // CONSTANTS
    // used to generate dimension input fields for the pier
    const pierInput: TextInputProps[] = [
        {label: 'Point Load, kips (P)', value: pointLoad, size: 'small', variant: 'standard', onChange: handlePointLoad},
        {label: 'Height, ft (h)', value: height, size: 'small', variant: 'standard', onChange: handleHeight},
        {label: 'Diameter, in (b)', value: diameter, size: 'small', variant: 'standard', onChange: handleDiameter},
        {label: 'Depth, in (d)', disabled: true, value: depth, size: 'small', variant: 'standard', onChange: handleDepth},
        {label: 'Allowable Soil Pressure, psf/ft (q)', value: passivePressure, size: 'small', variant: 'standard', onChange: handlePassivePressure},
        {label: 'Max Allowable Soil Pressure, psf (Q)', value: maxPressure, size: 'small', variant: 'standard', onChange: handleMaxPressure},
    ];
    
    // FUNCTIONS
    // determines the coordinates of pier labeling (bottom of pier, right side of pier, and title below pier)
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

        const viewBox: number[] = svgProps.viewBox.split(' ').map(value => parseFloat(value))
        const titleX: number = viewBox[2] / 2;
        const titleY: number = viewBox[3];
        const title: SvgTextProps = {x: titleX, y: titleY, fontSize: fontSize, textAnchor: textAnchor};

        return {bottom, perp, title};
    }
    // generates a rectangle with svg properties based on the SvgProps provided and type of pier desired
    // this will center the rectangle svg within the viewbox
    const pierProps: (svgProps: SvgProps) => {lever: SvgRectProps, pierSection: SvgRectProps} = (svgProps) => {
        const viewBox: number[] = svgProps.viewBox.split(' ').map( (index: string) => Number.parseFloat(index));
        const offsetY = 10;
        const viewBoxWidth: number = viewBox[2];
        const viewBoxHeight: number = viewBox[3] - 2 * offsetY;
        
        const totalHeight: number = parseFloat(height) * 12 + parseFloat(depth);
        const scaleFactor = 0.95;

        const leverWidth: number = (2 / totalHeight) * viewBoxHeight * scaleFactor;
        const leverHeight: number = parseFloat(height) === 0 ? 3 : (parseFloat(height) * 12 / totalHeight) * viewBoxHeight * scaleFactor;
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

        const rectWidth: number = (parseFloat(diameter) / totalHeight) * viewBoxHeight * scaleFactor;
        const rectHeight: number = (parseFloat(depth) / totalHeight) * viewBoxHeight * scaleFactor;
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
    const calcProps = {
        sx: {mt: 1,
            fontWeight: 'bold',
            textDecoration:'underline',
            fontStyle:'italic'
        }
    }
    const calcConvergence: (d: number) => {A: number, S1: number, S3: number} = (d) => {
        let S1Max: number = (1 / 3) * parseFloat(passivePressure) * d;
        let S3Max: number = parseFloat(passivePressure) * d;
        if(parseFloat(maxPressure) !== 0){
            S1Max = S1Max <= parseFloat(maxPressure) ? S1Max : parseFloat(maxPressure);
            S3Max = S3Max <= parseFloat(maxPressure) ? S3Max : parseFloat(maxPressure);
        }
        if(depthLimitation){
            S1Max = S1Max <= 12 * parseFloat(passivePressure) ? S1Max : 12 * parseFloat(passivePressure);
        }
        return {
            A: 2.34 * parseFloat(pointLoad)*1000 / (S1Max * parseFloat(diameter) / 12),
            S1: S1Max,
            S3: S3Max,
        }
    }
    const calcs = {
        b: parseFloat(diameter) / 12,
        d: parseFloat(depth) / 12,
        h: parseFloat(height),
        P: parseFloat(pointLoad) * 1000,
        q: parseFloat(passivePressure),
        Q: parseFloat(maxPressure),
        S1: calcConvergence(parseFloat(depth)).S1,
        S3: calcConvergence(parseFloat(depth)).S3,
        A: calcConvergence(parseFloat(depth)).A,
    }
    const labelLocationsPier = getLabelLocations(SvgProps, pierProps(SvgProps).pierSection)
    const labelLocationsLever = getLabelLocations(SvgProps, pierProps(SvgProps).lever)

    const convertToFtAndInches: (inchesTotal: number) => string = (inchesTotal) => {
        let totalFeet = inchesTotal / 12;
        let feet: number = Math.floor(totalFeet);
        let inches: number = Math.ceil((totalFeet - feet) * 12);
        if(inches === 12){
            feet += 1;
            inches = 0;
        }
        return `${feet}'-${inches}"`
    }

    return (
    <>
        <Divider/>
            <Box>
                <Typography variant='h1' align='center' sx={{fontSize: '3em'}}>Pier Foundation Depth</Typography>
            </Box>
        <Divider/>

        <Grid container>
            <Grid size={2}>
                <Stack>
                    {pierInput.map(field =>
                            <TextField sx={{mt:3}} {...field}/>
                    )}
                    <FormControl sx={{mt: 2}} disabled={depthLimitation}>
                        <Typography>
                            Constrained Condition?
                        </Typography>
                        <RadioGroup row value={constrained} onChange={event => handleConstrained(event)}>
                            <FormControlLabel value={false} control={<Radio size='small' />} label="no" />
                            <FormControlLabel value={true} control={<Radio size='small' />} label="yes" />
                        </RadioGroup>
                    </FormControl>
                    <FormControl sx={{mt: 1}}>
                        <Typography>
                            Apply 12ft limitation?
                        </Typography>
                        <RadioGroup row value={depthLimitation} onChange={event => handleDepthLimitation(event)}>
                            <FormControlLabel value={false} control={<Radio size='small' />} label="no" />
                            <FormControlLabel value={true} control={<Radio size='small' />} label="yes" />
                        </RadioGroup>
                    </FormControl>  
                    <Button sx={{mt:2}} variant="contained" onClick={handleCalcDepth} color={recalculate ? "error" : "success"}>{recalculate ? "Run Calculation" : "Calculated!"}</Button>
                </Stack>
            </Grid>
            <Grid size={5}>
                <svg {...SvgProps}>
                    {parseFloat(diameter) > 0
                        &&
                        <>
                            <Grade foundationProps={(pierProps(SvgProps).pierSection)}></Grade>
                            <text {...labelLocationsPier.bottom}>{diameter} in</text>
                            <text {...labelLocationsPier.perp}>{convertToFtAndInches(parseFloat(depth))}</text>
                            <rect {...(pierProps(SvgProps).pierSection)}></rect>
                            <rect {...(pierProps(SvgProps).lever)}></rect>
                            <text {...labelLocationsLever.perp}>{height} ft</text>
                            <text {...labelLocationsLever.title} fontSize={3}>Elevation View</text>
                            <PointLoadSection x={(pierProps(SvgProps).lever.y)} y={(pierProps(SvgProps).lever.x)} magnitude={parseFloat(pointLoad)} rotate={true}></PointLoadSection>
                        </>
                    }
                </svg>
            </Grid>
            <Grid size={5}>
                <svg {...SvgProps}>
                    {parseFloat(diameter) > 0
                        &&
                        <>
                            <circle cx={parseFloat(SvgProps.viewBox.split(' ')[2]) / 2} cy={parseFloat(SvgProps.viewBox.split(' ')[3]) / 2} r={parseFloat(diameter) / 2} fill='#949494ff' stroke='black' strokeWidth={0.1}></circle>
                            <text x={parseFloat(SvgProps.viewBox.split(' ')[2]) / 2} y={parseFloat(SvgProps.viewBox.split(' ')[3])/2 + parseFloat(diameter)/2 + 2} textAnchor='middle' fontSize={2}>Diameter = {diameter} in</text>
                            <text {...labelLocationsLever.title} fontSize={3}>Section View</text>
                        </>
                    }
                </svg> 
            </Grid>
        </Grid>

        {parseFloat(diameter) > 0
            &&
            <>                
                {/* CALCULATIONS SECTION */}
                <Divider sx={{mt: 3}}/>                
                <Box>
                    <Typography variant='h3' align='left' sx={{my: 2, fontSize: '2em'}}>Calculations</Typography>
                </Box>

                <Typography {...calcProps}>Foundation Properties</Typography>
                <Grid container>
                    <CalculationHeader/>
                    <CalculationLine name="diameter" variable="b" value={calcs.b} units='ft'/>
                    <CalculationLine name="embedment depth" variable="d" value={calcs.d} units='ft'/>
                    <CalculationLine name="point load height" variable="h" value={calcs.h} units='ft'/>
                    <CalculationLine name="applied point load" variable="P" value={calcs.P} units='lbf'/>
                    <CalculationLine name="allowable soil pressure" variable="q" value={calcs.q} units='psf/ft'/>
                    <CalculationLine name="max allowable soil pressure" variable="Q" value={calcs.Q} units='psf'/>
                    <CalculationLine name="soil pressure @ 1/3 depth" variable="S1" value={calcs.S1} units='psf' formula='1/3 * q * d'/>
                    <CalculationLine name="factor" variable="A" value={calcs.A} units='ft' formula='2.34 * P / (S1 * b)'/>
                </Grid>
            </>
        }
    </>
    )
}

export default Pier
