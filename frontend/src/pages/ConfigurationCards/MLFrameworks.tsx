import React, { useState } from 'react';
import InstallDashboard from 'components/InstallDashboards/InstallDashboards';
import PyTorch from 'components/MLFrameworks/PyTorch';
import Tensorflow from 'components/MLFrameworks/Tensorflow';
import { CardElement } from 'components/Card/Card';

export function MLFrameworks() {
  const [selectedFramework, setSelectedFramework] = useState(null);

  const handleButtonClick = (framework: any) => {
    setSelectedFramework(framework);
  };
  return (
    <div style={{ marginTop: '64px', border: '0.5px solid gray' }}>
      <h1 style={{ padding: '16px' }}> ML Framework Instructions</h1>
      <div style={{ display: 'flex', padding: '16px' }}>
        <CardElement
          title="Tensorflow"
          description="Monitor Your Tensorflow Usage"
          onClick={() => handleButtonClick('Tensorflow')}
        />
        <CardElement
          title="Pytorch"
          description="Monitor Your Pytorch Usage"
          onClick={() => handleButtonClick('Pytorch')}
        />
      </div>
      <div style={{ marginLeft: '32px', padding: '16px', marginTop: '16px' }}>
        {selectedFramework === 'Tensorflow' && <Tensorflow />}
        {selectedFramework === 'Pytorch' && <PyTorch />}
        {selectedFramework === 'Tensorflow' && <InstallDashboard filePath="https://raw.githubusercontent.com/grafana/hackathon-2024-03-tame-the-beast/main/grafana-aio11y-app/src/instructions/vectordb/chroma.json" />}
        {selectedFramework === 'Pytorch' && <InstallDashboard filePath='https://raw.githubusercontent.com/grafana/hackathon-2024-03-tame-the-beast/main/grafana-aio11y-app/src/instructions/vectordb/pinecone.json' />}
      </div>
    </div>
  );
}
