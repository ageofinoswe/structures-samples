import { Grid, Typography } from "@mui/material";

// calculation lines is used in the calculation sets - prefaced with a calculation header

// CALCULATION HEADER
// CALCULATION LINE
// CALCULATION LINE
//...

interface CalcLine {
    name: string,
    variable: string,
    value: number | string,
    units: string,
    formula?: string,
    highlight?: boolean,
    error?: {msg?: string},
}

function CalculationLine({name, variable, value, units, formula='-', highlight=false, error={}}: CalcLine) {
    const props = {
        sx: {fontFamily: 'Courier New', backgroundColor: highlight ? 'yellow' : 'none'
        }
    }

    return (
        <>
            <Grid size={2}>
                <Typography {...props}>{name}</Typography>
            </Grid>
            <Grid size={1}>
                <Typography {...props}>{variable}</Typography>
            </Grid>
            <Grid size={1}>
                <Typography {...props}>{typeof(value) === 'number' ? Math.round(value*1000)/1000 : value}</Typography>
            </Grid>
            <Grid size={1}>
                <Typography {...props}>{units}</Typography>
            </Grid>
            <Grid size={2}>
                <Typography {...props}>{formula}</Typography>
            </Grid>
            <Grid sx={{pl:4}} size={5}>
                {error.msg ? <Typography fontFamily={props.sx.fontFamily} color={error.msg ? 'red' : 'black'}>{error.msg}</Typography> : <div></div>}
            </Grid>
        </>
    )
}

export default CalculationLine;