import { AppBar, Box, Grid, Toolbar, Typography } from "@mui/material"


function NavBar() {

  return (
    <>
        <AppBar position="static" color="default" elevation={0} sx={{backgroundColor: 'white'}}>
            <Toolbar variant='regular' disableGutters={true}>
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container>
                        <Grid>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <img src='/src/assets/bridge.png' style={{height: 60, width: 'auto'}}></img>
                                <Typography fontSize={50} fontStyle='italic' fontFamily='cursive'>S</Typography>
                            </Box>
                        </Grid>
                        <Grid sx={{ alignContent: 'center' }}>
                            <Box>
                                <Typography pt={0.4} lineHeight={1} fontSize={20} fontWeight='medium' fontStyle='oblique'>tructural</Typography>
                                <Typography lineHeight={1} fontSize={20} fontWeight='medium' fontStyle='oblique'>amples</Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Toolbar>
        </AppBar>
    </>
  )
}

export default NavBar
