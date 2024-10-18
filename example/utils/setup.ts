import * as zodApi from '@asteasolutions/zod-to-openapi';
import * as trpc from '@trpc/server';
import * as trpcAdapter from '@trpc/server/adapters/fetch';
import { BlazeConfig } from '@busy-hour/blaze';

BlazeConfig.setModule('@asteasolutions/zod-to-openapi', zodApi);
BlazeConfig.setModule('@trpc/server', trpc);
BlazeConfig.setModule('@trpc/server/adapters/fetch', trpcAdapter);
