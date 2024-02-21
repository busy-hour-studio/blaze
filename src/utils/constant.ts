import { RenderType, type RenderTypeMap } from '@/types/swagger';

export const RESERVED_KEYWORD = {
  SUFFIX: {
    KILL: 'kill',
  },
  PREFIX: {
    EVENT: '$events$',
  },
} as const;

export const SwaggerRenderTypeMap: RenderTypeMap = {
  configUrl: RenderType.STRING,
  deepLinking: RenderType.RAW,
  presets: RenderType.STRING_ARRAY,
  plugins: RenderType.STRING_ARRAY,
  spec: RenderType.JSON_STRING,
  url: RenderType.STRING,
  urls: RenderType.JSON_STRING,
  layout: RenderType.STRING,
  docExpansion: RenderType.STRING,
  maxDisplayedTags: RenderType.RAW,
  operationsSorter: RenderType.RAW,
  requestInterceptor: RenderType.RAW,
  responseInterceptor: RenderType.RAW,
  persistAuthorization: RenderType.RAW,
};
