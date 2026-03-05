import { BrowserContext } from "@playwright/test";
import startInstance from "./browserInstance";
import getLink from "./clipboardparse";
import performActions from "./siteActions";

const main = async () => {
  const target_website = await getLink();
  const browserContext: BrowserContext = await startInstance();
  await performActions(target_website.host, target_website.link, browserContext);
  await browserContext.close();
}

main();
