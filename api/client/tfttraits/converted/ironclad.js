import * as React from "react";

function SvgIronclad(props) {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 34 55"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#ironclad_svg__clip0)" fill={props && props.fill}>
        <path d="M17.002 39.71c-5.814-5.967-11.927-6.13-14.994-5.718l-.497 6.599S8.802 37.817 17 46.235c8.2-8.415 15.491-5.644 15.491-5.644l-.496-6.599c-3.068-.412-9.181-.249-14.994 5.719z" />
        <path d="M31.705 24.217c1.044-1.695 1.632-3.594 1.632-5.603 0-5.05-3.7-9.414-9.084-11.518L17.001 0 9.75 7.096C4.37 9.197.666 13.565.666 18.614c0 2.009.588 3.908 1.632 5.603L0 32.182s8.799-3.132 17.002 5.283c8.199-8.415 17.001-5.283 17.001-5.283l-2.298-7.965zm-23.608-5.34c-.56 1.266-.872 2.611-.676 4.03.14.993.6 1.867 1.254 2.593-1.665-.767-3.425-2.439-3.549-6.071-.236-7.01 11.442-10.895 11.442-10.895s-7.375 5.2-8.471 10.344z" />
      </g>
      <defs>
        <clipPath id="ironclad_svg__clip0">
          <path fill="#fff" d="M0 0h34v55H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default SvgIronclad;
