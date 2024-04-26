
import React, { useState } from 'react';
import { Infrastructure, LLM, VectorDB, MLFrameworks } from 'pages';
import { CardElement } from '../Card/Card'; 


const HomePageCards = () => {
  const [selectedComponent, setSelectedComponent] = useState(null);

  const handleClick = (componentName: any) => {
    setSelectedComponent(componentName);
  };

  const renderComponent = () => {
    switch (selectedComponent) {
      case 'Infrastructure':
        return <Infrastructure />;
        case 'LLM':
          return <LLM />;
      case 'VectorDB':
        return <VectorDB />;
      case 'MLFrameworks':
        return <MLFrameworks />;
      default:
        return null;
    }
  };

  return (
    <div>
    <div style={{display: 'flex'}}>
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
        <li>
          <CardElement
            title="Vector DB"
            description="Monitor your DB Usage"
            onClick={() => handleClick('VectorDB')}
          />
        </li>
        <li>
          <CardElement
            title="ML Frameworks"
            description="Monitor your ML frameworks"
            onClick={() => handleClick('MLFrameworks')}
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
