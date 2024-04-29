export interface Config {
    auth: {
        region: 'us-east-1';
        userPoolId: string;
        userPoolWebClientId: string;
        oauth: {
            domain: string;
            scope: string[];
            redirectSignIn: string;
            redirectSignOut: string;
            responseType: 'code';
        };
    };
    api: {
        baseUrl: string;
    };
    media: {
        picturesBucket: string;
    };
    stripe: {
        publishableKey: string;
    };
    chat: {
        server: string;
        channel: string;
    };
}

const config: Record<string, Config> = {
    test: {
        auth: {
            region: 'us-east-1',
            userPoolId: 'us-east-1_apywr6kwu',
            userPoolWebClientId: '76en8knncv8bfpfgbheua6j6k',
            oauth: {
                domain: 'user-pool-domain-dev-chess-dojo-scheduler.auth.us-east-1.amazoncognito.com',
                scope: ['profile', 'email', 'openid'],
                redirectSignIn: 'http://localhost:3000',
                redirectSignOut: 'http://localhost:3000',
                responseType: 'code',
            },
        },
        api: {
            baseUrl: 'https://c2qamdaw08.execute-api.us-east-1.amazonaws.com',
        },
        media: {
            picturesBucket: 'https://chess-dojo-dev-pictures.s3.amazonaws.com',
        },
        stripe: {
            publishableKey:
                'pk_test_51OB6imGilmvijaecMJqdvLJdu89BcghnjU7eOIoCwlBl8DeV6i2XojJOaZ36lamZMuVjO7aorXtl90OcdtAstFfF0022uf0sdp',
        },
        chat: {
            server: '691123894001598536',
            channel: '691123894001598539',
        },
    },

    development: {
        auth: {
            region: 'us-east-1',
            userPoolId: 'us-east-1_apywr6kwu',
            userPoolWebClientId: '76en8knncv8bfpfgbheua6j6k',
            oauth: {
                domain: 'user-pool-domain-dev-chess-dojo-scheduler.auth.us-east-1.amazoncognito.com',
                scope: ['profile', 'email', 'openid'],
                redirectSignIn: 'http://localhost:3000',
                redirectSignOut: 'http://localhost:3000',
                responseType: 'code',
            },
        },
        api: {
            baseUrl: 'https://c2qamdaw08.execute-api.us-east-1.amazonaws.com',
        },
        media: {
            picturesBucket: 'https://chess-dojo-dev-pictures.s3.amazonaws.com',
        },
        stripe: {
            publishableKey:
                'pk_test_51OB6imGilmvijaecMJqdvLJdu89BcghnjU7eOIoCwlBl8DeV6i2XojJOaZ36lamZMuVjO7aorXtl90OcdtAstFfF0022uf0sdp',
        },
        chat: {
            server: '691123894001598536',
            channel: '691123894001598539',
        },
    },

    production: {
        auth: {
            region: 'us-east-1',
            userPoolId: 'us-east-1_0revSxCzf',
            userPoolWebClientId: '1dfi5rar7a2fr5samugigrmise',
            oauth: {
                domain: 'user-pool-domain-prod-chess-dojo-scheduler.auth.us-east-1.amazoncognito.com',
                scope: ['profile', 'email', 'openid'],
                redirectSignIn: 'https://www.dojoscoreboard.com',
                redirectSignOut: 'https://www.dojoscoreboard.com',
                responseType: 'code',
            },
        },
        api: {
            baseUrl: 'https://g4shdaq6ug.execute-api.us-east-1.amazonaws.com',
        },
        media: {
            picturesBucket: 'https://chess-dojo-prod-pictures.s3.amazonaws.com',
        },
        stripe: {
            publishableKey:
                'pk_live_51OB6imGilmvijaecicnOhS1rqgX6VofcmTgi4n3TdhYoPgutx4W8HnUch6iQE7GL62fngez6mL471YWiZSrUhbJI007MlHx5CM',
        },
        chat: {
            server: '951958534113886238',
            channel: '951958535258898444',
        },
    },
};

export function getConfig(): Config {
    return config[process.env.NODE_ENV || ''];
}
