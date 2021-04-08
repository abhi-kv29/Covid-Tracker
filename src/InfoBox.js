import React from 'react'
import { Card, CardContent, Typography } from '@material-ui/core';

function InfoBox({title , cases, total}) {
    return (
        <Card>
            <CardContent>
                <Typography className="infobox-title" color="textSecondary">
                    {title}
                </Typography>

                <h2 className="infobx-cases">{cases}</h2>

                <Typography className="infobox-total" color="textSecondary">
                    {total} Total
                </Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox
