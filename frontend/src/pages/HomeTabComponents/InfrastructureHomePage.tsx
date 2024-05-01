import { Card, LinkButton, useStyles2 } from '@grafana/ui'
import React from 'react'
import pytorch2 from 'img/MLFrameworks/Pytorch/pytorch2.png'
import { GrafanaTheme2 } from '@grafana/data';
import { css } from '@emotion/css';
export  function InfrastructureHomePage() {
  const styles = useStyles2(InfraStyles);

  return (
    <div className={styles.container}>
    <h1>Monitor your Infrastructure </h1>

      <Card>
        <img src={pytorch2} alt="" />
      </Card>
      <LinkButton href='/plugins/gtm-aiobservability-app'>
        Configure Now
      </LinkButton>
    </div>
  )
}

const InfraStyles = (theme: GrafanaTheme2) => ({
  container: css`
  padding: 16px;
    img {
      width: 99%;
    }
    h1 {
      text-align: center;
      font-size: 48x;
      margin: 24px 0;
    }
  `,
})
