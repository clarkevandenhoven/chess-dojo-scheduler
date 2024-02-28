import {
    FormControl,
    FormControlLabel,
    FormLabel,
    MenuItem,
    Radio,
    RadioGroup,
    Stack,
    TextField,
} from '@mui/material';
import { useState } from 'react';
import { Club } from '../database/club';

export interface ClubFilters {
    search: string;
    setSearch: (search: string) => void;

    sortMethod: ClubSortMethod;
    setSortMethod: (sortMethod: ClubSortMethod) => void;

    sortDirection: 'asc' | 'desc';
    setSortDirection: (sortDirection: 'asc' | 'desc') => void;
}

export enum ClubSortMethod {
    Alphabetical = 'ALPHABETICAL',
    MemberCount = 'MEMBER_COUNT',
    CreationDate = 'CREATION_DATE',
}

function displayClubSortMethod(sortMethod: ClubSortMethod): string {
    switch (sortMethod) {
        case ClubSortMethod.Alphabetical:
            return 'Alphabetical';
        case ClubSortMethod.MemberCount:
            return 'Member Count';
        case ClubSortMethod.CreationDate:
            return 'Creation Date';
    }
}

export function useClubFilters(): ClubFilters {
    const [search, setSearch] = useState('');
    const [sortMethod, setSortMethod] = useState(ClubSortMethod.Alphabetical);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    return {
        search,
        setSearch,
        sortMethod,
        setSortMethod,
        sortDirection,
        setSortDirection,
    };
}

export function filterClubs(clubs: Club[] | undefined, filters: ClubFilters): Club[] {
    let result = clubs || [];
    const search = filters.search.trim().toLowerCase();
    if (search) {
        result = result.filter(
            (club) =>
                club.name.toLowerCase().includes(search) ||
                club.shortDescription.toLowerCase().includes(search) ||
                club.location.city.toLowerCase().includes(search) ||
                club.location.state.toLowerCase().includes(search) ||
                club.location.country.toLowerCase().includes(search),
        );
    }
    return result.sort((lhs: Club, rhs: Club) => {
        switch (filters.sortMethod) {
            case ClubSortMethod.Alphabetical:
                if (filters.sortDirection === 'asc') {
                    return lhs.name.localeCompare(rhs.name);
                }
                return rhs.name.localeCompare(lhs.name);

            case ClubSortMethod.MemberCount:
                if (filters.sortDirection === 'asc') {
                    return lhs.memberCount - rhs.memberCount;
                }
                return rhs.memberCount - lhs.memberCount;

            case ClubSortMethod.CreationDate:
                if (filters.sortDirection === 'asc') {
                    return lhs.createdAt.localeCompare(rhs.createdAt);
                }
                return rhs.createdAt.localeCompare(lhs.createdAt);
        }
    });
}

interface ClubFilterEditorProps {
    filters: ClubFilters;
}

export const ClubFilterEditor: React.FC<ClubFilterEditorProps> = ({ filters }) => {
    return (
        <Stack direction='row' spacing={3} alignItems='center' flexWrap='wrap' rowGap={3}>
            <TextField
                label='Search...'
                value={filters.search}
                onChange={(e) => filters.setSearch(e.target.value)}
                sx={{ flexGrow: 1 }}
            />

            <Stack direction='row' spacing={2} alignItems='center'>
                <TextField
                    select
                    label='Sort By'
                    value={filters.sortMethod}
                    onChange={(e) =>
                        filters.setSortMethod(e.target.value as ClubSortMethod)
                    }
                >
                    {Object.values(ClubSortMethod).map((method) => (
                        <MenuItem key={method} value={method}>
                            {displayClubSortMethod(method)}
                        </MenuItem>
                    ))}
                </TextField>

                <FormControl>
                    <FormLabel>Sort Direction</FormLabel>
                    <RadioGroup
                        value={filters.sortDirection}
                        onChange={(e) =>
                            filters.setSortDirection(e.target.value as 'asc' | 'desc')
                        }
                        row
                    >
                        <FormControlLabel
                            control={<Radio />}
                            label='Ascending'
                            value='asc'
                        />
                        <FormControlLabel
                            control={<Radio />}
                            label='Descending'
                            value='desc'
                        />
                    </RadioGroup>
                </FormControl>
            </Stack>
        </Stack>
    );
};
