const CONFIG = {
  DISCORD_WEBHOOK: 'https://discord.com/api/webhooks/1498677954937487370/PAVXARtu3bSeJodua89uIT8nFAAX1c_8FX0EMxZDMIukD2Y9Mnu_1M5gVMHZ4Vv8gvVW',
  DISCORD_ROLE_ID: '839596804785176577',
  PASSING_SCORE: 14,
  QUESTIONS_PER_TEST: 20
};

const TEST_QUESTIONS = [
  {
    id: 1,
    question: "Что, согласно УК, является основным источником уголовного права в штате Сан-Андреас?",
    options: [
      { text: "Конституция штата.", correct: false },
      { text: "Судебный Кодекс.", correct: false },
      { text: "Уголовный Кодекс.", correct: true },
      { text: "Процессуальный Кодекс.", correct: false }
    ],
    type: "single",
    points: 1
  },
  {
    id: 2,
    question: "Какие из перечисленных признаков характеризуют деяние как 'малозначительное' и позволяют освободить от уголовной ответственности?",
    options: [
      { text: "Деяние формально содержит признаки преступления.", correct: true },
      { text: "Деяние не представляет общественной опасности.", correct: true },
      { text: "Вред, причинённый деянием, является минимальным и несущественным.", correct: true },
      { text: "Деяние совершено впервые.", correct: false }
    ],
    type: "multiple",
    points: 1
  },
  {
    id: 3,
    question: "Что признается покушением на преступление?",
    options: [
      { text: "Приготовление к преступлению.", correct: false },
      { text: "Умышленные действия, направленные на преступление, но не доведенные до конца по независящим от лица обстоятельствам.", correct: true },
      { text: "Совершение преступления в составе группы лиц.", correct: false },
      { text: "Любое нарушение, описанное в Особенной части УК.", correct: false }
    ],
    type: "single",
    points: 1
  }
  // Добавь сюда остальные вопросы из своего списка
];

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request, env, ctx) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);

    if (request.method === 'GET' && url.pathname === '/api/questions') {
      const shuffled = [...TEST_QUESTIONS].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, CONFIG.QUESTIONS_PER_TEST);
      
      const forClient = selected.map(q => ({
        id: q.id,
        question: q.question,
        options: q.options.map(o => ({ text: o.text })),
        type: q.type,
        points: q.points
      }));
      
      return new Response(JSON.stringify({ success: true, questions: forClient }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    if (request.method === 'POST' && url.pathname === '/api/cheat-alert') {
      const data = await request.json();
      const payload = {
        content: `<@&${CONFIG.DISCORD_ROLE_ID}> 🚨 **АНТИЧИТ АЛАРМ**`,
        username: "FIB Security",
        embeds: [{
          color: 0xFFA500,
          title: "⚠️ Подозрительная активность",
          fields: [
            { name: "👤 Игрок", value: `${data.nickname} (${data.discordTag})`, inline: true },
            { name: "🔍 Нарушение", value: data.reason, inline: false }
          ],
          timestamp: new Date().toISOString()
        }]
      };

      await fetch(CONFIG.DISCORD_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json', ...corsHeaders } });
    }

    if (request.method === 'POST' && url.pathname === '/api/submit') {
      const data = await request.json();
      let totalScore = 0;
      let fastAnswersCount = 0;
      
      data.questions.forEach((userQ, i) => {
        const orig = TEST_QUESTIONS.find(q => q.id === userQ.id);
        if (!orig) return;
        
        const selected = userQ.selectedAnswers || [];
        const correct = orig.options.map((opt, idx) => opt.correct ? idx : -1).filter(idx => idx !== -1);
        
        let isCorrect = false;
        if (orig.type === 'multiple') {
          const sSorted = [...selected].sort();
          const cSorted = [...correct].sort();
          isCorrect = sSorted.length === cSorted.length && sSorted.every((v,idx) => v === cSorted[idx]);
        } else {
          isCorrect = selected.length === 1 && correct.length === 1 && selected[0] === correct[0];
        }
        
        totalScore += isCorrect ? orig.points : 0;
        
        if (data.questionTimes && data.questionTimes[i] < 3) {
          fastAnswersCount++;
        }
      });

      const passed = totalScore >= CONFIG.PASSING_SCORE;
      let cheatWarning = fastAnswersCount >= 3 
        ? `\n\n⚠️ **Подозрение на читы:** ${fastAnswersCount} отв. даны быстрее 3 секунд.` 
        : "";

      const payload = {
        content: `<@&${CONFIG.DISCORD_ROLE_ID}>`,
        username: "FIB Переаттестация",
        embeds: [{
          color: passed ? 0x00FF00 : 0xFF4444,
          fields: [
            { name: "🎮 Discord", value: data.discordTag, inline: true },
            { name: "👤 Ник", value: data.nickname, inline: true },
            { name: "📊 Результат", value: `${totalScore}/${data.questions.length}${cheatWarning}`, inline: false }
          ],
          timestamp: new Date().toISOString()
        }]
      };

      await fetch(CONFIG.DISCORD_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return new Response(JSON.stringify({ success: true, score: totalScore }), { headers: { 'Content-Type': 'application/json', ...corsHeaders } });
    }

    return new Response('Not Found', { status: 404, headers: corsHeaders });
  }
};
