import {
    getIncrement,
    getInitialClock,
} from '@/board/pgn/boardTools/underboard/clock/ClockUsage';
import { GameInfo, GameResult } from '@/database/game';
import { dojoCohorts } from '@/database/user';
import CohortIcon from '@/scoreboard/CohortIcon';
import { useLightMode } from '@/style/useLightMode';
import CircleIcon from '@mui/icons-material/Circle';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import { Box, Link, Stack, Typography } from '@mui/material';
import { GridRenderCellParams } from '@mui/x-data-grid-pro';
import { FaEquals, FaMinusSquare, FaPlusSquare } from 'react-icons/fa';
import { SiAsterisk } from 'react-icons/si';
import { Link as RouterLink, useLocation } from 'react-router-dom';

export const MastersCohort = 'masters';
export const MastersOwnerDisplayName = 'Masters DB';

export function RenderPlayersCell(params: GridRenderCellParams<GameInfo>) {
    const headers = params.row.headers;

    return (
        <RenderPlayers
            fullHeight
            whiteElo={headers.WhiteElo}
            white={headers.White}
            black={headers.Black}
            blackElo={headers.BlackElo}
            result={headers.Result}
        />
    );
}

export function GameResultIcon({
    result,
    asWhite,
}: {
    result?: string;
    asWhite: boolean;
}) {
    if (result === GameResult.White) {
        return asWhite ? <WinIcon /> : <LoseIcon />;
    }

    if (result === GameResult.Black) {
        return asWhite ? <LoseIcon /> : <WinIcon />;
    }

    if (result === GameResult.Draw) {
        return <DrawIcon />;
    }

    if (result === GameResult.Incomplete) {
        return <IncompleteIcon />;
    }

    return <IncompleteIcon />;
}

export function IncompleteIcon() {
    return (
        <Typography
            color='text.secondary'
            display='flex'
            justifyContent='center'
            alignItems='center'
        >
            <SiAsterisk fontSize='0.875rem' />
        </Typography>
    );
}

export function WinIcon() {
    return (
        <Typography
            color='success'
            display='flex'
            justifyContent='center'
            alignItems='center'
        >
            <FaPlusSquare fontSize='0.875rem' />
        </Typography>
    );
}

export function LoseIcon() {
    return (
        <Typography
            color='error'
            display='flex'
            justifyContent='center'
            alignItems='center'
        >
            <FaMinusSquare fontSize='0.875rem' />
        </Typography>
    );
}

export function DrawIcon() {
    return (
        <Typography
            color='text.secondary'
            display='flex'
            justifyContent='center'
            alignItems='center'
        >
            <FaEquals fontSize='0.875rem' />
        </Typography>
    );
}

interface RenderPlayersProps {
    white: string;
    whiteElo?: string | number;
    whiteProvisional?: boolean;
    black: string;
    blackElo?: string | number;
    blackProvisional?: boolean;
    fullHeight?: boolean;
    result?: GameResult | string;
}

export function RenderGameResultStack({ result }: { result: string | undefined }) {
    return (
        <Stack justifyContent='center' height='100%' spacing={0.25}>
            <GameResultIcon result={result} asWhite />
            <GameResultIcon result={result} asWhite={false} />
        </Stack>
    );
}

export function BlackIcon() {
    const light = useLightMode();
    const location = useLocation();

    let blackIconColor = 'grey.800';
    if (!light && location.pathname.match(/games\/.+/)) {
        blackIconColor = 'common.black';
    }

    return (
        <CircleIcon
            sx={{
                fontSize: { xs: '0.75rem', sm: 'initial' },
                color: blackIconColor,
            }}
        />
    );
}

export function RenderRatingHeader({ white }: { white: boolean }) {
    return (
        <Stack direction='row' columnGap='0.125rem'>
            {white ? <WhiteIcon /> : <BlackIcon />} Rating
        </Stack>
    );
}

export function WhiteIcon() {
    const light = useLightMode();

    return light ? (
        <CircleOutlinedIcon sx={{ fontSize: { xs: '0.75rem', sm: 'initial' } }} />
    ) : (
        <CircleIcon
            sx={{
                fontSize: { xs: '0.75rem', sm: 'initial' },
                color: 'white',
            }}
        />
    );
}

export function RenderPlayers({
    white,
    whiteElo,
    whiteProvisional,
    black,
    blackElo,
    blackProvisional,
    fullHeight,
}: RenderPlayersProps) {
    return (
        <Stack height={fullHeight ? 1 : undefined} justifyContent='center'>
            <Stack direction='row' alignItems='center' columnGap='0.25rem'>
                <WhiteIcon />
                <Typography variant='body2'>{white}</Typography>
                {whiteElo && (
                    <Typography variant='body2' overflow='hidden'>
                        {getPlayerRating(whiteElo, whiteProvisional)}
                    </Typography>
                )}
            </Stack>
            <Stack direction='row' alignItems='center' columnGap='0.25rem'>
                <BlackIcon />
                <Typography variant='body2'>{black}</Typography>
                {blackElo && (
                    <Typography variant='body2' whiteSpace='nowrap' overflow='hidden'>
                        {getPlayerRating(blackElo, blackProvisional)}
                    </Typography>
                )}
            </Stack>
        </Stack>
    );
}

export function RenderCohort({ cohort }: { cohort: string }) {
    let display = cohort;
    if (cohort && cohort !== dojoCohorts[0] && cohort !== dojoCohorts.slice(-1)[0]) {
        display = cohort.replace('00', '');
    }

    return (
        <Stack sx={{ height: 1 }} alignItems='center' justifyContent='center'>
            <CohortIcon cohort={cohort} tooltip={cohort} size={28} />
            <Typography variant='caption' sx={{ fontSize: '0.6rem' }}>
                {display === MastersCohort ? 'Masters DB' : display}
            </Typography>
        </Stack>
    );
}

export function RenderOwner({
    ownerDisplayName,
    owner,
}: {
    ownerDisplayName: GameInfo['ownerDisplayName'];
    owner: GameInfo['owner'];
}) {
    if (ownerDisplayName === '' || ownerDisplayName === MastersOwnerDisplayName) {
        return '';
    }

    return (
        <Stack
            direction='row'
            spacing={1}
            alignItems='center'
            onClick={(e) => e.stopPropagation()}
        >
            <Link component={RouterLink} to={`/profile/${owner}`}>
                {ownerDisplayName}
            </Link>
        </Stack>
    );
}

export function RenderResult(params: GridRenderCellParams) {
    if (!params.value) {
        return '?';
    }

    return (
        <Stack height={1} justifyContent='center' alignItems='center'>
            <Typography sx={{ fontSize: { xs: '0.875rem', sm: 'initial' } }}>
                {params.value === GameResult.White && '1'}
                {params.value === GameResult.Black && '0'}
                {params.value === GameResult.Draw && '½'}
            </Typography>
            <Typography sx={{ fontSize: { xs: '0.875rem', sm: 'initial' } }}>
                {params.value === GameResult.White && '0'}
                {params.value === GameResult.Black && '1'}
                {params.value === GameResult.Draw && '½'}
            </Typography>
        </Stack>
    );
}

export function getTimeControl({ timeControl }: { timeControl?: string }) {
    const initialClock = getInitialClock(timeControl);
    if (!initialClock) {
        return null;
    }

    const increment = getIncrement(timeControl);

    return `${Math.round(initialClock / 60)}+${increment ?? 0}`;
}

export function RenderTimeControl({ timeControl }: { timeControl?: string }) {
    return (
        <Box height='100%' display='flex' alignItems='center'>
            <Typography variant='body2'>{getTimeControl({ timeControl })}</Typography>
        </Box>
    );
}

export function formatPublishedAt(value: string) {
    return value.split('T')[0].replaceAll('-', '.');
}

export function formatMoves(ply?: string) {
    return ply ? Math.ceil(parseInt(ply) / 2) : '?';
}

export function getPublishedAt(game: GameInfo) {
    return game.publishedAt || game.createdAt || game.id.split('_')[0];
}

function getPlayerRating(rating?: string | number, provisional?: boolean) {
    if (!rating) {
        return '';
    }

    let str = `(${rating}`;
    if (provisional) {
        str += '?';
    }
    str += ')';

    return str;
}
