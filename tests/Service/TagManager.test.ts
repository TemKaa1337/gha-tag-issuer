import { TagManager } from "../../src/Service/TagManager";

jest.mock('@actions/core', () => ({
    getInput: jest.fn(),
}));

describe('create', () => {
    it('fails with error response from GitHub create tag endpoint', async () => {
        const mockOctokit = {
            rest: {
                git: {
                    createTag: () => {
                        throw new Error('error from createTag')
                    },
                },
            },
        };

        // @ts-ignore
        const tagManager = new TagManager(mockOctokit);

        try {
            await tagManager.create('owner', 'repo', 'v1.0.0.', {message: 'message', sha: 'sha256'})
        } catch (error: any) {
            expect(error.message).toBe('error from createTag');
        }
    });

    it('fails with error response from GitHub create ref endpoint', async () => {
        const mockOctokit = {
            rest: {
                git: {
                    createRef: () => {
                        throw new Error('error from createRef')
                    },
                    createTag: () => {
                        return {data: {sha: 'sha256'}}
                    },
                },
            },
        };

        // @ts-ignore
        const tagManager = new TagManager(mockOctokit);

        try {
            await tagManager.create('owner', 'repo', 'v1.0.0.', {message: 'message', sha: 'sha256'})
        } catch (error: any) {
            expect(error.message).toBe('error from createRef');
        }
    });

    it('correctly creates a tag', async () => {
        const mockOctokit = {
            rest: {
                git: {
                    createRef: () => {
                        return {}
                    },
                    createTag: () => {
                        return {data: {sha: 'sha256'}}
                    },
                },
            },
        };

        // @ts-ignore
        const tagManager = new TagManager(mockOctokit);

        await tagManager.create('owner', 'repo', 'v1.0.0', {message: 'message', sha: 'sha256'})
    });
});

describe('latest', () => {
    it('fails with error response from GitHub', async () => {
        const mockOctokit = {
            rest: {
                repos: {
                    listTags: () => {
                        throw new Error('error from listTags')
                    },
                },
            },
        };

        // @ts-ignore
        const tagManager = new TagManager(mockOctokit);

        try {
            await tagManager.latest('owner', 'repo')
        } catch (error: any) {
            expect(error.message).toBe('error from listTags');
        }
    });

    const mocks: [{ name: string }[], string | null][] = [
        [
            [
                {name: 'latest'},
                {name: 'non-latest'},
            ],
            'latest'
        ],
        [
            [],
            null
        ],
    ];
    it.each(mocks)('correctly returns latest tag', async (
        responseTags: { name: string }[],
        expectedTag: string | null
    ) => {
        const mockOctokit = {
            rest: {
                repos: {
                    listTags: () => {
                        return {data: responseTags}
                    },
                },
            },
        };

        // @ts-ignore
        const tagManager = new TagManager(mockOctokit);

        const tags = await tagManager.latest('owner', 'repo')
        expect(tags).toEqual(expectedTag)
    });
});
