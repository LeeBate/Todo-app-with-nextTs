import React from 'react';

interface CircleIconProps {
  icon: React.ReactNode;
  bgColor?: string;
  textColor?: string;
  size?: string;
  iconSize?: string;
}

const CustomIcon: React.FC<CircleIconProps> = ({
  icon,
  bgColor = 'bg-green-600',
  textColor = 'text-white',
  size = 'w-5 h-5',
  iconSize = 'w-3 h-3',
}) => {
  return (
    <div className={`${size} ${textColor} ${bgColor} rounded-full flex justify-center items-center`}>
      <div className={iconSize}>{icon}</div>
    </div>
  );
};

export default CustomIcon;
