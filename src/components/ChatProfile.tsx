import { Typography, Box } from "@mui/material";

export type User = {
	photo: string | null | undefined;
    nom: string | undefined;
}

type Props = User

export default function ChatProfile({ photo, nom }: Props) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '5px'
            }}
        >
            <img
                src={photo || 'https://cdn-icons-png.flaticon.com/128/1144/1144760.png'}
                style={{ clipPath: 'circle()' }}
                alt={nom}
                width={50}
            />
            <Typography variant="h6" fontWeight='bold' color='#64675A' noWrap component="div">
                {nom}
            </Typography>
        </Box>
    );
}