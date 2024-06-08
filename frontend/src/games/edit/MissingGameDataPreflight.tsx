import { LoadingButton } from '@mui/lab';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormLabel,
    MenuItem,
    Radio,
    RadioGroup,
    Stack,
    TextField,
} from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import {
    BoardOrientation,
    GameHeader,
    parsePgnDate,
    stripTagValue,
    toPgnDate,
} from '../../api/gameApi';
import { GameResult, PgnHeaders, isGameResult } from '../../database/game';

interface FormHeader {
    white: string;
    black: string;
    date: DateTime | null;
    result: string;
}

function getFormHeader(h?: PgnHeaders): FormHeader {
    const result = h?.Result ?? '';

    return {
        result,
        date: parsePgnDate(h?.Date),
        white: stripTagValue(h?.White || ''),
        black: stripTagValue(h?.Black || ''),
    };
}

export function getGameHeaders(h: FormHeader): GameHeader {
    return {
        date: toPgnDate(h.date) ?? '',
        white: h.white,
        black: h.black,
        result: h.result,
    };
}

interface FormError {
    white: string;
    black: string;
    date: string;
    result: string;
}

interface MissingGameDataPreflightProps {
    open: boolean;
    onClose: () => void;
    initHeaders?: PgnHeaders;
    initOrientation?: BoardOrientation;
    loading: boolean;
    title?: string;
    skippable?: boolean;
    children?: React.ReactNode;
    onSubmit: (headers: GameHeader, orientation: BoardOrientation) => void;
}

export const MissingGameDataPreflight = ({
    open,
    onClose,
    initHeaders,
    initOrientation,
    loading,
    skippable,
    title,
    children,
    onSubmit,
}: MissingGameDataPreflightProps) => {
    const [headers, setHeaders] = useState<FormHeader>(getFormHeader(initHeaders));
    const [errors, setErrors] = useState<Partial<FormError>>({});
    const [orientation, setOrientation] = useState<BoardOrientation>(
        initOrientation ?? 'white',
    );

    if (skippable === undefined) {
        skippable = false;
    }

    if (title === undefined) {
        title = 'Missing Data';
    }

    useEffect(() => {
        setHeaders(getFormHeader(initHeaders));
    }, [initHeaders]);

    const onChangeHeader = (key: keyof GameHeader, value: string | DateTime | null) => {
        setHeaders((oldHeaders) => ({ ...oldHeaders, [key]: value }));
    };

    const submit = () => {
        const newErrors: Partial<FormError> = {};

        if (!skippable) {
            if (stripTagValue(headers.white) === '') {
                newErrors.white = 'This field is required';
            }
            if (stripTagValue(headers.black) === '') {
                newErrors.black = 'This field is required';
            }
            if (!isGameResult(headers.result)) {
                newErrors.result = 'This field is required';
            }
            if (!headers.date?.isValid) {
                newErrors.date = 'This field is required';
            }
        }

        setErrors(newErrors);
        if (Object.values(newErrors).length > 0) {
            return;
        }

        onSubmit(getGameHeaders(headers), orientation);
    };

    return (
        <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth='lg'>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                {children && <DialogContentText>{children}</DialogContentText>}

                <Stack spacing={3} mt={3}>
                    <Grid2 container columnSpacing={1} rowSpacing={2}>
                        <Grid2 xs={12} sm={true}>
                            <TextField
                                fullWidth
                                data-cy='white'
                                label="White's name"
                                value={headers.white}
                                onChange={(e) => onChangeHeader('white', e.target.value)}
                                error={!!errors.white}
                                helperText={errors.white}
                            />
                        </Grid2>

                        <Grid2 xs={12} sm={true}>
                            <TextField
                                fullWidth
                                data-cy='black'
                                label="Black's name"
                                value={headers.black}
                                onChange={(e) => onChangeHeader('black', e.target.value)}
                                error={!!errors.black}
                                helperText={errors.black}
                            />
                        </Grid2>

                        <Grid2 xs={12} sm={true}>
                            <TextField
                                select
                                data-cy='result'
                                label='Game Result'
                                value={headers.result.replaceAll('*', '')}
                                onChange={(e) => onChangeHeader('result', e.target.value)}
                                error={!!errors.result}
                                helperText={errors.result}
                                fullWidth
                            >
                                <MenuItem value={GameResult.White}>White Won</MenuItem>
                                <MenuItem value={GameResult.Draw}>Draw</MenuItem>
                                <MenuItem value={GameResult.Black}>Black Won</MenuItem>
                            </TextField>
                        </Grid2>

                        <Grid2 xs={12} sm={true}>
                            <DatePicker
                                label='Date'
                                disableFuture
                                value={headers.date}
                                onChange={(newValue) => {
                                    onChangeHeader('date', newValue);
                                }}
                                slotProps={{
                                    textField: {
                                        id: 'date',
                                        error: !!errors.date,
                                        helperText: errors.date,
                                        fullWidth: true,
                                    },
                                    field: {
                                        clearable: true,
                                    },
                                }}
                            />
                        </Grid2>

                        <Grid2 xs={12}>
                            <FormControl>
                                <FormLabel>Default Orientation</FormLabel>
                                <RadioGroup
                                    row
                                    value={orientation}
                                    onChange={(e) =>
                                        setOrientation(e.target.value as BoardOrientation)
                                    }
                                >
                                    <FormControlLabel
                                        value='white'
                                        control={<Radio />}
                                        label='White'
                                    />
                                    <FormControlLabel
                                        value='black'
                                        control={<Radio />}
                                        label='Black'
                                    />
                                </RadioGroup>
                            </FormControl>
                        </Grid2>
                    </Grid2>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button data-cy='cancel-preflight' onClick={onClose} disabled={loading}>
                    {skippable ? 'Skip for now' : 'Cancel'}
                </Button>
                <LoadingButton
                    data-cy='submit-preflight'
                    onClick={submit}
                    loading={loading}
                >
                    Submit
                </LoadingButton>
            </DialogActions>
        </Dialog>
    );
};
