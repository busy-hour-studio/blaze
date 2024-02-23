import type { ParsedUrlQuery } from 'node:querystring';

export function parseLimitPageQuery(query: ParsedUrlQuery) {
  let limit: number;
  let page: number;

  if (query.limit) {
    if (Array.isArray(query.limit)) {
      limit = parseInt(query.limit[0], 10);
    } else {
      limit = parseInt(query.limit, 10);
    }
  } else {
    limit = 10;
  }

  if (Number.isNaN(limit)) {
    limit = 10;
  }

  if (query.page) {
    if (Array.isArray(query.page)) {
      page = parseInt(query.page[0], 10);
    } else {
      page = parseInt(query.page, 10);
    }
  } else {
    page = 1;
  }

  if (Number.isNaN(page)) {
    page = 1;
  }

  const offset = (page - 1) * limit;

  return { limit, page, offset };
}
