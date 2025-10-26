// Teste do utilitário YouTube
import { getYouTubeVideoInfo, isValidYouTubeUrl } from './src/lib/youtube-utils';

// Teste com a URL que estava falhando
const testUrl = 'https://www.youtube.com/shorts/gFLHtvdIZgg';

console.log('Testando URL:', testUrl);
console.log('É válida?', isValidYouTubeUrl(testUrl));
console.log('Informações:', getYouTubeVideoInfo(testUrl));

// Teste com outros formatos
const testUrls = [
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'https://youtu.be/dQw4w9WgXcQ',
  'https://www.youtube.com/shorts/gFLHtvdIZgg',
  'https://www.youtube.com/embed/dQw4w9WgXcQ',
  'https://invalid-url.com'
];

testUrls.forEach(url => {
  console.log(`\nURL: ${url}`);
  console.log('Válida:', isValidYouTubeUrl(url));
  console.log('Info:', getYouTubeVideoInfo(url));
});
