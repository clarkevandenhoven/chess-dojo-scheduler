import { useState } from 'react';
import axios from 'axios';
import {
    Checkbox,
    Container,
    FormControlLabel,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

import { AuthStatus, useAuth } from '../../auth/Auth';
import LoadingPage from '../../loading/LoadingPage';
import { RequestSnackbar, RequestStatus, useRequest } from '../../api/Request';
import { useApi } from '../../api/Api';

function gamePlayed(result: string): boolean {
    return result !== '0-0' && result !== '1-0F' && result !== '0-1F';
}

const SubmitResultsPage = () => {
    const auth = useAuth();
    const user = auth.user;
    const api = useApi();

    const [email, setEmail] = useState('');
    const [section, setSection] = useState('');
    const [region, setRegion] = useState('');
    const [round, setRound] = useState('');
    const [gameUrl, setGameUrl] = useState('');
    const [white, setWhite] = useState('');
    const [black, setBlack] = useState('');
    const [result, setResult] = useState('');
    const [reportOpponent, setReportOpponent] = useState(false);
    const [notes, setNotes] = useState('');

    const [errors, setErrors] = useState<Record<string, string>>({});
    const request = useRequest();

    if (auth.status === AuthStatus.Loading) {
        return <LoadingPage />;
    }

    const onBlurGameUrl = () => {
        if (!gameUrl.startsWith('https://lichess.org/')) {
            setErrors({
                ...errors,
                gameUrl: '',
            });
            return;
        }
        const gameId = gameUrl.replace('https://lichess.org/', '');

        axios
            .get(`https://lichess.org/api/game/${gameId}`)
            .then((resp) => {
                console.log('Lichess Game Resp: ', resp);
                setWhite(resp.data.players.white.userId);
                setBlack(resp.data.players.black.userId);
                const status = resp.data.status;
                if (status === 'stalemate' || status === 'draw') {
                    setResult('1/2-1/2');
                } else if (resp.data.winner === 'white') {
                    setResult('1-0');
                } else if (resp.data.winner === 'black') {
                    setResult('0-1');
                }
            })
            .catch((err) => {
                console.error(err);
                setErrors({
                    ...errors,
                    gameUrl:
                        'Unable to fetch results from Lichess. Please ensure this is the correct URL before submitting.',
                });
            });
    };

    const onSubmit = () => {
        const newErrors: Record<string, string> = {};

        if (!user && email.trim() === '') {
            newErrors.email = 'This field is required';
        }
        if (region === '') {
            newErrors.region = 'This field is required';
        }
        if (section === '') {
            newErrors.section = 'This field is required';
        }
        if (round.trim() === '') {
            newErrors.round = 'This field is required';
        }
        if (gamePlayed(result) && gameUrl.trim() === '') {
            newErrors.gameUrl = 'This field is required';
        }
        if (white.trim() === '') {
            newErrors.white = 'This field is required';
        }
        if (black.trim() === '') {
            newErrors.black = 'This field is required';
        }
        if (result.trim() === '') {
            newErrors.result = 'This field is required';
        }

        setErrors(newErrors);
        if (Object.entries(newErrors).length > 0) {
            return;
        }

        request.onStart();
        api.submitResultsForOpenClassical({
            email: email.trim(),
            region,
            section,
            round: round.trim(),
            gameUrl: gameUrl.trim(),
            white: white.trim(),
            black: black.trim(),
            result: result.trim(),
            reportOpponent,
            notes: notes.trim(),
        })
            .then((resp) => {
                console.log('submitResultsForOpenClassical: ', resp);
                request.onSuccess();
            })
            .catch((err) => {
                console.error(err);
                request.onFailure(err);
            });
    };

    if (request.status === RequestStatus.Success) {
        return (
            <Container maxWidth='md' sx={{ py: 5 }}>
                <Stack spacing={4}>
                    <Typography data-cy='title' variant='h6'>
                        Submit Results for the Open Classical
                    </Typography>

                    <Typography>Your submission has been recorded. Thank you!</Typography>
                </Stack>
            </Container>
        );
    }

    return (
        <Container maxWidth='md' sx={{ py: 5 }}>
            <RequestSnackbar request={request} />

            <Stack spacing={4}>
                <Typography data-cy='title' variant='h6'>
                    Submit Results for the Open Classical
                </Typography>

                {!user && (
                    <TextField
                        data-cy='email'
                        label='Email'
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={Boolean(errors.email)}
                        helperText={
                            errors.email ||
                            'Please provide the same email addess you used to register for the tournament'
                        }
                    />
                )}

                <TextField
                    data-cy='region'
                    label='Region'
                    select
                    required
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    error={Boolean(errors.region)}
                    helperText={errors.region}
                >
                    <MenuItem value='A'>Region A (Americas)</MenuItem>
                    <MenuItem value='B'>Region B (Eurasia/Africa/Oceania)</MenuItem>
                </TextField>

                <TextField
                    data-cy='section'
                    label='Section'
                    select
                    required
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    error={Boolean(errors.section)}
                    helperText={errors.section}
                >
                    <MenuItem value='Open'>Open</MenuItem>
                    <MenuItem value='U1800'>U1800</MenuItem>
                </TextField>

                <TextField
                    data-cy='round'
                    label='Round'
                    select
                    required
                    value={round}
                    onChange={(e) => setRound(e.target.value)}
                    error={Boolean(errors.round)}
                    helperText={errors.round}
                >
                    {Array.from(Array(7)).map((_, i) => (
                        <MenuItem key={i} value={`${i + 1}`}>
                            {i + 1}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    data-cy='game-url'
                    label='Game URL'
                    value={gameUrl}
                    onChange={(e) => setGameUrl(e.target.value)}
                    onBlur={onBlurGameUrl}
                    error={Boolean(errors.gameUrl)}
                    helperText={errors.gameUrl || 'Please provide a link to the game'}
                />

                <TextField
                    data-cy='white'
                    label='White'
                    required
                    value={white}
                    onChange={(e) => setWhite(e.target.value)}
                    error={Boolean(errors.white)}
                    helperText={
                        errors.white ||
                        'Lichess username of the player with the white pieces'
                    }
                />
                <TextField
                    data-cy='black'
                    label='Black'
                    required
                    value={black}
                    onChange={(e) => setBlack(e.target.value)}
                    error={Boolean(errors.black)}
                    helperText={
                        errors.black ||
                        'Lichess username of the player with the black pieces'
                    }
                />

                <TextField
                    data-cy='result'
                    label='Result'
                    select
                    required
                    value={result}
                    onChange={(e) => setResult(e.target.value)}
                    error={Boolean(errors.result)}
                    helperText={errors.result}
                >
                    <MenuItem value='1-0'>White Wins (1-0)</MenuItem>
                    <MenuItem value='0-1'>Black Wins (0-1)</MenuItem>
                    <MenuItem value='1/2-1/2'>Draw (1/2-1/2)</MenuItem>
                    <MenuItem value='0-0'>Did Not Play (1/2-1/2)</MenuItem>
                    <MenuItem value='0-1F'>White Forfeits (0-1F)</MenuItem>
                    <MenuItem value='1-0F'>Black Forfeits (1-0F)</MenuItem>
                </TextField>

                {(result === '0-1F' || result === '1-0F') && (
                    <FormControlLabel
                        data-cy='report-opponent'
                        control={
                            <Checkbox
                                checked={reportOpponent}
                                onChange={(event) =>
                                    setReportOpponent(event.target.checked)
                                }
                            />
                        }
                        label='Report opponent for unresponsiveness or unwillingness to schedule?'
                    />
                )}

                <TextField
                    data-cy='notes'
                    label='Notes'
                    multiline
                    minRows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />

                <LoadingButton
                    data-cy='submit-button'
                    variant='contained'
                    loading={request.isLoading()}
                    onClick={onSubmit}
                    sx={{ alignSelf: 'center' }}
                >
                    Submit
                </LoadingButton>
            </Stack>
        </Container>
    );
};

export default SubmitResultsPage;
