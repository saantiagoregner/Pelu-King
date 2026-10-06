export const jsonOptions = {
versionKey: false,
transform: (doc, ret) => {
    if (ret._id === undefined) return ret;
    const { _id, ...rest } = ret;
    return { id: _id.toString(), ...rest };
},
};