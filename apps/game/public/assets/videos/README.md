# Intro Videos

Place intro video files here for the public asset pipeline.

## Structure

```
public/assets/videos/
├── README.md    ← this file
└── intro.mp4    ← opening cinematic (optional — placeholder shown if missing)
```

## How it works

The Intro page (`/intro`) automatically checks for `intro.mp4`:

- **If the file exists**: plays it with fullscreen autoplay, fade-in on start, fade-out on end
- **If the file is missing**: shows an elegant cinematic placeholder screen with a Skip button

## Adding the intro video

1. Place your video file as `intro.mp4` in this folder
2. The game automatically picks it up — no config changes needed

## Supported formats

- `.mp4` — recommended
- `.webm` — supported

## Requirements

- Autoplay with audio enabled
- Recommend 1920×1080 resolution
- Recommend H.264 codec for maximum compatibility
- Keep file size under 50MB for fast loading
