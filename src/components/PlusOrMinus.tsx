import { Button, Stack } from "@mui/material";

// creates buttons for + or - to negate values in the input fields

interface Active {
    active: boolean
    field: string,
    negate: (event: any, field: string) => void;
}

function PlusOrMinus({active, field, negate}: Active) {
    const dims = '15px';
    const props = {
        minWidth: 0,
        width: dims,
        height: dims,
        mr: 1,
        backgroundColor: active ? '#d3d3d3ff' : 'white',
        fontSize: 18,
        color: 'black',
        borderRadius: 1
    }

    return (
        <>
            <Stack>
                <Button sx={{...props}} onClick={event => negate(event, field)}>+</Button>
                <Button sx={{...props, backgroundColor: !active ? 'lightgrey' : 'white'}} onClick={event => negate(event, field)}>-</Button>
            </Stack>
        </>
    )
}

export default PlusOrMinus;