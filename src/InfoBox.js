import React from 'react'
import { Card, CardContent, Typography } from '@material-ui/core';
import './InfoBox.css';

function InfoBox({title , cases, total, ...props }) {
    return (
        <Card 
        onClick={props.onClick}
        className="infobox">
            <CardContent>
                <Typography className="infobox-title" color="textSecondary">
                    {title}
                </Typography>

                <h2 className="infobox-cases">{cases}</h2>

                <Typography className="infobox-total" color="textSecondary">
                    {total} Total
                </Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox
