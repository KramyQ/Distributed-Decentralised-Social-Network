import Switch from '@material-ui/core/Switch';
import React, { useImperativeHandle, useState } from 'react';

export default function SwitchLogin ({childRef}) {
    const [auth, setAuth] = useState(true);

    const handleChange = (event) => {
        setAuth(event.target.checked);
    };

    useImperativeHandle(childRef, () => ({
        getValue:() => {
            return {
                auth
            }
        }
    }));

    return (
        <Switch checked={auth} onChange={handleChange} aria-label="login switch" />
    )
}
    