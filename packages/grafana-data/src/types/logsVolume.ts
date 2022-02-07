import { Observable } from 'rxjs';

import { DataQuery } from './query';
import { DataQueryRequest, DataQueryResponse } from './datasource';

/**
 * TODO: This should be added to ./logs.ts but because of cross reference between ./datasource.ts and ./logs.ts it can
 * be done only after decoupling "logs" from "datasource" (https://github.com/grafana/grafana/pull/39536)
 *
 * @internal
 */
export interface DataSourceWithLogsVolumeSupport<TQuery extends DataQuery> {
  getLogsVolumeDataProvider(request: DataQueryRequest<TQuery>): Observable<DataQueryResponse> | undefined;
}

/**
 * @internal
 */
export const hasLogsVolumeSupport = <TQuery extends DataQuery>(
  datasource: any
): datasource is DataSourceWithLogsVolumeSupport<TQuery> => {
  return (datasource as DataSourceWithLogsVolumeSupport<TQuery>).getLogsVolumeDataProvider !== undefined;
};
