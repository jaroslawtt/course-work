import React from 'react';

const Button = (props) => {
    return (
        <div>
            <button className='border-solid border-sky-500 border-2	rounded w-20'>{props.type}</button>
        </div>
    );
};

export default Button;