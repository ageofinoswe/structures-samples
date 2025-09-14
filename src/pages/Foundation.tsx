import { Box, Divider, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, Stack, TextField, Typography } from "@mui/material"
import React from "react";
import ArrowInOut from "../components/ArrowInOut";
import OriginAxis from "../components/OriginAxis";
import ArrowUpDown from "../components/ArrowUpDown";
import MomentSection from "../components/MomentSection";
import MomentPlan from "../components/MomentPlan";
import CalculationLine from "../components/CalculationLine";
import CalculationHeader from "../components/CalculationHeader";

function Foundation() {
    // types and const declarations
    type FoundationOrientations = 'plan' | 'planRotated' | 'section' | 'sectionRotated';
    type MomentFields = 'kipft' | 'B' | 'L';
    type PointLoadFields = 'kips' | 'B' | 'L';
    const momentTextInputFields: MomentFields[] = ['kipft', 'B', 'L'];
    const pointLoadTextInputFields: PointLoadFields[] = ['kips', 'B', 'L'];

    // interfaces
    interface TextInputProps {
        id?: string,
        sx?: {},
        label?: string,
        defaultValue?: number,
        size?: 'small' | 'medium',
        variant?: 'standard' | 'outlined',
        onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void,
    };
    interface SvgRectProps {
        x: number,
        y: number,
        width: number,
        height: number,
        fill: string,
        stroke: string,
        'stroke-width': number
    }
    interface SvgProps {
        viewBox: string,
        width: string,
        height: string,
    }
    interface SvgTextProps {
        x: number,
        y: number,
        fontSize: number,
        textAnchor?: string,
        dominantBaseline?: string,
    }
    interface PointLoad {
        kips: number,
        coordB: number,
        coordL: number,
    }
    interface Moment {
        along: string,
        kipft: number,
        coordB: number,
        coordL: number,
    }

    // state variables
    const [fdnWidth, setFdnWidth] = React.useState(0);
    const [fdnHeight, setFdnHeight] = React.useState(0);
    const [fdnThickness, setFdnThickness] = React.useState(0);
    const [fdnDensity, setFdnDensity] = React.useState(0.145);
    const [fdnCenter, setFdnCenter] = React.useState([0,0]);
    const [pointLoad, setPointLoad] = React.useState<PointLoad>({kips: 0, coordB: 0, coordL: 0});
    const [moment, setMoment] = React.useState<Moment>({along: 'B', kipft: 0, coordB: 0, coordL: 0});
    const [eccentricityDirection, setEccentricityDirection] = React.useState('B');

    // foundation handlers
    const handleFdnWidthChange: (event: React.ChangeEvent<HTMLInputElement>) => void = (event) => {
        setFdnWidth(parseInt(event.target.value));
        centerLoads(parseInt(event.target.value), fdnHeight);
    }
    const handleFdnHeightChange: (event: React.ChangeEvent<HTMLInputElement>) => void = (event) => {
        setFdnHeight(parseInt(event.target.value));
        centerLoads(fdnWidth, parseInt(event.target.value));
    }
    const handleFdnThicknessChange: (event: React.ChangeEvent<HTMLInputElement>) => void = (event) => {
        setFdnThickness(parseInt(event.target.value));
    }
    const centerLoads: (width: number, height: number) => void = (width, height) => {
        const centeredPointLoad: PointLoad = {...pointLoad, coordB: width / 2, coordL: height / 2};
        const centeredMoment: Moment = {...moment, coordB: width / 2, coordL: height / 2}; 
        setPointLoad(centeredPointLoad);
        setMoment(centeredMoment);
        setFdnCenter([width / 2, height / 2]);
    }

    // point load handlers
    const handleModifyPointLoad: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: PointLoadFields) => void = (event, field) => {
        const newValue: number = isNaN(parseInt(event.target.value)) ? 0 : parseInt(event.target.value);
        const modifiedPointLoads: PointLoad = 
            {...pointLoad,
                kips: field === 'kips' ? newValue : pointLoad.kips,
                coordB: field === 'B' ? newValue + fdnCenter[0] : pointLoad.coordB,
                coordL: field === 'L' ? newValue + fdnCenter[1] : pointLoad.coordL,
            };
        setPointLoad(modifiedPointLoads);
    }

    // moment handlers
    const handleModifyMoment: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: MomentFields) => void = (event, field) => {
        const newValue: number = isNaN(parseInt(event.target.value)) ? 0 : parseInt(event.target.value);
        const modifiedMoments: Moment =
                {...moment,
                    kipft: field === 'kipft' ? newValue : moment.kipft,
                    coordB: field === 'B' ? newValue + fdnCenter[0] : moment.coordB,
                    coordL: field === 'L' ? newValue + fdnCenter[1] : moment.coordL,
                };
        setMoment(modifiedMoments);
    }
    const handleModifyMomentAlong: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void = (event) => {
        const modifiedMoments: Moment =
            {...moment,
                along: event.target.value
            };
        setMoment(modifiedMoments);
    }
    const handleEccentricityDirection: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void = (event) => {
        if(event.target.value === 'B'){
            setPointLoad({...pointLoad, coordL: fdnCenter[1]})
            setMoment({...moment, coordL: fdnCenter[1]})
        }
        else{
            setPointLoad({...pointLoad, coordB: fdnCenter[0]})
            setMoment({...moment, coordB: fdnCenter[0]})
        }
        setEccentricityDirection(event.target.value);
    }

    // foundation properties
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
            fill: '#e0e0e0',
            stroke: 'black',
            'stroke-width': 0.1
        }; 
        return fdnProps;
    }
    const getOrigin: (svgProps: SvgProps, type: FoundationOrientations) => [number, number] = (svgProps, type) => {
        const fdnProps: SvgRectProps = foundationProps(svgProps, type);
        const origin: [number, number] = (type === 'plan') ? [fdnProps.x, fdnProps.y + fdnHeight] : [fdnProps.x, fdnProps.y];
        return origin;
    }

    // foundation text input fields
    const dimensionInput: TextInputProps[] = [
        {label: 'Width, ft (B)', defaultValue: 0, size: 'small', variant: 'standard', onChange: handleFdnWidthChange},
        {label: 'Length, ft (L)', defaultValue: 0, size: 'small', variant: 'standard', onChange: handleFdnHeightChange},
        {label: 'Thickness, in (t)', defaultValue: 0, size: 'small', variant: 'standard', onChange: handleFdnThicknessChange},
    ];

    // svg properties
    const SvgProps: SvgProps = {
        viewBox: '0 0 75 45',
        width: '50vw',
        height: '30vw',
    }

    // svg labeling
    const getLabelLocations: (svgProps: SvgProps, fdnProps: SvgRectProps) => {bottom: SvgTextProps, perp: SvgTextProps, title: SvgTextProps} = (svgProps, fdnProps) => {
        const textAnchor: string = 'middle';
        const dominantBaseline: string = 'middle';
        const fontSize: number = 2;
        const offsetX: number = 1.5;
        const offsetY: number = 2.5;

        const bottomX: number = fdnProps.x + fdnProps.width / 2 ;
        const bottomY: number = fdnProps.y + fdnProps.height;
        const bottom: SvgTextProps = {x: bottomX, y: bottomY + offsetY, fontSize: fontSize, textAnchor: textAnchor};

        const perpX: number = fdnProps.x + fdnProps.width;
        const perpY: number = fdnProps.y + fdnProps.height / 2;
        const perp: SvgTextProps = {x: perpX + offsetX, y: perpY, fontSize: fontSize, dominantBaseline: dominantBaseline, textAnchor: textAnchor};

        const viewBox: number[] = svgProps.viewBox.split(' ').map(value => parseInt(value))
        const titleX: number = viewBox[2] / 2;
        const titleY: number = viewBox[3];
        const title: SvgTextProps = {x: titleX, y: titleY, fontSize: fontSize, textAnchor: textAnchor};

        return {bottom, perp, title};
    }

    // foundation origins and label locations
    const planOrigin = getOrigin(SvgProps, 'plan');
    const planRotatedOrigin = getOrigin(SvgProps, 'planRotated');
    const sectionOrigin = getOrigin(SvgProps, 'section');
    const sectionRotatedOrigin = getOrigin(SvgProps, 'sectionRotated');
    const labelLocationsPlan = getLabelLocations(SvgProps, foundationProps(SvgProps, 'plan'))
    const labelLocationsPlanRotated = getLabelLocations(SvgProps, foundationProps(SvgProps, 'planRotated'))
    const labelLocationsSection = getLabelLocations(SvgProps, foundationProps(SvgProps, 'section'))
    const labelLocationsSectionRotated = getLabelLocations(SvgProps, foundationProps(SvgProps, 'sectionRotated'))

    const calcProps = {
        sx: {mt: 1,
            fontWeight: 'bold',
            textDecoration:'underline',
            fontStyle:'italic'
        }
    }

    const calculations = {
        foundation: {
            width: fdnWidth,
            height: fdnHeight,
            thickness: fdnThickness,
            area: fdnWidth * fdnHeight,
            density: fdnDensity,
            weight: fdnWidth * fdnHeight * fdnThickness / 12 * fdnDensity,
            sbb: fdnHeight * fdnWidth * fdnWidth / 6,
            sll: fdnWidth * fdnHeight * fdnHeight / 6
        },
        pointLoad: {
            magnitude: pointLoad.kips,
            eB: pointLoad.coordB - fdnCenter[0],
            eL: pointLoad.coordL - fdnCenter[1],
            mB: pointLoad.kips * (pointLoad.coordB - fdnCenter[0]),
            mL: pointLoad.kips * (pointLoad.coordL - fdnCenter[1]),
            along: eccentricityDirection === 'B' ? 'B-B' : 'L-L',
        },
        moment: {
            mB: eccentricityDirection === 'B' ? moment.kipft : 0,
            mL: eccentricityDirection === 'L' ? moment.kipft : 0,
            eB: moment.coordB - fdnCenter[0],
            eL: moment.coordL - fdnCenter[1],
            along: eccentricityDirection === 'B' ? 'B-B' : 'L-L',
        },
    }
    const calculationsPressures = {
        bbTrpz: {
            qmax: (calculations.foundation.weight + calculations.pointLoad.magnitude) / calculations.foundation.area + (calculations.pointLoad.mB + calculations.moment.mB) / calculations.foundation.sbb,
            qmin: (calculations.foundation.weight + calculations.pointLoad.magnitude) / calculations.foundation.area - (calculations.pointLoad.mB + calculations.moment.mB) / calculations.foundation.sbb
        },
        llTrpz: {
            qmax: (calculations.foundation.weight + calculations.pointLoad.magnitude) / calculations.foundation.area + (calculations.pointLoad.mL + calculations.moment.mL) / calculations.foundation.sll,
            qmin: (calculations.foundation.weight + calculations.pointLoad.magnitude) / calculations.foundation.area - (calculations.pointLoad.mL + calculations.moment.mL) / calculations.foundation.sll
        },
        sumP: calculations.foundation.weight + calculations.pointLoad.magnitude,
        sumMbb: calculations.pointLoad.mB + calculations.moment.mB,
        sumMll: calculations.pointLoad.mL + calculations.moment.mL,
        beff: eccentricityDirection === 'L' ? calculations.foundation.width : 3*(calculations.foundation.width/2 - (calculations.pointLoad.mB + calculations.moment.mB)/(calculations.foundation.weight + calculations.pointLoad.magnitude)),
        leff: eccentricityDirection === 'B' ? calculations.foundation.height : 3*(calculations.foundation.height/2 - (calculations.pointLoad.mL + calculations.moment.mL)/(calculations.foundation.weight + calculations.pointLoad.magnitude)),

    }
  
    return (
        <>  
            {/* title*/}
            <Divider />
            <Box>
                <Typography variant='h1' align='center' sx={{ fontSize: '3em' }}>Foundation Bearing Pressure</Typography>
            </Box>
            <Divider />

            {/* GRID: dimensions, point loads, moments*/}
            <Grid container sx={{ py: 1 }} spacing={20}>
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
                            <Box display='flex'>
                                {pointLoadTextInputFields.map(field => 
                                    <TextField
                                        disabled={field !== 'kips' && eccentricityDirection !== field}
                                        sx={{pr:3}}
                                        label={field}
                                        value={field === 'kips' ? pointLoad.kips : field === 'B' ? pointLoad.coordB - fdnCenter[0] : pointLoad.coordL - fdnCenter[1]}
                                        size='small'
                                        variant='standard'
                                        onChange={event => handleModifyPointLoad(event, field)}/>
                                )}
                            </Box>
                    </Stack>
                </Grid>

                {/* moments */}
                <Grid size={5}>
                    <Stack>
                        <FormControl disabled={true} sx={{mb: 1}}>
                            <FormLabel>
                                Along
                            </FormLabel>
                            <RadioGroup row value={eccentricityDirection} onChange={event => handleModifyMomentAlong(event)}>
                                <FormControlLabel value={'B'} control={<Radio size='small' />} label="B" />
                                <FormControlLabel value={'L'} control={<Radio size='small' />} label="L" />
                            </RadioGroup>
                        </FormControl>          
                        <Typography variant='subtitle1'>Moment</Typography>
                            <Box alignItems='center' display='flex'>
                                {momentTextInputFields.map(field =>
                                    <TextField
                                        disabled={field !== 'kipft' && eccentricityDirection !== field}
                                        sx={{pr:3}}
                                        label={field}
                                        value={field === 'kipft' ? moment.kipft : field === 'B' ? moment.coordB - fdnCenter[0] : moment.coordL - fdnCenter[1]}
                                        size='small'
                                        variant='standard'
                                        onChange={event => handleModifyMoment(event, field)}/>
                                )}
                            </Box>
                    </Stack>
                </Grid>
            </Grid>

            {/* foundation plan and rotated plan*/}
            <Divider />
            <Box>
                <Typography variant='h2' align='center' sx={{ mt: 2,fontSize: '2em' }}>Foundation and Applied Loads</Typography>
            </Box>
            <Box display='flex' sx={{ justifyContent: 'center'}}>
                <svg {...SvgProps}>
                    <rect {...(foundationProps(SvgProps, 'plan'))}/>
                    <OriginAxis origin={planOrigin}></OriginAxis>
                    <text {...labelLocationsPlan.bottom}>B</text>
                    <text {...labelLocationsPlan.perp}>L</text>
                    <text {...labelLocationsPlan.title}>Foundation Plan</text>
                    <ArrowInOut x={planOrigin[0] + pointLoad.coordB} y={planOrigin[1] - pointLoad.coordL} magnitude={pointLoad.kips}/>
                    <MomentPlan x={planOrigin[0] + moment.coordB} y={planOrigin[1] - moment.coordL} magnitude={moment.kipft} along={eccentricityDirection}/>
                </svg>
                <svg {...SvgProps}>
                    <rect {...(foundationProps(SvgProps, 'planRotated'))}/>
                    <OriginAxis origin={planRotatedOrigin} rotate={true}></OriginAxis>
                    <text {...labelLocationsPlanRotated.bottom}>L</text>
                    <text {...labelLocationsPlanRotated.perp}>B</text>
                    <text {...labelLocationsPlanRotated.title}>Foundation Plan</text>
                    <ArrowInOut x={planRotatedOrigin[0] + pointLoad.coordL} y={planRotatedOrigin[1] + pointLoad.coordB} magnitude={pointLoad.kips}/>
                    <MomentPlan x={planRotatedOrigin[0] + moment.coordL} y={planRotatedOrigin[1] + moment.coordB} magnitude={moment.kipft} along={eccentricityDirection} rotate={true}/>
                </svg>
            </Box>

            {/* foundation section and rotated section */}
            <Box display='flex' sx={{ justifyContent: 'center'}}>
                <svg {...SvgProps}>
                    <rect {...(foundationProps(SvgProps, 'section'))}/>
                    <text {...labelLocationsSection.bottom}>B</text>
                    <text {...labelLocationsSection.perp}>t</text>
                    <text {...labelLocationsSection.title}>Foundation Section</text>
                    <ArrowUpDown x={sectionOrigin[0] + pointLoad.coordB} y={sectionOrigin[1]} magnitude={pointLoad.kips}/>
                    {eccentricityDirection === 'B' && <MomentSection x={sectionOrigin[0] + moment.coordB} y={sectionOrigin[1]} magnitude={moment.kipft}/>}
                </svg>
                <svg {...SvgProps}>
                     <rect {...(foundationProps(SvgProps, 'sectionRotated'))}/>
                    <text {...labelLocationsSectionRotated.bottom}>L</text>
                    <text {...labelLocationsSectionRotated.perp}>t</text>
                    <text {...labelLocationsSectionRotated.title}>Foundation Section</text>
                    <ArrowUpDown x={sectionRotatedOrigin[0] + pointLoad.coordL} y={sectionOrigin[1]} magnitude={pointLoad.kips}/>
                    {eccentricityDirection === 'L' && <MomentSection x={sectionRotatedOrigin[0] + moment.coordL} y={sectionRotatedOrigin[1]} magnitude={moment.kipft}/>}
                </svg>
            </Box>

            <Divider sx={{mt: 3}} />
            
            <Box>
                <Typography variant='h3' align='left' sx={{ my: 2, fontSize: '2em' }}>Calculations</Typography>
            </Box>

            <Typography {...calcProps}>Foundation Properties</Typography>
            <Grid container>
                <CalculationHeader/>
                <CalculationLine name="width" variable="B" value={calculations.foundation.width} units='ft'/>
                <CalculationLine name="length" variable="L" value={calculations.foundation.height} units='ft'/>
                <CalculationLine name="thickness" variable="t" value={calculations.foundation.thickness} units='in'/>
                <CalculationLine name="density" variable={'\u03B3'} value={calculations.foundation.density} units='kcf'/>
                <CalculationLine name="weight" variable="w" value={calculations.foundation.weight} units='kips' formula={`B * L * t * ${'\u03B3'}`}/>
            </Grid>

            <Typography {...calcProps}>Applied Point Load</Typography>
            <Grid container>
                <CalculationHeader/>
                <CalculationLine name="point load" variable="P" value={calculations.pointLoad.magnitude} units='kips'/>
                <CalculationLine name="eccentricity b" variable="Ep_b" value={calculations.pointLoad.eB} units='ft'/>
                <CalculationLine name="eccentricity l" variable="Ep_l" value={calculations.pointLoad.eL} units='ft'/>
                <CalculationLine name="eccentric moment b" variable="EMp_b" value={calculations.pointLoad.mB} units='kip-ft' formula='P * Ep_b'/>
                <CalculationLine name="eccentric moment l" variable="EMp_l" value={calculations.pointLoad.mL} units='kip-ft' formula='P * Ep_l'/>
            </Grid>

            <Typography {...calcProps}>Applied Moment</Typography>
            <Grid container>
                <CalculationHeader/>
                <CalculationLine name="moment" variable="M_b" value={calculations.moment.mB} units='kip-ft'/>
                <CalculationLine name="moment" variable="M_l" value={calculations.moment.mL} units='kip-ft'/>
                <CalculationLine name="along" variable={calculations.moment.along} value={'-'} units='-'/>
                <CalculationLine name="eccentricity b" variable="Em_b" value={calculations.moment.eB} units='ft'/>
                <CalculationLine name="eccentricity l" variable="Em_l" value={calculations.moment.eL} units='ft'/>
            </Grid>

            <Typography {...calcProps}>Summations / Totals</Typography>
            <Grid container>
                <CalculationHeader/>
                <CalculationLine name="vertical load" variable="Pt" value={calculationsPressures.sumP} units='kips' formula='w + P'/>
                <CalculationLine name="moment BB" variable="Mt_bb" value={calculationsPressures.sumMbb} units='kip-ft' formula={'EMp_b + M_b'}/>
                <CalculationLine name="moment LL" variable="Mt_ll" value={calculationsPressures.sumMll} units='kip-ft' formula={'EMp_l + M_l'}/>
            </Grid>

            <Typography {...calcProps}>Soil Bearing Pressures</Typography>
            <Grid container>
                <CalculationHeader/>
                <CalculationLine name="sum vertical load" variable="Pt" value={calculationsPressures.sumP} units='kips' formula='w + P'/>
                <CalculationLine name="foundation area" variable="A" value={calculations.foundation.area} units='ft2' formula='B * L'/>
                <CalculationLine name="moment BB" variable="Mt_bb" value={calculationsPressures.sumMbb} units='kip-ft' formula={'EMp_b + M_b'}/>
                <CalculationLine name="moment LL" variable="Mt_ll" value={calculationsPressures.sumMll} units='kip-ft' formula={'EMp_l + M_l'}/>
                <CalculationLine name="section modulus BB" variable="Sbb" value={calculations.foundation.sbb} units='ft3' formula='L * B^2 / 6'/>
                <CalculationLine name="section modulus LL" variable="Sll" value={calculations.foundation.sll} units='ft3' formula='L^2 * B / 6'/>
                <CalculationLine name="vertical pressure" variable="q_v" value={(calculationsPressures.sumP) / calculations.foundation.area} units='ksf' formula='Pt / A'/>
                <CalculationLine name="moment stress BB" variable="q_bb" value={(calculationsPressures.sumMbb) / calculations.foundation.sbb} units='ksf' formula='Mt_bb / Sbb'/>
                <CalculationLine name="moment stress LL" variable="q_ll" value={(calculationsPressures.sumMll) / calculations.foundation.sll} units='ksf' formula='Mt_ll / Sll'/>
                <CalculationLine name="q max BB" variable="qbb_max" value={calculationsPressures.bbTrpz.qmax} units='ksf' formula='Pt/A + (Mt_bb / Sbb)' highlight={eccentricityDirection=='B'} error={{msg: calculationsPressures.bbTrpz.qmin < 0 ? 'NG, uplift' : ''}}/>
                <CalculationLine name="q min BB" variable="qbb_min" value={calculationsPressures.bbTrpz.qmin} units='ksf' formula='Pt/A - (Mt_bb / Sbb)' highlight={eccentricityDirection=='B'} error={{msg: calculationsPressures.bbTrpz.qmin < 0 ? 'NG, uplift' : ''}}/>
                <CalculationLine name="q max LL" variable="qll_max" value={calculationsPressures.llTrpz.qmax} units='ksf' formula='Pt/A + (Mt_ll / Sll)' highlight={eccentricityDirection=='L'} error={{msg: calculationsPressures.llTrpz.qmin < 0 ? 'NG, uplift' : ''}}/>
                <CalculationLine name="q min LL" variable="qll_min" value={calculationsPressures.llTrpz.qmin} units='ksf' formula='Pt/A - (Mt_ll / Sll)' highlight={eccentricityDirection=='L'} error={{msg: calculationsPressures.llTrpz.qmin < 0 ? 'NG, uplift' : ''}}/>
                {(calculationsPressures.bbTrpz.qmin < 0 || calculationsPressures.llTrpz.qmin < 0) &&
                    <>
                        <Grid size={12}>
                            <Typography>...</Typography>
                        </Grid>
                        <CalculationLine name="effective width" variable="Beff" value={calculationsPressures.beff} units='ft' formula='3 * (B / 2 - Mt_bb / Pt)'/>
                        <CalculationLine name="effective length" variable="Leff" value={calculationsPressures.leff} units='ft' formula='3 * (L / 2 - Mt_ll / Pt)'/>
                        <CalculationLine name="q max BB" variable="qbb_max" value={2*calculationsPressures.sumP / (calculations.foundation.height * calculationsPressures.beff)} units='ksf' formula='(2 * Pt) / (L * Beff)' highlight={eccentricityDirection=='B'}/>
                        <CalculationLine name="q min BB" variable="qbb_min" value={0} units='ksf' highlight={eccentricityDirection=='B'}/>
                        <CalculationLine name="q max LL" variable="qll_max" value={2*calculationsPressures.sumP / (calculations.foundation.width * calculationsPressures.leff)} units='ksf' formula='(2 * Pt) / (B * Leff)' highlight={eccentricityDirection=='L'}/>
                        <CalculationLine name="q min LL" variable="qll_min" value={0} units='ksf' highlight={eccentricityDirection=='L'}/>
                    </>
                }
            </Grid>
            <Typography {...calcProps}>Resulting Soil Bearing Pressures</Typography>
            <Box display='flex' sx={{ justifyContent: 'center'}}>
                <svg {...SvgProps}>
                    <rect {...(foundationProps(SvgProps, 'section'))}/>
                    <text {...labelLocationsSection.bottom}>B</text>
                    <text {...labelLocationsSection.perp}>t</text>
                    <ArrowUpDown x={sectionOrigin[0] + pointLoad.coordB} y={sectionOrigin[1]} magnitude={pointLoad.kips}/>
                    {eccentricityDirection === 'B' && <MomentSection x={sectionOrigin[0] + moment.coordB} y={sectionOrigin[1]} magnitude={moment.kipft}/>}
                </svg>
                <svg {...SvgProps}>
                    <rect {...(foundationProps(SvgProps, 'sectionRotated'))}/>
                    <text {...labelLocationsSectionRotated.bottom}>L</text>
                    <text {...labelLocationsSectionRotated.perp}>t</text>
                    <ArrowUpDown x={sectionRotatedOrigin[0] + pointLoad.coordL} y={sectionOrigin[1]} magnitude={pointLoad.kips}/>
                    {eccentricityDirection === 'L' && <MomentSection x={sectionRotatedOrigin[0] + moment.coordL} y={sectionRotatedOrigin[1]} magnitude={moment.kipft}/>}
                </svg>
            </Box>
        </>
    );
};

export default Foundation
