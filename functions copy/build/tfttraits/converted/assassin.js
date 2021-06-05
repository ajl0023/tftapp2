import * as React from "react";

function SvgAssassin(props) {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 43 49"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M35.09 14.49C32.59.37 21.35 0 21.35 0S10.12.37 7.62 14.49C5.12 28.61 0 29.85 0 29.85S3.74 43.28 16.2 48.7c0 0-6.37-10.39-6.37-18.16 0-4.21 1.14-11.19 11.53-11.19 10.39 0 11.53 6.97 11.53 11.19 0 7.77-6.37 18.16-6.37 18.16 12.46-5.42 16.2-18.86 16.2-18.86s-5.13-1.24-7.63-15.35z"
        fill={props && props.fill}
      />
      <path
        d="M21.35 22.49s-7.03-.19-8.81 4.78c1.97 5.62 4.42 12.18 8.81 12.18 4.4 0 6.84-6.56 8.81-12.18-1.77-4.97-8.81-4.78-8.81-4.78z"
        fill={props && props.fill}
      />
    </svg>
  );
}

export default SvgAssassin;
