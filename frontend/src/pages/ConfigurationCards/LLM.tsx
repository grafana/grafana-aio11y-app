import React from 'react';
import OpenLIT from 'components/GenAI/OpenLIT';
import { PluginPage } from '@grafana/runtime';

export function LLM() {
  return (
    <PluginPage>
      <div style={{ display: 'flex', padding: '16px' }}>
      <OpenLIT />
      </div>
      </PluginPage>
    );
}
