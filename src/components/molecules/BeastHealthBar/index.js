import React from 'react';
import './BeastHealthBar.css';

const BeastHealthBar = ({currHealth, maxHealth}) => {
  const width = `${currHealth / maxHealth * 100}%`;
  const barStyle = {
    width
  };
  return (
    <div className="health-bar">
      <span style={barStyle}></span>
    </div>
  )
}

export default BeastHealthBar;