import qrcode from "qrcode-terminal";
import { Client, LocalAuth } from "whatsapp-web.js";
import fs from "fs";
import { Readable, pipeline } from "stream";
import { promisify } from "util";

const pipelineAsync = promisify(pipeline);
 
const c = new Client({
  authStrategy: new LocalAuth({
    clientId: "gamesticker",
    dataPath: "gamesticker",
  }), 
}); 

c.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

c.on("ready", async () => {
  console.log("Chat ready");
  const chats = await c.getChats();
  fs.writeFileSync(
    "gamesticker.json",
    JSON.stringify(
      [
        ...new Set(
          chats
            .filter((c) => c.isGroup)
            .map((d) => d.groupMetadata.participants)
            .flatMap((d) => d)
            .map((u) => u?.id?._serialized)
        ),
      ],
      null,
      2
    )
  );
});

c.on("authenticated", () => {
  console.log("Logged in");
});

c.initialize();
