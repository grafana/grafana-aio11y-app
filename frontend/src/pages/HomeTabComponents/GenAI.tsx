import React from 'react';
import tokens from 'img/GenAI/tokens.png';
import vectordb from 'img/GenAI/vectordb.png';
import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';
import { Card, LinkButton, useStyles2 } from '@grafana/ui';

export function GenAI() {
  const styles = useStyles2(GenAIStyles);

  return (
    <div className={styles.container}>
      <h1>Monitor your Generative AI stack</h1>
      <Card className=''>
        <div className={styles.imageContainer}>
        <div className={styles.textContainer}>
          <h2>Monitor Your GPU usage</h2>
          <p>with prebuilt dashboards</p>
          <LinkButton>
          View Infrastructure Dashboard
          </LinkButton>
        </div>
          <img src={tokens} alt="" />
        </div>
      </Card>
      <Card className=''>
        <div className={styles.imageContainer}>
          <img src={vectordb} alt="" />
          <div className={styles.textContainer}>
          <h2>Monitor Pytorch and Tensorflow</h2> 
          <p>With prebuilt dashboards</p>
         <LinkButton>
         View Frameworks Dashboard
         </LinkButton>
        </div>
        </div> 
      </Card>
      <Card className=''>
        <div className={styles.imageContainer}>
        <div className={styles.textContainer}>
          <h2>Monitor Your LLM and Vector DB usage</h2>
          <p>with prebuilt dashboards</p>
          <LinkButton>
          View Gen AI dashboards
          </LinkButton>
        </div>
          <img src={tokens} alt="" />
        </div>
      </Card>
      <Card className={styles.cardStats}>
  <div className={styles.header}>
    <h1>Dashboards Include</h1>
  </div>
  <div className={styles.stats}>
    <div>
      <h3>Total Successful Requests</h3>
      <h4>✅</h4>
    </div>
    <div>
    <h3>Total Usage Cost</h3>
      <h4>✅</h4>
    </div>
    <div>
    <h3>DB Requests By Operation</h3>
      <h4>✅</h4>
    </div>
    <div>
    <h3>Total Requests By Platform</h3>
      <h4>✅</h4>
    </div>
  </div>
  <p>...and more</p>

</Card>

    </div>
  );
}

const GenAIStyles = (theme: GrafanaTheme2) => ({
  container: css`
    display: flex;
    flex-direction: column;
    width: 100%;
    img {
      width: 50%;
    }

    h1 {
      text-align: center;
      font-size: 48x;
      margin: 24px 0;
    
    }

    padding: 16px;
  `,
  textContainer: css`
  white-space: nowrap;
  margin: auto;
  `,
  imageContainer: css`
    display: flex;
    justify-content: center; 
  `,
  stats: css`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-column-gap: 20px;
  grid-row-gap: 20px;
  padding: 40px;
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
