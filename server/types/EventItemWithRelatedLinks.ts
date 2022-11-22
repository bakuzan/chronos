import { HistoryEvent } from 'types/HistoryEvent';
import { RelatedLink } from './RelatedLink';

export interface EventItemWithRelatedLinks extends HistoryEvent {
  relatedLinks: RelatedLink[];
}
