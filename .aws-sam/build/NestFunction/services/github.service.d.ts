export declare class GithubService {
    private readonly apiUrl;
    fetchProfile(token: string): Promise<{
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
