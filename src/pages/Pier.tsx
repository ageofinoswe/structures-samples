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
    // point load, height, diameter, passivePressure, maxPressure, depth, recalculate, constraint, depth limitation
    const [pointLoad, setPointLoad] = React.useState('0');
    const [height, setHeight] = React.useState('0');
    const [diameter, setDiameter] = React.useState('0');
    const [passivePressure, setPassivePressure] = React.useState('0');
    const [maxPressure, setMaxPressure] = React.useState('0');
    const [depth, setDepth] = React.useState('72');
    const [recalculate, setRecalculate] = React.useState(true);             // if any state changes - recalculation is needed
    const [constrained, setConstrained] = React.useState(false);            // pier is constrained at the top per IBC
    const [depthLimitation, setDepthLimitation] = React.useState(false);    // 12 ft max limitation per IBC

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
    // updates whether the pier is contrained and/or has the 12ft lateral pressure limitation per IBC
    const handleConstrained: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void = (event) => {
        if(event.target.value === 'true'){
            setConstrained(true);
            setDepthLimitation(false);
        }
        else
            setConstrained(false);
        setRecalculate(true);
    }
    const handleDepthLimitation: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void = (event) => {
        if(event.target.value === 'true')
            setDepthLimitation(true);
        else
            setDepthLimitation(false);
        setRecalculate(true);
    }
    // updates the pier depth based on the input and constraint/limitations
    const handleCalcDepth: () => void = () => {
        // convergence tolerance between depth (left-hand-side) and right-hand-side calc per IBC
        const delta = 0.25;
        // increase depth by 0.1ft, allow 1000 iterations (up to 100 ft for convergence)
        const increment = 0.1;
        let iterationBoundary = 10000;
        let converged: boolean = false
        // not constrained; IBC 1807.3.2.1
        if(!constrained && diameter !== '0' && passivePressure !== '0'){
            for(let calcDepth = 0 ; calcDepth < iterationBoundary && !converged ; calcDepth += increment){
                let rhs = 0.5 * calcConvergence(calcDepth).A * (1 + Math.sqrt(1 + (4.36*calcs.h / calcConvergence(calcDepth).A)));
                if(Math.abs(calcDepth-rhs) <= delta){
                    converged = true;
                    setDepth((rhs*12).toString());
                }
            }
            setRecalculate(false);
        }
        // constrained; IBC 1807.3.2.2
        else if (constrained && diameter !== '0' && passivePressure !== '0') {
            for(let calcDepth = 0 ; calcDepth < iterationBoundary && !converged ; calcDepth += increment){
                let rhs = Math.sqrt((4.25 * calcs.P * calcs.h) / (calcConvergence(calcDepth).S3 * calcs.b));
                if(Math.abs(calcDepth-rhs) <= delta){
                    converged = true;
                    setDepth((rhs*12).toString());
                }
            }
            setRecalculate(false);            
        }
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
    // generates a rectangle with svg properties based on the SvgProps provided and type of pier dimensions input
    // this will center the pier svg within the viewbox, along with a lever for the point load application
    const pierProps: (svgProps: SvgProps) => {lever: SvgRectProps, pierElevation: SvgRectProps} = (svgProps) => {
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
        const pierElevation: SvgRectProps = {
            x: coordX,
            y: coordY,
            width: rectWidth,
            height: rectHeight,
            fill: '#949494ff',
            stroke: 'black',
            'strokeWidth': 0.1
        }; 
        return {lever: lever, pierElevation: pierElevation};
    }
    // calculates the necessary right-hand-side variables (A, S1, S3) based on the depth provided (in ft)
    // reference IBC 1807.3.2
    const calcConvergence: (d: number) => {A: number, S1: number, S3: number} = (d) => {
        // S1 is for nonconstrained, S3 is for constrained
        let S1Max: number = (1 / 3) * parseFloat(passivePressure) * d;
        let S3Max: number = parseFloat(passivePressure) * d;
        // limit the lateral soil pressure if a value is provided
        if(parseFloat(maxPressure) !== 0){
            S1Max = S1Max <= parseFloat(maxPressure) ? S1Max : parseFloat(maxPressure);
            S3Max = S3Max <= parseFloat(maxPressure) ? S3Max : parseFloat(maxPressure);
        }
        // if depth limitation is required, limit S1 for nonconstrained
        // reference IBC 1807.3.2.1
        if(depthLimitation){
            S1Max = S1Max <= 12 * parseFloat(passivePressure) ? S1Max : 12 * parseFloat(passivePressure);
        }
        return {
            A: 2.34 * parseFloat(pointLoad)*1000 / (S1Max * parseFloat(diameter) / 12),
            S1: S1Max,
            S3: S3Max,
        }
    }
    // calculate pier input dimensions and parameters
    const calcs = {
        b: parseFloat(diameter) / 12,       // diameter, ft
        d: parseFloat(depth) / 12,          // depth, ft
        h: parseFloat(height),              // height, ft
        P: parseFloat(pointLoad) * 1000,    // point load, kips
        q: parseFloat(passivePressure),     // passive pressure, psf/ft
        Q: (depthLimitation                 // max passive pressure, psf - min of input and 12ft limitation
            ? Math.min(parseFloat(maxPressure), 12 * parseFloat(passivePressure))
            : parseFloat(maxPressure)),
        S1: calcConvergence(parseFloat(depth) / 12).S1,
        S3: calcConvergence(parseFloat(depth) / 12).S3,
        A: calcConvergence(parseFloat(depth) / 12).A,
    }
    // takes in a value in inches and converts it to ft'-inches" (62 --> 5'-2")
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
    // location of labels for the svg
    const labelLocationsPier = getLabelLocations(SvgProps, pierProps(SvgProps).pierElevation)
    const labelLocationsLever = getLabelLocations(SvgProps, pierProps(SvgProps).lever)

    return (
    <>
        {/* TITLE */}
        <Divider/>
            <Box>
                <Typography variant='h1' align='center' sx={{fontSize: '3em'}}>Pier Foundation Depth</Typography>
            </Box>
        <Divider/>

        {/* INPUT FIELDS: point load, height, diameter, soil pressures, conditions and limitations*/}
        <Grid container>
            <Grid size={2}>
                <Stack>
                    {/* point load, height, diameter, depth, soil pressures*/}
                    {pierInput.map(field =>
                            <TextField key={field.label} sx={{mt:3}} {...field}/>
                    )}
                    {/* constrained condition */}
                    <FormControl sx={{mt: 2}}>
                        <Typography>
                            Constrained Condition?
                        </Typography>
                        <RadioGroup row value={constrained} onChange={event => handleConstrained(event)}>
                            <FormControlLabel value={false} control={<Radio size='small' />} label="no" />
                            <FormControlLabel value={true} control={<Radio size='small' />} label="yes" />
                        </RadioGroup>
                    </FormControl>
                    {/* 12ft depth limitation */}
                    <FormControl sx={{mt: 1}} disabled={constrained}>
                        <Typography>
                            Apply 12ft limitation?
                        </Typography>
                        <RadioGroup row value={depthLimitation} onChange={event => handleDepthLimitation(event)}>
                            <FormControlLabel value={false} control={<Radio size='small' />} label="no" />
                            <FormControlLabel value={true} control={<Radio size='small' />} label="yes" />
                        </RadioGroup>
                    </FormControl>
                    {/* recalculate depth if any variables change */}  
                    <Button sx={{mt:2}} variant="contained" onClick={handleCalcDepth} color={recalculate ? "error" : "success"}>{recalculate ? "Recalculation Needed!" : "Calculated!"}</Button>
                </Stack>
            </Grid>
            {/* PIER AND LEVER SVG DRAWINGS */}
            <Grid size={5}>
                {/* pier elevation svg drawing and lever svg drawing*/}
                <svg {...SvgProps}>
                    {parseFloat(diameter) > 0
                        &&
                        <>
                            <rect {...(pierProps(SvgProps).pierElevation)}></rect>
                            <Grade foundationProps={(pierProps(SvgProps).pierElevation)}></Grade>
                            <text {...labelLocationsPier.bottom}>{diameter} in</text>
                            <text {...labelLocationsPier.perp}>{convertToFtAndInches(parseFloat(depth))}</text>
                            <rect {...(pierProps(SvgProps).lever)}></rect>
                            <text {...labelLocationsLever.perp}>{height} ft</text>
                            <text {...labelLocationsLever.title} fontSize={3}>Elevation View</text>
                            <PointLoadSection x={(pierProps(SvgProps).lever.y)} y={(pierProps(SvgProps).lever.x)} magnitude={parseFloat(pointLoad)} rotate={true}></PointLoadSection>
                        </>
                    }
                </svg>
            </Grid>
            <Grid size={5}>
                {/* pier section svg drawings */}
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

        {/* render only if a diameter is provided */}
        {parseFloat(diameter) > 0
            &&
            <>                
                {/* CALCULATIONS SECTION */}
                {/* TITLE */}
                <Divider sx={{mt: 3}}/>                
                <Box>
                    {/* provide ibc reference to equations */}
                    <Typography variant='h3' align='left' sx={{my: 2, fontSize: '2em'}}>Calculations <a href='https://codes.iccsafe.org/content/IBC2024V1.0/chapter-18-soils-and-foundations#IBC2024V1.0_Ch18_Sec1807.3' target='_blank'>(reference IBC)</a></Typography>
                </Box>

                {/* APPLIED LOADS */}
                <Typography {...calcProps}>Applied Loads</Typography>
                <Grid container>
                    <CalculationHeader/>
                    <CalculationLine name="point load" variable="P" value={calcs.P} units='lbf'/>
                    <CalculationLine name="point load height" variable="h" value={calcs.h} units='ft'/>
                    <CalculationLine name="moment at toc" variable="Mg" value={calcs.P * calcs.h} units='lbf-ft' formula='P * h'/>
                </Grid>
                {/* PIER PROPERTIES */}
                <Typography {...calcProps}>Pier Properties</Typography>
                <Grid container>
                    <CalculationHeader/>
                    <CalculationLine name="diameter" variable="b" value={calcs.b} units='ft'/>
                    <CalculationLine name="cross sectional area" variable="ar" value={Math.PI * calcs.b * calcs.b / 4} units='ft^2' formula='3.14 * b^2 / 4'/>
                    {/* display equation depending if constrained or nonconstrained, provide ibc reference */}
                    <CalculationLine name="embedment depth" variable="d" value={calcs.d} units='ft'
                        formula={!constrained ? '0.5 * A * {1 + [1 + (4.36 * h / A)]^0.5}' : '[(4.25 * Mg) / (S3 * b)]^0.5'}
                        message={{msg: `Reference: IBC ${!constrained ? '1807.3.2.1' : '1807.3.2.2'}`}}/>
                </Grid>
                {/* SOIL PRESSURES */}
                <Typography {...calcProps}>Soil Pressures</Typography>
                <Grid container>
                    <CalculationHeader/>
                    <CalculationLine name="allowable soil pressure" variable="q" value={calcs.q} units='psf/ft'/>
                    <CalculationLine name="max allowable soil pressure" variable="Q" value={calcs.Q} units='psf'/>
                    {/* display equation depending if constrained or nonconstrained, provide ibc reference */}
                    {!constrained &&
                        <>
                            <CalculationLine name="soil pressure @ 1/3 depth" variable="S1" value={calcs.S1} units='psf' formula={`1/3 * q * d ${'\u2264'} Q`} message={{msg: `Reference: IBC ${!constrained ? '1807.3.2.1' : '1807.3.2.2'}`}}/>
                            <CalculationLine name="intermediate value" variable="A" value={calcs.A} units='ft' formula='2.34 * P / (S1 * b)' message={{msg: `Reference: IBC ${!constrained ? '1807.3.2.1' : '1807.3.2.2'}`}}/>
                        </>
                    }
                    {constrained &&
                        <>
                            <CalculationLine name="soil pressure @ full depth" variable="S3" value={calcs.S3} units='psf' formula='q * d' message={{msg: `Reference: IBC ${!constrained ? '1807.3.2.1' : '1807.3.2.2'}`}}/>
                        </>
                    }
                </Grid>
            </>
        }
    </>
    )
}

export default Pier
