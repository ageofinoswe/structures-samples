import { Box, Divider, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, Stack, TextField, Typography } from "@mui/material"
import React from "react";
import PointLoadPlan from "../components/PointLoadPlan";
import OriginAxis from "../components/OriginAxis";
import PointLoadSection from "../components/PointLoadSection";
import MomentSection from "../components/MomentSection";
import MomentPlan from "../components/MomentPlan";
import CalculationLine from "../components/CalculationLine";
import CalculationHeader from "../components/CalculationHeader";
import SoilBearingPressure from "../components/SoilBearingPressure";
import CenterAxis from "../components/CenterAxis";
import Grade from "../components/Grade";
import PlusOrMinus from "../components/PlusOrMinus";


// TYPES
// foundation orientations is used to decide which graphic/drawing is being used
type FoundationOrientations = 'plan' | 'planRotated' | 'section' | 'sectionRotated';
// moment fields is used to determine which moment input field is being used 
type MomentFields = 'kipft' | 'B' | 'L';
// points load fields is used to determine which point load input field is being used
type PointLoadFields = 'kips' | 'B' | 'L';

// INTERFACES
// text input props is used to specify the text input properties
interface TextInputProps {
    id?: string,
    sx?: {},
    label?: string,
    defaultValue?: number,
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
// point load is used to specify the properties of the point load being input
interface PointLoad {
    kips: number,
    coordB: number,
    coordL: number,
}
// moment is used to specify the properties of the moment being input
interface Moment {
    kipft: number,
    coordB: number,
    coordL: number,
}



function Foundation() {
    // STATE VARIABLES
    // foundation width, height, thickness, density, and center
    const [fdnWidth, setFdnWidth] = React.useState(0);
    const [fdnHeight, setFdnHeight] = React.useState(0);
    const [fdnThickness, setFdnThickness] = React.useState(0);
    const [fdnDensity, setFdnDensity] = React.useState(0.145);
    const [fdnCenter, setFdnCenter] = React.useState([0,0]);
    // point load and moment
    const [pointLoad, setPointLoad] = React.useState<PointLoad>({kips: 0, coordB: 0, coordL: 0});
    const [moment, setMoment] = React.useState<Moment>({kipft: 0, coordB: 0, coordL: 0});
    // eccentricity, must be along B or along L
    const [eccentricityDirection, setEccentricityDirection] = React.useState<'B' | 'L'>('B');

    // STATE HANDLERS
    // updates foundation width, and sets the foundation center
    const handleFdnWidthChange: (event: React.ChangeEvent<HTMLInputElement>) => void = (event) => {
        setFdnWidth(parseInt(event.target.value));
        setFdnCenter([parseInt(event.target.value) / 2, fdnCenter[1]]);
    }
    // updates the foundation height, and sets the foundation center
    const handleFdnHeightChange: (event: React.ChangeEvent<HTMLInputElement>) => void = (event) => {
        setFdnHeight(parseInt(event.target.value));
        setFdnCenter([fdnCenter[0], parseInt(event.target.value) / 2]);
    }
    // updates the foundation thickness
    const handleFdnThicknessChange: (event: React.ChangeEvent<HTMLInputElement>) => void = (event) => {
        setFdnThickness(parseInt(event.target.value));
    }
    // verifies and updates the point load
    const handleModifyPointLoad: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: PointLoadFields) => void = (event, field) => {
        // verify a number is input
        const newValue: number = isNaN(parseInt(event.target.value)) ? 0 : parseInt(event.target.value);
        const modifiedPointLoads: PointLoad = 
            {...pointLoad,
                kips: field === 'kips' ? newValue : pointLoad.kips,
                coordB: field === 'B' ? newValue : pointLoad.coordB,
                coordL: field === 'L' ? newValue : pointLoad.coordL,
            };
        // verify that the B and L value does not exceed half the foundation width/height (out of bounds / invalid)
        // field='kips' does not require verification
        if((field === 'B' && newValue <= fdnCenter[0]) || (field === 'L' && newValue <= fdnCenter[1]) || field === 'kips')
            setPointLoad(modifiedPointLoads);
    }
    // verifies and updates the moment
    const handleModifyMoment: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: MomentFields) => void = (event, field) => {
        // verify a number is input
        const newValue: number = isNaN(parseInt(event.target.value)) ? 0 : parseInt(event.target.value);
        const modifiedMoments: Moment =
            {...moment,
                kipft: field === 'kipft' ? newValue : moment.kipft,
                coordB: field === 'B' ? newValue : moment.coordB,
                coordL: field === 'L' ? newValue : moment.coordL,
            };
        // verify that the B and L value does not exceed half the foundation width/height (out of bounds / invalid)
        // field='kipft' does not require verification
        if((field === 'B' && newValue <= fdnCenter[0]) || (field === 'L' && newValue <= fdnCenter[1]) || field === 'kipft')
            setMoment(modifiedMoments);
    }
    // updates the eccentricity direction
    const handleEccentricityDirection: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void = (event) => {
        // L --> B, zero out the value in L 
        if(event.target.value === 'B'){
            setPointLoad({...pointLoad, coordL: 0})
            setMoment({...moment, coordL: 0})
        }
        // B --> L, zero out the value in B
        else{
            setPointLoad({...pointLoad, coordB: 0})
            setMoment({...moment, coordB: 0})
        }
        // update the eccentricity direction
        setEccentricityDirection(event.target.value as 'B' | 'L');
    }

    // FUNCTIONS
    // used to switch between +/- in user inputs for the point load fields
    const negatePointLoad: (event: any, field: string) => void = (event, field) => {
        const modifiedPointLoads: PointLoad = 
            {...pointLoad,
                kips: field === 'kips' ? pointLoad.kips * -1 : pointLoad.kips,
                coordB: field === 'B' ? pointLoad.coordB * -1 : pointLoad.coordB,
                coordL: field === 'L' ? pointLoad.coordL * -1 : pointLoad.coordL,
            };
        setPointLoad(modifiedPointLoads);
    }
    // used to switch between +/- in user inputs for the moment fields
    const negateMoment: (event: any, field: string) => void = (event, field) => {
        const modifiedMoment: Moment = 
            {...moment,
                kipft: field === 'kipft' ? moment.kipft * -1 : moment.kipft,
                coordB: field === 'B' ? moment.coordB * -1 : moment.coordB,
                coordL: field === 'L' ? moment.coordL * -1 : moment.coordL,
            };
        setMoment(modifiedMoment);
    }
    // generates a rectangle with svg properties based on the SvgProps provided and type of foundation desired
    // this will center the rectangle svg within the viewbox
    const foundationProps: (svgProps: SvgProps, type: FoundationOrientations) => SvgRectProps = (svgProps, type) => {
        const viewBox: number[] = svgProps.viewBox.split(' ').map( (index: string) => Number.parseInt(index));
        const viewBoxWidth: number = viewBox[2];
        const viewBoxHeight: number = viewBox[3];

        const rectWidth: number = (type === 'plan' || type === 'section') ? fdnWidth : fdnHeight;
        const rectHeight: number = (type === 'plan') ? fdnHeight : (type === 'planRotated') ? fdnWidth : fdnThickness / 12;
        const coordX: number = ((viewBoxWidth - rectWidth) / 2);
        const coordY: number = ((viewBoxHeight - rectHeight) / 2);

        const fdnProps: SvgRectProps = {
            x: coordX,
            y: coordY,
            width: rectWidth,
            height: rectHeight,
            fill: '#949494ff',
            stroke: 'black',
            'strokeWidth': 0.1
        }; 
        return fdnProps;
    }
    // determines the origin of a foundation drawing (bottom left for plan, top left for plan rotated, section, and section rotated)
    const getOrigin: (svgProps: SvgProps, type: FoundationOrientations) => [number, number] = (svgProps, type) => {
        const fdnProps: SvgRectProps = foundationProps(svgProps, type);
        const origin: [number, number] = (type === 'plan') ? [fdnProps.x, fdnProps.y + fdnHeight] : [fdnProps.x, fdnProps.y];
        return origin;
    }
    // determines the coordinates of foundation labeling (bottom of foundation, right side of foundation, and title below foundation)
    const getLabelLocations: (svgProps: SvgProps, fdnProps: SvgRectProps) => {bottom: SvgTextProps, perp: SvgTextProps, title: SvgTextProps} = (svgProps, fdnProps) => {
        const textAnchor: string = 'middle';
        const dominantBaseline: string = 'middle';
        const fontSize: number = 2;
        const offsetX: number = 0;
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

    // CONSTANTS
    // used to generate dimension input fields for the foundation
    const dimensionInput: TextInputProps[] = [
        {label: 'Width, ft (B)', defaultValue: 0, size: 'small', variant: 'standard', onChange: handleFdnWidthChange},
        {label: 'Length, ft (L)', defaultValue: 0, size: 'small', variant: 'standard', onChange: handleFdnHeightChange},
        {label: 'Thickness, in (t)', defaultValue: 0, size: 'small', variant: 'standard', onChange: handleFdnThicknessChange},
    ];
    // used to populate the labels for the point load and moment input fields
    const pointLoadTextInputFields: PointLoadFields[] = ['kips', 'B', 'L'];
    const momentTextInputFields: MomentFields[] = ['kipft', 'B', 'L'];
    // svg properties to be used to draw the foundations
    const SvgProps: SvgProps = {
        viewBox: '0 0 75 45',
        width: '50vw',
        height: '30vw',
    }
    // foundation origins
    const planOrigin = getOrigin(SvgProps, 'plan');                                                     // plan, bottom left
    const planRotatedOrigin = getOrigin(SvgProps, 'planRotated');                                       // plan rotated, top left
    const sectionOrigin = getOrigin(SvgProps, 'section');                                               // section, top left
    const sectionRotatedOrigin = getOrigin(SvgProps, 'sectionRotated');                                 // section rotated, top left
    // foundation svg properties
    const foundationPropsPlan = foundationProps(SvgProps, 'plan');                                      // plan
    const foundationPropsPlanRotated = foundationProps(SvgProps, 'planRotated');                        // plan rotated
    const foundationPropsSection = foundationProps(SvgProps, 'section');                                // section
    const foundationPropsSectionRotated = foundationProps(SvgProps, 'sectionRotated');                  // section rotated
    // foundation label locations
    const labelLocationsPlan = getLabelLocations(SvgProps, foundationPropsPlan)                         // plan
    const labelLocationsPlanRotated = getLabelLocations(SvgProps, foundationPropsPlanRotated)           // plan rotated
    const labelLocationsSection = getLabelLocations(SvgProps, foundationPropsSection)                   // section
    const labelLocationsSectionRotated = getLabelLocations(SvgProps, foundationPropsSectionRotated)     // section rotated

    // CALCULATIONS
    // calculation section header properties
    const calcProps = {
        sx: {mt: 1,
            fontWeight: 'bold',
            textDecoration:'underline',
            fontStyle:'italic'
        }
    }
    // foundation calculations, point load and moment properties aggregation
    const calculations = {
        foundation: {
            width: fdnWidth,
            height: fdnHeight,
            thickness: fdnThickness,
            area: fdnWidth * fdnHeight,
            density: fdnDensity,
            weight: fdnWidth * fdnHeight * fdnThickness / 12 * fdnDensity,
            // section modulus
            sbb: fdnHeight * fdnWidth * fdnWidth / 6,
            sll: fdnWidth * fdnHeight * fdnHeight / 6
        },
        pointLoad: {
            magnitude: pointLoad.kips,
            eB: pointLoad.coordB,
            eL: pointLoad.coordL,
            mB: pointLoad.kips * pointLoad.coordB,
            mL: pointLoad.kips * pointLoad.coordL,
            along: eccentricityDirection === 'B' ? 'B-B' : 'L-L',
        },
        moment: {
            mB: eccentricityDirection === 'B' ? moment.kipft : 0,
            mL: eccentricityDirection === 'L' ? moment.kipft : 0,
            eB: moment.coordB,
            eL: moment.coordL,
            along: eccentricityDirection === 'B' ? 'B-B' : 'L-L',
        },
    }
    // summations for vertical loads (P) and moment + eccentric moments from point load
    const calculationsSums = {
        sumP: calculations.foundation.weight + calculations.pointLoad.magnitude,
        sumMbb: calculations.pointLoad.mB + calculations.moment.mB,
        sumMll: calculations.pointLoad.mL + calculations.moment.mL,
    }
    // calculations for a trapezoidal soil bearing pressure
    // determine the effective width and length as well if a triangular soil bearing pressure is determined
    const calculationsPressuresTrapezoid = {
        // P/A +/- M/S
        bb: {
            qmax: (calculationsSums.sumP) / calculations.foundation.area + (calculationsSums.sumMbb) / calculations.foundation.sbb,
            qmin: (calculationsSums.sumP) / calculations.foundation.area - (calculationsSums.sumMbb) / calculations.foundation.sbb
        },
        ll: {
            qmax: (calculationsSums.sumP) / calculations.foundation.area + (calculationsSums.sumMll) / calculations.foundation.sll,
            qmin: (calculationsSums.sumP) / calculations.foundation.area - (calculationsSums.sumMll) / calculations.foundation.sll
        },
        // 3 * (x/2 - M / sumP)
        beff: eccentricityDirection === 'L' ? calculations.foundation.width : 3*(calculations.foundation.width/2 - (Math.abs(calculationsSums.sumMbb))/(calculationsSums.sumP)),
        leff: eccentricityDirection === 'B' ? calculations.foundation.height : 3*(calculations.foundation.height/2 - (Math.abs(calculationsSums.sumMll))/(calculationsSums.sumP)),
    }
    // calculations for a triangular soil bearing pressure, using the previously calculated efftive width and length
    const calculationsPressuresTriangular = {
        // 2*sumP / (Leff * Beff)
        bb: {
            qmax: 2*calculationsSums.sumP / (calculations.foundation.height * calculationsPressuresTrapezoid.beff),
            qmin: 0,
        },
        ll: {
            qmax: 2*calculationsSums.sumP / (calculations.foundation.width * calculationsPressuresTrapezoid.leff),
            qmin: 0,
        }
    }

    return (
        <>  
            {/* TITLE */}
            <Divider />
            <Box>
                <Typography variant='h1' align='center' sx={{fontSize: '3em'}}>Foundation Bearing Pressure</Typography>
            </Box>
            <Divider />

            {/* INPUT FIELDS: dimensions, point loads, moments*/}
            <Grid container sx={{py: 1}} spacing={20}>
                {/* dimensions */}
                <Grid size={3}>
                    <Stack>          
                        <Typography variant='subtitle1'>Dimensions</Typography>
                        {dimensionInput.map(textInputProps => 
                            <TextField {...textInputProps}/>
                        )}
                    </Stack>
                </Grid>

                {/* point loads */}
                <Grid size={4}>
                    <Stack>
                        <FormControl sx={{mb: 1}}>
                            <Typography>
                                Eccentricity Along?
                            </Typography>
                                <RadioGroup row value={eccentricityDirection} onChange={event => handleEccentricityDirection(event)}>
                                    <FormControlLabel value={'B'} control={<Radio size='small' />} label="B" />
                                    <FormControlLabel value={'L'} control={<Radio size='small' />} label="L" />
                                </RadioGroup>
                            </FormControl>         
                        <Typography variant='subtitle1'>Point Loads</Typography>
                            <Box display='flex' alignItems='center'>
                                {pointLoadTextInputFields.map(field => 
                                    <>
                                        {/* plus is active/selected if magnitude is >= 0, attach negate function to button */}
                                        <PlusOrMinus active={field === 'kips' ? pointLoad.kips >= 0 : field === 'B' ? pointLoad.coordB >= 0 : pointLoad.coordL >= 0} field={field} negate={negatePointLoad}></PlusOrMinus>
                                        {/* disable opposite eccentricity direction */}
                                        <TextField
                                                disabled={field !== 'kips' && eccentricityDirection !== field}
                                                sx={{pr:3}}
                                                label={field === 'kips' ? field : field + ', ft'}
                                                value={field === 'kips' ? pointLoad.kips : field === 'B' ? pointLoad.coordB : pointLoad.coordL}
                                                size='small'
                                                variant='standard'
                                                onChange={event => handleModifyPointLoad(event, field)}/>
                                    </>
                                )}
                            </Box>
                    </Stack>
                </Grid>

                {/* moments */}
                <Grid size={5}>
                    <Stack>
                        {/* disable these radio buttons as they are controlled by the 'eccentricity along' button group from the point load */}
                        <FormControl disabled={true} sx={{mb: 1}}>
                            <FormLabel>
                                Along
                            </FormLabel>
                            <RadioGroup row value={eccentricityDirection}>
                                <FormControlLabel value={'B'} control={<Radio size='small' />} label="B" />
                                <FormControlLabel value={'L'} control={<Radio size='small' />} label="L" />
                            </RadioGroup>
                        </FormControl>          
                        <Typography variant='subtitle1'>Moment</Typography>
                            <Box alignItems='center' display='flex'>
                                {momentTextInputFields.map(field =>
                                <>
                                    {/* plus is active/selected if magnitude is >= 0, attach negate function to button */}
                                    <PlusOrMinus active={field === 'kipft' ? moment.kipft >= 0 : field === 'B' ? moment.coordB >= 0 : moment.coordL >= 0} field={field} negate={negateMoment}></PlusOrMinus>
                                    {/* disable opposite eccentricity direction */}
                                    <TextField
                                        disabled={field !== 'kipft' && eccentricityDirection !== field}
                                        sx={{pr:3}}
                                        label={field === 'kipft' ? 'kip-ft' : field + ', ft'}
                                        value={field === 'kipft' ? moment.kipft : field === 'B' ? moment.coordB : moment.coordL}
                                        size='small'
                                        variant='standard'
                                        onChange={event => handleModifyMoment(event, field)}/>
                                </>
                                )}
                            </Box>
                    </Stack>
                </Grid>
            </Grid>

            {/* FOUNDATION DRAWINGS AND CALCULATIONS */}
            {/* only render foundation drawings and calculations if foundation dimensions have been input */}
            {!isNaN(fdnWidth) && fdnWidth > 0 && !isNaN(fdnHeight) && fdnHeight > 0 && !isNaN(fdnThickness) && fdnThickness > 0
                &&
                <>
                    {/* TITLE */}
                    <Divider />
                    <Box>
                        <Typography variant='h2' align='center' sx={{mt: 2,fontSize: '2em'}}>Foundation and Applied Loads</Typography>
                    </Box>
                    {/* FOUNDATION PLANS */}
                    <Box display='flex' sx={{justifyContent: 'center'}}>
                        {/* foundation plan drawing */}
                        <svg {...SvgProps}>
                            <rect {...(foundationPropsPlan)}/>
                            <CenterAxis foundationProps={foundationPropsPlan}></CenterAxis>
                            <OriginAxis origin={planOrigin}></OriginAxis>
                            <text {...labelLocationsPlan.title}>Foundation Plan</text>
                            <PointLoadPlan x={planOrigin[0] + pointLoad.coordB + fdnCenter[0]} y={planOrigin[1] - pointLoad.coordL - fdnCenter[1]} magnitude={pointLoad.kips}/>
                            <MomentPlan x={planOrigin[0] + moment.coordB + fdnCenter[0]} y={planOrigin[1] - moment.coordL - fdnCenter[1]} magnitude={moment.kipft} along={eccentricityDirection}/>
                        </svg>
                        {/* foundation plan rotated drawing */}
                        <svg {...SvgProps}>
                            <rect {...(foundationPropsPlanRotated)}/>
                            <CenterAxis foundationProps={foundationPropsPlanRotated}></CenterAxis>
                            <OriginAxis origin={planRotatedOrigin} rotate={true}></OriginAxis>
                            <text {...labelLocationsPlanRotated.title}>Foundation Plan</text>
                            <PointLoadPlan x={planRotatedOrigin[0] + pointLoad.coordL + fdnCenter[1]} y={planRotatedOrigin[1] + pointLoad.coordB + fdnCenter[0]} magnitude={pointLoad.kips}/>
                            <MomentPlan x={planRotatedOrigin[0] + moment.coordL + fdnCenter[1]} y={planRotatedOrigin[1] + moment.coordB + fdnCenter[0]} magnitude={moment.kipft} along={eccentricityDirection} rotate={true}/>
                        </svg>
                    </Box>
                    {/* FOUNDATION SECTIONS */}
                    <Box display='flex' sx={{justifyContent: 'center'}}>
                        {/* foundation section drawing */}
                        <svg {...SvgProps}>
                            <rect {...(foundationPropsSection)}/>
                            <Grade foundationProps={foundationPropsSection}></Grade>
                            <text {...labelLocationsSection.bottom}>B-B</text>
                            <text {...labelLocationsSection.perp}>t</text>
                            <text {...labelLocationsSection.title}>Foundation Section</text>
                            <PointLoadSection x={sectionOrigin[0] + pointLoad.coordB + fdnCenter[0]} y={sectionOrigin[1]} magnitude={pointLoad.kips}/>
                            {/* only render the moment if it is in-plane */}
                            {eccentricityDirection === 'B' && <MomentSection x={sectionOrigin[0] + moment.coordB + fdnCenter[0]} y={sectionOrigin[1]} magnitude={moment.kipft}/>}
                        </svg>
                        {/* foundation section rotated drawing */}
                        <svg {...SvgProps}>
                            <rect {...(foundationPropsSectionRotated)}/>
                            <Grade foundationProps={foundationPropsSectionRotated}></Grade>
                            <text {...labelLocationsSectionRotated.bottom}>L-L</text>
                            <text {...labelLocationsSectionRotated.perp}>t</text>
                            <text {...labelLocationsSectionRotated.title}>Foundation Section</text>
                            <PointLoadSection x={sectionRotatedOrigin[0] + pointLoad.coordL + fdnCenter[0]} y={sectionOrigin[1]} magnitude={pointLoad.kips}/>
                            {/* only render the moment if it is in-plane */}
                            {eccentricityDirection === 'L' && <MomentSection x={sectionRotatedOrigin[0] + moment.coordL + fdnCenter[0]} y={sectionRotatedOrigin[1]} magnitude={moment.kipft}/>}
                        </svg>
                    </Box>

                    <Divider sx={{mt: 3}} />
                    
                    {/* CALCULATIONS SECTION */}
                    <Box>
                        <Typography variant='h3' align='left' sx={{my: 2, fontSize: '2em'}}>Calculations</Typography>
                    </Box>

                    {/* calcs: foundation properties */}
                    <Typography {...calcProps}>Foundation Properties</Typography>
                    <Grid container>
                        <CalculationHeader/>
                        <CalculationLine name="width" variable="B" value={calculations.foundation.width} units='ft'/>
                        <CalculationLine name="length" variable="L" value={calculations.foundation.height} units='ft'/>
                        <CalculationLine name="thickness" variable="t" value={calculations.foundation.thickness} units='in'/>
                        <CalculationLine name="density" variable={'\u03B3'} value={calculations.foundation.density} units='kcf'/>
                        <CalculationLine name="weight" variable="w" value={calculations.foundation.weight} units='kips' formula={`B * L * t * ${'\u03B3'}`}/>
                    </Grid>
                    {/* calcs: point load */}
                    <Typography {...calcProps}>Applied Point Load</Typography>
                    <Grid container>
                        <CalculationHeader/>
                        <CalculationLine name="point load" variable="P" value={calculations.pointLoad.magnitude} units='kips'/>
                        <CalculationLine name="ecc. along B" variable="Ep_b" value={calculations.pointLoad.eB} units='ft'/>
                        <CalculationLine name="ecc. along L" variable="Ep_l" value={calculations.pointLoad.eL} units='ft'/>
                        <CalculationLine name="ecc. moment along B" variable="EMp_b" value={calculations.pointLoad.mB} units='kip-ft' formula='P * Ep_b'/>
                        <CalculationLine name="ecc. moment along L" variable="EMp_l" value={calculations.pointLoad.mL} units='kip-ft' formula='P * Ep_l'/>
                    </Grid>
                    {/* calcs: moment */}
                    <Typography {...calcProps}>Applied Moment</Typography>
                    <Grid container>
                        <CalculationHeader/>
                        <CalculationLine name="moment" variable="M_b" value={calculations.moment.mB} units='kip-ft'/>
                        <CalculationLine name="moment" variable="M_l" value={calculations.moment.mL} units='kip-ft'/>
                        <CalculationLine name="along" variable={calculations.moment.along} value={'-'} units='-'/>
                        <CalculationLine name="ecc. along B" variable="Em_b" value={calculations.moment.eB} units='ft'/>
                        <CalculationLine name="ecc. along L" variable="Em_l" value={calculations.moment.eL} units='ft'/>
                    </Grid>
                    {/* calcs: summations */}
                    <Typography {...calcProps}>Summations</Typography>
                    <Grid container>
                        <CalculationHeader/>
                        <CalculationLine name="sum vertical load" variable="Pt" value={calculationsSums.sumP} units='kips' formula='w + P'/>
                        <CalculationLine name="sum moment along B" variable="Mt_bb" value={calculationsSums.sumMbb} units='kip-ft' formula={'EMp_b + M_b'}/>
                        <CalculationLine name="sum moment along L" variable="Mt_ll" value={calculationsSums.sumMll} units='kip-ft' formula={'EMp_l + M_l'}/>
                    </Grid>
                    {/* calcs: soil bearing pressures */}
                    <Typography {...calcProps}>Soil Bearing Pressures</Typography>
                    <Grid container>
                        <CalculationHeader/>
                        <CalculationLine name="sum vertical load" variable="Pt" value={calculationsSums.sumP} units='kips' formula='w + P'/>
                        <CalculationLine name="foundation area" variable="A" value={calculations.foundation.area} units='ft^2' formula='B * L'/>
                        <CalculationLine name="moment along B" variable="Mt_bb" value={calculationsSums.sumMbb} units='kip-ft' formula={'EMp_b + M_b'}/>
                        <CalculationLine name="moment along L" variable="Mt_ll" value={calculationsSums.sumMll} units='kip-ft' formula={'EMp_l + M_l'}/>
                        <CalculationLine name="section modulus about BB" variable="Sbb" value={calculations.foundation.sbb} units='ft^3' formula='L * B^2 / 6'/>
                        <CalculationLine name="section modulus about LL" variable="Sll" value={calculations.foundation.sll} units='ft^3' formula='L^2 * B / 6'/>
                        <CalculationLine name="vertical pressure" variable="q_v" value={(calculationsSums.sumP) / calculations.foundation.area} units='ksf' formula='Pt / A'/>
                        <CalculationLine name="moment stress along B" variable="q_bb" value={(calculationsSums.sumMbb) / calculations.foundation.sbb} units='ksf' formula='Mt_bb / Sbb'/>
                        <CalculationLine name="moment stress along L" variable="q_ll" value={(calculationsSums.sumMll) / calculations.foundation.sll} units='ksf' formula='Mt_ll / Sll'/>
                        {/* trapezoidal soil bearing distribution */}
                        {calculationsPressuresTrapezoid.bb.qmax > calculationsPressuresTrapezoid.bb.qmin ?
                            <>
                                {/* P/A + M/S is the max */} 
                                <CalculationLine name="q max along B" variable="qbb_max" value={calculationsPressuresTrapezoid.bb.qmax} units='ksf' formula='Pt/A + (Mt_bb / Sbb)' highlight={eccentricityDirection==='B'} error={{msg: (calculationsPressuresTrapezoid.bb.qmin < 0 || calculationsPressuresTrapezoid.bb.qmax < 0)? 'NG, uplift' : ''}}/>
                                <CalculationLine name="q min along B" variable="qbb_min" value={calculationsPressuresTrapezoid.bb.qmin} units='ksf' formula='Pt/A - (Mt_bb / Sbb)' highlight={eccentricityDirection==='B'} error={{msg: (calculationsPressuresTrapezoid.bb.qmin < 0 || calculationsPressuresTrapezoid.bb.qmax < 0) ? 'NG, uplift' : ''}}/>
                            </>
                                :
                            <>
                                {/* P/A - M/S is the max */} 
                                <CalculationLine name="q max along B" variable="qbb_max" value={calculationsPressuresTrapezoid.bb.qmin} units='ksf' formula='Pt/A - (Mt_bb / Sbb)' highlight={eccentricityDirection==='B'} error={{msg: (calculationsPressuresTrapezoid.bb.qmin < 0 || calculationsPressuresTrapezoid.bb.qmax < 0) ? 'NG, uplift' : ''}}/>
                                <CalculationLine name="q min along B" variable="qbb_min" value={calculationsPressuresTrapezoid.bb.qmax} units='ksf' formula='Pt/A + (Mt_bb / Sbb)' highlight={eccentricityDirection==='B'} error={{msg: (calculationsPressuresTrapezoid.bb.qmin < 0 || calculationsPressuresTrapezoid.bb.qmax < 0) ? 'NG, uplift' : ''}}/>
                            </>
                        }
                        {calculationsPressuresTrapezoid.ll.qmax > calculationsPressuresTrapezoid.ll.qmin ?
                            <>
                                {/* P/A + M/S is the max */} 
                                <CalculationLine name="q max along L" variable="qll_max" value={calculationsPressuresTrapezoid.ll.qmax} units='ksf' formula='Pt/A + (Mt_ll / Sll)' highlight={eccentricityDirection==='L'} error={{msg: (calculationsPressuresTrapezoid.ll.qmin < 0 || calculationsPressuresTrapezoid.ll.qmax < 0)? 'NG, uplift' : ''}}/>
                                <CalculationLine name="q min along L" variable="qll_min" value={calculationsPressuresTrapezoid.ll.qmin} units='ksf' formula='Pt/A - (Mt_ll / Sll)' highlight={eccentricityDirection==='L'} error={{msg: (calculationsPressuresTrapezoid.ll.qmin < 0 || calculationsPressuresTrapezoid.ll.qmax < 0) ? 'NG, uplift' : ''}}/>
                            </>
                                :
                            <>
                                {/* P/A - M/S is the max */} 
                                <CalculationLine name="q max along L" variable="qll_max" value={calculationsPressuresTrapezoid.ll.qmin} units='ksf' formula='Pt/A - (Mt_ll / Sll)' highlight={eccentricityDirection==='L'} error={{msg: (calculationsPressuresTrapezoid.ll.qmin < 0 || calculationsPressuresTrapezoid.ll.qmax < 0) ? 'NG, uplift' : ''}}/>
                                <CalculationLine name="q min along L" variable="qll_min" value={calculationsPressuresTrapezoid.ll.qmax} units='ksf' formula='Pt/A + (Mt_ll / Sll)' highlight={eccentricityDirection==='L'} error={{msg: (calculationsPressuresTrapezoid.ll.qmin < 0 || calculationsPressuresTrapezoid.ll.qmax < 0) ? 'NG, uplift' : ''}}/>
                            </>
                        }
                        {/* triangular soil bearing distribution if any of the trapezoidal soil bearing distributions are < 0*/}
                        {(calculationsPressuresTrapezoid.bb.qmin < 0 || calculationsPressuresTrapezoid.ll.qmin < 0 || calculationsPressuresTrapezoid.bb.qmax < 0 || calculationsPressuresTrapezoid.ll.qmax < 0)
                            &&
                            <>
                                <Grid size={12}>
                                    <Typography>Using triangular soil bearing distribution...</Typography>
                                </Grid>
                                <CalculationLine name="effective width" variable="Beff" value={calculationsPressuresTrapezoid.beff} units='ft' formula='3 * (B / 2 - |Mt_bb| / Pt)'/>
                                <CalculationLine name="effective length" variable="Leff" value={calculationsPressuresTrapezoid.leff} units='ft' formula='3 * (L / 2 - |Mt_ll| / Pt)'/>
                                <CalculationLine name="q max BB along B" variable="qbb_max" value={eccentricityDirection === 'B' ? calculationsPressuresTriangular.bb.qmax : '-'} units='ksf' formula='(2 * Pt) / (L * Beff)' highlight={eccentricityDirection==='B'}/>
                                <CalculationLine name="q min BB along B" variable="qbb_min" value={eccentricityDirection === 'B' ? calculationsPressuresTriangular.bb.qmin : '-'} units='ksf' highlight={eccentricityDirection==='B'}/>
                                <CalculationLine name="q max LL along L" variable="qll_max" value={eccentricityDirection === 'L' ? calculationsPressuresTriangular.ll.qmax : '-'} units='ksf' formula='(2 * Pt) / (B * Leff)' highlight={eccentricityDirection==='L'}/>
                                <CalculationLine name="q min LL along L" variable="qll_min" value={eccentricityDirection === 'L' ? calculationsPressuresTriangular.ll.qmin : '-'} units='ksf' highlight={eccentricityDirection==='L'}/>
                            </>
                        }
                    </Grid>

                    {/* draw the resulting soil bearing distributions under the foundation sections */}
                    <Typography {...calcProps}>Resulting Soil Bearing Pressures</Typography>
                    <Box display='flex' sx={{justifyContent: 'center'}}>
                        {/* foundation section soil bearing pressure: B-B */}
                        <svg {...SvgProps}>
                            {/* redraw foundation section */}
                            <rect {...(foundationPropsSection)}/>
                            <text {...labelLocationsSection.perp}>t</text>
                            <Grade foundationProps={foundationPropsSection}></Grade>
                            <PointLoadSection x={sectionOrigin[0] + pointLoad.coordB + fdnCenter[0]} y={sectionOrigin[1]} magnitude={pointLoad.kips}/>
                            {eccentricityDirection === 'B' && <MomentSection x={sectionOrigin[0] + moment.coordB + fdnCenter[0]} y={sectionOrigin[1]} magnitude={moment.kipft}/>}
                            <text {...{...labelLocationsSection.title, y:labelLocationsSection.title.y-10}}>B-B</text>
                            {/* if soil pressure is >= 0, trapezoidal soil bearing distribution */}
                            {(calculationsPressuresTrapezoid.bb.qmin >= 0 && calculationsPressuresTrapezoid.bb.qmax >= 0)
                                &&
                                <SoilBearingPressure
                                    foundationProps={foundationPropsSection}
                                    qLeft={calculationsPressuresTrapezoid.bb.qmin}
                                    qRight={calculationsPressuresTrapezoid.bb.qmax}
                                    shape={{type: 'trapezoidal'}}/>}
                            {/* if soil pressure is < 0, triangular soil bearing distribution */}
                            {(calculationsPressuresTrapezoid.bb.qmin < 0 || calculationsPressuresTrapezoid.bb.qmax < 0)
                                &&
                                <SoilBearingPressure
                                    foundationProps={foundationPropsSection}
                                    qLeft={calculationsPressuresTriangular.bb.qmin}
                                    qRight={calculationsPressuresTriangular.bb.qmax}
                                    shape={{type: 'triangular', effectiveWidth: calculationsPressuresTrapezoid.beff, reverse: calculationsSums.sumMbb < 0 ? true : false}}/>}
                            </svg>
                        {/* foundation section soil bearing pressure: L-L */}
                        <svg {...SvgProps}>
                            {/* redraw foundation section rotated */}
                            <rect {...(foundationPropsSectionRotated)}/>
                            <text {...labelLocationsSectionRotated.perp}>t</text>
                            <Grade foundationProps={foundationPropsSectionRotated}></Grade>
                            <PointLoadSection x={sectionRotatedOrigin[0] + pointLoad.coordL + fdnCenter[0]} y={sectionOrigin[1]} magnitude={pointLoad.kips}/>
                            {eccentricityDirection === 'L' && <MomentSection x={sectionRotatedOrigin[0] + moment.coordL + fdnCenter[0]} y={sectionRotatedOrigin[1]} magnitude={moment.kipft}/>}
                            <text {...{...labelLocationsSection.title, y:labelLocationsSection.title.y-10}}>L-L</text>
                            {/* if soil pressure is >= 0, trapezoidal soil bearing distribution */}
                            {(calculationsPressuresTrapezoid.ll.qmin >= 0 && calculationsPressuresTrapezoid.ll.qmax >= 0)
                                && 
                                <SoilBearingPressure
                                    foundationProps={foundationPropsSectionRotated}
                                    qLeft={calculationsPressuresTrapezoid.ll.qmin}
                                    qRight={calculationsPressuresTrapezoid.ll.qmax}
                                    shape={{type: 'trapezoidal'}}/>}
                            {/* if soil pressure is < 0, triangular soil bearing distribution */}
                            {(calculationsPressuresTrapezoid.ll.qmin < 0 || calculationsPressuresTrapezoid.ll.qmax < 0)
                                &&
                                <SoilBearingPressure
                                    foundationProps={foundationPropsSectionRotated}
                                    qLeft={calculationsPressuresTriangular.ll.qmin}
                                    qRight={calculationsPressuresTriangular.ll.qmax}
                                    shape={{type: 'triangular', effectiveWidth: calculationsPressuresTrapezoid.leff, reverse: calculationsSums.sumMll < 0 ? true : false}}/>}
                        </svg>
                    </Box>
                </>
            }
        </>
    );
};

export default Foundation
