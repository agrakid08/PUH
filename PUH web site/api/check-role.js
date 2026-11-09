export default async function handler(req, res) {
  const { access_token } = req.query;

  if (!access_token) {
    return res.status(400).json({ error: 'Missing access token' });
  }

  const GUILD_ID = "1569343502649790565";
  const ROLE_ID = "1569344062954283079";
  const BOT_TOKEN = "MTU2OTM0MzUwMjY0OTc5MDU2NQ.G4hS4g.a_x74-JXZzL5aesP7WPLLtmcmW39xhrOigPyLA"; // Твой токен бота из Discord Developer Portal

  try {
    // 1. Получаем ID пользователя
    const userRes = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${access_token}` }
    });
    if (!userRes.ok) throw new Error('Failed to fetch user');
    const userData = await userRes.json();

    // 2. Запрашиваем данные участника на твоем сервере через Бота
    const memberRes = await fetch(`https://discord.com/api/v8/guilds/${GUILD_ID}/members/${userData.id}`, {
      headers: { Authorization: `Bot ${BOT_TOKEN}` }
    });

    if (!memberRes.ok) {
      // Пользователя нет на сервере
      return res.status(200).json({ hasRole: false, user: userData });
    }

    const memberData = await memberRes.json();
    const hasRole = memberData.roles.includes(ROLE_ID);

    return res.status(200).json({ hasRole, user: userData });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}