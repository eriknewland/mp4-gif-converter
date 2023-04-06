# Video to GIF Converter

This project is a simple command-line tool that converts a video file to an optimized GIF using Node.js and the FFmpeg library.

## Features

- Extracts metadata from the input video file
- Converts the video to a high-quality GIF with an optimized color palette
- Customize output to optimize for quality, speed, etc.
- Easily access metadata
- Displays the conversion progress as a percentage
- Handles errors gracefully
- Production-ready

## Requirements

- Node.js
- FFmpeg library

## Installation

1. Clone the repository:

```bash
git clone https://github.com/eriknewland/mp4-gif-converter.git
```

2. Change to the project directory:

```bash
cd mp4-gif-converter
```

3. Install the required dependencies (fluent-ffmpeg):

```bash
npm install
```

### Installing FFmpeg

#### Windows

1. Download the FFmpeg executable from the [official website](https://ffmpeg.org/download.html).
2. Extract the downloaded archive.
3. Add the `bin` folder from the extracted archive to your system's `PATH` environment variable.

#### macOS

1. Install FFmpeg using [Homebrew](https://brew.sh/):

```bash
brew install ffmpeg
```

#### Linux (Ubuntu/Debian)

1. Install FFmpeg using the package manager:

```bash
sudo apt-get update
sudo apt-get install ffmpeg
```

#### Linux (Fedora)

1. Install FFmpeg using the package manager:

```bash
sudo dnf install ffmpeg
```

#### Linux (Arch/Manjaro)

1. Install FFmpeg using the package manager:

```bash
sudo pacman -S ffmpeg
```

After installing FFmpeg, make sure it is available in your system's `PATH`. You can test this by running `ffmpeg -version` in your terminal. If the command is not found, you may need to add the FFmpeg executable to your `PATH` manually.

## Usage

1. Place your input video file (e.g., `input.mov`) in the project directory.

2. Update the `inputFilePath` and `outputFilePath` variables in `gifConverter.js` to match your input and desired output file names.

3. Run the script:

```bash
node gifConverter.js
```

The script will display the progress of the conversion and notify you when it's completed. The output GIF file will be saved in the project directory.

## Customization

You can customize the output GIF by modifying the `videoFilters` option in the `convertVideo` function. For example, you can change the frame rate, scale, or other filter options as needed. [Refer to the FFmpeg documentation for additional options](https://ffmpeg.org/ffmpeg.html)
