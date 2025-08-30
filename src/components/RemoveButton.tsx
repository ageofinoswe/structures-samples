import { IconButton } from "@mui/material";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

interface ButtonProps {
    id: number,
    onClick: (event: React.MouseEvent<HTMLButtonElement>, id: number) => void
}

function RemoveButton({id, onClick} : ButtonProps) {
    return(
        <>
            <IconButton sx={{ p: 0, m: 0, alignItems: 'flex-end' }} onClick={ (e) => onClick(e, id)}>
                <RemoveCircleOutlineIcon sx={{ color: 'red' }}/>
            </IconButton>
        </>
    )
}

export default RemoveButton