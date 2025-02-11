import api, { route } from "@forge/api";

export async function getBlogPosts(payload) {
  const response = await api.asUser().requestConfluence(route`/wiki/api/v2/labels/${payload.id}/blogposts`, {
    headers: {
      'Accept': 'application/json'
    }
  });

  console.log(`Response: ${response.status} ${response.statusText}`);
  console.log(await response.json());
}