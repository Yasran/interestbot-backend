export function delay(ms: number) {
    return new Promise(res => setTimeout(res, ms));
  }
  
  export function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  