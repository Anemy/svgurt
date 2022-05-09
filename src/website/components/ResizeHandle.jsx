import React, { useRef } from 'react';

import './ResizeHandle.css';

const ResizeDirection = {
  TOP: 'TOP',
  RIGHT: 'RIGHT'
};

function ResizeHandle({
  direction,
  step = 10,
  value,
  minValue,
  maxValue,
  onChange,
  title
}) {
  const isDragging = useRef(false);

  function boundSize(attemptedSize) {
    return Math.min(maxValue, Math.max(minValue, attemptedSize));
  }

  let directionTitle = 'vertical';
  let dimensionTitle = 'Width';
  let resizerStyle = 'svgee-vertical-resizer-styles';

  if (direction === ResizeDirection.TOP) {
    directionTitle = 'horizontal';
    dimensionTitle = 'Height';
    resizerStyle = 'svgee-horizontal-resizer-styles';
  }

  return (
    <input
      className={`svgee-resizer-styles ${resizerStyle}`}
      type="range"
      aria-roledescription={`${directionTitle} splitter`}
      aria-label={`${dimensionTitle} of the ${title}, resize using arrow keys`}
      // style={styles}
      min={minValue}
      max={maxValue}
      value={value}
      step={step}
      onChange={(event) => {
        if (isDragging.current) {
          // When dragging, we want the mouse movement to update the
          // width, not the value of the range where it's being dragged.
          return;
        }
        onChange(boundSize(Number(event.target.value)));
      }}
      onMouseDown={() => {
        isDragging.current = true;
      }}
      onMouseMove={(event) => {
        if (isDragging.current) {
          if (direction === ResizeDirection.RIGHT) {
            onChange(boundSize(value + event.movementX));
          } else if (direction === ResizeDirection.TOP) {
            onChange(boundSize(value - event.movementY));
          }
        }
      }}
      onMouseUp={(event) => {
        // We only want to maintain focus on the resizer when
        // the user has focused it using the keyboard.
        event.currentTarget.blur();

        isDragging.current = false;
        if (direction === ResizeDirection.RIGHT) {
          onChange(boundSize(value + event.movementX));
        } else if (direction === ResizeDirection.TOP) {
          onChange(boundSize(value - event.movementY));
        }
      }}
    />
  );
}

export { ResizeHandle, ResizeDirection };
