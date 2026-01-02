import { GithubService } from '../services/github.service';
type GithubProfileRequest = {
    token: string;
};
export declare class GithubController {
    private readonly githubService;
    constructor(githubService: GithubService);
    fetchProfile(body: GithubProfileRequest): Promise<{
        login: string;
        name: string | null;
        avatarUrl: string;
        profileUrl: string;
        bio: string | null;
        followers: number;
        following: number;
        publicRepos: number;
    }>;
}
export {};
