import type {
  DistSwaggerUIOptions,
  SwaggerResourceConfig,
} from '@/types/swagger';
import { RenderType } from '@/types/swagger';
import { SwaggerRenderTypeMap as RenderTypeMap } from '@/utils/constant';
import { remoteAssets } from '@/utils/helper/swagger';
import type { Context as HonoCtx } from 'hono';
import { html } from 'hono/html';

export class SwaggerUI {
  public readonly options: DistSwaggerUIOptions;
  public readonly version: string | undefined;
  public readonly optionsStrings: string;

  constructor(options: DistSwaggerUIOptions & SwaggerResourceConfig) {
    this.options = options;
    this.version = options.version;
    this.optionsStrings = this.getOptionsStrings();

    delete options.version;
  }

  private getOptionsStrings() {
    const optionsStrings = Object.entries(this.options)
      .map(([keyAlias, value]) => {
        const key = keyAlias as keyof typeof RenderTypeMap;

        switch (RenderTypeMap[key]) {
          case RenderType.STRING_ARRAY:
            if (!Array.isArray(value)) return '';

            return `${key}: [${value.map((v) => `'${v}'`).join(',')}]`;

          case RenderType.STRING:
            return `${key}: '${value}'`;
          case RenderType.JSON_STRING:
            return `${key}: ${JSON.stringify(value)}`;

          case RenderType.RAW:
            return `${key}: ${value}`;

          default:
            return '';
        }
      })
      .join(',');

    return optionsStrings;
  }

  public get renderer() {
    const assets = remoteAssets({ version: this.version });

    return (ctx: HonoCtx) => {
      return ctx.html(
        `<html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="description" content="SwaggerUI" />
          <title>SwaggerUI</title>
        </head>
        <body>
          <div>
            <div id="swagger-ui"></div>
            ${assets.css.map((url) => html`<link rel="stylesheet" href="${url}" />`)}
            ${assets.js.map((url) => html`<script src="${url}" crossorigin="anonymous"></script>`)}
            <script>
              window.onload = () => {
                window.ui = SwaggerUIBundle({
                  dom_id: '#swagger-ui',${this.optionsStrings},
                })
              }
            </script>
          </div>
        </body>
      </html>`
      );
    };
  }
}
