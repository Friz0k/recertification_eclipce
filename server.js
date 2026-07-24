const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const CONFIG = {
  DISCORD_WEBHOOK: 'https://discord.com/api/webhooks/1498677954937487370/PAVXARtu3bSeJodua89uIT8nFAAX1c_8FX0EMxZDMIukD2Y9Mnu_1M5gVMHZ4Vv8gvVW',
  DISCORD_ROLE_ID: '839596804785176577'
};

const TEST_QUESTIONS = [
  { id: 1, question: "Что, согласно УК, является основным источником уголовного права в штате Сан-Андреас?", options: [{ text: "Конституция штата.", correct: false }, { text: "Судебный Кодекс.", correct: false }, { text: "Уголовный Кодекс.", correct: true }, { text: "Процессуальный Кодекс.", correct: false }], type: "single", points: 1 },
  { id: 2, question: "Какие из перечисленных признаков характеризуют деяние как 'малозначительное' и позволяют освободить от уголовной ответственности?", options: [{ text: "Деяние формально содержит признаки преступления.", correct: true }, { text: "Деяние не представляет общественной опасности.", correct: true }, { text: "Вред, причинённый деянием, является минимальным и несущественным.", correct: true }, { text: "Деяние совершено впервые.", correct: false }], type: "multiple", points: 1 },
  { id: 3, question: "Что признается покушением на преступление?", options: [{ text: "Приготовление к преступлению.", correct: false }, { text: "Умышленные действия, направленные на преступление, но не доведенные до конца по независящим от лица обстоятельствам.", correct: true }, { text: "Совершение преступления в составе группы лиц.", correct: false }, { text: "Любое нарушение, описанное в Особенной части УК.", correct: false }], type: "single", points: 1 },
  { id: 4, question: "В соответствии с УК, максимальный срок наказания за покушение на преступление (не оконченное по независящим от лица обстоятельствам) соотносится с наказанием за оконченное преступление следующим образом:", options: [{ text: "Не может превышать 1/2 максимального срока или размера наказания, предусмотренного за оконченное преступление.", correct: true }, { text: "Не может превышать 2/3 максимального срока.", correct: false }, { text: "Может быть равен наказанию за оконченное преступление, если суд усмотрит особую дерзость.", correct: false }, { text: "Срок ограничивается только нижней границей санкции статьи.", correct: false }], type: "single", points: 1 },
  { id: 5, question: "Кто из перечисленных НЕ является соучастником преступления?", options: [{ text: "Организатор.", correct: false }, { text: "Подстрекатель.", correct: false }, { text: "Свидетель.", correct: true }, { text: "Пособник.", correct: false }], type: "single", points: 1 },
  { id: 6, question: "Что влечет совершение преступления группой лиц?", options: [{ text: "Освобождение от ответственности для рядовых участников.", correct: false }, { text: "Более строгое наказание.", correct: true }, { text: "Изменение юрисдикции преступления на федеральную.", correct: false }, { text: "Обязательное рассмотрение дела судом.", correct: false }], type: "single", points: 1 },
  { id: 11, question: "Какое наказание предусмотрено за нанесение телесных повреждений кулаком (без нока)?", options: [{ text: "От 1 до 2 лет.", correct: true }, { text: "От 2 до 4 лет.", correct: false }, { text: "От 4 до 6 лет.", correct: false }, { text: "Штраф.", correct: false }], type: "single", points: 1 },
  { id: 12, question: "Какой статьей инкриминируется намеренное сбитие человека на автомобиле, приведшее к его ноку?", options: [{ text: "6.3", correct: false }, { text: "6.4", correct: false }, { text: "6.6", correct: true }, { text: "10.7", correct: false }], type: "single", points: 1 },
  { id: 14, question: "Какой срок грозит за хранение 8 единиц наркотических средств (косяков)?", options: [{ text: "От 1 до 3 лет.", correct: false }, { text: "От 2 до 4 лет.", correct: true }, { text: "От 6 до 8 лет.", correct: false }, { text: "Штраф до 5.000 $.", correct: false }], type: "single", points: 1 },
  { id: 15, question: "В каких местах ношение маски, полностью или частично скрывающей лицо, НЕ является нарушением ст. 13.4 УК (при отсутствии специального разрешения)?", options: [{ text: "На пляже, яхте.", correct: true }, { text: "На карнавале, фестивале или любом публичном мероприятии, согласованном с мэрией.", correct: true }, { text: "В помещении суда во время процесса.", correct: false }, { text: "На территории мэрии или полицейского участка.", correct: false }], type: "multiple", points: 1 },
  { id: 18, question: "Что является основным источником процессуального права согласно ПК?", options: [{ text: "Уголовный Кодекс.", correct: false }, { text: "Процессуальный Кодекс.", correct: true }, { text: "Судебный Кодекс.", correct: false }, { text: "Закон 'О прокуратуре'.", correct: false }], type: "single", points: 1 },
  { id: 20, question: "Что из перечисленного является недопустимым доказательством?", options: [{ text: "Показания свидетеля, который подробно описывает событие, основываясь на личных наблюдениях.", correct: false }, { text: "Признание задержанного, полученное после зачтения ему прав Миранды.", correct: false }, { text: "Показания, основанные на слухе или догадке.", correct: true }, { text: "Видеофиксация преступления с камер наблюдения.", correct: false }], type: "single", points: 1 },
  { id: 21, question: "Что такое задержание согласно ПК?", options: [{ text: "Мера уголовного наказания.", correct: false }, { text: "Мера кратковременного лишения свободы для сбора доказательств.", correct: true }, { text: "Административный арест.", correct: false }, { text: "Заключение под стражу по приговору суда.", correct: false }], type: "single", points: 1 },
  { id: 22, question: "Какое из перечисленных является основанием для задержания гражданского лица?", options: [{ text: "Лицо отказывается предъявить паспорт по просьбе сотрудника.", correct: false }, { text: "Наличие ориентировки на данное лицо, размещенной в рации департамента.", correct: true }, { text: "Лицо ведет себя подозрительно в общественном месте.", correct: false }], type: "single", points: 1 },
  { id: 23, question: "В какой момент сотрудник обязан зачитать задержанному его права?", options: [{ text: "Только после доставки в КПЗ.", correct: false }, { text: "Только в начале задержания, сразу после надевания наручников.", correct: false }, { text: "Рекомендуется как можно раньше, может быть в любой момент задержания.", correct: true }, { text: "Только если задержанный сам попросит.", correct: false }], type: "single", points: 1 },
  { id: 24, question: "При задержании государственного служащего:", options: [{ text: "Всегда проводится первичный обыск.", correct: false }, { text: "Первичный обыск не проводится.", correct: true }, { text: "Первичный обыск проводится только с разрешения прокурора.", correct: false }], type: "single", points: 1 },
  { id: 25, question: "Какой из перечисленных НЕ является субъектом задержания?", options: [{ text: "Сотрудник, производящий задержание (не более 3 человек).", correct: false }, { text: "Любой журналист Weazel News.", correct: true }, { text: "Адвокат задержанного.", correct: false }, { text: "Сотрудник прокуратуры, осуществляющий надзор.", correct: false }], type: "single", points: 1 },
  { id: 26, question: "Какое право из перечисленных входит в права задерживаемого?", options: [{ text: "Право на один телефонный звонок.", correct: false }, { text: "Право на адвоката.", correct: false }, { text: "Право хранить молчание.", correct: false }, { text: "Все перечисленные права.", correct: true }], type: "single", points: 1 },
  { id: 27, question: "Что такое первичный обыск?", options: [{ text: "Тщательный обыск жилища.", correct: false }, { text: "Обыск, проводимый для обеспечения безопасности сотрудника и поиска оружия сразу после задержания.", correct: true }, { text: "Обыск, проводимый только с ордером прокурора.", correct: false }, { text: "Обыск автомобиля.", correct: false }], type: "single", points: 1 },
  { id: 48, question: "Что обязаны сделать пешеходы при приближении автомобиля с включенными синим маячком и сиреной?", options: [{ text: "Ускорить переход дороги", correct: false }, { text: "Продолжить движение, у них приоритет", correct: false }, { text: "Воздержаться от перехода, а находящиеся на проезжей части — немедленно ее освободить", correct: true }, { text: "Остановиться и сделать фотографию", correct: false }], type: "single", points: 1 },
  { id: 53, question: "Что из перечисленного является недопустимым доказательством?", options: [{ text: "Показания свидетеля, основанные на слухе.", correct: true }, { text: "Видеозапись с места преступления.", correct: false }, { text: "Показания потерпевшего, подтверждённые экспертизой.", correct: false }, { text: "Признательные показания после разъяснения прав.", correct: false }], type: "single", points: 1 },
  { id: 54, question: "Доказательства, полученные с нарушением закона:", options: [{ text: "Имеют равную силу с остальными.", correct: false }, { text: "Признаются недопустимыми и не могут использоваться.", correct: true }, { text: "Могут быть использованы с согласия прокурора.", correct: false }, { text: "Допускаются, если нарушение несущественно.", correct: false }], type: "single", points: 1 },
  { id: 61, question: "С какого количества наркотических средств наступает уголовная ответственность за хранение?", options: [{ text: "С 1 единицы.", correct: false }, { text: "С 4 единиц.", correct: true }, { text: "С 10 единиц.", correct: false }, { text: "Только при доказанном сбыте.", correct: false }], type: "single", points: 1 },
  { id: 63, question: "Может ли сотрудник LSPD задержать лицо, находящееся в федеральном розыске?", options: [{ text: "Нет, только FIB.", correct: false }, { text: "Да, любой сотрудник правоохранительных органов обязан это сделать.", correct: true }, { text: "Только с санкции прокурора.", correct: false }, { text: "Только если лицо совершает преступление в данный момент.", correct: false }], type: "single", points: 1 },
  { id: 65, question: "В каких случаях сотрудник государственной структуры вправе применить физическое воздействие к гражданскому?", options: [{ text: "Только при задержании за преступление.", correct: false }, { text: "Если это необходимо по рабочей ситуации, он под прикрытием или в обстановке секретности с опасением последствий.", correct: true }, { text: "Всегда, если гражданин не подчиняется.", correct: false }, { text: "Только с разрешения прокурора.", correct: false }], type: "single", points: 1 },
  { id: 66, question: "Что из перечисленного запрещено хранить сотруднику госструктуры в личном транспорте или шкафу?", options: [{ text: "Аптечки и бронежилеты, принадлежащие госструктуре.", correct: true }, { text: "Личное оружие, купленное в магазине.", correct: false }, { text: "Украденные Деньги.", correct: false }, { text: "Спанк", correct: false }], type: "single", points: 1 },
  { id: 69, question: "Разрешено ли сотрудникам FIB употреблять алкоголь или наркотики во время исполнения служебных обязанностей?", options: [{ text: "Разрешено, если это не мешает работе.", correct: false }, { text: "Запрещено.", correct: true }, { text: "Разрешено только алкоголь.", correct: false }, { text: "Разрешено с разрешения начальника.", correct: false }], type: "single", points: 1 },
  { id: 70, question: "Разрешено ли сотрудникам госструктур использовать служебный транспорт для выполнения квестов или рыбалки?", options: [{ text: "Да, если это не мешает работе.", correct: false }, { text: "Запрещено.", correct: true }, { text: "Разрешено в нерабочее время.", correct: false }, { text: "Только с разрешения лидера.", correct: false }], type: "single", points: 1 },
  { id: 71, question: "Что из перечисленного является нарушением запрета на слив склада государственной структуры?", options: [{ text: "Продажа вооружения со склада посторонним.", correct: false }, { text: "Ношение бронежилета другой госструктуры без обмена по отчетности.", correct: false }, { text: "Присвоение государственного оружия после увольнения.", correct: false }, { text: "Все перечисленное.", correct: true }], type: "single", points: 1 },
  { id: 72, question: "Может ли сотрудник FIB участвовать в войне семей, используя оружие и броню со склада фракции?", options: [{ text: "Да, может.", correct: false }, { text: "Нет, запрещено, это считается сливом склада.", correct: true }, { text: "Может, если уволен из фракции.", correct: false }, { text: "Может только с разрешения лидера.", correct: false }], type: "single", points: 1 },
  { id: 75, question: "В какой момент разрешено срывать маску с нарушителя?", options: [{ text: "Сразу при встрече.", correct: false }, { text: "Только в процессе задержания.", correct: true }, { text: "После доставки в КПЗ.", correct: false }, { text: "Только с санкции прокурора.", correct: false }], type: "single", points: 1 },
  { id: 73, question: "Какое минимальное количество сотрудников должно быть в патрульной машине LSPD/LSSD/FIB в гетто?", options: [{ text: "Один.", correct: false }, { text: "Двое.", correct: true }, { text: "Трое.", correct: false }, { text: "Четверо.", correct: false }], type: "single", points: 1 },
  { id: 76, question: "Какое оружие разрешено использовать сотрудникам FIB при исполнении?", options: [{ text: "Исключительно произведенное государственными структурами.", correct: false }, { text: "Только купленное в оружейном магазине.", correct: false }, { text: "Любое без ограничений.", correct: false }, { text: "Произведенное госструктурами или приобретенное в магазине; агентам под прикрытием — любое.", correct: true }], type: "single", points: 1 },
  { id: 77, question: "Какое наказание предусмотрено за SK на титульном районе чужой организации?", options: [{ text: "Штраф в игре.", correct: false }, { text: "Деморган от 120 минут и warn всем участникам.", correct: true }, { text: "Увольнение.", correct: false }, { text: "Никакого, это IC ситуация.", correct: false }], type: "single", points: 1 },
  { id: 37, question: "Что можно складывать в рюкзак?", options: [{ text: "Оружие.", correct: true }, { text: "Патроны.", correct: false }, { text: "Аптечки.", correct: true }, { text: "Броню.", correct: true }], type: "multiple", points: 1 },
  { id: 35, question: "Какой из перечисленных органов имеет право действовать на всей территории штата без оповещения о пересечении границ юрисдикции?", options: [{ text: "Только LSPD в своей зоне.", correct: false }, { text: "Только LSSD и SANG в своих зонах.", correct: false }, { text: "USSS, Прокуратура Штата и FIB.", correct: true }, { text: "Все государственные структуры в любое время.", correct: false }], type: "single", points: 1 }
];

async function sendToDiscord(payload) {
  try {
    await fetch(CONFIG.DISCORD_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (error) {}
}

app.get('/api/questions', (req, res) => {
  const rank = parseInt(req.query.rank) || 3;
  const questionsCount = rank === 7 ? 20 : 10;
  
  const shuffled = [...TEST_QUESTIONS].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, questionsCount);
  
  const forClient = selected.map(q => ({
    id: q.id, question: q.question, type: q.type, points: q.points,
    options: q.options.map(o => ({ text: o.text }))
  }));
  
  res.json({ success: true, questions: forClient });
});

app.post('/api/submit', async (req, res) => {
  const data = req.body;
  let totalScore = 0;
  let peekAttempts = 0;
  
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
    
    if (isCorrect) totalScore += orig.points;
    if (data.questionTimes && data.questionTimes[i] > 60) peekAttempts++;
  });

  const passed = totalScore >= (data.questions.length * 0.7);

  const payload = {
    content: `<@&${CONFIG.DISCORD_ROLE_ID}>`,
    username: "FIB Cop bot",
    embeds: [{
      title: "📋 FIB переаттестация",
      color: passed ? 0x00FF00 : 0xFF4444,
      fields: [
        { name: "👤 Никнейм:", value: `${data.nickname} (${data.discordTag})\n🏅 Ранг: ${data.rank}`, inline: false },
        { name: "📊 Кол-во набранных баллов:", value: `${totalScore} из ${data.questions.length}`, inline: false },
        { name: "⚠️ Количество выхода из страницы:", value: `${data.leaveCount}`, inline: false },
        { name: "👀 Попытки списывания:", value: `${peekAttempts}`, inline: false }
      ],
      timestamp: new Date().toISOString()
    }]
  };

  await sendToDiscord(payload);
  res.json({ success: true, score: totalScore });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {});
