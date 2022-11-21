import { HistoryEvent } from 'types/HistoryEvent';
import { HistoryEventRelatedLink } from 'types/HistoryEventRelatedLink';

export interface HistoryEventWithRelatedLinks extends HistoryEvent {
  relatedLinks: HistoryEventRelatedLink[];
}
