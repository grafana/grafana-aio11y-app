
import React, { useState } from 'react';
import { Infrastructure, LLM  } from 'pages';
import { CardElement } from '../Card/Card'; 


const HomePageCards = () => {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);

  const handleClick = (componentName: string) => {
    setSelectedComponent(componentName);
  };

  const renderComponent = () => {
    switch (selectedComponent) {
      case 'Infrastructure':
        return <Infrastructure />;
        case 'LLM':
          return <LLM />;
      default:
        return null;
    }
  };

  return (
    <div>
    <div style={{display: 'flex', marginTop: '3rem'}}>
      <ul style= {{display: 'flex', listStyleType: 'none'}}>
        <li>
          <CardElement
            title="Infrastructure"
            description="Monitor GPU usage"
            onClick={() => handleClick('Infrastructure')}
          />
        </li>
        <li>
          <CardElement
            title="Gen AI"
            description="Monitor Your LLM Usage"
            onClick={() => handleClick('LLM')}
          />
        </li>
      </ul>
      </div>
      <div>
        {renderComponent()}
      </div>
    </div>
  );
};

export default HomePageCards;
