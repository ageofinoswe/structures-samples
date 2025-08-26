import { AppBar, Box, Grid, Stack, Tab, Tabs, Toolbar, Typography } from "@mui/material"
import React from "react"


function NavBar() {
    const [value, setValue] = React.useState('primary');

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    return (
    <>
        <AppBar position="static" color="default" elevation={0} sx={{backgroundColor: 'white'}}>
            <Toolbar disableGutters={true}>
                <img src='/src/assets/bridge.png' style={{height: 60, width: 'auto'}}></img>
                <Typography fontSize={50} fontStyle='italic' fontFamily='cursive'>S</Typography>
                <Stack>
                    <Typography pt={0.5} lineHeight={1} fontSize={25} fontWeight='medium' fontStyle='oblique'>tructural</Typography>
                    <Typography lineHeight={1} fontSize={20} fontWeight='medium' fontStyle='oblique'>amples</Typography>
                </Stack>
                <Box sx={{ justifyItems: 'center', flexGrow: 1 }}>
                    <Tabs value={value} onChange={handleChange} textColor="primary" indicatorColor="secondary" aria-label="secondary tabs example">
                        <Tab value='one' label='Shear & Moment Diagrams'/>
                        <Tab value='two' label='Foundation Bearing Pressure'/>
                        <Tab value='three' label='Pier Foundation Depth'/>
                    </Tabs>
                </Box>
            </Toolbar>
        </AppBar>
    </>
    )
}

export default NavBar
