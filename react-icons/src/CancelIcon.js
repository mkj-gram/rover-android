import React from 'react'

export default props =>
    <svg {...props} width="8" height="8" viewBox="0 0 8 8">
        <polygon fill={props.fill} fillRule="evenodd" points="6.993 0 3.999 2.992 1.006 0 0 1.007 2.992 4.001 0 6.993 1.006 8 3.999 5.007 6.993 8 8 6.993 5.008 4.001 8 1.007"/>
    </svg>
