import React, { useMemo, useState } from 'react';
import {
  ResizeHandle,
  ResizeDirection
} from './ResizeHandle';

const containerStyles = {
  display: 'flex',
  flexDirection: 'column',
  margin: 0,
  padding: 0,
  maxWidth: '80%',
  height: '100%',
  position: 'relative'
};

function ResizableArea({
  initialWidth,
  minWidth,
  children
}) {
  const [width, setWidth] = useState(initialWidth);

  const maxWidth = useMemo(() => {
    return Math.max(minWidth, window.innerWidth - 100);
  }, [minWidth]);

  return (
    <div
      style={{
        ...containerStyles,
        minWidth,
        width,
        flex: 'none'
      }}
    >
      {children}
      <ResizeHandle
        onChange={(newWidth) => setWidth(newWidth)}
        direction={ResizeDirection.RIGHT}
        value={width}
        minValue={minWidth}
        maxValue={maxWidth}
        title="sidebar"
      />
    </div>
  );
}

export { ResizableArea };
