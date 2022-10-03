import { Button, NonIdealState } from '@blueprintjs/core';
import { FC } from 'react';
import { ResourceListProps } from '.';
import {
    EmptyStateIcon,
    EmptyStateText,
    EmptyStateWrapper,
} from './ResourceEmptyState.styles';

type Props = Pick<ResourceListProps, 'headerAction' | 'onClickCTA'> & {
    resourceType: ResourceListProps['resourceType'] | 'space';
    resourceIcon?: ResourceListProps['resourceIcon'];
};

const ResourceEmptyState: FC<Props> = ({
    resourceType,
    resourceIcon,
    onClickCTA,
}) => {
    return (
        <EmptyStateWrapper>
            <NonIdealState
                description={
                    <EmptyStateWrapper>
                        {resourceIcon && (
                            <EmptyStateIcon icon={resourceIcon} size={40} />
                        )}

                        <EmptyStateText>
                            No {resourceType}s added yet
                        </EmptyStateText>

                        {onClickCTA && (
                            <Button
                                text={`Create ${resourceType}`}
                                icon="plus"
                                intent="primary"
                                onClick={onClickCTA}
                            />
                        )}
                    </EmptyStateWrapper>
                }
            />
        </EmptyStateWrapper>
    );
};

export default ResourceEmptyState;