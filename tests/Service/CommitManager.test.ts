import { CommitManager } from "../../src/Service/CommitManager";

jest.mock('@actions/core', () => ({
    getInput: jest.fn(),
}));

describe('latest', () => {
    it('fails with error response from GitHub', async () => {
        const mockOctokit = {
            rest: {
                repos: {
                    listCommits: () => {
                        throw new Error('error from listCommits')
                    },
                },
            },
        };

        // @ts-ignore
        const commitManager = new CommitManager(mockOctokit);

        try {
            await commitManager.latest('owner', 'repo')
        } catch (error: any) {
            expect(error.message).toBe('error from listCommits');
        }
    });

    it('fails when repo is empty', async () => {
        const mockOctokit = {
            rest: {
                repos: {
                    listCommits: () => {
                        return {data: []};
                    },
                },
            },
        };

        // @ts-ignore
        const commitManager = new CommitManager(mockOctokit);

        try {
            await commitManager.latest('owner', 'repo')
        } catch (error: any) {
            expect(error.message).toBe('Cannot create a tag in empty repository.');
        }
    });

    it('returns correct commit', async () => {
        const mockOctokit = {
            rest: {
                repos: {
                    listCommits: () => {
                        return {data: [{sha: 'sha256', commit: {message: 'message'}}]};
                    },
                },
            },
        };

        // @ts-ignore
        const commitManager = new CommitManager(mockOctokit);

        const commit = await commitManager.latest('owner', 'repo');

        expect(commit).toEqual({sha: 'sha256', message: 'message'})
    });
});
