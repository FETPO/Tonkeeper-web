import React, { FC } from 'react';
import styled from 'styled-components';
import { ActivityAction } from '../../components/activity/ActivityAction';
import { ListBlock, ListItem } from '../../components/List';
import { H3 } from '../../components/Text';
import { useTranslation } from '../../hooks/translation';
import {
  ActivityGroup,
  formatActivityDate,
  getActivityTitle,
} from '../../state/activity';

const List = styled(ListBlock)`
  margin: 0.5rem 0;
`;

const Title = styled(H3)`
  margin: 1.875rem 0 0.875rem;
`;

export const ActivityGroupRaw: FC<{ items: ActivityGroup[] }> = ({ items }) => {
  const { t } = useTranslation();

  return (
    <>
      {items.map(([key, events]) => {
        return (
          <div key={key}>
            <Title>{getActivityTitle(key, t)}</Title>
            {events.map(({ timestamp, event }) => {
              const date = formatActivityDate(key, timestamp);
              return (
                <List key={event.eventId}>
                  {event.actions.map((action, index) => (
                    <ListItem key={index} hover={false}>
                      <ActivityAction action={action} date={date} />
                    </ListItem>
                  ))}
                </List>
              );
            })}
          </div>
        );
      })}
    </>
  );
};