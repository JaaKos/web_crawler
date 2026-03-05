import clipboard from "clipboardy";
import { URL } from "url";

const getLink = async () => {
    try {
        const clipboard_content: string = await clipboard.read().then((text) => text.trim());
        if (!clipboard_content.startsWith('http')) throw new Error(`Clipboard content: '${clipboard_content}' is not a valid link.`);
        const parsed_url = new URL(clipboard_content);
        return {"host": parsed_url.hostname, "link": parsed_url.href};
    } catch(error) {
        console.error(error);
        process.exit(1);
    }
}

export default getLink;