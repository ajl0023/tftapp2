import * as React from "react";

function SvgVerdant(props) {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 31 55"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#verdant_svg__clip0)">
        <path
          d="M27.42 23.99C16.12 0 15.25 0 15.25 0s-.87 0-12.17 23.99c-9.66 20.49 6.07 28.49 10.85 30.39v-6.81l-7.68-6.2.01-.01h-.01l-1.87-3.39 3.52 1.35.01-.01 6.03 4.86v-8.24L8.5 31.57l.01-.01H8.5l-1.87-3.39 3.52 1.36.01-.01 3.78 3.05V19.2h.03l1.29-5.22 1.31 5.22h.01v13.43l3.86-3.11 3.51-1.35-1.87 3.39.01.01-5.51 4.45v8.24l6.11-4.93.01.01 3.51-1.35-1.87 3.39.01.01-7.77 6.26v6.74c4.77-1.91 20.49-9.91 10.84-30.4z"
          fill={props && props.fill}
        />
      </g>
      <defs>
        <clipPath id="verdant_svg__clip0">
          <path fill="#fff" d="M0 0h30.49v54.37H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default SvgVerdant;
