import { LinkButton, useStyles2 } from '@grafana/ui'
import React from 'react'

import { GrafanaTheme2 } from '@grafana/data';
import { PluginPage } from '@grafana/runtime';

import { css } from '@emotion/css';
export  function InfrastructureHomePage() {
  const styles = useStyles2(InfraStyles);

  return (
    <PluginPage subTitle="AI O11y Infrastructure Dahsboards">

    <div className={styles.container}>

<h1>Dashboards</h1>
        <p>A list of your available dashboards</p>
        <ul>
          <li><a href="#">Infra1</a></li>
          <li><a href="#">Infra2</a></li>
          <li><a href="#">Infra3</a></li>
          <li><a href="#">Infra4</a></li>
          <li><a href="#">Infra5</a></li>
        </ul>

      <LinkButton href='/a/grafana-aio11y-app/configuration'>
        Download Dashboards
      </LinkButton>
    </div>
    </PluginPage>
  )
}

const InfraStyles = (theme: GrafanaTheme2) => ({
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
