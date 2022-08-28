import { NodeUtils } from "./node-utils.interface";

export default class NodeUtilsGRG implements NodeUtils {
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

  convertLatitudeToSamp(posX: number, canvasHeight: number): number {
    return ((canvasHeight / 2) - posX) * (6000 / canvasHeight);
  }
  convertLongitudeToSamp(posY: number, canvasWidth: number): number {
    return (posY - (canvasWidth / 2)) * (6000 / canvasWidth);
  }
  
}