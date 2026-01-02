import { Body, Controller, Post } from '@nestjs/common';
import { GithubService } from '../services/github.service';

type GithubProfileRequest = {
  token: string;
};

@Controller('github')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Post('profile')
  fetchProfile(@Body() body: GithubProfileRequest) {
    return this.githubService.fetchProfile(body.token);
  }
}
