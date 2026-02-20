// lib/utils/sound.ts
export const playNotificationSound = () => {
  // Check if browser supports Audio
  if (typeof window === 'undefined' || !window.Audio) return;

  try {
    // Create a simple beep using Web Audio API (no external files needed)
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Create oscillator for beep sound
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime); // 800 Hz
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime); // Low volume
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Play for 0.1 seconds
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
    
    // Resume audio context if suspended (browser autoplay policy)
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
  } catch (error) {
    console.warn('Could not play notification sound:', error);
  }
};

// Alternative: Use a simple beep if Web Audio API fails
export const playFallbackSound = () => {
  try {
    const audio = new Audio();
    audio.src = 'data:audio/wav;base64,UklGRlwAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YVAAAAA8APA' // Simple beep base64
    audio.volume = 0.3;
    audio.play().catch(() => {}); // Ignore autoplay errors
  } catch (error) {
    // Silently fail - better than crashing
  }
};