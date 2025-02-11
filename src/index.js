import api, { route } from "@forge/api";

const { WebClient } = require('@slack/web-api');

const slackToken = "xoxb-8428428571013-8431737529858-SYTpkn39ANECl9dqiq7k05aq";
const client = new WebClient(slackToken);

export async function getBlogPosts(payload) {
  const response = await api.asUser().requestConfluence(route`/wiki/api/v2/blogposts`, {
    headers: {
      'Accept': 'application/json'
    }
  });

  console.log(`Response: ${response.status} ${response.statusText}`);
  console.log(await response.json());

  return response.json();
}

async function getId(name) {
  try {
      const response = await client.users.list();
      const users = response.members;

      for (let user of users) {
          console.log(user.real_name);
          if (user.real_name === name) {
              return user.id;
          }
      }
  } catch (error) {
      console.error("Error fetching user list:", error);
  }
  return null;
}

async function getUniqueChannelName(baseName) {
  let name = baseName;
  let count = 0;
  let exists = true;

  const response = await client.conversations.list({types: "public_channel,private_channel"});

  while (exists) {
      exists = response.channels.some(channel => channel.name == name);
      if (exists) {
          count++;
          name = `${baseName}-${count}`;
      }
  }
  return name;
}

async function matchmake(message, userA, userB) {
  try {
      const baseName = `${userA.toLowerCase().split(" ")[0]}-${userB.toLowerCase().split(" ")[0]}`;
      const name = await getUniqueChannelName(baseName);
      console.log(name);

      const conversation = await client.conversations.create({ name: name, is_private: true });
      const channelId = conversation.channel.id;

      console.log(channelId);

      const idA = await getId(userA);
      const idB = await getId(userB);

      if (!idA || !idB) {
          console.error("One or both users not found.");
          return;
      }

      console.log(idA, idB);

      await client.conversations.invite({ channel: channelId, users: `${idA},${idB}` });
      await client.chat.postMessage({ channel: channelId, text: message });
  } catch (error) {
      console.error("Slack API Error:", error);
  }
}

export function sendMessage(payload) {
  matchmake(payload.Message, payload.NameOne, payload.NameTwo)
}