import api, { route } from "@forge/api";

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

export function sendMessage(payload) {
  $.ajax({
    type: "POST",
    url: "../SlackBot/zammit.py",
    data: { param: payload },
  });
}