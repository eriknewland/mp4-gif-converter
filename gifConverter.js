const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");

ffmpeg.setFfmpegPath("ffmpeg");
ffmpeg.setFfprobePath("ffprobe");

const inputFilePath = "./input.mov";
const outputFilePath = "./output.gif";

const getMetadata = (input) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(input, (err, metadata) => {
      if (err) {
        reject(err);
      } else {
        resolve(metadata);
      }
    });
  });
};

/* note on videoFilters (OPTIONAL!):
  The `fps` filter sets the frame rate to 15, the `scale` filter resizes the video to a width of 320 pixels while maintaining the aspect ratio, and the `flags=lanczos` option improves the scaling quality. The `split`, `palettegen`, and `paletteuse` filters are used to generate and apply an optimized color palette for the GIF.
*/

const convertVideo = async (input, output) => {
  try {
    const metadata = await getMetadata(input);
    const duration = metadata.format.duration;

    console.log(
      `File length: ${duration.toFixed(2)} seconds. File size: ${(
        metadata.format.size / 1e6
      ).toFixed(2)} MB`
    );

    ffmpeg()
      .input(input)
      .outputFormat("gif")
      .output(output)
      .videoFilters(
        "fps=15,scale=500:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse"
      )
      .on("start", () => {
        process.stdout.write("Starting conversion...");
      })
      .on("progress", (progress) => {
        if (progress.timemark) {
          const currentTime = progress.timemark.replace(/:/g, "");
          const percentage = (currentTime / duration) * 100;
          process.stdout.write(
            `\r\x1b[2K\x1b[32mProgress: ${percentage.toFixed(2)}%\x1b[0m`
          );
        }
      })
      .on("end", () => {
        console.log("\rConversion completed successfully.");
      })
      .on("error", (error) => {
        console.error("Error during conversion:", error);
      })
      .run();
  } catch (error) {
    console.error("Error getting metadata:", error);
  }
};

convertVideo(inputFilePath, outputFilePath);