import React from 'react';
import PropTypes from 'prop-types';
import formatTime from '../utils/time';

export default function Timer({ player, time }) {
  return (
    <div>
      <p>{`${player}:`}</p>
      <p>{formatTime(time)}</p>
    </div>
  );
}

Timer.propTypes = {
  player: PropTypes.string.isRequired,
  time: PropTypes.number.isRequired,
};
