The purpose of this project is to create a Discord bot that sends private messages about air raid alerts in Ukraine, leveraging a specialized API and a Redis database.

### Project Benefits
This project provides timely and critical information about air raid alerts directly to users via Discord, helping them stay informed and safe.

### How the Project Works
The project uses Node.js to create a Discord bot that fetches air raid alert data from a special API, stores and manages alert information using Redis, and sends private notifications to users.

### Repository and Installation
[GitHub Repository](https://github.com/Fulldroper/discord.bot.air-raid-alert)

To install and run the project:

1. Clone the repository:
    ```bash
    git clone https://github.com/Fulldroper/discord.bot.air-raid-alert
    cd discord.bot.air-raid-alert
    ```

2. Install dependencies and start the bot:
    ```bash
    npm install
    npm start
    ```

### Project Workflow
1. **Setup Project:** Initialize the project structure and dependencies.
    ```bash
    npm init
    npm install
    ```

2. **Create Discord Bot:** Set up the bot to connect to Discord and listen for commands.
    ```javascript
    const { Client, GatewayIntentBits } = require('discord.js');
    const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages] });
    const redis = require('redis');
    const redisClient = redis.createClient();

    client.once('ready', () => {
        console.log(`Logged in as ${client.user.tag}!`);
    });

    client.login('your-token-goes-here');
    ```

3. **Implement Alert Notifications:** Fetch alert data and send notifications.
    ```javascript
    const fetch = require('node-fetch');

    async function checkAlerts() {
        const response = await fetch('https://api.air-raid-alerts.com/alerts');
        const data = await response.json();

        data.alerts.forEach(alert => {
            // Send alert notification
            client.users.cache.get(alert.userId).send(`Air raid alert: ${alert.message}`);
        });
    }

    setInterval(checkAlerts, 60000); // Check every minute
    ```

### Skills Gained
- Developing Discord bots with Node.js
- Integrating Redis for data storage and management
- Implementing API fetching and real-time notifications
