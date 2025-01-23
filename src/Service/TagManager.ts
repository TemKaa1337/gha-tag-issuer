import { GitHub } from '@actions/github/lib/utils';

export class TagManager {
    private readonly octokit: InstanceType<typeof GitHub>;

    constructor(octokit: InstanceType<typeof GitHub>) {
        this.octokit = octokit;
    }

    public async create(
        owner: string,
        repo: string,
        tag: string,
        commit: {
            message: string,
            sha: string
        }
    ): Promise<void> {
        try {
            const createTagResponse = await this.octokit.rest.git.createTag({
                owner,
                repo,
                tag,
                message: commit.message,
                object: commit.sha,
                type: 'commit',
            });

            console.info(`Create tag response: ${createTagResponse}`);

            const createRefResponse = await this.octokit.rest.git.createRef({
                owner,
                repo,
                ref: `refs/tags/${tag}`,
                sha: createTagResponse.data.sha,
            });
            console.info(`Create ref response: ${createRefResponse}`);
        } catch (error) {
            console.error(`Error pushing tag: ${error}.`);

            throw error;
        }
    }

    public async latest(owner: string, repo: string): Promise<string | null> {
        try {
            const response = await this.octokit.rest.repos.listTags(
                {
                    owner: owner,
                    repo: repo,
                    per_page: 1,
                }
            );

            const latestTag = response.data[0];

            return latestTag ? latestTag.name : null;
        } catch (error) {
            console.error(`Error fetching the latest tag: ${error}.`);

            throw error;
        }
    }
}
