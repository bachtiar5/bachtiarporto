import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
async function readSnapshot(file, key) {
  const context = { window: {} };
  vm.runInNewContext(await readFile(new URL(file, root), 'utf8'), context);
  return context.window[key];
}
async function get(url) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
      if (!response.ok) throw new Error(`Roblox HTTP ${response.status}: ${url}`);
      return await response.json();
    } catch (error) {
      if (attempt === 2) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * 2 ** attempt));
    }
  }
}
function count(value, field) {
  if (!Number.isSafeInteger(value) || value < 0) throw new Error(`Invalid ${field}`);
  return value;
}
function text(value, field) {
  if (typeof value !== 'string') throw new Error(`Invalid ${field}`);
  return value;
}
function date(value) {
  if (!Number.isFinite(Date.parse(value))) throw new Error('Invalid Roblox date');
  return value;
}

export async function syncRoblox() {
  const [published, profile, studio] = await Promise.all([
    readSnapshot('published-projects.js', 'publishedProjects'),
    readSnapshot('profile-data.js', 'robloxProfile'),
    readSnapshot('studio-data.js', 'studioProfile')
  ]);
  const ids = published.projects.map(game => game.universeId).join(',');
  const [games, votes, user, friends, followers, following, group] = await Promise.all([
    get(`https://games.roblox.com/v1/games?universeIds=${ids}`),
    get(`https://games.roblox.com/v1/games/votes?universeIds=${ids}`),
    get(`https://users.roblox.com/v1/users/${profile.id}`),
    get(`https://friends.roblox.com/v1/users/${profile.id}/friends/count`),
    get(`https://friends.roblox.com/v1/users/${profile.id}/followers/count`),
    get(`https://friends.roblox.com/v1/users/${profile.id}/followings/count`),
    get(`https://groups.roblox.com/v1/groups/${studio.id}`)
  ]);
  const capturedAt = new Date().toISOString();
  published.projects = published.projects.map(previous => {
    const game = games.data.find(item => item.id === previous.universeId);
    const vote = votes.data.find(item => item.id === previous.universeId);
    if (!game || !vote) throw new Error(`Missing game ${previous.universeId}`);
    return { ...previous, name: text(game.name, 'game name'),
      likes: count(vote.upVotes, 'likes'), active: count(game.playing, 'players'),
      favorites: count(game.favoritedCount, 'favorites'), visits: count(game.visits, 'visits'),
      created: date(game.created), updated: date(game.updated) };
  });
  if (user.id !== profile.id || group.id !== studio.id || typeof user.hasVerifiedBadge !== 'boolean') {
    throw new Error('Unexpected Roblox profile response');
  }
  const nextProfile = { ...profile, name: text(user.name, 'username'),
    displayName: text(user.displayName, 'display name'), description: text(user.description, 'bio'),
    created: date(user.created), hasVerifiedBadge: user.hasVerifiedBadge,
    friends: count(friends.count, 'friends'), followers: count(followers.count, 'followers'),
    following: count(following.count, 'following'), capturedAt };
  const nextStudio = { ...studio, name: text(group.name, 'studio name'),
    memberCount: count(group.memberCount, 'members'), capturedAt };
  published.capturedAt = capturedAt;
  // Validate every API response before replacing any snapshot. Authored roles and peak CCU stay intact.
  for (const [file, key, value] of [
    ['published-projects.js', 'publishedProjects', published],
    ['profile-data.js', 'robloxProfile', nextProfile],
    ['studio-data.js', 'studioProfile', nextStudio]
  ]) await writeFile(new URL(file, root), `// Roblox API snapshot. Updated by scripts/sync-roblox.mjs.\nwindow.${key} = ${JSON.stringify(value, null, 2)};\n`);
  console.log(`Updated ${published.projects.length} games, Roblox profile, and studio at ${capturedAt}`);
}
if (process.argv[1] === fileURLToPath(import.meta.url)) await syncRoblox();
