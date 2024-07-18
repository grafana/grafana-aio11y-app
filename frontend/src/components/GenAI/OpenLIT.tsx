import InstallDashboard from 'components/InstallDashboards/InstallDashboards'
import { openLitConfiguration } from 'pages/snippets'
import React from 'react'

const OpenLIT = () => {
  return (
    <div>
        <h1>LLM Application Monitoring with OpenTelemetry</h1>
        <h3>Install <code>openlit </code>Library</h3>
        <pre>pip install openlit</pre>
        <h3>Create Grafana Cloud Token</h3>
        <p>A Grafana Cloud token is necessary for authentication when sending telemetry data to Grafana Cloud. The provided token should be kept secure and used in your application&lsquo;s environment variables for authorization.</p>
        <pre>glc_eyJvIjoiNjUyOTkyIiwibiI6InN0YWNrLTk1MjMyMi1obS13cml0ZS1hc2RhZGFkIiwiayI6ImUzSjNSNko0WXB1cEwyMFlxSjcyYzEwQSIsIm0iOnsiciI6InByb2QtdXMtZWFzdC0wIn19</pre>
        <h3>Add Environment Variables</h3>
        <pre>{openLitConfiguration()}</pre>
        <h3>Instrument your code</h3>
        <p>To begin collecting telemetry data, initialize the `openlit` library at the start of your application. This simple step hooks into your application to start monitoring its performance and behavior.</p>
        <pre>
        import openlit

        openlit.init()
        </pre>
        <h3>Install Dashboard</h3>
        <p>Get access to pre-configured dashboard that work right away</p>
        <InstallDashboard filePath='https://raw.githubusercontent.com/grafana/hackathon-2024-03-tame-the-beast/main/grafana-aio11y-app/src/instructions/llms/openai/dashboard.json?token=GHSAT0AAAAAACKHWE6CWH7A5ORZB6XWN5E4ZUOTL6Q'/>

    </div>
  )
}

export default OpenLIT;
