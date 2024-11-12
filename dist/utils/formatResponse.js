"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = formatResponse;
function formatResponse(newToken, data) {
    const response = {
        data,
        newToken: newToken,
    };
    return response;
}
//# sourceMappingURL=formatResponse.js.map