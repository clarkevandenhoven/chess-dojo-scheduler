import { AppBar, Container, Toolbar } from '@mui/material';

import { useEvents } from '../api/cache/Cache';
import { useAuth } from '../auth/Auth';
import { Event, AvailabilityStatus } from '../database/event';
import NavbarMenu from './NavbarMenu';

const Navbar = () => {
    const auth = useAuth();

    const filterTime = new Date(new Date().getTime()).toISOString();
    const { events } = useEvents();

    const meetingCount = events.filter((e: Event) => {
        if (!e.participants || e.participants.length === 0) {
            return false;
        }
        if (
            e.owner !== auth.user?.username &&
            e.participants.every((p) => p.username !== auth.user?.username)
        ) {
            return false;
        }
        return e.status !== AvailabilityStatus.Canceled && e.endTime >= filterTime;
    }).length;

    return (
        <AppBar data-cy='navbar' position='sticky' sx={{ zIndex: 1300, height: '80px' }}>
            <Container maxWidth='xl' sx={{ height: 1 }}>
                <Toolbar disableGutters sx={{ height: 1 }}>
                    <NavbarMenu meetingCount={meetingCount} />
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar;
