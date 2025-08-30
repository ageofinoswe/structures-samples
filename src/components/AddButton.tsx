import { IconButton } from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

interface ButtonProps {
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
}

function AddButton({onClick} : ButtonProps) {
    return(
        <>
            <IconButton sx={{ px: 0, mx: 0 }} onClick={onClick}>
                <AddCircleOutlineIcon sx={{ color: 'green' }}/>
            </IconButton>
        </>
    )
}

export default AddButton