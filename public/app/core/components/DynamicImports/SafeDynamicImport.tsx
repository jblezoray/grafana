import React from 'react';
import Loadable from 'react-loadable';

import { GrafanaRouteComponent } from 'app/core/navigation/types';

import { LoadingChunkPlaceHolder } from './LoadingChunkPlaceHolder';
import { ErrorLoadingChunk } from './ErrorLoadingChunk';

export const loadComponentHandler = (props: { error: Error; pastDelay: boolean }) => {
  const { error, pastDelay } = props;

  if (error) {
    return <ErrorLoadingChunk error={error} />;
  }

  if (pastDelay) {
    return <LoadingChunkPlaceHolder />;
  }

  return null;
};

export const SafeDynamicImport = (loader: () => Promise<any>): GrafanaRouteComponent =>
  Loadable({
    loader: loader,
    loading: loadComponentHandler,
  });
