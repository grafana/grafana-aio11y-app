import React from 'react';

import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';
import { LinkButton, useStyles2 } from '@grafana/ui';
export function GenAI() {
  const styles = useStyles2(GenAIStyles);

  return (
    <div className={styles.container}>
        <h1>Dashboards</h1>
        <p>A list of your available dashboards</p>
        <ul>
          <li><a href="#">GenAi1</a></li>
          <li><a href="#">GenAi2</a></li>
          <li><a href="#">GenAi3</a></li>
          <li><a href="#">GenAi4</a></li>
          <li><a href="#">GenAi5</a></li>
        </ul>

        <LinkButton href='/plugins/gtm-aiobservability-app'>
        Download Dashboards
        </LinkButton> 
    </div>
  );
}

const GenAIStyles = (theme: GrafanaTheme2) => ({
  container: css`
  padding: 48px;
  width: 100vw;
  height: 100vh;
  background-color: ${theme.colors.background.primary};
  ul {
    margin-bottom: 16px;
  }
    img {
      width: 99%;
    }

  `,





});
