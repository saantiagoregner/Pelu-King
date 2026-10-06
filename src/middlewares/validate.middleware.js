import { HttpError } from "../utils/httpError.js";
export const validate = ({ body, params, query } = {}) => {
return (req, res, next) => {
    const messages = [];
    if (body) {
    const result = body.safeParse(req.body ?? {});
    if (result.success) req.body = result.data;
    else messages.push(...result.error.issues.map((issue) => issue.message));
    }
    if (params) {
    const result = params.safeParse(req.params);
    if (!result.success) messages.push(...result.error.issues.map((issue) => issue.message));
    }
    if (query) {
    const result = query.safeParse(req.query);
    if (result.success) req.validatedQuery = result.data;
    else messages.push(...result.error.issues.map((issue) => issue.message));
    }
    if (messages.length > 0) return next(new HttpError(400, messages.join("; ")));
    next();
};
};