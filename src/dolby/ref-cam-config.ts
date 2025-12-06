export const REF_CAM_CONFIG = {
  streamAccountId: 'FBb77b',
  streamName: 'Ref_Cam_Stream',
  subscriberToken: '00954981ba7682ecb6b029e2c0dac55b4baa7282b3467fe75b772fa6f4d153ff',
  get iframeUrl() {
    return `https://viewer.millicast.com/?streamId=${this.streamAccountId}/${this.streamName}&token=${this.subscriberToken}`;
  }
} as const;

