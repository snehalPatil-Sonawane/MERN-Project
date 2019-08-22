import React, {Fragment} from 'react'
import spinnerGif from "./spinner.gif";

export default () => {
    return (
        <Fragment>
            <img 
                src={spinnerGif}
                style={{width: '200px', margin: 'auto', display: 'block'}}
                alt="Loading..."
            />
        </Fragment>
    )
}