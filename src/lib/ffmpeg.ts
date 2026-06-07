/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { CompressionSettings } from '../types';

let ffmpeg: FFmpeg | null = null;

export const loadFFmpeg = async () => {
  if (ffmpeg) return ffmpeg;

  ffmpeg = new FFmpeg();
  
  ffmpeg.on('log', ({ message }) => {
    console.log('[FFmpeg]', message);
  });

  try {
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
    console.log('[FFmpeg] Load successful');
  } catch (error) {
    console.error('[FFmpeg] Load failed:', error);
    throw error;
  }

  return ffmpeg;
};

export const compressAudio = async (
  file: File,
  settings: CompressionSettings,
  onProgress: (progress: number) => void,
  trim?: { start: number; end: number }
): Promise<Blob> => {
  const instance = await loadFFmpeg();
  const inputName = 'input_audio';
  const outputName = `output.${settings.format}`;

  instance.on('progress', ({ progress }) => {
    onProgress(Math.round(progress * 100));
  });

  await instance.writeFile(inputName, await fetchFile(file));

  let command = [];

  // Add trim options if provided
  if (trim) {
    if (trim.start > 0) {
      command = [...command, '-ss', trim.start.toString()];
    }
    if (trim.end > trim.start) {
      command = [...command, '-to', trim.end.toString()];
    }
  }

  command = [...command, '-i', inputName];

  // Bitrate and Codec
  if (settings.format === 'mp3') {
    command = [...command, '-c:a', 'libmp3lame', '-b:a', settings.bitrate];
  } else if (settings.format === 'aac') {
    command = [...command, '-c:a', 'aac', '-b:a', settings.bitrate];
  } else if (settings.format === 'opus') {
    command = [...command, '-c:a', 'libopus', '-b:a', settings.bitrate];
  }

  // Channels
  if (settings.channels) {
    command = [...command, '-ac', settings.channels];
  }

  // Normalization and FX filters
  const filters = [];
  if (settings.noiseReduction) {
    // High-pass filter to remove low frequency noise, then anlmdn for noise reduction
    filters.push('highpass=f=200', 'anlmdn=s=10:p=0.002:r=0.002:m=15');
  }
  if (settings.normalize) {
    filters.push('loudnorm');
  }
  if (settings.bassBoost) {
    filters.push('bass=g=5:f=100:w=1.0');
  }

  if (filters.length > 0) {
    command = [...command, '-af', filters.join(',')];
  }

  command.push(outputName);

  try {
    const result = await instance.exec(command);
    if (result !== 0) {
      throw new Error(`FFmpeg instance exited with code ${result}`);
    }
  } catch (err) {
    console.error('FFmpeg execution error:', err);
    throw err;
  }

  const data = await instance.readFile(outputName);
  const blob = new Blob([data], { type: `audio/${settings.format}` });

  // Clean up
  await instance.deleteFile(inputName);
  await instance.deleteFile(outputName);

  return blob;
};

export const mergeAudios = async (
  blobs: Blob[],
  format: string,
  onProgress: (progress: number) => void
): Promise<Blob> => {
  const instance = await loadFFmpeg();
  const inputPaths: string[] = [];

  // Write all blobs to the virtual FS
  for (let i = 0; i < blobs.length; i++) {
    const name = `input_${i}`;
    await instance.writeFile(name, await fetchFile(blobs[i]));
    inputPaths.push(name);
  }

  const outputName = `merged_output.${format}`;
  
  // Use concat protocol for simple merging
  let filterComplex = '';
  for (let i = 0; i < blobs.length; i++) {
    filterComplex += `[${i}:a]`;
  }
  filterComplex += `concat=n=${blobs.length}:v=0:a=1[aout]`;

  const command = [];
  for (const path of inputPaths) {
    command.push('-i', path);
  }
  command.push('-filter_complex', filterComplex, '-map', '[aout]', outputName);

  try {
    const result = await instance.exec(command);
    if (result !== 0) throw new Error('Merge failed');
  } catch (err) {
    console.error('Merge error:', err);
    throw err;
  }

  const data = await instance.readFile(outputName);
  return new Blob([data], { type: `audio/${format}` });
};
