import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { DataTransformerConfig, standardTransformersRegistry } from '@grafana/data';
import { getStandardTransformers } from 'app/core/utils/standardTransformers';
import { selectors } from '@grafana/e2e-selectors';

import { PanelModel } from '../../state';

import { TransformationsEditor } from './TransformationsEditor';

const setup = (transformations: DataTransformerConfig[] = []) => {
  const panel = new PanelModel({});
  panel.setTransformations(transformations);
  render(<TransformationsEditor panel={panel} />);
};

describe('TransformationsEditor', () => {
  standardTransformersRegistry.setInit(getStandardTransformers);

  describe('when no transformations configured', () => {
    it('renders transformations selection list', () => {
      setup();

      const cards = screen.getAllByLabelText(/^New transform/i);
      expect(cards.length).toEqual(standardTransformersRegistry.list().length);
    });
  });

  describe('when transformations configured', () => {
    it('renders transformation editors', () => {
      setup([
        {
          id: 'reduce',
          options: {},
        },
      ]);
      const editors = screen.getAllByLabelText(/^Transformation editor/g);
      expect(editors).toHaveLength(1);
    });
  });

  describe('when Add transformation clicked', () => {
    it('renders transformations picker', () => {
      const buttonLabel = 'Add transformation';
      setup([
        {
          id: 'reduce',
          options: {},
        },
      ]);

      const addTransformationButton = screen.getByText(buttonLabel);
      userEvent.click(addTransformationButton);

      const search = screen.getByLabelText(selectors.components.Transforms.searchInput);
      expect(search).toBeDefined();
    });
  });

  describe('actions', () => {
    describe('debug', () => {
      it('should show/hide debugger', () => {
        setup([
          {
            id: 'reduce',
            options: {},
          },
        ]);
        const debuggerSelector = selectors.components.TransformTab.transformationEditorDebugger('Reduce');

        expect(screen.queryByLabelText(debuggerSelector)).toBeNull();

        const debugButton = screen.getByLabelText(selectors.components.QueryEditorRow.actionButton('Debug'));
        userEvent.click(debugButton);

        expect(screen.getByLabelText(debuggerSelector)).toBeInTheDocument();
      });
    });
  });
});
