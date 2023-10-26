
const recursiveParser = (obj) => {
    const result = [];
    if (obj.content && Array.isArray(obj.content)) {
        obj.content.forEach((item) => {
            if (typeof item === "string") {
                result.push({
                    type: obj.type ? obj.type : '',
                    content: item
                });
            } else if (typeof item === "object") {
                const subResult = recursiveParser(item); // Llamada recursiva para objetos anidados
                if (!subResult) return
                subResult.forEach(value => {
                    result.push(value);
                })
            }
        });
    }

    return result;
}

module.exports = {
    recursiveParser
};
