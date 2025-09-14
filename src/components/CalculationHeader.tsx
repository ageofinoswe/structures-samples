import { Grid, Typography } from "@mui/material";

function CalculationHeader () {
    const props = {
        sx: {fontWeight: 'bold',
        }
    }

    return (
        <>
            <Grid size={1.5}>
                <Typography {...props}>description</Typography>
            </Grid>
            <Grid size={1}>
                <Typography {...props}>variable</Typography>
            </Grid>
            <Grid size={1}>
                <Typography {...props}>value</Typography>
            </Grid>
            <Grid size={1}>
                <Typography {...props}>units</Typography>
            </Grid>
            <Grid size={2}>
                <Typography {...props}>formula</Typography>
            </Grid>
            <Grid size={5.5}>
                <div></div>
            </Grid>
        </>
    )
}

export default CalculationHeader;