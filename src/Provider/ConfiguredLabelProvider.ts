import { getInput } from "@actions/core";

export class ConfiguredLabelProvider {
    public async provide(): Promise<{ patch: string[], minor: string[], major: string[] }> {
        return {
            major: await this.split(getInput('MAJOR_LABELS')),
            minor: await this.split(getInput('MINOR_LABELS')),
            patch: await this.split(getInput('PATCH_LABELS')),
        }
    }

    private async split(labels: string): Promise<string[]> {
        return labels
            .split(/\r\n|\r|\n/g)
            .map((value: string) => value.trim())
            .filter((value: string) => value !== '');
    }
}
