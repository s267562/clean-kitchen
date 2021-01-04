import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

function LoadingComponent() {
    return (
        <div style={{ height: 'calc(100% - 128px)', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            <CircularProgress color='secondary' />
        </div>
    );
}

export default LoadingComponent;