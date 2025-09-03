import { Box, Divider, Grid, Stack, TextField, Typography } from "@mui/material"
import React from "react";
import RemoveButton from "../components/RemoveButton";
import AddButton from "../components/AddButton";
import Arrow from "../components/Arrow";
import ArrowInto from "../components/ArrowInto";

function Foundation() {
    // interfaces
    interface TextFieldProps {
        id?: string,
        sx?: {},
        label?: string,
        defaultValue?: number,
        size?: 'small' | 'medium',
        variant?: 'standard' | 'outlined',
        onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void,
    };

    interface RectProps {
        x: number,
        y: number,
        width: number,
        height: number,
        fill: string,
        stroke: string,
        'stroke-width': number
    }

    interface svgProps {
        viewBox: string,
        width: string,
        height: string,
    }

    interface PointLoad {
        id: number,
        kips: number,
        xCoord: number,
        yCoord: number,
    }

    interface MomentLoad {
        id: number,
        kipft: number,
        xCoord: number,
        yCoord: number,
    }

    // state variables
    const [width, setWidth] = React.useState(0);
    const [height, setHeight] = React.useState(0);
    const [thickness, setThickness] = React.useState(0);
    const [pointLoads, setPointLoads] = React.useState<PointLoad[]>([]);
    const [pointLoadID, setPointLoadID] = React.useState(0);
    const [momentLoads, setMomentLoads] = React.useState<MomentLoad[]>([]);
    const [momentLoadID, setMomentLoadID] = React.useState(0);

    // handlers
    const handleWidthChange: (event: React.ChangeEvent<HTMLInputElement>) => void = (e: React.ChangeEvent<HTMLInputElement>) => {
        setWidth(parseInt(e.target.value));
    }
    const handleHeightChange: (event: React.ChangeEvent<HTMLInputElement>) => void = (e: React.ChangeEvent<HTMLInputElement>) => {
        setHeight(parseInt(e.target.value));
    }
    const handleThicknessChange: (event: React.ChangeEvent<HTMLInputElement>) => void = (e: React.ChangeEvent<HTMLInputElement>) => {
        setThickness(parseInt(e.target.value) / 12);
    }
    const handleAddPointLoad: (event: React.MouseEvent<HTMLButtonElement>) => void = (e: React.MouseEvent<HTMLButtonElement>) => {
        const newPointLoad: PointLoad = {id: pointLoadID, kips: 0, xCoord: 0, yCoord: 0};
        setPointLoadID(pointLoadID + 1);
        setPointLoads([...pointLoads, newPointLoad]);
    }
    const handleRemovePointLoad: (event: React.MouseEvent<HTMLButtonElement>, id: number) => void = (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
        setPointLoads(pointLoads.filter(load => load.id !== id))
    }
    const handleModifyPointLoad: (event: React.ChangeEvent<HTMLInputElement>, id: number, param: 'kips' | 'x' | 'y') => void =
        (e: React.ChangeEvent<HTMLInputElement>, id: number, param: 'kips' | 'x' | 'y') => {
            const newValue = parseInt(e.target.value);
            const modifiedPointLoads: PointLoad[] = pointLoads.map( load => {
                if(load.id === id){
                    switch(param){
                        case 'kips': return {...load, kips: newValue}
                        case 'x': return {...load, xCoord: newValue}
                        case 'y': return {...load, yCoord: newValue}
                    }
                }
                return load;
            })
            setPointLoads(modifiedPointLoads);
    }
    const handleAddMomentLoad: (event: React.MouseEvent<HTMLButtonElement>) => void = (e: React.MouseEvent<HTMLButtonElement>) => {
        const newMomentLoad: MomentLoad = {id: momentLoadID, kipft: 0, xCoord: 0, yCoord: 0};
        setMomentLoadID(momentLoadID + 1);
        setMomentLoads([...momentLoads, newMomentLoad]);
    }
    const handleRemoveMomentLoad: (event: React.MouseEvent<HTMLButtonElement>, id: number) => void = (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
        setMomentLoads(momentLoads.filter(load => load.id !== id))
    }
    const handleModifyMomentLoad: (event: React.ChangeEvent<HTMLInputElement>, id: number, param: 'kipft' | 'x' | 'y') => void =
        (e: React.ChangeEvent<HTMLInputElement>, id: number, param: 'kipft' | 'x' | 'y') => {
            const newValue = parseInt(e.target.value);
            const modifiedMomentLoads: MomentLoad[] = momentLoads.map( load => {
                if(load.id === id){
                    switch(param){
                        case 'kipft': return {...load, kipft: newValue}
                        case 'x': return {...load, xCoord: newValue}
                        case 'y': return {...load, yCoord: newValue}
                    }
                }
                return load;
            })
            setMomentLoads(modifiedMomentLoads);
    }

    // functions
    const generatePointLoadInputs: (id: number) => TextFieldProps[] = (id: number) => {
        return [
            {sx: {pr:3}, label: 'kips', defaultValue: 0, size: 'small', variant: 'standard', onChange: (e) => handleModifyPointLoad(e, id, 'kips')},
            {sx: {pr:3}, label: 'x', defaultValue: 0, size: 'small', variant: 'standard', onChange: (e) => handleModifyPointLoad(e, id, 'x')},
            {sx: {pr:3}, label: 'y', defaultValue: 0, size: 'small', variant: 'standard', onChange: (e) => handleModifyPointLoad(e, id, 'y')},
        ]
    }
    const generateMomentLoadInputs: (id: number) => TextFieldProps[] = (id: number) => {
        return [
            {sx: {pr:3}, label: 'kip-ft', defaultValue: 0, size: 'small', variant: 'standard', onChange: (e) => handleModifyMomentLoad(e, id, 'kipft')},
            {sx: {pr:3}, label: 'x', defaultValue: 0, size: 'small', variant: 'standard', onChange: (e) => handleModifyMomentLoad(e, id, 'x')},
            {sx: {pr:3}, label: 'y', defaultValue: 0, size: 'small', variant: 'standard', onChange: (e) => handleModifyMomentLoad(e, id, 'y')},
        ]
    }
    const foundationProps: (SvgProps: svgProps, rotated?: boolean, section?: boolean) => RectProps = (SvgProps: svgProps, rotated: boolean = false, section: boolean = false) => {
        const viewBox: number[] = SvgProps.viewBox.split(' ').map( (index: string) => Number.parseInt(index));
        const viewBoxWidth: number = viewBox[2];
        const viewBoxHeight: number = viewBox[3];

        const rectWidth: number = rotated ? height : width;
        const rectHeight: number = section ? thickness : rotated ? width : height;
        const rectX: number = ((viewBoxWidth - rectWidth) / 2);
        const rectY: number = ((viewBoxHeight - rectHeight) / 2);

        const foundationProps: RectProps = {
            x: rectX,
            y: rectY,
            width: rectWidth,
            height: rectHeight,
            fill: '#e0e0e0',
            stroke: 'black',
            'stroke-width': 0.5
        }; 
        return foundationProps;
    }
    const bottomLeftCorner: (svgProps: svgProps, type: 'plan' | 'planRotated' | 'section' | 'sectionRotated' | 'none') => [number, number] = (svgProps: svgProps, type: string) => {
        const viewBox: number[] = svgProps.viewBox.split(' ').map( (index: string) => Number.parseInt(index));
        const viewBoxWidth: number = viewBox[2];
        const viewBoxHeight: number = viewBox[3];

        let rectWidth: number = 0;
        let rectHeight: number = 0;
        if(type === 'plan'){
            rectWidth = width;
            rectHeight = height;
        }
        if(type === 'planRotated'){
            rectWidth = height;
            rectHeight = width;
        }
        if(type === 'section'){
            rectWidth = width;
            rectHeight = thickness;
        }
        if(type === 'sectionRotated'){
            rectWidth = height;
            rectHeight = thickness;
        }
        const horizontalShift: number = ((viewBoxWidth - rectWidth) / 2);
        const verticalShift: number = ((viewBoxHeight + rectHeight) / 2);

        return [horizontalShift, verticalShift]
    }
    const foundationTitle: (svgProps: svgProps) => {x: number, y: number} = (svgProps: svgProps) => {
        const viewBox: number[] = svgProps.viewBox.split(' ').map( (index: string) => Number.parseInt(index));
        return {x: viewBox[2] / 2, y: viewBox[3], textAnchor: 'middle', fontSize: '5px'};
    }

    // constants
    const dimensionInput: TextFieldProps[] = [
        {label: 'Width, ft (B)', defaultValue: 0, size: 'small', variant: 'standard', onChange: handleWidthChange},
        {label: 'Length, ft (L)', defaultValue: 0, size: 'small', variant: 'standard', onChange: handleHeightChange},
        {label: 'Thickness, in (t)', defaultValue: 0, size: 'small', variant: 'standard', onChange: handleThicknessChange},
    ];

    const svgProps: svgProps = {
        viewBox: '0 0 100 60',
        width: '50vw',
        height: '30vw',
    }




 
/*
    const validateLoadLocation: (loadLocation: number, maximum: number) => boolean = (loadLocation: number, maximum: number) => {
        return (loadLocation >= 0 && !isNaN(loadLocation) && loadLocation <= maximum) && (width !== 0 && height !== 0 && thickness !== 0)
    } */


    return (
        <>  
            {/* title*/}
            <Divider />
            <Box>
                <Typography variant='h1' sx={{ fontSize: '3em', textAlign: 'center'}}>Foundation Bearing Pressure</Typography>
            </Box>
            <Divider />

            {/* dimensions, point loads, moments*/}
            <Grid container sx={{ mt: '1em' }} spacing={20}>

                {/* dimensions */}
                <Grid size={4}>
                    <Stack sx={{ py: 1 }}>          
                        <Typography variant='subtitle1'>Dimensions</Typography>
                        {dimensionInput.map( input => 
                            <TextField {...input} key={input.label}/>)
                        }
                    </Stack>
                </Grid>

                {/* point loads */}
                <Grid size={4}>
                    <Stack sx={{ alignItems: 'flex-start', py: 1 }}>          
                        <Typography variant='subtitle1'>Point Loads</Typography>
                        {pointLoads.map( load =>
                            <Box key={load.id} display='flex'>
                                {generatePointLoadInputs(load.id).map( input => 
                                    <TextField {...input} key={load.id.toString() + input.label}/>
                                )}
                                <RemoveButton id={load.id} onClick={handleRemovePointLoad}></RemoveButton>
                            </Box>
                        )}
                        <AddButton onClick={handleAddPointLoad}></AddButton>
                    </Stack>
                </Grid>

                {/* moments */}
                <Grid size={4}>
                    <Stack sx={{ alignItems: 'flex-start', py: 1 }}>          
                        <Typography variant='subtitle1'>Moments</Typography>
                        {momentLoads.map( load =>
                            <Box key={load.id} display='flex'>
                                {generateMomentLoadInputs(load.id).map( input => 
                                    <TextField {...input} key={load.id.toString() + input.label}/>
                                )}
                                <RemoveButton id={load.id} onClick={handleRemoveMomentLoad}></RemoveButton>
                            </Box>
                        )}
                        <AddButton onClick={handleAddMomentLoad}></AddButton>
                    </Stack>
                </Grid>

            </Grid>

            {/* foundation plan and rotated plan*/}
            <Divider />
            <Box display='flex' sx={{ justifyContent: 'center'}}>
                <svg {...svgProps}>
                    <rect {...(foundationProps(svgProps, false))}/>
                    {pointLoads.map( load => <ArrowInto horizontalShift={bottomLeftCorner(svgProps, 'plan')[0] + load.xCoord} verticalShift={bottomLeftCorner(svgProps, 'plan')[1] - load.yCoord}/>)}
                    <text {...foundationTitle(svgProps)}>Foundation Plan x-x</text>
                    <text x={bottomLeftCorner(svgProps, 'plan')[0] + width / 2} y={bottomLeftCorner(svgProps, 'plan')[1] + 4} textAnchor="middle" fontSize={4}>B</text>
                    <text x={bottomLeftCorner(svgProps, 'plan')[0] + width + 1} y={bottomLeftCorner(svgProps, 'plan')[1] - height / 2 + 1} fontSize={4}>L</text>
                </svg>
                <svg {...svgProps}>
                    <rect {...(foundationProps(svgProps, true))}/>
                    {pointLoads.map( load => <ArrowInto horizontalShift={bottomLeftCorner(svgProps, 'planRotated')[0] + load.yCoord} verticalShift={bottomLeftCorner(svgProps, 'planRotated')[1] + load.xCoord - width}/>)}
                    <text {...foundationTitle(svgProps)}>Foundation Plan y-y</text>
                    <text x={bottomLeftCorner(svgProps, 'planRotated')[0] + height / 2} y={bottomLeftCorner(svgProps, 'planRotated')[1] + 4} textAnchor="middle" fontSize={4}>L</text>
                    <text x={bottomLeftCorner(svgProps, 'planRotated')[0] + height + 1} y={bottomLeftCorner(svgProps, 'planRotated')[1] - width / 2 + 1} fontSize={4}>B</text>
                </svg>
            </Box>

            {/* foundation section and rotated section */}
            <Box display='flex' sx={{ justifyContent: 'center'}}>
                <svg {...svgProps}>
                    {pointLoads.map( load => <Arrow horizontalShift={bottomLeftCorner(svgProps, 'section')[0] + load.xCoord} verticalShift={bottomLeftCorner(svgProps, 'section')[1] - thickness}/>)}
                    <rect {...(foundationProps(svgProps, false, true))}/>
                    <text {...foundationTitle(svgProps)}>Foundation Section x-x</text>
                    <text x={bottomLeftCorner(svgProps, 'section')[0] + width / 2} y={bottomLeftCorner(svgProps, 'section')[1] + 4} textAnchor="middle" fontSize={4}>B</text>
                    <text x={bottomLeftCorner(svgProps, 'section')[0] + width + 1} y={bottomLeftCorner(svgProps, 'section')[1] - thickness / 2 + 1} fontSize={4}>t</text>
                </svg>
                <svg {...svgProps}>
                    {pointLoads.map( load => <Arrow horizontalShift={bottomLeftCorner(svgProps, 'sectionRotated')[0] + load.yCoord} verticalShift={bottomLeftCorner(svgProps, 'sectionRotated')[1] - thickness}/>)}
                    <rect {...(foundationProps(svgProps, true, true))}/>
                    <text {...foundationTitle(svgProps)}>Foundation Plan y-y</text>
                    <text x={bottomLeftCorner(svgProps, 'sectionRotated')[0] + height / 2} y={bottomLeftCorner(svgProps, 'sectionRotated')[1] + 4} textAnchor="middle" fontSize={4}>L</text>
                    <text x={bottomLeftCorner(svgProps, 'sectionRotated')[0] + height + 1} y={bottomLeftCorner(svgProps, 'sectionRotated')[1] - thickness / 2 + 1} fontSize={4}>t</text>
                </svg>
            </Box>
            <Divider />

        </>
    );
};

export default Foundation
