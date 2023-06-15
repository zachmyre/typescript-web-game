import React from 'react';

export interface PlayerProps {
    id?: string;
  size: number;
  x: number;
  y: number;
  name: string;
}

const Player: React.FC<PlayerProps> = ({ size, x, y, name }) => {
  const circleStyle: React.CSSProperties = {
    width: `${size}rem`,
    height: `${size}rem`,
    borderRadius: '50%',
    backgroundColor: 'red',
    position: 'absolute',
    left: `${x}rem`,
    top: `${y}rem`,
  };

  const nameStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${x - .5}rem`,
    top: `${y - 2}rem`, // Adjust the vertical position for the name tag
    textAlign: 'center',
    fontWeight: 'bold',
  };

  return (
    <div>
      <div style={circleStyle}></div>
      <div style={nameStyle}>{name}</div>
    </div>
  );
};

export default Player;
