'use server';
import { Client, LocalAuth } from 'whatsapp-web.js';
import QRCode from 'qrcode';

function createFile(data: BlobPart[]) {
	const blob = new Blob(data, { type: 'audio/ogg' });
	const file = new File([blob], 'yourfilename.ogg', { type: 'audio/ogg' });

	/* then upload oder directly download your file / blob depending on your needs */
}
