export const REF_CAM_CONFIG = {
  streamAccountId: 'FBb77b',
  streamName: 'Ref_Cam_Stream',
  subscriberToken: '48b2e9f09e96b1f82b920b1bf8032282b6ec917e332c8801805f968d032ca93f',
  get iframeUrl() {
    return `https://viewer.millicast.com/?streamId=${this.streamAccountId}/${this.streamName}&token=${this.subscriberToken}`;
  }
} as const;

