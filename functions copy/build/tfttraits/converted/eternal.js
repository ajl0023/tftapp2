import * as React from "react";

function SvgEternal(props) {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 36 59"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#eternal_svg__clip0)" fill={props && props.fill}>
        <path d="M15.59 58.41C15.59 49.35 0 45.47 0 29.88c0-15.59 22.78-16.7 22.78-4.42 0 1.84-4.2 4.87-4.2 2.18 0-4.5-10.06-6.38-10.06 2.91 0 5.53 1.99 8.74 6.75 12.06.1 2.75 1.43 6.96.32 15.8z" />
        <path d="M13.01 31.99s1.59 11.96 13.35 7.17c11.76-4.79 10.06-17.34 3.79-24.71C23.88 7.08 17.2 9.97 17.3 0c-2.39 1.69-4.48 7.84-2.19 10.75 2.29 2.91 14.25 8.7 11.56 18.61-2.69 9.91-11.36 7.31-13.66 2.63z" />
      </g>
      <defs>
        <clipPath id="eternal_svg__clip0">
          <path fill="#fff" d="M0 0h35.05v58.41H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default SvgEternal;
