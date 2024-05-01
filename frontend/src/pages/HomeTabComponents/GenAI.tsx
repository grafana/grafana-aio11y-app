import React from 'react';

import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';
import { Card, LinkButton, useStyles2 } from '@grafana/ui';
import tokens from '/img/GenAi/tokens.png'

export function GenAI() {
  const styles = useStyles2(GenAIStyles);

  return (
    <div className={styles.container}>
      <h1>Monitor your Generative AI stack</h1>
      <Card className=''>
        <img src={tokens} alt="" />
      </Card>
      <LinkButton href='/plugins/gtm-aiobservability-app'>
        Configure Now
        </LinkButton>
    </div>
  );
}

const GenAIStyles = (theme: GrafanaTheme2) => ({
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





});
