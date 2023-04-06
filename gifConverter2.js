// const { exec } = require("child_process");

// exec("ffmpeg -i input.mov -qscale 0 output.gif");

const { spawn } = require("child_process");

const input = "input1.mov";
const output = "output.gif";

const getDuration = (input) => {
  return new Promise((resolve, reject) => {
    const ffprobe = spawn("ffprobe", [
      "-v",
      "error",
      "-show_entries",
      "format=duration",
      "-of",
      "default=noprint_wrappers=1:nokey=1",
      input,
    ]);

    ffprobe.stdout.on("data", (data) => {
      resolve(parseFloat(data.toString().trim()));
    });

    ffprobe.stderr.on("data", (data) => {
      reject(`Error: ${data}`);
    });

    ffprobe.on("close", (code) => {
      if (code !== 0) {
        reject(`FFprobe process exited with code ${code}`);
      }
    });
  })
  .catch((err) => {
  const red = "\x1b[31m";
  const reset = "\x1b[0m";
  console.error(`${red}Error obtaining file duration:\n${err}${reset}`);
});
};

const convertVideo = async (input, output) => {
  const duration = await getDuration(input);

  const ffmpeg = spawn("ffmpeg", [
    "-i",
    input,
    "-qscale",
    "0",
    "-progress",
    "pipe:1",
    output,
  ]);

  ffmpeg.stdout.on("data", (data) => {
    const lines = data.toString().split("\n");
    const progress = {};

    lines.forEach((line) => {
      const [key, value] = line.split("=");
      if (key && value) {
        progress[key.trim()] = value.trim();
      }
    });

    if (progress.out_time_ms) {
      const currentTime = parseFloat(progress.out_time_ms) / 1000000;
      const percentage = ((currentTime / duration) * 100).toFixed(2);
      // console.log(`Progress: ${percentage}%`);
      process.stdout.write('\x1b[1G\x1b[32m');
      process.stdout.write(`Progress: ${percentage}%`);
      process.stdout.write('\x1b[0m');
    }
  });

  /* stderr and stdout return the same data. Use this listener to easily observer meta data */

  // ffmpeg.stderr.on("data", (data) => {
  //   console.error(`Meta Data: ${data}`);
  // });

  //Error handler parses errors from meta data
  ffmpeg.stderr.on("data", (data) => {
    const message = data.toString().trim();
    const regex = /(\bno\b|invalid|error|failed|unsupported|permission denied|cannot|unable)/i;
    const ignoreMessage = "No accelerated colorspace";
    const secondIgnore = "lib"

    if (regex.test(message) && !message.includes(ignoreMessage) && !message.includes(secondIgnore)) {
      console.error(`Error: ${message}`);
    }
  });

  ffmpeg.on("close", (code) => {
    if (code !== 0) {
      console.log(`\nFFmpeg process exited with code ${code}`);
    } else {
      console.log('\rConversion Complete.')
    }
  });
};

convertVideo(input, output);