/**
 * Parses safe positive integer pagination parameters from query strings.
 */
export const parsePagination = (query, defaultLimit = 10, maxLimit = 50) => {
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1);
  const limit = Math.min(
    maxLimit,
    Math.max(1, Number.parseInt(query.limit, 10) || defaultLimit)
  );
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};
