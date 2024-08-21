import React from 'react';

import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';
import { useStyles2 } from '@grafana/ui';

import InstallDashboard from 'components/InstallDashboards/InstallDashboards';
import { dcgmSnippet, installDCGMExporter, prepareAgentConfig } from '../snippets';
import { PluginPage } from '@grafana/runtime';

export function Infrastructure() {
  const styles = useStyles2(getStyles);

  return (
    <PluginPage>
      <div>
        <div style={{ padding: '16px' }}>
          <h1>Monitor Nvidea DCGM</h1>

          <h3 className={styles.h3}>Obtain environment variables</h3>
          <div className={styles.instructionSubheader}>
            Setting these environment variables configures the SDK with the necessary endpoint and headers to securely
            send telemetry data to Grafana Cloud.
            <br />
            To get these variables, Follow the below steps
          </div>
          <ol className={styles.instructionsList}>
            <li>Sign in to Grafana Cloud Portal and select your Grafana Cloud Stack</li>
            <li>Click Configure in the OpenTelemetry section</li>
            <li>In the Password / API Token section, click on Generate now to create a new API token</li>
            <li>Give the API token a name, for example openlit</li>
            <li>Click on Create token</li>
            <li>Click on Close without copying the token</li>
            <li>Copy and Save the value for `OTEL_EXPORTER_OTLP_ENDPOINT` and `OTEL_EXPORTER_OTLP_HEADERS`</li>
          </ol>
          <div className={styles.instructionNote}>
            Note: Replace the space after Basic with %20: OTEL_EXPORTER_OTLP_HEADERS=“Authorization=Basic%20[base64
            instanceID:token]”
          </div>

          <h3 className={styles.h3}>Install Grafana Agent In Kubernetes</h3>
          <p>
            The Grafana agent collects observability data and sends it to Grafana Cloud. Once the agent is deployed to
            your hosts, it collects and sends Prometheus-style metrics and log data using a pared-down Prometheus
            collector.
          </p>
          <p>Run this command to install and run Grafana Agent in Kubernetes</p>
          <pre>{dcgmSnippet()}</pre>
          <h3 className={styles.h3}>Install DCGM Exporter </h3>
          <p>
            The NVIDIA DCGM Exporter fetches metrics from GPUs and exposes them for collection. It&apos;s crucial for
            monitoring the performance and health of your GPUs within Kubernetes.
          </p>
          <pre>{installDCGMExporter()}</pre>
          <h3 className={styles.h3}>Prepare your agent config file</h3>
          <p>Below `metrics.configs.scrape_configs`, insert the following lines: </p>
          <pre>{prepareAgentConfig()}</pre>
          <h3 className={styles.h3}>Install Dashboards:</h3>
          <InstallDashboard filePath="https://raw.githubusercontent.com/grafana/grafana-aio11y-app/main/frontend/src/instructions/infrastructure/dashboard.json" />
        </div>
      </div>
    </PluginPage>
  );
}

const getStyles = (theme: GrafanaTheme2) => ({
  instructionBox: css`
    padding: 10px;
    border: 1px solid ${theme.colors.border.weak};
    margin: 20px 0px;
  `,
  instructionHeader: css`
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
  `,
  instructionSubheader: css`
    font-size: 14px;
    font-style: itallic;
    margin-bottom: 10px;
  `,
  instructionsList: css`
    font-size: 18px;
    margin-left: 30px;
    & li {
      margin-bottom: 5px;
    }
  `,
  instructionNote: css`
    color: ${theme.colors.text.secondary};
    font-size: 14px;
    font-style: itallic;
    margin-top: 10px;
  `,
  h3: css`
    margin-top: 40px;
  `,
});
