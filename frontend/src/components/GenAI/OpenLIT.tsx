import React from 'react';

import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';
import { useStyles2 } from '@grafana/ui';

import InstallDashboard from 'components/InstallDashboards/InstallDashboards';
import { openLitConfiguration } from 'pages/snippets';

const OpenLIT = () => {
  const styles = useStyles2(getStyles);
  return (
    <div>
      <h1>LLM Application Monitoring with OpenTelemetry</h1>

      <h3 className={styles.h3}>Obtain environment variables</h3>
      <div className={styles.instructionSubheader}>
        Setting these environment variables configures the SDK with the necessary endpoint and headers to securely send
        telemetry data to Grafana Cloud.
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

      <h3 className={styles.h3}>
        Install <code>openlit </code>Library
      </h3>
      <pre>pip install openlit</pre>
      <h3 className={styles.h3}>Create Grafana Cloud Token</h3>
      <p>
        A Grafana Cloud token is necessary for authentication when sending telemetry data to Grafana Cloud. The provided
        token should be kept secure and used in your application&lsquo;s environment variables for authorization.
      </p>
      <h3 className={styles.h3}>Add Environment Variables</h3>
      <pre>{openLitConfiguration()}</pre>
      <h3 className={styles.h3}>Instrument your code</h3>
      <p>
        To begin collecting telemetry data, initialize the `openlit` library at the start of your application. This
        simple step hooks into your application to start monitoring its performance and behavior.
      </p>
      <pre>
        import openlit{'\n'}
        openlit.init()
      </pre>
      <h3 className={styles.h3}>Install Dashboard</h3>
      <p>Get access to pre-configured dashboard that work right away</p>
      <InstallDashboard filePath="https://raw.githubusercontent.com/grafana/grafana-aio11y-app/main/frontend/src/instructions/genai/dashboard.json" />
    </div>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
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

export default OpenLIT;
