"use server";
import { Client, LocalAuth } from "whatsapp-web.js";

const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: "./session",
  }),
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("qr", (qr) => {
  // QRCode.toCanvas(qrcodeRef, qr, function (error) {
  //   if (error) console.error(error);
  //   console.log("success!");
  // });
});

// client.getChatById()
client.on("message", async (msg) => {
  if (msg.hasMedia) {
    // const media = await msg.downloadMedia();
    // do something with the media data here
  }
});
client.initialize();
