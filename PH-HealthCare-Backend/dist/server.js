"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var app = (0, express_1.default)();
var port = 5000;
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.get("/", function (req, res) {
    res.send("hello health care");
});
app.listen(port, function () {
    console.log("Server is running on http://localhost:".concat(port));
});
