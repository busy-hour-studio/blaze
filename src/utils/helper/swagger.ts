import type {
  SwaggerResourceConfig as Config,
  SwaggerAssetURLs as RemoteAssets,
} from '@/types/swagger';

export function remoteAssets({ version }: Config): RemoteAssets {
  const url = `https://unpkg.com/swagger-ui-dist${version !== undefined ? `@${version}` : ''}`;

  return {
    css: [`${url}/swagger-ui.css`],
    js: [`${url}/swagger-ui-bundle.js`],
  };
}
