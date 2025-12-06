export const REF_CAM_CONFIG = {
  streamAccountId: 'FBb77b',
  streamName: 'Ref_Cam_Stream',
  subscriberToken: '307812ef947c6d72583d4219e686e4507759da02553e3b3253304a86b942f5d0',
  get iframeUrl() {
    return `https://viewer.millicast.com/?streamId=${this.streamAccountId}/${this.streamName}&token=${this.subscriberToken}`;
  }
} as const;

