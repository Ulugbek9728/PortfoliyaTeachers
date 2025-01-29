import React from 'react';

function DateFormat(props) {
    console.log(props)
    const parsedDate = new Date(props?.date);
    const formattedDate = parsedDate.toLocaleDateString("en-GB");

    return (<p>{formattedDate}</p>);
}

export default DateFormat;