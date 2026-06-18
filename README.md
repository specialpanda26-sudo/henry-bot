# 🤖 WhatsApp Bot

A full-featured WhatsApp bot built with [Baileys](https://github.com/WhiskeySockets/Baileys).

---

## ✅ Features

| # | Feature | Command |
|---|---------|---------|
| 1 | Auto View Status | `.autostatus` |
| 2 | Download Songs | `.play [song name]` |
| 3 | Download Videos | `.video [name]` / `.yt [url]` |
| 4 | Download IG Content | `.ig [url]` |
| 5 | Download FB Videos | `.fb [url]` |
| 6 | Fake Typing | `.faketyping` |
| 7 | Fake Recording | `.fakerecording` |
| 8 | Always Online | `.alwaysonline` |
| 9 | Auto Like Status | `.autolike` |
| 10 | AI / ChatGPT | `.gpt [question]` |
| 11 | Auto Read Messages | `.autoread` |
| 12 | Auto React | `.autoreact` |
| 13 | Auto Bio Rotation | `.autobio` |
| 14 | Anti-Call | `.anticall` |
| 15 | Create Image w/ Text | `.imagine [text]` |
| 16 | Save Group Contacts | `.savecontacts` |
| 17 | Show Menu | `.menu` |
| 18 | Ping | `.ping` |
| 19 | Feature Status | `.status` |

---

## 📦 Requirements

- **Node.js** v18 or higher
- A WhatsApp account (will be used as the bot account)
- (Optional) OpenAI API key for `.gpt` command

---

## 🚀 Setup

### 1. Install Node.js
Download from https://nodejs.org (choose LTS version)

### 2. Install dependencies
```bash
npm install
```

### 3. Configure the bot
Open `config.js` and set:
- `OWNER_NUMBER` — your WhatsApp number (e.g. `27831234567`)
- `OPENAI_API_KEY` — get one at https://platform.openai.com/api-keys
- `BOT_NAME` — whatever you want to call your bot

### 4. Start the bot
```bash
node index.js
```

### 5. Scan the QR code
A QR code will appear in the terminal. Open WhatsApp on your phone:
- Tap the three dots (⋮) → Linked Devices → Link a Device
- Scan the QR code

Your bot is now running! 🎉

---

## 💬 Using the Bot

Send any command to yourself or in a group where the bot is active:

```
.menu          → Shows all commands
.ping          → Tests bot speed
.play Adele    → Downloads a song
.gpt Hello!    → Asks ChatGPT
.imagine Hello World  → Creates an image with text
```

Owner-only commands (only work from your number):
```
.autostatus    → Toggle auto-viewing statuses
.autolike      → Toggle auto-liking statuses
.alwaysonline  → Toggle always-online presence
.autoread      → Toggle auto-reading messages
.autobio       → Toggle auto-rotating bio
.anticall      → Toggle rejecting incoming calls
.autoreact     → Toggle auto-reacting to messages
```

---

## 🗂️ File Structure

```
whatsapp-bot/
├── index.js          ← Main bot file
├── config.js         ← Your settings
├── package.json
├── lib/
│   ├── helper.js     ← Utility functions
│   └── state.js      ← Feature toggle state
└── commands/
    ├── menu.js       ← .menu
    ├── ping.js       ← .ping
    ├── status.js     ← .status
    ├── gpt.js        ← .gpt
    ├── play.js       ← .play
    ├── video.js      ← .video / .yt
    ├── social.js     ← .ig / .fb
    ├── imagine.js    ← .imagine
    ├── fake.js       ← .faketyping / .fakerecording
    ├── contacts.js   ← .savecontacts
    └── toggles.js    ← All owner toggle commands
```

---

## ⚠️ Important Notes

1. **Use a secondary WhatsApp number** — using unofficial methods risks account bans
2. **Keep your session folder (`auth/`) private** — it contains your login credentials
3. **The bot must stay running** — close the terminal and it stops. Use `pm2` to keep it alive:
   ```bash
   npm install -g pm2
   pm2 start index.js --name whatsapp-bot
   pm2 save
   ```

---

## 🛠️ Troubleshooting

| Problem | Fix |
|---------|-----|
| QR code not showing | Make sure Node.js v18+ is installed |
| `.gpt` not working | Add your OpenAI key to `config.js` |
| `.imagine` failing | Run `npm install canvas` |
| `.play` / `.video` failing | Run `npm install ytdl-core yt-search` |
| Bot keeps disconnecting | Use `pm2` to auto-restart |
