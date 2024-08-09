import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { AppRootProps } from '@grafana/data';
import { ROUTES } from '../../constants';
import {  HomePage, Infrastructure, MLFrameworks, LLM, InfrastructureHomePage, MLFrameworksHomePage } from '../../pages';
import { GenAI } from 'pages/HomeTabComponents/GenAI';
import { AppConfig } from 'components/AppConfig';

export function App(props: AppRootProps) {
  return (
    <Routes>
      <Route path={ROUTES.MLFrameworks} element={<MLFrameworks />} />
      <Route path={ROUTES.Infrastructure} element={<Infrastructure />} />
      <Route path={ROUTES.GenAI} element={<GenAI />} />
      <Route path={ROUTES.LLM} element={<LLM/>} />
      <Route path={ROUTES.InfrastructureHomePage} element={<InfrastructureHomePage/>} />
      <Route path={ROUTES.MLFrameworksHomePage} element={<MLFrameworksHomePage/>} />
      <Route path={ROUTES.CONFIG} element={<AppConfig />}/>
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
}
