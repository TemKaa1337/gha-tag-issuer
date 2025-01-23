export class VersionManager {
    private readonly versionRegex = '^v?[0-9]+\\.[0-9]+\\.[0-9]+$'

    public async increment(
        current: string | null,
        mode: 'patch' | 'minor' | 'major',
        withVersion: boolean
    ): Promise<string> {
        let major, minor, patch;

        if (current === null) {
            major = minor = patch = 0;
        } else {
            await this.validate(current);

            [major, minor, patch] = current.replace('v', '').split('.').map((value: string) => parseInt(value))

            withVersion = current.startsWith('v')
        }

        switch (mode) {
            case 'major':
                major++;

                break;
            case 'minor':
                minor++;

                break;
            case 'patch':
                patch++;

                break;
        }

        const prefix = withVersion ? 'v' : '';

        return `${prefix}${major}.${minor}.${patch}`;
    }

    private async validate(current: string): Promise<void> {
        if (!current.match(this.versionRegex)) {
            throw new Error(`Unsupported tag format, expected: ${this.versionRegex}.`)
        }
    }
}
