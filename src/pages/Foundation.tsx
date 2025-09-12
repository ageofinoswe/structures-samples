import { Box, Divider, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, Stack, TextField, Typography } from "@mui/material"
import React from "react";
import RemoveButton from "../components/RemoveButton";
import AddButton from "../components/AddButton";
import ArrowInOut from "../components/ArrowInOut";
import OriginAxis from "../components/OriginAxis";
import ArrowUpDown from "../components/ArrowUpDown";
import MomentSection from "../components/MomentSection";
import MomentPlan from "../components/MomentPlan";




function Foundation() {
    // types and const declarations
    type FoundationOrientations = 'plan' | 'planRotated' | 'section' | 'sectionRotated';
    type MomentAlongAxis = 'B' | 'L';
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
        id: number,
        kips: number,
        coordB: number,
        coordL: number,
    }
    interface Moment {
        id: number,
        along: MomentAlongAxis,
        kipft: number,
        coordB: number,
        coordL: number,
    }

    // state variables
    const [fdnWidth, setFdnWidth] = React.useState(0);
    const [fdnHeight, setFdnHeight] = React.useState(0);
    const [fdnThickness, setFdnThickness] = React.useState(0);
    const [pointLoads, setPointLoads] = React.useState<PointLoad[]>([]);
    const [pointLoadID, setPointLoadID] = React.useState(0);
    const [moments, setMoments] = React.useState<Moment[]>([]);
    const [momentID, setMomentID] = React.useState(0);

    // foundation handlers
    const handleFdnWidthChange: (event: React.ChangeEvent<HTMLInputElement>) => void = (event) => {
        setFdnWidth(parseInt(event.target.value));
    }
    const handleFdnHeightChange: (event: React.ChangeEvent<HTMLInputElement>) => void = (event) => {
        setFdnHeight(parseInt(event.target.value));
    }
    const handleFdnThicknessChange: (event: React.ChangeEvent<HTMLInputElement>) => void = (event) => {
        setFdnThickness(parseInt(event.target.value) / 12);
    }

    // point load handlers
    const handleAddPointLoad: () => void = () => {
        const newPointLoad: PointLoad = {
            id: pointLoadID,
            kips: 0,
            coordB: 0,
            coordL: 0,
        };
        setPointLoads([...pointLoads, newPointLoad]);
        setPointLoadID(pointLoadID + 1);
    }
    const handleRemovePointLoad: (id: number) => void = (id) => {
        const modifiedPointLoads: PointLoad[]= pointLoads.filter(pointLoad => pointLoad.id !== id);
        setPointLoads(modifiedPointLoads);
    }
    const handleModifyPointLoad: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, id: number, field: PointLoadFields) => void = (event, id, field) => {
        const newValue: number = parseInt(event.target.value);
        const modifiedPointLoads: PointLoad[] = pointLoads.map(pointLoad => {
            if(pointLoad.id === id){
                return{...pointLoad,
                    kips: field === 'kips' ? newValue : pointLoad.kips,
                    coordB: field === 'B' ? newValue : pointLoad.coordB,
                    coordL: field === 'L' ? newValue : pointLoad.coordL,
                }
            }
            return pointLoad;
        })
        setPointLoads(modifiedPointLoads);
    }

    // moment handlers
    const handleAddMoment: () => void = () => {
        const newMoment: Moment = {
            id: momentID,
            along: 'B',
            kipft: 0,
            coordB: 0,
            coordL: 0,
        }
        setMoments([...moments, newMoment])
        setMomentID(momentID + 1);
    }
    const handleRemoveMoment: (id: number) => void = (id) => {
        const modifiedMoments: Moment[]= moments.filter(moment => moment.id !== id);
        setMoments(modifiedMoments);
    }
    const handleModifyMoment: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, id: number, field: MomentFields) => void = (event, id, field) => {
        const newValue: number = parseInt(event.target.value);
        const modifiedMoments: Moment[] = moments.map(moment => {
            if(moment.id === id){
                return{...moment,
                    kipft: field === 'kipft' ? newValue : moment.kipft,
                    coordB: field === 'B' ? newValue : moment.coordB,
                    coordL: field === 'L' ? newValue : moment.coordL,
                }
            }
            return moment;
        })
        setMoments(modifiedMoments);
    }
    const handleModifyMomentAlong: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, id: number) => void = (event, id) => {
        const modifiedMoments: Moment[] = moments.map(moment => {
            return{...moment,
                along: (moment.id === id ? event.target.value as MomentAlongAxis : moment.along)
            }
        })
        setMoments(modifiedMoments);
    }

    // foundation properties
    const foundationProps: (svgProps: SvgProps, type: FoundationOrientations) => SvgRectProps = (svgProps, type) => {
        const viewBox: number[] = svgProps.viewBox.split(' ').map( (index: string) => Number.parseInt(index));
        const viewBoxWidth: number = viewBox[2];
        const viewBoxHeight: number = viewBox[3];

        const rectWidth: number = (type === 'plan' || type === 'section') ? fdnWidth : fdnHeight;
        const rectHeight: number = (type === 'plan') ? fdnHeight : (type === 'planRotated') ? fdnWidth : fdnThickness;
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

    return (
        <>  
            {/* title*/}
            <Divider />
            <Box>
                <Typography variant='h1' align='center' sx={{ fontSize: '3em' }}>Foundation Bearing Pressure</Typography>
            </Box>
            <Divider />

            {/* GRID: dimensions, point loads, moments*/}
            <Grid container sx={{ mt: '1em' }} spacing={20}>
                {/* dimensions */}
                <Grid size={3}>
                    <Stack sx={{ py: 1 }}>          
                        <Typography variant='subtitle1'>Dimensions</Typography>
                        {dimensionInput.map(textInputProps => 
                            <TextField {...textInputProps}/>
                        )}
                    </Stack>
                </Grid>

                {/* point loads */}
                <Grid size={4}>
                    <Stack sx={{ alignItems: 'flex-start', py: 1 }}>          
                        <Typography variant='subtitle1'>Point Loads</Typography>
                        {pointLoads.map(pointLoad =>
                            <Box key={pointLoad.id} display='flex'>
                                {pointLoadTextInputFields.map(field => 
                                    <TextField
                                        sx={{pr:3}}
                                        label={field}
                                        defaultValue={0}
                                        size='small'
                                        variant='standard'
                                        onChange={event => handleModifyPointLoad(event, pointLoad.id, field)}/>
                                )}
                                <RemoveButton id={pointLoad.id} onClick={()=>handleRemovePointLoad(pointLoad.id)}></RemoveButton>
                            </Box>
                        )}
                        <AddButton onClick={handleAddPointLoad}></AddButton>
                    </Stack>
                </Grid>

                {/* moments */}
                <Grid size={5}>
                    <Stack sx={{ alignItems: 'flex-start', py: 1 }}>          
                        <Typography variant='subtitle1'>Moments</Typography>
                        {moments.map(moment =>
                            <Box alignItems='center' key={moment.id} display='flex'>
                                <FormControl sx={{mr: 4}}>
                                    <FormLabel>
                                        Along?
                                    </FormLabel>
                                    <RadioGroup value={moment.along} onChange={event => handleModifyMomentAlong(event, moment.id)}>
                                        <FormControlLabel value={'B'} control={<Radio size='small' />} label="B" />
                                        <FormControlLabel value={'L'} control={<Radio size='small' />} label="L" />
                                    </RadioGroup>
                                </FormControl>
                                {momentTextInputFields.map(field =>
                                    <TextField
                                        sx={{pr:3}}
                                        label={field}
                                        defaultValue={0}
                                        size='small'
                                        variant='standard'
                                        onChange={event => handleModifyMoment(event, moment.id, field)}/>
                                )}
                                <RemoveButton id={moment.id} onClick={() => handleRemoveMoment(moment.id)}></RemoveButton>
                            </Box>
                        )}
                        <AddButton onClick={handleAddMoment}></AddButton>
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
                    {pointLoads.map(pointLoad =>
                        <ArrowInOut x={planOrigin[0] + pointLoad.coordB} y={planOrigin[1] - pointLoad.coordL} magnitude={pointLoad.kips}/>
                    )}
                    {moments.map(moment =>
                        <MomentPlan x={planOrigin[0] + moment.coordB} y={planOrigin[1] - moment.coordL} magnitude={moment.kipft} along={moment.along}/>
                    )}
                </svg>
                <svg {...SvgProps}>
                    <rect {...(foundationProps(SvgProps, 'planRotated'))}/>
                    <OriginAxis origin={planRotatedOrigin} rotate={true}></OriginAxis>
                    <text {...labelLocationsPlanRotated.bottom}>L</text>
                    <text {...labelLocationsPlanRotated.perp}>B</text>
                    <text {...labelLocationsPlanRotated.title}>Foundation Plan</text>
                    {pointLoads.map(pointLoad =>
                        <ArrowInOut x={planRotatedOrigin[0] + pointLoad.coordL} y={planRotatedOrigin[1] + pointLoad.coordB} magnitude={pointLoad.kips}/>
                    )}
                    {moments.map(moment =>
                        <MomentPlan x={planRotatedOrigin[0] + moment.coordL} y={planRotatedOrigin[1] + moment.coordB} magnitude={moment.kipft} along={moment.along} rotate={true}/>
                    )}
                </svg>
            </Box>

            {/* foundation section and rotated section */}
            <Box display='flex' sx={{ justifyContent: 'center'}}>
                <svg {...SvgProps}>
                    <rect {...(foundationProps(SvgProps, 'section'))}/>
                    <text {...labelLocationsSection.bottom}>B</text>
                    <text {...labelLocationsSection.perp}>t</text>
                    <text {...labelLocationsSection.title}>Foundation Section</text>
                    {pointLoads.map(pointLoad =>
                        <ArrowUpDown x={sectionOrigin[0] + pointLoad.coordB} y={sectionOrigin[1]} magnitude={pointLoad.kips}/>
                    )}
                    {moments.map(moment =>
                        moment.along === 'B' && <MomentSection x={sectionOrigin[0] + moment.coordB} y={sectionOrigin[1]} magnitude={moment.kipft}/>
                    )}
                </svg>
                <svg {...SvgProps}>
                     <rect {...(foundationProps(SvgProps, 'sectionRotated'))}/>
                    <text {...labelLocationsSectionRotated.bottom}>L</text>
                    <text {...labelLocationsSectionRotated.perp}>t</text>
                    <text {...labelLocationsSectionRotated.title}>Foundation Section</text>
                    {pointLoads.map(pointLoad =>
                        <ArrowUpDown x={sectionRotatedOrigin[0] + pointLoad.coordL} y={sectionOrigin[1]} magnitude={pointLoad.kips}/>
                    )}
                    {moments.map(moment =>
                        moment.along === 'L' && <MomentSection x={sectionRotatedOrigin[0] + moment.coordL} y={sectionRotatedOrigin[1]} magnitude={moment.kipft}/>
                    )}
                </svg>
            </Box>
            <Divider sx={{mt: 3}} />
            <Box>
                <Typography variant='h3' align='left' sx={{ mt: 2, fontSize: '2em' }}>Calculations</Typography>
            </Box>
        </>
    );
};

export default Foundation
