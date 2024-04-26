import React from 'react';
import OpenLIT from 'components/GenAI/OpenLIT';

export function LLM() {
  return (
    <div style={{ marginTop: '64px', border: '0.5px solid gray' }}>
      <div style={{ display: 'flex', padding: '16px' }}>
      <OpenLIT />
      </div>
    </div>
  );
}
