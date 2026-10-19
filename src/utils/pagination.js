export const buildPagination = ({ total, page, limit }) => {
const totalPages = Math.ceil(total / limit);
const hasPrevPage = page > 1 && totalPages >= 1;
const hasNextPage = page < totalPages;
return {
    total,
    page,
    limit,
    totalPages,
    hasPrevPage,
    hasNextPage,
    prevPage: hasPrevPage ? Math.min(page - 1, totalPages) : null,
    nextPage: hasNextPage ? page + 1 : null,
};
};