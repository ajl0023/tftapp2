import * as React from "react";

function SvgLegionnaire(props) {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 40 51"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#legionnaire_svg__clip0)" fill={props && props.fill}>
        <path d="M13.36 17.35c.11-.3.08-.62-.09-.9L6.96 5.98 3.86 0l-1.1 5.73h.01L.02 19.1c-.07.36.05.72.34 1l6.06 5.77 4.77 22.7c.19 1 1.32 1.68 2.51 1.52 0 0 1.99-1.11 1.8-2.11l-4.9-23.32 2.76-7.31z" />
        <path d="M9.2 24.33s12.63.95 12.96-2.02c.17-1.69-4.09-1.07-4-3.18.04-1.07 7.97-3.22 19.2-3.51-1.7 3.14-6.15 7.08-6.15 7.08s5.16 2.88 8.11 6.65c-3.59.87-13.17-.87-14 .7.42 1.9 1.45 5.82 1.45 5.82s-6.85 3.59-15.11 1.65c-.91-4.46-.48-9.7-.48-9.7L9.2 24.33z" />
      </g>
      <defs>
        <clipPath id="legionnaire_svg__clip0">
          <path fill="#fff" d="M0 0h39.31v50.11H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default SvgLegionnaire;
