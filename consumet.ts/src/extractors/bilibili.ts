import { convertDuration } from '../utils/utils';
import { ISource, IVideo, VideoExtractor } from '../models';

class BilibiliExtractor extends VideoExtractor {
  protected override serverName = 'Bilibili';
  protected override sources: IVideo[] = [];

  override async extract(episodeId: any): Promise<ISource> {
    this.sources.push({
      url: `https://api.consumet.org/utils/bilibili/playurl?episode_id=${episodeId}`,
      isM3U8: false,
      isDASH: true,
    });
    return {
      sources: this.sources,
    };
  }

  toDash = (data: any) => {
    const videos = data.video
      .filter((video: any) => video.video_resource.url)
      .map((video: any) => video.video_resource);

    const audios = data.audio_resource;

    const duration = convertDuration(data.duration);

    const dash = `<?xml version="1.0"?>
<MPD xmlns="urn:mpeg💨schema:mpd:2011" profiles="urn:mpeg💨profile:isoff-on-demand:2011" minBufferTime="PT1M" type="static" mediaPresentationDuration="${duration}">
    <Period duration="${duration}">
        <AdaptationSet id="1" group="1" par="16:9" segmentAlignment="true" subsegmentAlignment="true" subsegmentStartsWithSAP="1" maxWidth="${
          videos[0].width
        }" maxHeight="${videos[0].height}" maxFrameRate="${videos[0].frame_rate}" startWithSAP="1">
            ${videos.map((video: any, index: any) => this.videoSegment(video, index)).join()}
        </AdaptationSet>
        <AdaptationSet id="2" group="2" subsegmentAlignment="true" subsegmentStartsWithSAP="1" segmentAlignment="true" startWithSAP="1">
            ${audios.map((audio: any, index: any) => this.audioSegment(audio, videos.length + index)).join()}
        </AdaptationSet>
    </Period>
</MPD>`;

    return dash;
  };

  videoSegment = (video: any, index = 0) => {
    const allUrls = [video.url, video.backup_url[0]];

    const videoUrl = allUrls.find(url => url.includes('akamaized.net'));

    return `
            <Representation id="${index}" mimeType="${video.mime_type}" codecs="${video.codecs}" width="${
      video.width
    }" height="${video.height}" frameRate="${video.frame_rate}" sar="${video.sar}" bandwidth="${
      video.bandwidth
    }">
                <BaseURL>${videoUrl.replace(/&/g, '&amp;')}</BaseURL>
                <SegmentBase indexRangeExact="true" indexRange="${video.segment_base.index_range}">
                    <Initialization range="${video.segment_base.range}"/>
                </SegmentBase>
            </Representation>
            `;
  };

  audioSegment = (audio: any, index = 0) => {
    const allUrls = [audio.url, audio.backup_url[0]];

    const audioUrl = allUrls.find(url => url.includes('akamaized.net'));

    return `
            <Representation id="${index}" mimeType="${audio.mime_type}" codecs="${audio.codecs}" bandwidth="${
      audio.bandwidth
    }">
                <BaseURL>${audioUrl.replace(/&/g, '&amp;')}</BaseURL>
                <SegmentBase indexRangeExact="true" indexRange="${audio.segment_base.index_range}">
                    <Initialization range="${audio.segment_base.range}"/>
                </SegmentBase>
            </Representation>
            `;
  };
}

export default BilibiliExtractor;
