import { AppBar, Box, Stack, Tab, Tabs, Toolbar, Typography } from "@mui/material"
import React from "react"
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom'

function Navbar() {
    const path = useLocation().pathname.split('/');
    const tab = path[path.length - 1] === '' ? 'foundation' : path[path.length - 1];

    /* sets which tab is active */
    const [value, setValue] = React.useState(tab);

    /* changes tab state */
    const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    /* logo textual styling */
    const logoText = {
        lineHeight: 1,
        fontSize: 25,
        fontWeight: 'medium',
        fontStyle: 'oblique'
    }

    /* active tab styling */
    const tabStyle = {
        mx: '4em',
        '&.Mui-selected': { color: '#69b15f'},
        '& .MuiTabs-indicator' : {backgroundColor: '#004ea8'}
    }

    return (
        <>
            <AppBar position="static" color="default" elevation={0} sx={{backgroundColor: 'white'}}>
                <Toolbar disableGutters={true}>
                    <img src='/src/assets/bridge.png' style={{height: 60, width: 'auto'}}></img>
                    <Typography fontSize={50} fontStyle='italic' fontFamily='cursive'>S</Typography>
                    <Stack>
                        <Typography sx={logoText} pt={0.5} >tructural</Typography>
                        <Typography sx={{...logoText, fontSize:20}}>amples</Typography>
                    </Stack>
                    <Box sx={{ justifyItems: 'center', flexGrow: 1 }}>
                        <Tabs sx={tabStyle} value={value} onChange={handleChange}>
                            <Tab sx={tabStyle} value='foundation' component={Link} to='/foundation' label='Foundation Bearing Pressure'/>
                            <Tab sx={tabStyle} value='pier' component={Link} to='/pier' label='Pier Foundation Depth'/>
                        </Tabs>
                    </Box>
                </Toolbar>
            </AppBar>
        </>
    )
}

export default Navbar
