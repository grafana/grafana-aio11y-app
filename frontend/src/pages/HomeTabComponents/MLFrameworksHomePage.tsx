import {  LinkButton, useStyles2 } from '@grafana/ui'
import React from 'react'
import { GrafanaTheme2 } from '@grafana/data';
import { css } from '@emotion/css';
export function MLFrameworksHomePage() {
  const styles = useStyles2(MLStyles);

  return (
    <div className={styles.container}>
      {/* <h1>Monitor your ML Frameworks</h1>

      <Card>
        <img src={pytorch1} alt="" />
      </Card>
      <LinkButton href='/plugins/gtm-aiobservability-app'>
        Configure Now
        </LinkButton> */}

      <h1>Dashboards</h1>
      <p>A list of your available dashboards</p>
      <ul>
        <li><a href="#">ML1</a></li>
        <li><a href="#">ML2</a></li>
        <li><a href="#">ML3</a></li>
        <li><a href="#">ML4</a></li>
        <li><a href="#">ML5</a></li>
      </ul>

      <LinkButton href='/plugins/gtm-aiobservability-app'>
        Download Dashboards
      </LinkButton>
    </div>
  )
}

const MLStyles = (theme: GrafanaTheme2) => ({
  container: css`
  padding: 48px;
  width: 100vw;
  height: 100vh;
  background-color: ${theme.colors.background.primary};
  ul {
    margin-bottom: 16px;
    
  }    img {
      width: 99%;
    }

  `,
})
