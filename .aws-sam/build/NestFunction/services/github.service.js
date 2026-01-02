"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GithubService = void 0;
const common_1 = require("@nestjs/common");
let GithubService = class GithubService {
    apiUrl = 'https://api.github.com/user';
    async fetchProfile(token) {
        if (!token?.trim()) {
            throw new common_1.UnauthorizedException('缺少 GitHub Token');
        }
        const response = await fetch(this.apiUrl, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/vnd.github+json',
                'User-Agent': 'ai-nest-app',
            },
        });
        if (response.status === 401) {
            throw new common_1.UnauthorizedException('GitHub Token 无效或已过期');
        }
        if (!response.ok) {
            throw new common_1.InternalServerErrorException('请求 GitHub 用户信息失败');
        }
        const data = (await response.json());
        return {
            login: data.login,
            name: data.name,
            avatarUrl: data.avatar_url,
            profileUrl: data.html_url,
            bio: data.bio,
            followers: data.followers,
            following: data.following,
            publicRepos: data.public_repos,
        };
    }
};
exports.GithubService = GithubService;
exports.GithubService = GithubService = __decorate([
    (0, common_1.Injectable)()
], GithubService);
//# sourceMappingURL=github.service.js.map