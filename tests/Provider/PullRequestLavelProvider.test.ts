import { PullRequestLabelProvider } from "../../src/Provider/PullRequestLabelProvider";

jest.mock('@actions/core', () => ({
    getInput: jest.fn(),
}));

describe('provide', () => {
    const mocks: [{ name: string }[], string[]][] = [
        [
            [
                {name: 'PR label 1'},
                {name: 'PR label 2'},
                {name: ''},
            ],
            [
                'PR label 1',
                'PR label 2',
            ],
        ],
        [
            [],
            [],
        ],
    ];

    it.each(mocks)(
        'returns correct PR labels',
        async (
            responseLabels: { name: string }[],
            expectedLabels: string[]
        ) => {
            const mockGetPullRequest = jest
                .fn()
                .mockReturnValueOnce({
                    data: {
                        labels: responseLabels
                    }
                });

            const mockOctokit = {
                rest: {
                    pulls: {
                        get: mockGetPullRequest,
                    },
                },
            };

            // @ts-ignore
            const pullRequestLabelProvider = new PullRequestLabelProvider(mockOctokit);

            const labels = await pullRequestLabelProvider.provide('owner', 'repo', 100);
            expect(labels).toEqual(expectedLabels)
        }
    );

    it('fails with error response from GitHub', async () => {
        const mockOctokit = {
            rest: {
                pulls: {
                    get: () => {
                        throw new Error('error from get')
                    },
                },
            },
        };

        // @ts-ignore
        const pullRequestLabelProvider = new PullRequestLabelProvider(mockOctokit);

        try {
            await pullRequestLabelProvider.provide('owner', 'repo', 100)
        } catch (error: any) {
            expect(error.message).toBe('error from get');
        }
    });
});
