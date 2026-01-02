import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';

type GithubUser = {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  followers: number;
  following: number;
  public_repos: number;
};

@Injectable()
export class GithubService {
  private readonly apiUrl = 'https://api.github.com/user';

  async fetchProfile(token: string) {
    if (!token?.trim()) {
      throw new UnauthorizedException('缺少 GitHub Token');
    }

    const response = await fetch(this.apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'ai-nest-app',
      },
    });

    if (response.status === 401) {
      throw new UnauthorizedException('GitHub Token 无效或已过期');
    }

    if (!response.ok) {
      throw new InternalServerErrorException('请求 GitHub 用户信息失败');
    }

    const data = (await response.json()) as GithubUser;

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
}
