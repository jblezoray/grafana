import React from 'react';
import { NavModelItem } from '@grafana/data';

import { IconName } from '../../types';
import { TabsBar } from '../Tabs/TabsBar';
import { Tab } from '../Tabs/Tab';

import { ModalHeader } from './ModalHeader';

interface ModalTab {
  value: string;
  label: string;
  icon?: IconName;
  tabSuffix?: NavModelItem['tabSuffix'];
}

interface Props {
  icon: IconName;
  title: string;
  tabs: ModalTab[];
  activeTab: string;
  onChangeTab(tab: ModalTab): void;
}

export const ModalTabsHeader: React.FC<Props> = ({ icon, title, tabs, activeTab, onChangeTab }) => {
  return (
    <ModalHeader icon={icon} title={title}>
      <TabsBar hideBorder={true}>
        {tabs.map((t, index) => {
          return (
            <Tab
              key={`${t.value}-${index}`}
              label={t.label}
              icon={t.icon}
              suffix={t.tabSuffix}
              active={t.value === activeTab}
              onChangeTab={() => onChangeTab(t)}
            />
          );
        })}
      </TabsBar>
    </ModalHeader>
  );
};
