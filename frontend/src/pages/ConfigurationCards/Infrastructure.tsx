import React  from 'react';
import InstallDashboard from 'components/InstallDashboards/InstallDashboards';
import { dcgmSnippet, installDCGMExporter, prepareAgentConfig } from '../snippets';

export function Infrastructure() {

  return (
    <div style={{ marginTop: '64px', border: '0.5px solid gray' }}>
      <div>
        <div style={{ marginLeft: '32px', padding: '16px' }}>
          <h1>Monitor Nvidea DCGM</h1>
          
          <p>some text about what this does!</p>
          <h2>Install Grafana Agent In Kubernetes</h2>
          <p>The Grafana agent collects observability data and sends it to Grafana Cloud. Once the agent is deployed to your hosts, it collects and sends Prometheus-style metrics and log data using a pared-down Prometheus collector.</p>
          <p>Run this command to install and run Grafana Agent in Kubernetes</p>
          <pre>{dcgmSnippet()}</pre>
          <h2>Install DCGM Exporter </h2>
          <p>The NVIDIA DCGM Exporter fetches metrics from GPUs and exposes them for collection. It&apos;s crucial for monitoring the performance and health of your GPUs within Kubernetes.</p>
          <pre>{installDCGMExporter()}</pre>
          <h2>Prepare your agent config file</h2>
          <p>Below `metrics.configs.scrape_configs`, insert the following lines: </p>
          <pre>
            {prepareAgentConfig()}
          </pre>
          <h2>Install Dashboards:</h2>
          <InstallDashboard filePath='https://raw.githubusercontent.com/grafana/grafana-aio11y-app/main/frontend/src/instructions/infrastructure/dashboard.json' />
        </div>
      </div>
    </div>
  );
}



