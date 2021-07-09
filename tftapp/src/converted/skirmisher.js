import * as React from "react";

function SvgSkirmisher(props) {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 41 45"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#skirmisher_svg__clip0)">
        <path
          d="M32.15 35.58c6.55-6.66 7.64-15.16 8.8-19.11-3.38-.31-6.29-.92-8.8-1.66l2.76-3.19 3.64-.68L40.47 0l-9.51 5.72.65 3.48-3.58 4.14c-5.16-2.19-7.56-4.64-7.56-4.64s-2.4 2.45-7.56 4.64L9.34 9.2l.65-3.48L.48 0l1.91 10.93 3.64.68 2.76 3.19c-2.5.74-5.42 1.35-8.79 1.66 1.16 3.95 2.25 12.46 8.8 19.11l-4.66 5.39c-.64.93-.4 2.22.53 2.85.93.64 2.22.4 2.85-.53l4.36-5.05c2.32 1.7 5.14 3.19 8.59 4.31 3.45-1.12 6.27-2.61 8.59-4.31l4.36 5.05c.64.93 1.92 1.17 2.85.53.93-.64 1.17-1.92.53-2.85l-4.65-5.38zm-11.67 1.33V14.73l15.24 6.48s-10.4 1.36-3.6 6.43c-5.66 9.54-11.64 9.27-11.64 9.27z"
          fill={props && props.fill}
        />
      </g>
      <defs>
        <clipPath id="skirmisher_svg__clip0">
          <path fill="#fff" d="M0 0h40.95v44.18H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default SvgSkirmisher;
