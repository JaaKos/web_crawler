import { BrowserContext, Page } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const OUTDIR = path.join(process.cwd(), 'out');

type DomainAction = (name: Page) => Promise<void>;
type SupportedDomain = (typeof DOMAINS)[keyof typeof DOMAINS];

const DOMAINS = {
    Example: 'example.com',
    RoyalRoad: 'www.royalroad.com',
} as const;

const domainActions: Record<SupportedDomain, DomainAction> = {
    [DOMAINS.Example]: async (page) => example_action(page),
    [DOMAINS.RoyalRoad]: async (page) => royalroad_action(page),
}

const performActions = async (domain: string, link: string, context: BrowserContext): Promise<void> => {
    const action = domainActions[domain as SupportedDomain];

    if (action) {
        const page = context.pages()[0];
        await page.goto(link);
        await action(page);
    } else {
        console.error(`Error: unsupported domain: '${domain}'`);
        process.exit(1);
    } 
}

const example_action = async (page: Page) => {
    // click link in page, wait for linked page to load, then copy an element from the page to a file.
    await page.getByRole('link', { name: 'Learn more' }).click();
    await page.waitForLoadState();
    const example_element = await page.getByRole('article').allInnerTexts().then(el => el.toString());
    fs.writeFileSync(path.join(OUTDIR, "out.txt"), example_element);
}

const royalroad_action = async (page: Page) => {
    // copy linked chapter + 9 following chapters, to a file
    const chapter_amount = 10;
    let full_content: string;
    for (let i = 0; i < chapter_amount; i++) {
        const chapter_content = await page.locator('.chapter-inner').allInnerTexts();
        full_content += chapter_content.toString();
        await page.getByRole('link', { name: 'Next Chapter ' }).click();
    }
    fs.writeFileSync(path.join(OUTDIR, "out.txt"), full_content);
}

export default performActions;