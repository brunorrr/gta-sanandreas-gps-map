export default class NodeUtils {
  getColorFromAltitude(altitude: number): string {
    const convertedZ = 255 - (Math.floor((altitude + 46) / 2.141176470588235));
    return `#${convertedZ.toString(16)}${convertedZ.toString(16)}00`;
  }

  convertLatitudeFromSamp(latitude: number, canvasHeight: number): number {
    return Math.abs(latitude - 3000) * (canvasHeight / 6000);
  }

  convertLongitudeFromSamp(longitude: number, canvasWidth: number): number {
    return Math.abs(longitude + 3000) * (canvasWidth / 6000);
  }
  
}