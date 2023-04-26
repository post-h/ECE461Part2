"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.getAdherence = exports.getVersionPinning = void 0;
var octokit_1 = require("octokit");
var octokit = new octokit_1.Octokit({
    auth: process.env.GITHUB_TOKEN,
    userAgent: 'testing',
    timeZone: "Eastern",
    baseUrl: 'https://api.github.com'
});
function getVersionPinning(_owner, _repo) {
    return __awaiter(this, void 0, void 0, function () {
        var response, packageJson, dependencies, packageVersion;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, octokit.request('GET /repos/{owner}/{repo}/contents/package.json', {
                        owner: _owner,
                        repo: _repo
                    })];
                case 1:
                    response = _a.sent();
                    packageJson = Buffer.from(response.data.content, "base64").toString();
                    dependencies = JSON.parse(packageJson).devDependencies || {};
                    packageVersion = dependencies[_repo];
                    console.log(packageVersion !== undefined);
                    return [2 /*return*/, packageVersion !== undefined];
            }
        });
    });
}
exports.getVersionPinning = getVersionPinning;
function getAdherence(_owner, _repo) {
    return __awaiter(this, void 0, void 0, function () {
        var discussion_response, discussions, issues_response, closed_at_date, last_10_issues_time, current_date, responsiveness, adherence, i, created_at_date, avg_resp_time;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, octokit.request('GET /repos/{owner}/{repo}', {
                        owner: _owner,
                        repo: _repo
                    })];
                case 1:
                    discussion_response = _a.sent();
                    discussions = discussion_response['data']['has_discussions'];
                    return [4 /*yield*/, octokit.request('GET /repos/{owner}/{repo}/issues', {
                            owner: _owner,
                            repo: _repo
                        })];
                case 2:
                    issues_response = _a.sent();
                    last_10_issues_time = 0;
                    current_date = new Date();
                    // Loop through most recent 10 issues and calculate how long it took to be resolved
                    for (i = 0; i < 10; i++) {
                        if (issues_response['data'][i] == undefined) {
                            break;
                        }
                        if (issues_response['data'][i].closed_at == null) {
                            closed_at_date = current_date;
                        }
                        else {
                            closed_at_date = new Date(issues_response['data'][i].closed_at);
                        }
                        created_at_date = new Date(issues_response['data'][i].created_at);
                        last_10_issues_time += closed_at_date.getTime() - created_at_date.getTime();
                    }
                    avg_resp_time = last_10_issues_time / 10;
                    avg_resp_time /= 3600000 * 24;
                    if (avg_resp_time <= 30) {
                        responsiveness = true;
                    }
                    else {
                        responsiveness = false;
                    }
                    if (discussions && responsiveness) {
                        adherence = true;
                    }
                    else {
                        adherence = false;
                    }
                    console.log(adherence);
                    return [2 /*return*/, adherence];
            }
        });
    });
}
exports.getAdherence = getAdherence;
