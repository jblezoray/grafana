import React from 'react';
import { EditorRows, EditorRow } from '@grafana/experimental';

import { DataSourceApi, SelectableValue } from '@grafana/data';

import { PromVisualQuery } from '../types';
import { LabelFilters } from '../shared/LabelFilters';
import { OperationList } from '../shared/OperationList';
import { PrometheusDatasource } from '../../datasource';
import { promQueryModeller } from '../PromQueryModeller';
import { QueryBuilderLabelFilter } from '../shared/types';
import { OperationsEditorRow } from '../shared/OperationsEditorRow';

import { QueryPreview } from './QueryPreview';
import { NestedQueryList } from './NestedQueryList';
import { MetricSelect } from './MetricSelect';

export interface Props {
  query: PromVisualQuery;
  datasource: PrometheusDatasource;
  onChange: (update: PromVisualQuery) => void;
  onRunQuery: () => void;
  nested?: boolean;
}

export const PromQueryBuilder = React.memo<Props>(({ datasource, query, onChange, onRunQuery, nested }) => {
  const onChangeLabels = (labels: QueryBuilderLabelFilter[]) => {
    onChange({ ...query, labels });
  };

  const withTemplateVariableOptions = async (optionsPromise: Promise<string[]>): Promise<SelectableValue[]> => {
    const variables = datasource.getVariables();
    const options = await optionsPromise;
    return [...variables, ...options].map((value) => ({ label: value, value }));
  };

  const onGetLabelNames = async (forLabel: Partial<QueryBuilderLabelFilter>): Promise<string[]> => {
    // If no metric we need to use a different method
    if (!query.metric) {
      // Todo add caching but inside language provider!
      await datasource.languageProvider.fetchLabels();
      return datasource.languageProvider.getLabelKeys();
    }

    const labelsToConsider = query.labels.filter((x) => x !== forLabel);
    labelsToConsider.push({ label: '__name__', op: '=', value: query.metric });
    const expr = promQueryModeller.renderLabels(labelsToConsider);
    const labelsIndex = await datasource.languageProvider.fetchSeriesLabels(expr);

    // filter out already used labels
    return Object.keys(labelsIndex).filter(
      (labelName) => !labelsToConsider.find((filter) => filter.label === labelName)
    );
  };

  const onGetLabelValues = async (forLabel: Partial<QueryBuilderLabelFilter>) => {
    if (!forLabel.label) {
      return [];
    }

    // If no metric we need to use a different method
    if (!query.metric) {
      return await datasource.languageProvider.getLabelValues(forLabel.label);
    }

    const labelsToConsider = query.labels.filter((x) => x !== forLabel);
    labelsToConsider.push({ label: '__name__', op: '=', value: query.metric });
    const expr = promQueryModeller.renderLabels(labelsToConsider);
    const result = await datasource.languageProvider.fetchSeriesLabels(expr);
    const forLabelInterpolated = datasource.interpolateString(forLabel.label);
    return result[forLabelInterpolated] ?? [];
  };

  const onGetMetrics = async () => {
    if (query.labels.length > 0) {
      const expr = promQueryModeller.renderLabels(query.labels);
      return (await datasource.languageProvider.getSeries(expr, true))['__name__'] ?? [];
    } else {
      return (await datasource.languageProvider.getLabelValues('__name__')) ?? [];
    }
  };

  return (
    <EditorRows>
      <EditorRow>
        <MetricSelect
          query={query}
          onChange={onChange}
          onGetMetrics={() => withTemplateVariableOptions(onGetMetrics())}
        />
        <LabelFilters
          labelsFilters={query.labels}
          onChange={onChangeLabels}
          onGetLabelNames={(forLabel: Partial<QueryBuilderLabelFilter>) =>
            withTemplateVariableOptions(onGetLabelNames(forLabel))
          }
          onGetLabelValues={(forLabel: Partial<QueryBuilderLabelFilter>) =>
            withTemplateVariableOptions(onGetLabelValues(forLabel))
          }
        />
      </EditorRow>
      <OperationsEditorRow>
        <OperationList<PromVisualQuery>
          queryModeller={promQueryModeller}
          datasource={datasource as DataSourceApi}
          query={query}
          onChange={onChange}
          onRunQuery={onRunQuery}
        />
        {query.binaryQueries && query.binaryQueries.length > 0 && (
          <NestedQueryList query={query} datasource={datasource} onChange={onChange} onRunQuery={onRunQuery} />
        )}
      </OperationsEditorRow>
      {!nested && (
        <EditorRow>
          <QueryPreview query={query} />
        </EditorRow>
      )}
    </EditorRows>
  );
});

PromQueryBuilder.displayName = 'PromQueryBuilder';
