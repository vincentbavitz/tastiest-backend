export enum SegmentEventType {
  TRACK = 'track',
  PAGE = 'page',
  GROUP = 'group',
  IDENTIFY = 'identify',
}

type SegmentEventInner<T extends SegmentEventType = SegmentEventType.TRACK> =
  // prettier-ignore
  T extends SegmentEventType.TRACK ? {
    properties: any;
  } :
  T extends SegmentEventType.IDENTIFY ? {
    traits: any;
  } :
  T extends SegmentEventType.PAGE ? {
    properties: any;
  } :
  T extends SegmentEventType.GROUP ? {
    traits: any;
    groupId?: string;
  } :
  never;

export type SegmentWebhookBody<
  T extends SegmentEventType = SegmentEventType.TRACK,
> = SegmentEventInner<T> & {
  type: T;
  event: string;
  email?: string;
  userId?: string;
  anonymousId?: string;
  timestamp: string;
  messageId: string;
};
