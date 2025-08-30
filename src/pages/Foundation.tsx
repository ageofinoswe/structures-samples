import { Box, Divider, Grid, Stack, TextField, Typography } from "@mui/material"
import React from "react";
import RemoveButton from "../components/RemoveButton";
import AddButton from "../components/AddButton";

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

    interface SvgProps {
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
        setWidth(parseInt(e.target.value))
    }
    const handleHeightChange: (event: React.ChangeEvent<HTMLInputElement>) => void = (e: React.ChangeEvent<HTMLInputElement>) => {
        setHeight(parseInt(e.target.value))
    }
    const handleThicknessChange: (event: React.ChangeEvent<HTMLInputElement>) => void = (e: React.ChangeEvent<HTMLInputElement>) => {
        setThickness(parseInt(e.target.value))
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
            {sx: {pr:3}, label: 'kipft', defaultValue: 0, size: 'small', variant: 'standard', onChange: (e) => handleModifyMomentLoad(e, id, 'kipft')},
            {sx: {pr:3}, label: 'x', defaultValue: 0, size: 'small', variant: 'standard', onChange: (e) => handleModifyMomentLoad(e, id, 'x')},
            {sx: {pr:3}, label: 'y', defaultValue: 0, size: 'small', variant: 'standard', onChange: (e) => handleModifyMomentLoad(e, id, 'y')},
        ]
    }
    const foundationProps: (SvgProps: SvgProps, rotated?: boolean, section?: boolean) => RectProps = (SvgProps: SvgProps, rotated: boolean = false, section: boolean = false) => {
        const viewBox: number[] = SvgProps.viewBox.split(' ').map( (index: string) => Number.parseInt(index));
        const viewBoxWidth: number = viewBox[2];
        const viewBoxHeight: number = viewBox[3];

        const rectWidth: number = rotated ? height : width;
        const rectHeight: number = section ? thickness/12 : rotated ? width : height;
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

    // constants
    const dimensionInput: TextFieldProps[]= [
        {label: 'Width, ft', defaultValue: 0, size: 'small', variant: 'standard', onChange: handleWidthChange},
        {label: 'Length, ft', defaultValue: 0, size: 'small', variant: 'standard', onChange: handleHeightChange},
        {label: 'Thickness, in', defaultValue: 0, size: 'small', variant: 'standard', onChange: handleThicknessChange},
    ];

    const SvgProps: SvgProps = {
        viewBox: '0 0 75 75',
        width: '50vw',
        height: '30vw',
    }




/*     const loadShift: (SvgProps: SvgProps, type: 'plan' | 'planRotated' | 'section' | 'sectionRotated') => [number, number] = (SvgProps: SvgProps, type: string) => {
        const viewBox: number[] = SvgProps.viewBox.split(' ').map( (index: string) => Number.parseInt(index));
        const viewBoxWidth: number = viewBox[2];
        const viewBoxHeight: number = viewBox[3];

        const rectWidth: number = type === 'plan' ? width : height;
        const rectHeight: number = type === 'plan' ? height : (type === 'rotated' ? width : thickness);
        const horizontalShift: number = ((viewBoxWidth - rectWidth) / 2);
        const verticalShift: number = ((viewBoxHeight - rectHeight) / 2);

        return [horizontalShift, verticalShift]
    }

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
            <Box display='flex' sx={{ justifyContent: 'center'}}>
                <svg {...SvgProps}>
                    <rect {...(foundationProps(SvgProps, false))}/>
                </svg>
                <svg {...SvgProps}>
                    <rect {...(foundationProps(SvgProps, true))}/>
                </svg>
            </Box>

            {/* foundation section and rotated section */}
            <Box display='flex' sx={{ justifyContent: 'center'}}>
                <svg {...SvgProps}>
                    <rect {...(foundationProps(SvgProps, false, true))}/>
                </svg>
                <svg {...SvgProps}>
                    <rect {...(foundationProps(SvgProps, true, true))}/>
                </svg>
            </Box>
        </>
    );
};

export default Foundation
