export interface NodeUtils {
  getColorFromAltitude(altitude: number): string;
  convertLatitudeFromSamp(latitude: number, canvasHeight: number): number;
  convertLongitudeFromSamp(longitude: number, canvasWidth: number): number;
  convertLatitudeToSamp(posX: number, canvasHeight: number): number;
  convertLongitudeToSamp(posY: number, canvasWidth: number): number;
}