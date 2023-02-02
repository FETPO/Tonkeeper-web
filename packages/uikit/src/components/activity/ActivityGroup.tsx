import { NftItemRepr } from '@tonkeeper/core/dist/tonApi';
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
import { ActionData } from './ActivityNotification';

const List = styled(ListBlock)`
  margin: 0.5rem 0;
`;

const Title = styled(H3)`
  margin: 1.875rem 0 0.875rem;
`;

export const ActivityGroupRaw: FC<{
  items: ActivityGroup[];
  openActivity: (value: ActionData) => void;
  openNft: (nft: NftItemRepr) => void;
}> = ({ items, openActivity, openNft }) => {
  const { t, i18n } = useTranslation();
  return (
    <>
      {items.map(([key, events]) => {
        return (
          <div key={key}>
            <Title>
              {getActivityTitle(i18n.language, key, events[0].timestamp)}
            </Title>
            {events.map(({ timestamp, event }) => {
              const date = formatActivityDate(i18n.language, key, timestamp);
              return (
                <List key={event.eventId}>
                  {event.actions.map((action, index) => (
                    <ListItem
                      key={index}
                      onClick={() => openActivity({ action, timestamp, event })}
                    >
                      <ActivityAction
                        action={action}
                        date={date}
                        openNft={openNft}
                      />
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
