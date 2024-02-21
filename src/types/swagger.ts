import type { SwaggerConfigs } from 'swagger-ui-dist';
import { RequireOne } from './helper';

export interface SwaggerAssetURLs {
  css: string[];
  js: string[];
}

export interface SwaggerResourceConfig {
  version?: string;
}

export type DistSwaggerUIOptions = {
  configUrl?: SwaggerConfigs['configUrl'];
  deepLinking?: SwaggerConfigs['deepLinking'];
  presets?: string[];
  plugins?: string[];
  spec?: SwaggerConfigs['spec'];
  layout?: SwaggerConfigs['layout'];
  docExpansion?: SwaggerConfigs['docExpansion'];
  maxDisplayedTags?: SwaggerConfigs['maxDisplayedTags'];
  operationsSorter?: string;
  requestInterceptor?: string;
  responseInterceptor?: string;
  persistAuthorization?: boolean;
} & RequireOne<{
  url?: SwaggerConfigs['url'];
  urls?: SwaggerConfigs['urls'];
}>;

export enum RenderType {
  STRING_ARRAY = 'string_array',
  STRING = 'string',
  JSON_STRING = 'json_string',
  RAW = 'raw',
}

export type RenderTypeMap = Record<keyof DistSwaggerUIOptions, RenderType>;
