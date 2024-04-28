import { Container, Typography } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { useState } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';

import { useApi } from '../api/Api';
import { RequestSnackbar, useRequest } from '../api/Request';
import { AuthStatus, useAuth } from '../auth/Auth';
import { SubscriptionStatus } from '../database/user';
import LoadingPage from '../loading/LoadingPage';
import PriceMatrix from './PriceMatrix';

interface PricingPageProps {
    onFreeTier?: () => void;
}

const PricingPage: React.FC<PricingPageProps> = ({ onFreeTier }) => {
    const auth = useAuth();
    const user = auth.user;
    const navigate = useNavigate();

    const api = useApi();
    const request = useRequest();
    const [interval, setInterval] = useState('');
    const [searchParams] = useSearchParams();
    const redirect = searchParams.get('redirect') || '';

    if (auth.status === AuthStatus.Loading) {
        return <LoadingPage />;
    }

    if (user?.subscriptionStatus === SubscriptionStatus.Subscribed) {
        return <Navigate to='/' replace />;
    }

    const onSubscribe = (interval: 'month' | 'year') => {
        if (!user) {
            navigate('/signup');
        }

        setInterval(interval);

        request.onStart();
        api.subscriptionCheckout({ interval, successUrl: redirect, cancelUrl: redirect })
            .then((resp) => {
                console.log('subscriptionCheckout: ', resp);
                window.location.href = resp.data.url;
            })
            .catch((err) => {
                console.error('subscriptionCheckout: ', err);
                request.onFailure(err);
            });
    };

    return (
        <Container sx={{ py: 5 }}>
            <RequestSnackbar request={request} />

            <Grid2 container spacing={3}>
                <Grid2 xs={12} textAlign='center'>
                    <Typography variant='subtitle1' color='text.secondary'>
                        Choose your pricing plan
                    </Typography>
                </Grid2>

                <PriceMatrix
                    onSubscribe={onSubscribe}
                    request={request}
                    interval={interval}
                    onFreeTier={onFreeTier}
                />

                <Grid2 xs={12} textAlign='center'>
                    <Typography variant='body2' color='text.secondary'>
                        Plans automatically renew until canceled
                    </Typography>
                </Grid2>
            </Grid2>
        </Container>
    );
};

export default PricingPage;
