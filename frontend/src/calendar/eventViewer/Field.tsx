import { Stack, Typography } from '@mui/material';
import Icon from '../../style/Icon';

interface FieldProps {
    title?: string;
    body?: string;
    showEmptyBody?: boolean;
    iconName?: string;
}

const Field: React.FC<FieldProps> = ({ title, body, showEmptyBody, iconName }) => {
    if (!title || (!showEmptyBody && !body)) {
        return null;
    }

    return (
        <Stack>
            <Typography variant='h6' color='text.secondary'>
                <Icon
                    name={iconName}
                    color='primary'
                    sx={{ marginRight: '0.3rem', verticalAlign: 'middle' }}
                />
                {title}
            </Typography>
            <Typography variant='body1'>{body}</Typography>
        </Stack>
    );
};

export default Field;
