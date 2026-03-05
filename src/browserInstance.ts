const { chromium } = require('playwright');
const path = require('path');
import { readdirSync } from "fs";

const startInstance = async () => {
    const extension_dir: string = path.join(process.cwd(), 'profile', 'extensions');

    const extensions: string[] = readdirSync(extension_dir, {withFileTypes: true})
        .filter(entry => entry.isDirectory())
        .map(dir => path.join(extension_dir, dir.name));

    const profilePath: string = path.join(process.cwd(), 'profile', 'browser_profile');

    const browserContext = await chromium.launchPersistentContext(profilePath, {
        headless: false,
        args: [
            `--disable-extensions-except=${extensions.toString()}`,
            `--load-extension=${extensions.toString()}`,
        ]
    });

    return browserContext;
};

export default startInstance;