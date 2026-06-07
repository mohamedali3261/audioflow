/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Play a completion sound when audio processing is finished
 */
export const playCompletionSound = () => {
  try {
    // Create AudioContext
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Create oscillators for a pleasant notification sound
    const oscillator1 = audioContext.createOscillator();
    const oscillator2 = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    // Connect nodes
    oscillator1.connect(gainNode);
    oscillator2.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Set frequencies for a pleasant "ding" sound (C major chord)
    oscillator1.frequency.value = 523.25; // C5
    oscillator2.frequency.value = 659.25; // E5
    
    // Set wave type for smooth sound
    oscillator1.type = 'sine';
    oscillator2.type = 'sine';
    
    // Volume envelope (fade in and out)
    const now = audioContext.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01); // Quick fade in
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4); // Smooth fade out
    
    // Play the sound
    oscillator1.start(now);
    oscillator2.start(now);
    oscillator1.stop(now + 0.4);
    oscillator2.stop(now + 0.4);
    
    // Cleanup
    setTimeout(() => {
      oscillator1.disconnect();
      oscillator2.disconnect();
      gainNode.disconnect();
      audioContext.close();
    }, 500);
  } catch (error) {
    console.log('Could not play completion sound:', error);
  }
};
