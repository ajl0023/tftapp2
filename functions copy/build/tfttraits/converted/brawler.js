import * as React from "react";

function SvgBrawler(props) {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 36 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M19.67 34.67L33 37.17l.5-5.67-16-.75 2.17 3.92zM22.42 0L0 11l3.42 16h4.49L7.5 15.67 10.95 27h4.55V12.83L18.99 27h4.72l1.21-17.75L27.18 27h6.74l1.91-23.42L22.42 0z"
        fill={props && props.fill}
      />
    </svg>
  );
}

export default SvgBrawler;
