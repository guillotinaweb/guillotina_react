import React from 'react'

export function Delete({ onClick }) {
  return (<button type="button"
    onClick={onClick} className="delete" />
  );
}
