import React  from 'react';
import { lastValueFrom } from 'rxjs';
import {  PluginMeta } from '@grafana/data';
import { getBackendSrv } from '@grafana/runtime';
import { testIds } from '../testIds';
import HomePageCards from './HomePageCards';

export const AppConfig = () => {
  return (
    <div data-testid={testIds.appConfig.container}>
      <HomePageCards />    
    </div>
  );
};

export const updatePlugin = async (pluginId: string, data: Partial<PluginMeta>) => {
  const response = await getBackendSrv().fetch({
    url: `/api/plugins/${pluginId}/settings`,
    method: 'POST',
    data,
  });

  return lastValueFrom(response);
};
