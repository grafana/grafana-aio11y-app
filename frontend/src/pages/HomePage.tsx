import React from 'react';
import { testIds } from '../components/testIds';
import { PluginPage } from '@grafana/runtime';
import { Card, LinkButton, useStyles2 } from '@grafana/ui';
import vectordb from 'img/GenAI/vectordb.png';

export function HomePage() {
  const styles = useStyles2(homeStyles);

  return (
    <PluginPage subTitle="AI O11y Monitoring Quick Setup">
      <div data-testid={testIds.pageOne.container} className={styles.container}>
        <div>
          <Card className={styles.cardCentered}>
            <h2>
              AI Observability is the multi-purpose, turnkey solution for monitoring your AI stack, streamlining triage, and
              optimizing resource utilization.
            </h2>
            <div>
              <LinkButton href='/a/grafana-aio11y-app/configuration' style={{ marginRight: '10px' }} onClick={() => console.log('hi')}>
                Get started
              </LinkButton>
            </div>
          </Card>
          <Card className=''>
            <div className={styles.imageContainer}>
              <div className={styles.textContainer}>
                <h2>Monitor Your GPU usage</h2>
                <p>NVIDA Support</p>
                <LinkButton href='/a/grafana-aio11y-app/InfrastructureHomePage'>
                  View Infrastructure Dashboard
                </LinkButton>
              </div>
              <img src={vectordb} alt="" />
            </div>
          </Card>
          <Card className=''>
            <div className={styles.imageContainer}>
              <div className={styles.textContainer}>
                <h2>Monitor Generative AI</h2>
                <p>Monitor your LLM and Vector Database usage</p>
                <LinkButton href='/a/grafana-aio11y-app/GenAI'>
                  View Gen AI dashboards
                </LinkButton>
              </div>
              <img src={vectordb} alt="" />
            </div>
          </Card>
          <Card className={styles.cardStats}>
            <div className={styles.header}>
              <h1>Dashboard Visualizations Include</h1>
            </div>
            <div className={styles.stats}>
              <div>
                <h4>Total Successful Requests</h4>
                <h5>✅</h5>
              </div>
              <div>
                <h4>Total Usage Cost</h4>
                <h5>✅</h5>
              </div>
              <div>
                <h4>GPU Usage</h4>
                <h5>✅</h5>
              </div>
              <div>
                <h4>Total Requests By Platform</h4>
                <h5>✅</h5>
              </div>
            </div>
            <p>...and more</p>
          </Card>
        </div>
      </div>
    </PluginPage>
  );
}


import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

const homeStyles = (theme: GrafanaTheme2) => ({
  container: css`
  display: flex;
  flex-direction: column;

  h1 {
    text-align: center;
    font-size: 48x;
    margin: 24px 0;
  
  }

  padding: 16px;
`,
  cardCentered: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 40px;
    h2:first-of-type {
      display: none;
    }
    h2 {
      width: 60%;
      margin: 20px 0 40px 0;
    }
  `,
  cardGrid: css`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: 1fr;
    width: 100%;
    text-align: center;

    h3 {
      margin-bottom: 20px;
    }

    img {
      margin-bottom: 20px;
    }

    p {
      margin: auto;
    }
  `,
  card60: css`
    display: flex;
    flex-direction: column;
    width: 66.6%;
    padding: 40px;
  `,
  card30: css`
    width: 33.3%;
    margin-left: 8px;
    display: flex;
    flex-direction: column;
    padding: 40px;

    a {
      color: ${theme.colors.text.link};
    }

    ul {
      margin-left: 20px;
    }
  `,
  textContainer: css`
  margin: auto;
  `,
  imageContainer: css`
    display: flex;
    justify-content: center; 
    img {
      width: 55%;
    }
  `,
  stats: css`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-column-gap: 40px;
  grid-row-gap: 10px;
  padding: 30px;
  text-align: center;
`,

  header: css`
  grid-column: span 5;
`,

  cardStats: css`
  display: flex;
  flex-direction: column;
  align-items: center;
`,

});

export default homeStyles;
