module.exports = async (Model, query, page, limit) => {
    const total = await Model.find(query).countDocuments();
    const totalPages = Math.ceil(total / limit);

    return {
        total,
        totalPages,
        currentPage: page,
        next: page + 1,
        prev: page - 1,
        hasNext: page < totalPages || false,
        hasPrev: page > 1 || false
    };
};
