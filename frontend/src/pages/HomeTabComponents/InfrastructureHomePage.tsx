import {  LinkButton, useStyles2 } from '@grafana/ui'
import React from 'react'
import { GrafanaTheme2 } from '@grafana/data';
import { css } from '@emotion/css';
export  function InfrastructureHomePage() {
  const styles = useStyles2(InfraStyles);

  return (
    <div className={styles.container}>
    {/* <h1>Monitor your Infrastructure </h1>

      <Card>
        <img src={pytorch2} alt="" />
      </Card>
      <LinkButton href='/plugins/grafana-aio11y-app'>
        Configure Now
      </LinkButton> */}

<h1>Dashboards</h1>
        <p>A list of your available dashboards</p>
        <ul>
          <li><a href="#">Infra1</a></li>
          <li><a href="#">Infra2</a></li>
          <li><a href="#">Infra3</a></li>
          <li><a href="#">Infra4</a></li>
          <li><a href="#">Infra5</a></li>
        </ul>

        <LinkButton href='/plugins/grafana-aio11y-app'>
        Download Dashboards
        </LinkButton> 
    </div>
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
