# ResQNet demo video

The ResQNet video player appears in two places:

- `index.html`, the featured project on the homepage
- `resqnet.html`, the top of the case study

Both are `<div class="video-player" data-video ...>` elements. Until a video is
configured they show a "demo video coming soon" placeholder. `js/main.js` swaps
the placeholder for a real player as soon as one of the attributes below is set.
Use the same value in both files.

## Option A: a local video file

1. Export the recording as MP4 (H.264 video, AAC audio), 1920x1080 or 1280x720.
   Keep it under ~50 MB if possible.
2. Save it here as `assets/video/resqnet_demo.mp4`.
3. Optional: export a still frame as `assets/video/resqnet_poster.jpg`.
4. In both HTML files, set:

   ```html
   data-video-src="assets/video/resqnet_demo.mp4"
   data-video-poster="assets/video/resqnet_poster.jpg"
   ```

The browser's native player is used, with controls, `preload="metadata"` and
`playsinline`.

## Option B: YouTube or Vimeo

Upload the video (unlisted is fine), then in both HTML files set:

```html
data-video-embed="https://www.youtube.com/watch?v=VIDEO_ID"
```

YouTube links (`watch?v=`, `youtu.be/`, `/embed/`, `/shorts/`) are embedded
through `youtube-nocookie.com`. Vimeo links (`https://vimeo.com/123456789`) use
the Vimeo player.

If both attributes are set, `data-video-src` wins.
