"use strict";
const fs = require("fs-extra");
const figlet = require("figlet");
const qrcode = require("qrcode")
const Baileys = "@adiwajshing/baileys";
const { WAConnection: _WAConnection } = require("@adiwajshing/baileys");
const WAConnection = require('./Lib/simple').WAConnection(_WAConnection);
const { Functions } = require('./Lib/Functions');

const func = require('./lib/function');
const handler = require("./messages/handler");
const {
    color
} = require("./lib/color");

let WAConnection = func.WAConnection(_WAConnection);

// Global
global.botuser = require('./config')
global['db'] = {};
global['db']['mess'] = JSON.parse(fs.readFileSync('./temp/message.json'));
let conn;
conn = new WAConnection();
const sleep = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function start(sesion) {
    console.log(color(figlet.textSync('Daun Bot', 'Standard'), 'cyan'))
    conn.logger.level = 'warn';
    console.log(color('[ SYSTEM ]', 'yellow'), color('Loading...'));

    // Menunggu QR
    conn.on('qr', qr => {
        qrcode.generate(qr, {
            small: true
        });
        console.log(color('[ SYSTEM ]', 'yellow'), color('Please scan qr code'));
    })

    // Restore Sesion
    fs.existsSync(sesion) && conn.loadAuthInfo(sesion)

    // Mencoba menghubungkan
    conn.on('connecting', () => {
        console.log(color('[ SYSTEM ]', 'yellow'), color(' ⏳ Connecting...'));
    })

    // Konek
    conn.on('open', (json) => {
        console.log(color('[ SYSTEM ]', 'yellow'), color('Bot is now online!'));
    })

    // Write Sesion
    await conn.connect({
        timeoutMs: 30 * 1000
    })
    fs.writeFileSync(sesion, JSON.stringify(conn.base64EncodedAuthInfo(), null, '\t'))

    // Action Call
    conn.on('CB:action,,call', async json => {
    const callerId = json[2][0][1].from;
    console.log("call dari "+ callerId)
        conn.sendMessage(callerId, "*•IND*\nMaaf Otomatis Di Blokir Oleh Sistem, Tolong Jangan Telepon Nomor Ini, Saya Udah Rakit Khusus Dengan Penuh Keamanan Bot.\n\n*•ENG*\nSorry Automatically Blocked By The System, Please Don't Call This Number, I've Specially Assembled With Fully Bot Security.", MessageType.text)
        await sleep(4000)
        await conn.blockUser(callerId, "add") // Block user
    })

    conn.on('chat-update', async (msg) => {
        handler.chatUpdate(conn, msg)
    })
}

start('qr.json')
    .catch(console.log)

module.exports = {
    conn
}
