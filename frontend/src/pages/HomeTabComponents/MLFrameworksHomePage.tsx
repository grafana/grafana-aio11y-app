import { Card, LinkButton, useStyles2 } from '@grafana/ui'
import React from 'react'
import pytorch1 from 'img/MLFrameworks/Pytorch/pytorch1.png'
import { GrafanaTheme2 } from '@grafana/data';
import { css } from '@emotion/css';
export  function MLFrameworksHomePage() {
  const styles = useStyles2(MLStyles);

  return (
    <div className={styles.container}>
    <h1>Monitor your ML Frameworks</h1>

      <Card>
        <img src={pytorch1} alt="" />
      </Card>
      <LinkButton href='/plugins/gtm-aiobservability-app'>
        Configure Now
        </LinkButton>
    </div>
  )
}

const MLStyles = (theme: GrafanaTheme2) => ({
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
