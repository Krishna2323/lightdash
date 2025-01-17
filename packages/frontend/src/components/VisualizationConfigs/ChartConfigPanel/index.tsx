import { Popover2 } from '@blueprintjs/popover2';
import { Button } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import React from 'react';
import useEcharts from '../../../hooks/echarts/useEcharts';
import { COLLAPSABLE_CARD_BUTTON_PROPS } from '../../common/CollapsableCard';
import MantineIcon from '../../common/MantineIcon';
import ChartConfigTabs from './ChartConfigTabs';

const ChartConfigPanel: React.FC = () => {
    const eChartsOptions = useEcharts();
    const disabled = !eChartsOptions;

    return (
        <Popover2
            disabled={disabled}
            position="bottom"
            content={<ChartConfigTabs />}
        >
            <Button
                {...COLLAPSABLE_CARD_BUTTON_PROPS}
                disabled={disabled}
                rightIcon={<MantineIcon icon={IconChevronDown} color="gray" />}
            >
                Configure
            </Button>
        </Popover2>
    );
};

export default ChartConfigPanel;
