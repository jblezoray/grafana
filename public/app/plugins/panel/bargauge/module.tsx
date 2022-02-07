import { commonOptionsBuilder, sharedSingleStatPanelChangedHandler } from '@grafana/ui';
import { PanelPlugin } from '@grafana/data';

import { addOrientationOption, addStandardDataReduceOptions } from '../stat/types';

import { BarGaugePanel } from './BarGaugePanel';
import { BarGaugeOptions, displayModes } from './types';
import { barGaugePanelMigrationHandler } from './BarGaugeMigrations';
import { BarGaugeSuggestionsSupplier } from './suggestions';

export const plugin = new PanelPlugin<BarGaugeOptions>(BarGaugePanel)
  .useFieldConfig()
  .setPanelOptions((builder) => {
    addStandardDataReduceOptions(builder);
    addOrientationOption(builder);
    commonOptionsBuilder.addTextSizeOptions(builder);

    builder
      .addRadio({
        path: 'displayMode',
        name: 'Display mode',
        settings: {
          options: displayModes,
        },
        defaultValue: 'gradient',
      })
      .addBooleanSwitch({
        path: 'showUnfilled',
        name: 'Show unfilled area',
        description: 'When enabled renders the unfilled region as gray',
        defaultValue: true,
        showIf: (options: BarGaugeOptions) => options.displayMode !== 'lcd',
      });
  })
  .setPanelChangeHandler(sharedSingleStatPanelChangedHandler)
  .setMigrationHandler(barGaugePanelMigrationHandler)
  .setSuggestionsSupplier(new BarGaugeSuggestionsSupplier());
