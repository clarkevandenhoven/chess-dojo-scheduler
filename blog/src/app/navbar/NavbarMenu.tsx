import {
    AutoStories,
    BorderColor,
    CalendarToday,
    Checklist,
    ChevronRight,
    ExpandLess,
    ExpandMore,
    Feed,
    Forum,
    Groups,
    Help,
    ImportContacts,
    LocalFireDepartment,
    Logout,
    MenuBook,
    Menu as MenuIcon,
    MilitaryTech,
    Notifications,
    Person2 as Person2Icon,
    Psychology,
    RocketLaunch,
    Scoreboard,
    Sell,
    SignalCellularAlt,
    Speed,
    Storefront,
    EmojiEvents as Tournaments,
} from '@mui/icons-material';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import GroupIcon from '@mui/icons-material/Group';
import LanguageIcon from '@mui/icons-material/Language';
import SearchIcon from '@mui/icons-material/Search';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import {
    Button,
    Collapse,
    IconButton,
    List,
    ListItemIcon,
    Menu,
    MenuItem,
    Stack,
    Tooltip,
    Typography,
    useMediaQuery,
} from '@mui/material';
import Image from 'next/image';
import React, { useState } from 'react';
import { AuthStatus, useAuth } from '../auth/Auth';
import { hasCreatedProfile } from '../database/user';
import PawnIcon from './PawnIcon';
import ProfileButton from './ProfileButton';
import UnauthenticatedMenu, {
    ExtraSmallMenuUnauthenticated,
} from './UnauthenticatedMenu';

export const Logo = () => {
    return (
        <a href='/'>
            <Image
                src='/logo192.png'
                style={{
                    paddingTop: '10px',
                    paddingBottom: '10px',
                    height: '100%',
                    marginRight: '15px',
                    cursor: 'pointer',
                }}
                alt=''
            />
        </a>
    );
};

export interface NavbarItem {
    name: string;
    icon?: JSX.Element;
    onClick?: () => void;
    children?: NavbarItem[];
    href?: string;
}

function allStartItems(toggleExpansion: (item: string) => void): NavbarItem[] {
    return [
        {
            name: 'Newsfeed',
            icon: <Feed />,
            href: '/newsfeed',
        },
        {
            name: 'Training Plan',
            icon: <Checklist />,
            href: '/profile?view=progress',
        },
        {
            name: 'Scoreboard',
            icon: <Scoreboard />,
            onClick: () => toggleExpansion('Scoreboard'),
            children: [
                {
                    name: 'My Cohort',
                    icon: <GroupIcon />,
                    href: '/scoreboard',
                },
                {
                    name: 'Full Dojo',
                    icon: <LanguageIcon />,
                    href: 'scoreboard/dojo',
                },
                {
                    name: 'Followers',
                    icon: <ThumbUpIcon />,
                    href: 'scoreboard/following',
                },
                {
                    name: 'Search Users',
                    icon: <SearchIcon />,
                    href: 'scoreboard/search',
                },
                {
                    name: 'Statistics',
                    icon: <AutoGraphIcon />,
                    href: 'scoreboard/stats',
                },
            ],
        },
        {
            name: 'Tournaments',
            icon: <Tournaments />,
            onClick: () => toggleExpansion('Tournaments'),
            children: [
                {
                    name: 'DojoLiga',
                    icon: <MilitaryTech />,
                    href: '/tournaments',
                },
                {
                    name: 'Open Classical',
                    icon: <MilitaryTech />,
                    href: '/tournaments/open-classical',
                },
            ],
        },
        {
            name: 'Games',
            icon: <PawnIcon />,
            href: '/games',
        },
        {
            name: 'Calendar',
            icon: <CalendarToday />,
            href: '/calendar',
        },
        {
            name: 'Material',
            icon: <MenuBook />,
            onClick: () => toggleExpansion('Material'),
            children: [
                {
                    name: 'Courses',
                    icon: <ImportContacts />,
                    href: '/courses',
                },
                {
                    name: 'Tactics Tests',
                    icon: <Speed />,
                    href: '/tactics',
                },
                {
                    name: 'Books',
                    icon: <AutoStories />,
                    href: '/material/books',
                },
                {
                    name: 'Sparring Positions',
                    icon: <LocalFireDepartment />,
                    href: '/material/sparring',
                },
                {
                    name: 'Model Annotations',
                    icon: <BorderColor />,
                    href: '/material/modelgames',
                },
                {
                    name: 'Games to Memorize',
                    icon: <Psychology />,
                    href: '/material/memorizegames',
                },
                {
                    name: 'Rating Conversions',
                    icon: <SignalCellularAlt />,
                    href: '/material/ratings',
                },
            ],
        },
        {
            name: 'Clubs',
            icon: <Groups />,
            href: '/clubs',
        },
        {
            name: 'Chat',
            icon: <Forum />,
            href: '/chat',
        },
        {
            name: 'Shop',
            icon: <Sell />,
            onClick: () => toggleExpansion('Shop'),
            children: [
                {
                    name: 'Courses',
                    icon: <ImportContacts />,
                    href: '/courses',
                },
                {
                    name: 'Coaching',
                    icon: <RocketLaunch />,
                    href: '/coaching',
                },
                {
                    name: 'Merch',
                    icon: <Storefront />,
                    onClick: () =>
                        window.open('https://www.chessdojo.shop/shop', '_blank'),
                },
            ],
        },
    ];
}

function helpItem(): NavbarItem {
    return {
        name: 'Help',
        icon: <Help />,
        href: '/help',
    };
}

function NotificationsMenuItem(): JSX.Element {
    return (
        <MenuItem href='/notifications'>
            <ListItemIcon>
                <Notifications />
            </ListItemIcon>
            <Typography textAlign='center'>Notifications</Typography>
        </MenuItem>
    );
}

export const StartItem: React.FC<{ item: NavbarItem }> = ({ item }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClick = (func: () => void) => {
        return () => {
            func();
            handleClose();
        };
    };

    return (
        <>
            <Button
                key={item.name}
                onClick={item.children ? handleOpen : item.onClick}
                sx={{ color: 'white', whiteSpace: 'nowrap' }}
                startIcon={item.icon}
                endIcon={item.children ? <ExpandMore /> : undefined}
                href={item.href}
            >
                {item.name}
            </Button>
            {item.children && (
                <Menu
                    id='submenu-appbar'
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    {item.children.map((child) => (
                        <MenuItem
                            key={child.name}
                            onClick={
                                child.onClick ? handleClick(child.onClick) : undefined
                            }
                            component={child.href ? 'a' : 'li'}
                            href={child.href}
                        >
                            {child.icon && <ListItemIcon>{child.icon}</ListItemIcon>}
                            <Typography textAlign='center'>{child.name}</Typography>
                        </MenuItem>
                    ))}
                </Menu>
            )}
        </>
    );
};

export const NavMenuItem: React.FC<{
    item: NavbarItem;
    openItems: Record<string, boolean>;
    handleClick: (func: () => void) => () => void;
}> = ({ item, openItems, handleClick }) => {
    return (
        <>
            <MenuItem
                key={item.name}
                onClick={item.children ? item.onClick : undefined}
                component={item.href ? 'a' : 'li'}
                href={item.href}
            >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <Typography textAlign='center'>{item.name}</Typography>
                {item.children &&
                    (openItems[item.name] ? (
                        <ListItemIcon sx={{ position: 'absolute', right: 0 }}>
                            <ExpandLess />
                        </ListItemIcon>
                    ) : (
                        <ListItemIcon sx={{ position: 'absolute', right: 0 }}>
                            <ExpandMore />
                        </ListItemIcon>
                    ))}
            </MenuItem>
            {item.children && (
                <Collapse key={item.name + '-collapse'} in={openItems[item.name]}>
                    <List component='div' disablePadding>
                        {item.children.map((child) => (
                            <MenuItem
                                key={child.name}
                                onClick={
                                    child.onClick ? handleClick(child.onClick) : undefined
                                }
                                sx={{ pl: 3 }}
                                component={child.href ? 'a' : 'li'}
                                href={child.href}
                            >
                                {child.icon ? (
                                    <ListItemIcon>{child.icon}</ListItemIcon>
                                ) : (
                                    <ListItemIcon>
                                        <ChevronRight />
                                    </ListItemIcon>
                                )}
                                <Typography textAlign='center'>{child.name}</Typography>
                            </MenuItem>
                        ))}
                    </List>
                </Collapse>
            )}
        </>
    );
};

function HelpButton() {
    return (
        <Tooltip key='help' title='Help'>
            <IconButton data-cy='Help' key='help' sx={{ color: 'white' }} href='/help'>
                <Help />
            </IconButton>
        </Tooltip>
    );
}

function useNavbarItems(handleClick: (func: () => void) => () => void) {
    const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
    const auth = useAuth();

    const showAll = useMediaQuery('(min-width:1560px)');
    const hide2 = useMediaQuery('(min-width:1416px)');
    const hide3 = useMediaQuery('(min-width:1315px)');
    const hide4 = useMediaQuery('(min-width:1196px)');
    const hide5 = useMediaQuery('(min-width:1066px)');
    const hide6 = useMediaQuery('(min-width:963px)');
    const hide7 = useMediaQuery('(min-width:772px)');

    const showHelp = useMediaQuery('(min-width:624px)');
    const showNotifications = useMediaQuery('(min-width:567px)');
    const showProfileDropdown = useMediaQuery('(min-width:542px)');

    const startItems = allStartItems((item: string) =>
        setOpenItems((v) => ({ ...v, [item]: !(v[item] || false) })),
    );

    let startItemCount = 0;
    if (showAll) {
        startItemCount = startItems.length;
    } else if (hide2) {
        startItemCount = startItems.length - 2;
    } else if (hide3) {
        startItemCount = startItems.length - 3;
    } else if (hide4) {
        startItemCount = startItems.length - 4;
    } else if (hide5) {
        startItemCount = startItems.length - 5;
    } else if (hide6) {
        startItemCount = startItems.length - 6;
    } else if (hide7) {
        startItemCount = startItems.length - 7;
    } else {
        startItemCount = startItems.length - 8;
    }

    const shownStartItems: JSX.Element[] = startItems
        .slice(0, startItemCount)
        .map((item) => <StartItem key={item.name} item={item} />);

    const menuItems: JSX.Element[] = startItems
        .slice(startItemCount)
        .map((item) => (
            <NavMenuItem
                key={item.name}
                item={item}
                openItems={openItems}
                handleClick={handleClick}
            />
        ));

    const endItems: JSX.Element[] = [];

    if (!showNotifications) {
        menuItems.push(<NotificationsMenuItem key='notifications' />);
    }

    if (showHelp) {
        endItems.push(HelpButton());
    } else {
        menuItems.push(
            <NavMenuItem
                key='help'
                item={helpItem()}
                openItems={openItems}
                handleClick={handleClick}
            />,
        );
    }

    if (showProfileDropdown) {
        endItems.push(<ProfileButton key='profileDropdown' />);
    } else {
        menuItems.push(
            <MenuItem key='signout' onClick={handleClick(auth.signout)}>
                <ListItemIcon>
                    <Logout color='error' />
                </ListItemIcon>
                <Typography textAlign='center' color='error'>
                    Sign Out
                </Typography>
            </MenuItem>,
        );
    }

    return {
        startItems: shownStartItems,
        menuItems: menuItems,
        endItems: endItems,
    };
}

const LargeMenu = () => {
    const auth = useAuth();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClick = (func: () => void) => {
        return () => {
            func();
            handleClose();
        };
    };

    const { startItems, menuItems, endItems } = useNavbarItems(handleClick);
    const profileCreated = hasCreatedProfile(auth.user!);

    if (!profileCreated) {
        return (
            <>
                <Logo />
                <Stack spacing={1} direction='row' sx={{ flexGrow: 1 }}>
                    <Button
                        href='/profile'
                        sx={{ color: 'white' }}
                        startIcon={<Person2Icon />}
                    >
                        Profile
                    </Button>
                </Stack>

                <Button href='/help' sx={{ color: 'white' }}>
                    Help
                </Button>

                <Button onClick={auth.signout} sx={{ color: 'white' }}>
                    Sign Out
                </Button>
            </>
        );
    }

    return (
        <>
            <Logo />
            <Stack spacing={1} direction='row' sx={{ flexGrow: 1 }}>
                {startItems}

                {menuItems.length > 0 && (
                    <>
                        <Tooltip title='More'>
                            <IconButton
                                data-cy='navbar-more-button'
                                onClick={handleOpen}
                                sx={{ color: 'white' }}
                            >
                                <MenuIcon />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            id='menu-appbar'
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            {menuItems}
                        </Menu>
                    </>
                )}
            </Stack>

            {endItems}
        </>
    );
};

const ExtraSmallMenu = () => {
    const auth = useAuth();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

    const startItems = allStartItems((item: string) =>
        setOpenItems((v) => ({ ...v, [item]: !(v[item] || false) })),
    );

    if (auth.status === AuthStatus.Unauthenticated) {
        return <ExtraSmallMenuUnauthenticated />;
    }

    const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClick = (func: () => void) => {
        return () => {
            func();
            handleClose();
            setOpenItems({});
        };
    };

    const profileCreated = hasCreatedProfile(auth.user!);

    let startItemsJsx: JSX.Element[] = [];
    if (profileCreated) {
        startItemsJsx = startItems.map((item) => (
            <NavMenuItem
                key={item.name}
                item={item}
                openItems={openItems}
                handleClick={handleClick}
            />
        ));
    }

    return (
        <Stack
            direction='row'
            justifyContent='space-between'
            alignItems='center'
            sx={{ flexGrow: 1, height: 1 }}
        >
            <Logo />
            <IconButton
                data-cy='navbar-more-button'
                size='medium'
                aria-label='navigation menu'
                aria-controls='menu-appbar'
                aria-haspopup='true'
                onClick={handleOpen}
                color='inherit'
            >
                <MenuIcon />
            </IconButton>
            <Menu
                id='menu-appbar'
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {!profileCreated && (
                    <MenuItem href='/profile'>
                        <ListItemIcon>
                            <Person2Icon />
                        </ListItemIcon>
                        <Typography textAlign='center'>Profile</Typography>
                    </MenuItem>
                )}

                {startItemsJsx}

                <MenuItem href='/notifications'>
                    <ListItemIcon></ListItemIcon>
                    <Typography textAlign='center'>Notifications</Typography>
                </MenuItem>

                <MenuItem href='/help'>
                    <ListItemIcon>
                        <Help />
                    </ListItemIcon>
                    <Typography textAlign='center'>Help</Typography>
                </MenuItem>

                <MenuItem onClick={handleClick(auth.signout)}>
                    <ListItemIcon>
                        <Logout color='error' />
                    </ListItemIcon>
                    <Typography textAlign='center' color='error'>
                        Sign Out
                    </Typography>
                </MenuItem>
            </Menu>
        </Stack>
    );
};

const AuthenticatedMenu = () => {
    const largeMenu = useMediaQuery('(min-width:450px)');
    if (largeMenu) {
        return <LargeMenu />;
    }
    return <ExtraSmallMenu />;
};

const NavbarMenu = () => {
    const auth = useAuth();

    if (auth.status === AuthStatus.Loading) {
        return <Logo />;
    }
    if (auth.status === AuthStatus.Unauthenticated) {
        return <UnauthenticatedMenu />;
    }
    return <AuthenticatedMenu />;
};

export default NavbarMenu;
