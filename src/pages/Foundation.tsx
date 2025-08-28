import { Box, Stack, TextField, Typography } from "@mui/material"
import React from "react";


function Foundation() {
    const [width, setWidth] = React.useState('0');
    const [height, setHeight] = React.useState('0');
    const [thickness, setThickness] = React.useState('0');

    interface textFieldProps {
        label: string,
        defaultValue: number,
        size: 'small' | 'medium',
        variant: 'standard' | 'outlined',
        onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    };

    interface rectProps {
        x: string,
        y: string,
        width: string,
        height: string,
        fill: string,
        stroke: string,
        'stroke-width': number
    }

    interface svgProps {
        viewBox: string,
        width: string,
        height: string,
    }

    const handleHeightChange : (event: React.ChangeEvent<HTMLInputElement>) => void = (e: React.ChangeEvent<HTMLInputElement>) => {
        setHeight(e.target.value)
    }
    const handleWidthChange : (event: React.ChangeEvent<HTMLInputElement>) => void = (e: React.ChangeEvent<HTMLInputElement>) => {
        setWidth(e.target.value)
    }
    const handleThicknessChange : (event: React.ChangeEvent<HTMLInputElement>) => void = (e: React.ChangeEvent<HTMLInputElement>) => {
        setThickness(e.target.value)
    }

    const dimensionInput: textFieldProps[]= [
        {label: 'Width', defaultValue: 0, size: 'small', variant: 'standard', onChange: handleWidthChange},
        {label: 'Length', defaultValue: 0, size: 'small', variant: 'standard', onChange: handleHeightChange},
        {label: 'Thickness', defaultValue: 0, size: 'small', variant: 'standard', onChange: handleThicknessChange},
    ];

    const loadInput: textFieldProps[]= [
        {label: 'Load', defaultValue: 0, size: 'small', variant: 'standard', onChange: handleWidthChange},
        {label: 'Load', defaultValue: 0, size: 'small', variant: 'standard', onChange: handleHeightChange},
        {label: 'Load', defaultValue: 0, size: 'small', variant: 'standard', onChange: handleThicknessChange},
    ];

    const svgProps: svgProps = {
        viewBox: '0 0 100 100',
        width: '50vw',
        height: '30vw',
    }

    const foundationProps : (svgProps: svgProps, rotated?: boolean, section?: boolean) => rectProps = (svgProps: svgProps, rotated: boolean = false, section: boolean = false) => {
        const viewBox: number[] = svgProps.viewBox.split(' ').map( (index: string) => Number.parseInt(index));
        const viewBoxWidth: number = viewBox[2];
        const viewBoxHeight: number = viewBox[3];

        const rectWidth: string = rotated ? height : width;
        const rectHeight: string = section ? thickness : rotated ? width : height;
        const rectX: string = ((viewBoxWidth - Number.parseInt(rectWidth)) / 2).toString();
        const rectY: string = ((viewBoxHeight - Number.parseInt(rectHeight)) / 2).toString();

        const rectProps: rectProps = {
            x: rectX,
            y: rectY,
            width: rectWidth,
            height: rectHeight,
            fill: 'white',
            stroke: 'black',
            'stroke-width': 0.5
        };

        return rectProps;
    }

    return (
        <>        
            <Box display='flex' sx={{ justifyContent: 'center'}}>
                <svg {...svgProps}>
                    <rect {...(foundationProps(svgProps))}/>
                </svg>
                <svg {...svgProps}>
                    <rect {...(foundationProps(svgProps, true))}/>
                </svg>
            </Box>

            <Box display='flex' sx={{ justifyContent: 'center'}}>
                <svg {...svgProps}>
                    <rect {...(foundationProps(svgProps, false, true))}/>
                </svg>
                <svg {...svgProps}>
                    <rect {...(foundationProps(svgProps, true, true))}/>
                </svg>
            </Box>

            <Box display='flex' sx={{ justifyContent: 'center', gap: 20 }}>
                {dimensionInput.map( (input) => 
                    <TextField
                        label={input.label}
                        defaultValue={input.defaultValue}
                        size={input.size}
                        variant={input.variant}
                        onChange={input.onChange}
                    />)
                }
            </Box>
            
            <Box display='flex' sx={{ justifyContent: 'center', gap: 20 }}>
                {loadInput.map( (input) => 
                    <TextField
                        label={input.label}
                        defaultValue={input.defaultValue}
                        size={input.size}
                        variant={input.variant}
                        onChange={input.onChange}
                    />)
                }
            </Box>
        </>
    );
};

export default Foundation
