import React from 'react';

interface IconProps {
  className?: string;
  color?: string;
  size?: number;
}

export const DashboardIcon: React.FC<IconProps> = ({ 
  className = "", 
  color = "currentColor", 
  size = 24 
}) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    className={className}
    fill="none"
  >
    <path 
      d="M9.75 3H5.75C5.05222 3 4.70333 3 4.41943 3.08612C3.78023 3.28002 3.28002 3.78023 3.08612 4.41943C3 4.70333 3 5.05222 3 5.75C3 6.44778 3 6.79667 3.08612 7.08057C3.28002 7.71977 3.78023 8.21998 4.41943 8.41388C4.70333 8.5 5.05222 8.5 5.75 8.5H9.75C10.4478 8.5 10.7967 8.5 11.0806 8.41388C11.7198 8.21998 12.22 7.71977 12.4139 7.08057C12.5 6.79667 12.5 6.44778 12.5 5.75C12.5 5.05222 12.5 4.70333 12.4139 4.41943C12.22 3.78023 11.7198 3.28002 11.0806 3.08612C10.7967 3 10.4478 3 9.75 3Z" 
      stroke={color} 
      strokeWidth="1.5" 
      strokeLinejoin="round"
    />
    <path 
      d="M21 9.75V5.75C21 5.05222 21 4.70333 20.9139 4.41943C20.72 3.78023 20.2198 3.28002 19.5806 3.08612C19.2967 3 18.9478 3 18.25 3C17.5522 3 17.2033 3 16.9194 3.08612C16.2802 3.28002 15.78 3.78023 15.5861 4.41943C15.5 4.70333 15.5 5.05222 15.5 5.75V9.75C15.5 10.4478 15.5 10.7967 15.5861 11.0806C15.78 11.7198 16.2802 12.22 16.9194 12.4139C17.2033 12.5 17.5522 12.5 18.25 12.5C18.9478 12.5 19.2967 12.5 19.5806 12.4139C20.2198 12.22 20.72 11.7198 20.9139 11.0806C21 10.7967 21 10.4478 21 9.75Z" 
      stroke={color} 
      strokeWidth="1.5" 
      strokeLinejoin="round"
    />
    <path 
      d="M16.9194 20.9139C17.2033 21 17.5522 21 18.25 21C18.9478 21 19.2967 21 19.5806 20.9139C20.2198 20.72 20.72 20.2198 20.9139 19.5806C21 19.2967 21 18.9478 21 18.25C21 17.5522 21 17.2033 20.9139 16.9194C20.72 16.2802 20.2198 15.78 19.5806 15.5861C19.2967 15.5 18.9478 15.5 18.25 15.5C17.5522 15.5 17.2033 15.5 16.9194 15.5861C16.2802 15.78 15.78 16.2802 15.5861 16.9194C15.5 17.2033 15.5 17.5522 15.5 18.25C15.5 18.9478 15.5 19.2967 15.5861 19.5806C15.78 20.2198 16.2802 20.72 16.9194 20.9139Z" 
      stroke={color} 
      strokeWidth="1.5" 
      strokeLinejoin="round"
    />
    <path 
      d="M8.5 11.5H7C5.11438 11.5 4.17157 11.5 3.58579 12.0858C3 12.6716 3 13.6144 3 15.5V17C3 18.8856 3 19.8284 3.58579 20.4142C4.17157 21 5.11438 21 7 21H8.5C10.3856 21 11.3284 21 11.9142 20.4142C12.5 19.8284 12.5 18.8856 12.5 17V15.5C12.5 13.6144 12.5 12.6716 11.9142 12.0858C11.3284 11.5 10.3856 11.5 8.5 11.5Z" 
      stroke={color} 
      strokeWidth="1.5" 
      strokeLinejoin="round"
    />
  </svg>
);

export const FolderManagementIcon: React.FC<IconProps> = ({ 
  className = "", 
  color = "currentColor", 
  size = 24 
}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} className={className} fill="none">
    <path d="M2 19.5C2 18.3215 2 17.7322 2.43934 17.3661C2.87868 17 3.58579 17 5 17C6.41421 17 7.12132 17 7.56066 17.3661C8 17.7322 8 18.3215 8 19.5C8 20.6785 8 21.2678 7.56066 21.6339C7.12132 22 6.41421 22 5 22C3.58579 22 2.87868 22 2.43934 21.6339C2 21.2678 2 20.6785 2 19.5Z" stroke={color} strokeWidth="1.5" />
    <path d="M16 19.5C16 18.3215 16 17.7322 16.4393 17.3661C16.8787 17 17.5858 17 19 17C20.4142 17 21.1213 17 21.5607 17.3661C22 17.7322 22 18.3215 22 19.5C22 20.6785 22 21.2678 21.5607 21.6339C21.1213 22 20.4142 22 19 22C17.5858 22 16.8787 22 16.4393 21.6339C16 21.2678 16 20.6785 16 19.5Z" stroke={color} strokeWidth="1.5" />
    <path d="M19 17C19 13.6907 18.2562 13 14.6923 13H9.30769C5.74379 13 5 13.6907 5 17" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 10H12.5625C14.1425 10 14.9325 10 15.5 9.62549C15.7457 9.46336 15.9566 9.25502 16.1208 9.01238C16.5 8.45188 16.5 7.67163 16.5 6.11111C16.5 5.1748 16.5 4.70665 16.2725 4.37035C16.174 4.22476 16.0474 4.09976 15.9 4.00249C15.5595 3.77778 15.0855 3.77778 14.1375 3.77778H12.6425C12.5126 3.77778 12.4476 3.77778 12.3879 3.76912C12.1645 3.73672 11.9647 3.61544 11.8358 3.43402C11.8014 3.38555 11.7726 3.32861 11.715 3.21472C11.4788 2.74826 11.263 2.27872 10.7397 2.08489C10.5105 2 10.2486 2 9.72492 2C8.90751 2 8.4988 2 8.19213 2.16903C7.97352 2.28952 7.79314 2.46767 7.67114 2.68358C7.5 2.98647 7.5 3.39013 7.5 4.19745V5.55556C7.5 7.65069 7.5 8.69825 8.15901 9.34913C8.81802 10 9.87868 10 12 10Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const ProductivityIcon: React.FC<IconProps> = ({ 
  className = "", 
  color = "currentColor", 
  size = 24 
}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} className={className} fill="none">
    <path d="M12 22V9" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M15 17H16C18.7614 17 21 14.7614 21 12C21 9.5807 19.2818 7.56271 16.999 7.09982C16.999 4.3384 15 2 12 2C9 2 7.00097 4.3384 7.00097 7.09982C4.71825 7.56271 3 9.5807 3 12C3 14.7614 5.23858 17 8 17H9" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 15L14.5 12.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 13L9.5 10.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10 22H14" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const TaskManagerIcon: React.FC<IconProps> = ({ 
  className = "", 
  color = "currentColor", 
  size = 24 
}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} className={className} fill="none">
    <path d="M19.5 13V9.36842C19.5 5.89491 19.5 4.15816 18.4749 3.07908C17.4497 2 15.7998 2 12.5 2H9.5C6.20017 2 4.55025 2 3.52513 3.07908C2.5 4.15816 2.5 5.89491 2.5 9.36842V14.6316C2.5 18.1051 2.5 19.8418 3.52513 20.9209C4.55025 22 6.20017 22 9.5 22H11" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13.5 20C13.5 20 14.5 20 15.5 22C15.5 22 18.6765 17 21.5 16" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 2L7.0822 2.4932C7.28174 3.69044 7.38151 4.28906 7.80113 4.64453C8.22075 5 8.82762 5 10.0414 5H11.9586C13.1724 5 13.7793 5 14.1989 4.64453C14.6185 4.28906 14.7183 3.69044 14.9178 2.4932L15 2" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M7 16H11M7 11H15" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const SettingsIcon: React.FC<IconProps> = ({ 
  className = "", 
  color = "currentColor", 
  size = 24 
}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} className={className} fill="none">
    <path d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M8.5 10C7.67157 10 7 9.32843 7 8.5C7 7.67157 7.67157 7 8.5 7C9.32843 7 10 7.67157 10 8.5C10 9.32843 9.32843 10 8.5 10Z" stroke={color} strokeWidth="1.5" />
    <path d="M15.5 17C16.3284 17 17 16.3284 17 15.5C17 14.6716 16.3284 14 15.5 14C14.6716 14 14 14.6716 14 15.5C14 16.3284 14.6716 17 15.5 17Z" stroke={color} strokeWidth="1.5" />
    <path d="M10 8.5L17 8.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M14 15.5L7 15.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const AIAssistantIcon: React.FC<IconProps> = ({ 
  className = "", 
  color = "currentColor", 
  size = 24 
}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} className={className} fill="none">
    <path d="M21.25 5.5C20.8358 5.5 20.5 5.16421 20.5 4.75C20.5 4.33579 20.8358 4 21.25 4C21.6642 4 22 4.33579 22 4.75C22 5.16421 21.6642 5.5 21.25 5.5ZM21.25 5.5V9.25C21.25 9.94778 21.25 10.2967 21.1639 10.5806C20.97 11.2198 20.4698 11.72 19.8306 11.9139C19.5467 12 19.1978 12 18.5 12" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M2.75 18.5C3.16421 18.5 3.5 18.8358 3.5 19.25C3.5 19.6642 3.16421 20 2.75 20C2.33579 20 2 19.6642 2 19.25C2 18.8358 2.33579 18.5 2.75 18.5ZM2.75 18.5L2.75 14.75C2.75 14.0522 2.75 13.7033 2.83612 13.4194C3.03002 12.7802 3.53023 12.28 4.16943 12.0861C4.45333 12 4.80222 12 5.5 12" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M5.5 2.75009C5.5 3.16431 5.16421 3.50009 4.75 3.50009C4.33579 3.50009 4 3.16431 4 2.75009C4 2.33588 4.33579 2.00009 4.75 2.00009C5.16421 2.00009 5.5 2.33588 5.5 2.75009ZM5.5 2.75009L9.25 2.75009C9.94778 2.75009 10.2967 2.75009 10.5806 2.83621C11.2198 3.03011 11.72 3.53032 11.9139 4.16952C12 4.45342 12 4.80231 12 5.50009" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M18.5 21.2501C18.5 20.8359 18.8358 20.5001 19.25 20.5001C19.6642 20.5001 20 20.8359 20 21.2501C20 21.6643 19.6642 22.0001 19.25 22.0001C18.8358 22.0001 18.5 21.6643 18.5 21.2501ZM18.5 21.2501L14.75 21.2501C14.0522 21.2501 13.7033 21.2501 13.4194 21.164C12.7802 20.9701 12.28 20.4699 12.0861 19.8307C12 19.5468 12 19.1979 12 18.5001" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M5.54883 11.9512C5.54883 8.88704 5.54883 7.35498 6.50073 6.40307C7.45263 5.45117 8.9847 5.45117 12.0488 5.45117C15.113 5.45117 16.645 5.45117 17.5969 6.40307C18.5488 7.35498 18.5488 8.88704 18.5488 11.9512C18.5488 15.0153 18.5488 16.5474 17.5969 17.4993C16.645 18.4512 15.113 18.4512 12.0488 18.4512C8.9847 18.4512 7.45263 18.4512 6.50073 17.4993C5.54883 16.5474 5.54883 15.0153 5.54883 11.9512Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M12.499 14.5L11.0384 9.97891C10.9465 9.69466 10.6648 9.5 10.3452 9.5C10.0256 9.5 9.74382 9.69466 9.65199 9.97891L8.19133 14.5M14.9989 9.5V14.5M8.72979 13H11.9606" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const AIContentGenerationIcon: React.FC<IconProps> = ({ 
  className = "", 
  color = "currentColor", 
  size = 24 
}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} className={className} fill="none">
    <path d="M6.5 2H14.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M17.5 15L17.2421 15.697C16.9039 16.611 16.7348 17.068 16.4014 17.4014C16.068 17.7348 15.611 17.9039 14.697 18.2421L14 18.5L14.697 18.7579C15.611 19.0961 16.068 19.2652 16.4014 19.5986C16.7348 19.932 16.9039 20.389 17.2421 21.303L17.5 22L17.7579 21.303C18.0961 20.389 18.2652 19.932 18.5986 19.5986C18.932 19.2652 19.389 19.0961 20.303 18.7579L21 18.5L20.303 18.2421C19.389 17.9039 18.932 17.7348 18.5986 17.4014C18.2652 17.068 18.0961 16.611 17.7579 15.697L17.5 15Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M17.5 11.8018C16.7142 9.76446 15.0645 8.15647 13 7.42676V2H8V7.42676C5.08702 8.45636 3 11.2345 3 14.5C3 18.6421 6.35786 22 10.5 22C11.5667 22 12.5813 21.7773 13.5 21.3759" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 11H17" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const BriefcaseIcon: React.FC<IconProps> = ({ 
  className = "", 
  color = "currentColor", 
  size = 24 
}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} className={className} fill="none">
    <path d="M2 14C2 11.1911 2 9.78661 2.67412 8.77772C2.96596 8.34096 3.34096 7.96596 3.77772 7.67412C4.78661 7 6.19108 7 9 7H15C17.8089 7 19.2134 7 20.2223 7.67412C20.659 7.96596 21.034 8.34096 21.3259 8.77772C22 9.78661 22 11.1911 22 14C22 16.8089 22 18.2134 21.3259 19.2223C21.034 19.659 20.659 20.034 20.2223 20.3259C19.2134 21 17.8089 21 15 21H9C6.19108 21 4.78661 21 3.77772 20.3259C3.34096 20.034 2.96596 19.659 2.67412 19.2223C2 18.2134 2 16.8089 2 14Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 7C16 5.11438 16 4.17157 15.4142 3.58579C14.8284 3 13.8856 3 12 3C10.1144 3 9.17157 3 8.58579 3.58579C8 4.17157 8 5.11438 8 7" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 11L6.65197 11.202C10.0851 12.266 13.9149 12.266 17.348 11.202L18 11M12 12V14" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ClientIcon: React.FC<IconProps> = ({ 
  className = "", 
  color = "currentColor", 
  size = 24 
}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} className={className} fill="none">
    <path d="M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z" stroke={color} strokeWidth="2" />
    <path d="M15 11C17.2091 11 19 9.20914 19 7C19 4.79086 17.2091 3 15 3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11 14H7C4.23858 14 2 16.2386 2 19C2 20.1046 2.89543 21 4 21H14C15.1046 21 16 20.1046 16 19C16 16.2386 13.7614 14 11 14Z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
    <path d="M17 14C19.7614 14 22 16.2386 22 19C22 20.1046 21.1046 21 20 21H18.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ProjectIcon: React.FC<IconProps> = ({ 
  className = "", 
  color = "currentColor", 
  size = 24 
}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} className={className} fill="none">
    <path d="M4 3H3C2.44772 3 2 3.44772 2 4V18L3.5 21L5 18V4C5 3.44772 4.55228 3 4 3Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M21 12.0013V8.00072C21 5.64336 21 4.46468 20.2678 3.73234C19.5355 3 18.357 3 16 3H13C10.643 3 9.46447 3 8.73223 3.73234C8 4.46468 8 5.64336 8 8.00072V16.0019C8 18.3592 8 19.5379 8.73223 20.2703C9.35264 20.8908 10.2934 20.9855 12 21" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 7H17M12 11H17M14 19C14 19 15.5 19.5 16.5 21C16.5 21 18 17 22 15M2 7H5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const TeamIcon: React.FC<IconProps> = ({ 
  className = "", 
  color = "currentColor", 
  size = 24 
}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} className={className} fill="none">
    <path d="M15 8C15 9.65685 13.6569 11 12 11C10.3431 11 9 9.65685 9 8C9 6.34315 10.3431 5 12 5C13.6569 5 15 6.34315 15 8Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 4C17.6568 4 19 5.34315 19 7C19 8.22309 18.268 9.27523 17.2183 9.7423" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13.7143 14H10.2857C7.91876 14 5.99998 15.9188 5.99998 18.2857C5.99998 19.2325 6.76749 20 7.71426 20H16.2857C17.2325 20 18 19.2325 18 18.2857C18 15.9188 16.0812 14 13.7143 14Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M17.7143 13C20.0812 13 22 14.9188 22 17.2857C22 18.2325 21.2325 19 20.2857 19" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 4C6.34315 4 5 5.34315 5 7C5 8.22309 5.73193 9.27523 6.78168 9.7423" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3.71429 19C2.76751 19 2 18.2325 2 17.2857C2 14.9188 3.91878 13 6.28571 13" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const AnalyticsIcon: React.FC<IconProps> = ({ 
  className = "", 
  color = "currentColor", 
  size = 24 
}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} className={className} fill="none">
    <path d="M6.5 17.5L6.5 14.5M11.5 17.5L11.5 8.5M16.5 17.5V13.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M21.5 5.5C21.5 7.15685 20.1569 8.5 18.5 8.5C16.8431 8.5 15.5 7.15685 15.5 5.5C15.5 3.84315 16.8431 2.5 18.5 2.5C20.1569 2.5 21.5 3.84315 21.5 5.5Z" stroke={color} strokeWidth="2" />
    <path d="M21.4955 11C21.4955 11 21.5 11.3395 21.5 12C21.5 16.4784 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4784 2.5 12C2.5 7.52169 2.5 5.28252 3.89124 3.89127C5.28249 2.50003 7.52166 2.50003 12 2.50003L13 2.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const DebitCardIcon: React.FC<IconProps> = ({ 
  className = "", 
  color = "currentColor", 
  size = 24 
}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} className={className} fill="none">
    <path d="M3.3457 16.1976L16.1747 3.36866M18.6316 11.0556L16.4321 13.2551M14.5549 15.1099L13.5762 16.0886" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M3.17467 16.1411C1.60844 14.5749 1.60844 12.0355 3.17467 10.4693L10.4693 3.17467C12.0355 1.60844 14.5749 1.60844 16.1411 3.17467L20.8253 7.85891C22.3916 9.42514 22.3916 11.9645 20.8253 13.5307L13.5307 20.8253C11.9645 22.3916 9.42514 22.3916 7.85891 20.8253L3.17467 16.1411Z" stroke={color} strokeWidth="1.5" />
    <path d="M4 22H20" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const ExpenseIcon: React.FC<IconProps> = ({ 
  className = "", 
  color = "currentColor", 
  size = 24 
}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} className={className} fill="none">
    <path d="M16.4407 21.3478L16.9929 20.6576C17.4781 20.0511 18.5085 20.1 18.9184 20.7488C19.4114 21.5295 20.6292 21.3743 20.9669 20.6562C20.9845 20.6189 20.9405 20.7123 20.9781 20.3892C21.0156 20.0661 21 19.9923 20.9687 19.8448L19.0456 10.7641C18.5623 8.48195 18.3206 7.34086 17.4893 6.67043C16.6581 6 15.4848 6 13.1384 6H10.8616C8.51517 6 7.34194 6 6.51066 6.67043C5.67937 7.34086 5.43771 8.48195 4.95439 10.7641L3.0313 19.8448C3.00004 19.9923 2.98441 20.0661 3.02194 20.3892C3.05946 20.7123 3.01554 20.6189 3.0331 20.6562C3.37084 21.3743 4.58856 21.5295 5.08165 20.7488C5.49152 20.1 6.52187 20.0511 7.00709 20.6576L7.55934 21.3478C8.25514 22.2174 9.70819 22.2174 10.404 21.3478L10.4908 21.2392C11.2291 20.3165 12.7709 20.3165 13.5092 21.2392L13.596 21.3478C14.2918 22.2174 15.7449 22.2174 16.4407 21.3478Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M2.48336 9.5C1.89805 8.89199 2.00824 8.10893 2.00824 6.15176C2.00824 4.1946 2.00824 3.21602 2.59355 2.60801C3.17886 2 4.1209 2 6.00497 2L17.9952 2C19.8792 2 20.8213 2 21.4066 2.60801C21.9919 3.21602 21.9919 4.1946 21.9919 6.15176C21.9919 8.10893 22.1014 8.89199 21.5161 9.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M12 10H9M14 14L8 14" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);