import 'styled-components';
declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      background: {
        one: string,
        two: string,
        three: string,
        four: string,
        five: string,
      }
      text: {
        primary: string,
        contrast: string,
        alternativeContrast: string,
      },
      primary: string;
      danger: string;
      warn: string;
    }
  }
}