const $ = (s) => document.querySelector(s);
const tenseGroups = [
  ['Настоящее', [
    ['Present Simple','Привычки, факты и регулярные действия.','Базовый','S + V / V-s','I work. / She works.'],
    ['Present Continuous','Действия, которые происходят прямо сейчас.','Базовый','S + am/is/are + V-ing','She is reading now.'],
    ['Present Perfect','Опыт и результат, важный сейчас.','Средний','S + have/has + V3','They have finished.'],
    ['Present Perfect Continuous','Действие началось раньше и всё ещё длится.','Продвинутый','S + have/has been + V-ing','I have been waiting.']
  ]],
  ['Прошедшее', [
    ['Past Simple','Завершённые события в прошлом.','Базовый','S + V2 / did + V','We visited Rome.'],
    ['Past Continuous','Действие в определённый момент прошлого.','Базовый','S + was/were + V-ing','He was sleeping.'],
    ['Past Perfect','Одно действие произошло раньше другого.','Средний','S + had + V3','She had left before noon.'],
    ['Past Perfect Continuous','Длительность действия до момента в прошлом.','Продвинутый','S + had been + V-ing','They had been working.']
  ]],
  ['Будущее', [
    ['Future Simple','Решения, обещания и прогнозы.','Базовый','S + will + V','I will call you.'],
    ['Future Continuous','Действие будет идти в момент будущего.','Средний','S + will be + V-ing','We will be travelling.'],
    ['Future Perfect','Действие завершится к моменту в будущем.','Продвинутый','S + will have + V3','He will have arrived.'],
    ['Future Perfect Continuous','Длительность действия до будущего момента.','Продвинутый','S + will have been + V-ing','I will have been studying.']
  ]],
  ['Будущее в прошлом', [
    ['Future in the Past Simple','Будущее действие с точки зрения прошлого.','Средний','S + would + V','She said she would call.'],
    ['Future in the Past Continuous','Процесс в будущем с точки зрения прошлого.','Продвинутый','S + would be + V-ing','He knew we would be waiting.'],
    ['Future in the Past Perfect','Завершённость в будущем относительно прошлого.','Продвинутый','S + would have + V3','I thought she would have left.'],
    ['Future in the Past Perfect Continuous','Длительность до будущего момента в прошлом.','Продвинутый','S + would have been + V-ing','They expected I would have been working.']
  ]],
  ['Модальные формы', [
    ['Present Simple Passive','Пассивный залог в настоящем времени.','Средний','S + am/is/are + V3','The room is cleaned.'],
    ['Past Simple Passive','Пассивный залог в прошлом времени.','Средний','S + was/were + V3','The letter was sent.'],
    ['Present Perfect Passive','Результат действия в пассиве.','Продвинутый','S + have/has been + V3','The work has been done.'],
    ['Future Simple Passive','Будущее действие в пассиве.','Продвинутый','S + will be + V3','The report will be finished.']
  ]],
  ['Условные конструкции', [
    ['Zero Conditional','Общие истины и закономерности.','Средний','If + Present, Present','If it rains, I stay home.'],
    ['First Conditional','Реальное условие в будущем.','Средний','If + Present, will + V','If it rains, I will stay home.'],
    ['Second Conditional','Нереальное условие в настоящем.','Продвинутый','If + Past, would + V','If I had time, I would travel.'],
    ['Third Conditional','Нереальное условие в прошлом.','Продвинутый','If + Past Perfect, would have + V3','If I had known, I would have called.']
  ]]
];
/* People. `slot` indexes the 5-form present/future tables (я, ты, он/она, мы, они);
   `gender` indexes the 4-form past tables, or 'x' where the speaker's gender is
   unknown and Russian convention writes both endings. `en` picks the English
   agreement pattern: i = am/was + bare verb, you/pl = are/were + bare verb,
   s = is/was + third-person -s. */
const people = {
  i:         { en: 'I',             low: 'I',             pron: 'I',    ru: 'я',              agr: 'i',   slot: 0, gender: 'x' },
  you:       { en: 'You',           low: 'you',           pron: 'you',  ru: 'ты',             agr: 'you', slot: 1, gender: 'x' },
  he:        { en: 'He',            low: 'he',            pron: 'he',   ru: 'он',             agr: 's',   slot: 2, gender: 'm' },
  she:       { en: 'She',           low: 'she',           pron: 'she',  ru: 'она',            agr: 's',   slot: 2, gender: 'f' },
  we:        { en: 'We',            low: 'we',            pron: 'we',   ru: 'мы',             agr: 'pl',  slot: 3, gender: 'pl' },
  they:      { en: 'They',          low: 'they',          pron: 'they', ru: 'они',            agr: 'pl',  slot: 4, gender: 'pl' },
  brother:   { en: 'My brother',    low: 'my brother',    pron: 'he',   ru: 'мой брат',       agr: 's',   slot: 2, gender: 'm' },
  sister:    { en: 'My sister',     low: 'my sister',     pron: 'she',  ru: 'моя сестра',     agr: 's',   slot: 2, gender: 'f' },
  mother:    { en: 'My mother',     low: 'my mother',     pron: 'she',  ru: 'моя мама',       agr: 's',   slot: 2, gender: 'f' },
  parents:   { en: 'My parents',    low: 'my parents',    pron: 'they', ru: 'мои родители',   agr: 'pl',  slot: 4, gender: 'pl' },
  friend:    { en: 'My friend',     low: 'my friend',     pron: 'he',   ru: 'мой друг',       agr: 's',   slot: 2, gender: 'm' },
  boss:      { en: 'My boss',       low: 'my boss',       pron: 'he',   ru: 'мой начальник',  agr: 's',   slot: 2, gender: 'm' },
  anna:      { en: 'Anna',          low: 'Anna',          pron: 'she',  ru: 'Анна',           agr: 's',   slot: 2, gender: 'f' },
  kate:      { en: 'Kate',          low: 'Kate',          pron: 'she',  ru: 'Катя',           agr: 's',   slot: 2, gender: 'f' },
  david:     { en: 'David',         low: 'David',         pron: 'he',   ru: 'Дэвид',          agr: 's',   slot: 2, gender: 'm' },
  max:       { en: 'Max',           low: 'Max',           pron: 'he',   ru: 'Макс',           agr: 's',   slot: 2, gender: 'm' },
  children:  { en: 'The children',  low: 'the children',  pron: 'they', ru: 'дети',           agr: 'pl',  slot: 4, gender: 'pl' },
  girls:     { en: 'The girls',     low: 'the girls',     pron: 'they', ru: 'девочки',        agr: 'pl',  slot: 4, gender: 'pl' },
  students:  { en: 'The students',  low: 'the students',  pron: 'they', ru: 'студенты',       agr: 'pl',  slot: 4, gender: 'pl' },
  guests:    { en: 'The guests',    low: 'the guests',    pron: 'they', ru: 'гости',          agr: 'pl',  slot: 4, gender: 'pl' },
  neighbours:{ en: 'Our neighbours',low: 'our neighbours',pron: 'they', ru: 'наши соседи',    agr: 'pl',  slot: 4, gender: 'pl' },
  team:      { en: 'Our team',      low: 'our team',      pron: 'it',   ru: 'наша команда',   agr: 's',   slot: 2, gender: 'f' },
  teacher:   { en: 'The teacher',   low: 'the teacher',   pron: 'she',  ru: 'учительница',    agr: 's',   slot: 2, gender: 'f' },
  doctor:    { en: 'The doctor',    low: 'the doctor',    pron: 'he',   ru: 'доктор',         agr: 's',   slot: 2, gender: 'm' },
  engineer:  { en: 'The engineer',  low: 'the engineer',  pron: 'he',   ru: 'инженер',        agr: 's',   slot: 2, gender: 'm' }
};

/* Verbs. Russian needs four tables where English needs one: the present is
   imperfective, the continuous past is imperfective, the perfect and simple
   pasts are perfective, and the simple future is the perfective future.
   Present/future tables are [я, ты, он, мы, они]; past tables are
   [м, ж, ср, мн, unknown-gender]. */
const verbs = {
  write:   { past:'wrote', pp:'written', ing:'writing', inf:'писать',
             pres:['пишу','пишешь','пишет','пишем','пишут'],
             impf:['писал','писала','писало','писали','писал(а)'],
             perf:['написал','написала','написало','написали','написал(а)'],
             fut: ['напишу','напишешь','напишет','напишем','напишут'] },
  read:    { past:'read', pp:'read', ing:'reading', inf:'читать',
             pres:['читаю','читаешь','читает','читаем','читают'],
             impf:['читал','читала','читало','читали','читал(а)'],
             perf:['прочитал','прочитала','прочитало','прочитали','прочитал(а)'],
             fut: ['прочитаю','прочитаешь','прочитает','прочитаем','прочитают'] },
  cook:    { past:'cooked', pp:'cooked', ing:'cooking', inf:'готовить',
             pres:['готовлю','готовишь','готовит','готовим','готовят'],
             impf:['готовил','готовила','готовило','готовили','готовил(а)'],
             perf:['приготовил','приготовила','приготовило','приготовили','приготовил(а)'],
             fut: ['приготовлю','приготовишь','приготовит','приготовим','приготовят'] },
  drink:   { past:'drank', pp:'drunk', ing:'drinking', inf:'пить',
             pres:['пью','пьёшь','пьёт','пьём','пьют'],
             impf:['пил','пила','пило','пили','пил(а)'],
             perf:['выпил','выпила','выпило','выпили','выпил(а)'],
             fut: ['выпью','выпьешь','выпьет','выпьем','выпьют'] },
  watch:   { past:'watched', pp:'watched', ing:'watching', inf:'смотреть',
             pres:['смотрю','смотришь','смотрит','смотрим','смотрят'],
             impf:['смотрел','смотрела','смотрело','смотрели','смотрел(а)'],
             perf:['посмотрел','посмотрела','посмотрело','посмотрели','посмотрел(а)'],
             fut: ['посмотрю','посмотришь','посмотрит','посмотрим','посмотрят'] },
  play:    { past:'played', pp:'played', ing:'playing', inf:'играть',
             pres:['играю','играешь','играет','играем','играют'],
             impf:['играл','играла','играло','играли','играл(а)'],
             perf:['сыграл','сыграла','сыграло','сыграли','сыграл(а)'],
             fut: ['сыграю','сыграешь','сыграет','сыграем','сыграют'] },
  fix:     { past:'fixed', pp:'fixed', ing:'fixing', inf:'чинить',
             pres:['чиню','чинишь','чинит','чиним','чинят'],
             impf:['чинил','чинила','чинило','чинили','чинил(а)'],
             perf:['починил','починила','починило','починили','починил(а)'],
             fut: ['починю','починишь','починит','починим','починят'] },
  learn:   { past:'learned', pp:'learned', ing:'learning', inf:'учить',
             pres:['учу','учишь','учит','учим','учат'],
             impf:['учил','учила','учило','учили','учил(а)'],
             perf:['выучил','выучила','выучило','выучили','выучил(а)'],
             fut: ['выучу','выучишь','выучит','выучим','выучат'] },
  build:   { past:'built', pp:'built', ing:'building', inf:'строить',
             pres:['строю','строишь','строит','строим','строят'],
             impf:['строил','строила','строило','строили','строил(а)'],
             perf:['построил','построила','построило','построили','построил(а)'],
             fut: ['построю','построишь','построит','построим','построят'] },
  plan:    { past:'planned', pp:'planned', ing:'planning', inf:'планировать',
             pres:['планирую','планируешь','планирует','планируем','планируют'],
             impf:['планировал','планировала','планировало','планировали','планировал(а)'],
             perf:['спланировал','спланировала','спланировало','спланировали','спланировал(а)'],
             fut: ['спланирую','спланируешь','спланирует','спланируем','спланируют'] },
  buy:     { past:'bought', pp:'bought', ing:'buying', inf:'покупать',
             pres:['покупаю','покупаешь','покупает','покупаем','покупают'],
             impf:['покупал','покупала','покупало','покупали','покупал(а)'],
             perf:['купил','купила','купило','купили','купил(а)'],
             fut: ['куплю','купишь','купит','купим','купят'] },
  solve:   { past:'solved', pp:'solved', ing:'solving', inf:'решать',
             pres:['решаю','решаешь','решает','решаем','решают'],
             impf:['решал','решала','решало','решали','решал(а)'],
             perf:['решил','решила','решило','решили','решил(а)'],
             fut: ['решу','решишь','решит','решим','решат'] },
  call:    { past:'called', pp:'called', ing:'calling', inf:'звонить',
             pres:['звоню','звонишь','звонит','звоним','звонят'],
             impf:['звонил','звонила','звонило','звонили','звонил(а)'],
             perf:['позвонил','позвонила','позвонило','позвонили','позвонил(а)'],
             fut: ['позвоню','позвонишь','позвонит','позвоним','позвонят'] },
  send:    { past:'sent', pp:'sent', ing:'sending', inf:'отправлять',
             pres:['отправляю','отправляешь','отправляет','отправляем','отправляют'],
             impf:['отправлял','отправляла','отправляло','отправляли','отправлял(а)'],
             perf:['отправил','отправила','отправило','отправили','отправил(а)'],
             fut: ['отправлю','отправишь','отправит','отправим','отправят'] },
  visit:   { past:'visited', pp:'visited', ing:'visiting', inf:'посещать',
             pres:['посещаю','посещаешь','посещает','посещаем','посещают'],
             impf:['посещал','посещала','посещало','посещали','посещал(а)'],
             perf:['посетил','посетила','посетило','посетили','посетил(а)'],
             fut: ['посещу','посетишь','посетит','посетим','посетят'] },
  check:   { past:'checked', pp:'checked', ing:'checking', inf:'проверять',
             pres:['проверяю','проверяешь','проверяет','проверяем','проверяют'],
             impf:['проверял','проверяла','проверяло','проверяли','проверял(а)'],
             perf:['проверил','проверила','проверило','проверили','проверил(а)'],
             fut: ['проверю','проверишь','проверит','проверим','проверят'] },
  draw:    { past:'drew', pp:'drawn', ing:'drawing', inf:'рисовать',
             pres:['рисую','рисуешь','рисует','рисуем','рисуют'],
             impf:['рисовал','рисовала','рисовало','рисовали','рисовал(а)'],
             perf:['нарисовал','нарисовала','нарисовало','нарисовали','нарисовал(а)'],
             fut: ['нарисую','нарисуешь','нарисует','нарисуем','нарисуют'] },
  clean:   { past:'cleaned', pp:'cleaned', ing:'cleaning', inf:'убирать',
             pres:['убираю','убираешь','убирает','убираем','убирают'],
             impf:['убирал','убирала','убирало','убирали','убирал(а)'],
             perf:['убрал','убрала','убрало','убрали','убрал(а)'],
             fut: ['уберу','уберёшь','уберёт','уберём','уберут'] },
  wash:    { past:'washed', pp:'washed', ing:'washing', inf:'мыть',
             pres:['мою','моешь','моет','моем','моют'],
             impf:['мыл','мыла','мыло','мыли','мыл(а)'],
             perf:['помыл','помыла','помыло','помыли','помыл(а)'],
             fut: ['помою','помоешь','помоет','помоем','помоют'] },
  explain: { past:'explained', pp:'explained', ing:'explaining', inf:'объяснять',
             pres:['объясняю','объясняешь','объясняет','объясняем','объясняют'],
             impf:['объяснял','объясняла','объясняло','объясняли','объяснял(а)'],
             perf:['объяснил','объяснила','объяснило','объяснили','объяснил(а)'],
             fut: ['объясню','объяснишь','объяснит','объясним','объяснят'] },
  open:    { past:'opened', pp:'opened', ing:'opening', inf:'открывать',
             pres:['открываю','открываешь','открывает','открываем','открывают'],
             impf:['открывал','открывала','открывало','открывали','открывал(а)'],
             perf:['открыл','открыла','открыло','открыли','открыл(а)'],
             fut: ['открою','откроешь','откроет','откроем','откроют'] },
  close:   { past:'closed', pp:'closed', ing:'closing', inf:'закрывать',
             pres:['закрываю','закрываешь','закрывает','закрываем','закрывают'],
             impf:['закрывал','закрывала','закрывало','закрывали','закрывал(а)'],
             perf:['закрыл','закрыла','закрыло','закрыли','закрыл(а)'],
             fut: ['закрою','закроешь','закроет','закроем','закроют'] },
  finish:  { past:'finished', pp:'finished', ing:'finishing', inf:'заканчивать',
             pres:['заканчиваю','заканчиваешь','заканчивает','заканчиваем','заканчивают'],
             impf:['заканчивал','заканчивала','заканчивало','заканчивали','заканчивал(а)'],
             perf:['закончил','закончила','закончило','закончили','закончил(а)'],
             fut: ['закончу','закончишь','закончит','закончим','закончат'] },
  start:   { past:'started', pp:'started', ing:'starting', inf:'начинать',
             pres:['начинаю','начинаешь','начинает','начинаем','начинают'],
             impf:['начинал','начинала','начинало','начинали','начинал(а)'],
             perf:['начал','начала','начало','начали','начал(а)'],
             fut: ['начну','начнёшь','начнёт','начнём','начнут'] },
  order:   { past:'ordered', pp:'ordered', ing:'ordering', inf:'заказывать',
             pres:['заказываю','заказываешь','заказывает','заказываем','заказывают'],
             impf:['заказывал','заказывала','заказывало','заказывали','заказывал(а)'],
             perf:['заказал','заказала','заказало','заказали','заказал(а)'],
             fut: ['закажу','закажешь','закажет','закажем','закажут'] },
  pay:     { past:'paid', pp:'paid', ing:'paying', inf:'платить',
             pres:['плачу','платишь','платит','платим','платят'],
             impf:['платил','платила','платило','платили','платил(а)'],
             perf:['заплатил','заплатила','заплатило','заплатили','заплатил(а)'],
             fut: ['заплачу','заплатишь','заплатит','заплатим','заплатят'] },
  sell:    { past:'sold', pp:'sold', ing:'selling', inf:'продавать',
             pres:['продаю','продаёшь','продаёт','продаём','продают'],
             impf:['продавал','продавала','продавало','продавали','продавал(а)'],
             perf:['продал','продала','продало','продали','продал(а)'],
             fut: ['продам','продашь','продаст','продадим','продадут'] },
  bring:   { past:'brought', pp:'brought', ing:'bringing', inf:'приносить',
             pres:['приношу','приносишь','приносит','приносим','приносят'],
             impf:['приносил','приносила','приносило','приносили','приносил(а)'],
             perf:['принёс','принесла','принесло','принесли','принёс(ла)'],
             fut: ['принесу','принесёшь','принесёт','принесём','принесут'] },
  help:    { past:'helped', pp:'helped', ing:'helping', inf:'помогать',
             pres:['помогаю','помогаешь','помогает','помогаем','помогают'],
             impf:['помогал','помогала','помогало','помогали','помогал(а)'],
             perf:['помог','помогла','помогло','помогли','помог(ла)'],
             fut: ['помогу','поможешь','поможет','поможем','помогут'] },
  invite:  { past:'invited', pp:'invited', ing:'inviting', inf:'приглашать',
             pres:['приглашаю','приглашаешь','приглашает','приглашаем','приглашают'],
             impf:['приглашал','приглашала','приглашало','приглашали','приглашал(а)'],
             perf:['пригласил','пригласила','пригласило','пригласили','пригласил(а)'],
             fut: ['приглашу','пригласишь','пригласит','пригласим','пригласят'] },
  book:    { past:'booked', pp:'booked', ing:'booking', inf:'бронировать',
             pres:['бронирую','бронируешь','бронирует','бронируем','бронируют'],
             impf:['бронировал','бронировала','бронировало','бронировали','бронировал(а)'],
             perf:['забронировал','забронировала','забронировало','забронировали','забронировал(а)'],
             fut: ['забронирую','забронируешь','забронирует','забронируем','забронируют'] },
  answer:  { past:'answered', pp:'answered', ing:'answering', inf:'отвечать',
             pres:['отвечаю','отвечаешь','отвечает','отвечаем','отвечают'],
             impf:['отвечал','отвечала','отвечало','отвечали','отвечал(а)'],
             perf:['ответил','ответила','ответило','ответили','ответил(а)'],
             fut: ['отвечу','ответишь','ответит','ответим','ответят'] },
  choose:  { past:'chose', pp:'chosen', ing:'choosing', inf:'выбирать',
             pres:['выбираю','выбираешь','выбирает','выбираем','выбирают'],
             impf:['выбирал','выбирала','выбирало','выбирали','выбирал(а)'],
             perf:['выбрал','выбрала','выбрало','выбрали','выбрал(а)'],
             fut: ['выберу','выберешь','выберет','выберем','выберут'] },
  paint:   { past:'painted', pp:'painted', ing:'painting', inf:'красить',
             pres:['крашу','красишь','красит','красим','красят'],
             impf:['красил','красила','красило','красили','красил(а)'],
             perf:['покрасил','покрасила','покрасило','покрасили','покрасил(а)'],
             fut: ['покрашу','покрасишь','покрасит','покрасим','покрасят'] },
  repeat:  { past:'repeated', pp:'repeated', ing:'repeating', inf:'повторять',
             pres:['повторяю','повторяешь','повторяет','повторяем','повторяют'],
             impf:['повторял','повторяла','повторяло','повторяли','повторял(а)'],
             perf:['повторил','повторила','повторило','повторили','повторил(а)'],
             fut: ['повторю','повторишь','повторит','повторим','повторят'] }
};

/* The reporting verbs of "future in the past", in the same past-table shape. */
const reporting = {
  say:    ['сказал','сказала','сказало','сказали','сказал(а)'],
  know:   ['знал','знала','знало','знали','знал(а)'],
  think:  ['думал','думала','думало','думали','думал(а)'],
  expect: ['ожидал','ожидала','ожидало','ожидали','ожидал(а)']
};

const willBe = ['буду','будешь','будет','будем','будут'];

/* 60 scenarios: who does what to what. The Russian object carries its own case
   and preposition, so the templates never have to inflect it. */
const bank = [
  ['i',         'write',   'a short email',      'короткое письмо'],
  ['you',       'read',    'this article',       'эту статью'],
  ['he',        'cook',    'dinner',             'ужин'],
  ['she',       'drink',   'green tea',          'зелёный чай'],
  ['we',        'watch',   'a new film',         'новый фильм'],
  ['they',      'play',    'tennis',             'в теннис'],
  ['brother',   'fix',     'his bike',           'свой велосипед'],
  ['anna',      'learn',   'English',            'английский'],
  ['children',  'build',   'a sandcastle',       'замок из песка'],
  ['team',      'plan',    'the trip',           'поездку'],
  ['friend',    'buy',     'fresh bread',        'свежий хлеб'],
  ['students',  'solve',   'the problem',        'задачу'],
  ['kate',      'call',    'her grandmother',    'своей бабушке'],
  ['david',     'send',    'the document',       'документ'],
  ['parents',   'visit',   'the museum',         'музей'],
  ['doctor',    'check',   'the patient',        'пациента'],
  ['i',         'cook',    'breakfast',          'завтрак'],
  ['she',       'draw',    'a beautiful picture','красивую картину'],
  ['we',        'clean',   'the kitchen',        'кухню'],
  ['neighbours','wash',    'their car',          'свою машину'],
  ['teacher',   'explain', 'the rule',           'правило'],
  ['boss',      'open',    'the office',         'офис'],
  ['girls',     'close',   'the windows',        'окна'],
  ['engineer',  'finish',  'the report',         'отчёт'],
  ['sister',    'start',   'a new course',       'новый курс'],
  ['guests',    'order',   'pizza',              'пиццу'],
  ['max',       'pay',     'for the tickets',    'за билеты'],
  ['mother',    'sell',    'the old sofa',       'старый диван'],
  ['i',         'bring',   'the keys',           'ключи'],
  ['you',       'watch',   'the news',           'новости'],
  ['he',        'order',   'a taxi',             'такси'],
  ['we',        'help',    'our neighbours',     'соседям'],
  ['they',      'invite',  'their friends',      'своих друзей'],
  ['anna',      'book',    'a table',            'столик'],
  ['kate',      'answer',  'the letter',         'на письмо'],
  ['students',  'choose',  'a topic',            'тему'],
  ['brother',   'paint',   'the fence',          'забор'],
  ['doctor',    'repeat',  'the question',       'вопрос'],
  ['children',  'read',    'a fairy tale',       'сказку'],
  ['friend',    'watch',   'the match',          'матч'],
  ['she',       'cook',    'soup',               'суп'],
  ['parents',   'buy',     'a new fridge',       'новый холодильник'],
  ['we',        'write',   'the invitations',    'приглашения'],
  ['david',     'learn',   'Spanish',            'испанский'],
  ['team',      'solve',   'the puzzle',         'головоломку'],
  ['teacher',   'check',   'the homework',       'домашнее задание'],
  ['i',         'call',    'my brother',         'своему брату'],
  ['guests',    'drink',   'coffee',             'кофе'],
  ['boss',      'send',    'the invoice',        'счёт'],
  ['neighbours','plan',    'a party',            'вечеринку'],
  ['sister',    'clean',   'her room',           'свою комнату'],
  ['girls',     'draw',    'a poster',           'плакат'],
  ['max',       'fix',     'the printer',        'принтер'],
  ['mother',    'visit',   'the doctor',         'врача'],
  ['engineer',  'build',   'a bridge',           'мост'],
  ['you',       'open',    'the door',           'дверь'],
  ['he',        'wash',    'the dishes',         'посуду'],
  ['they',      'finish',  'the project',        'проект'],
  ['engineer',  'check',   'the drawings',       'чертежи'],
  ['we',        'invite',  'the whole team',     'всю команду']
];

/* Passive and conditional sentences are written out as pairs: their Russian
   equivalents restructure the clause rather than swapping a verb form. */
const passiveBank = [
  [ ['The report is checked by the manager every morning.','Отчёт проверяется менеджером каждое утро.'],
    ['Dinner is cooked by the chef every evening.','Ужин готовится шеф-поваром каждый вечер.'],
    ['The room is cleaned by the staff every day.','Комната убирается персоналом каждый день.'],
    ['English is taught by our teacher on Mondays.','Английский преподаётся нашим учителем по понедельникам.'],
    ['The bread is baked by the baker every night.','Хлеб выпекается пекарем каждую ночь.'],
    ['The letters are sorted by the postman every morning.','Письма сортируются почтальоном каждое утро.'],
    ['The garden is watered by my father every evening.','Сад поливается моим отцом каждый вечер.'],
    ['These forms are signed by the director every week.','Эти бланки подписываются директором каждую неделю.'],
    ['The shelves are filled by the staff every morning.','Полки заполняются персоналом каждое утро.'],
    ['The bills are paid by my mother every month.','Счета оплачиваются моей мамой каждый месяц.'],
    ['The windows are washed by the cleaner every Friday.','Окна моются уборщицей каждую пятницу.'],
    ['The tickets are booked by my sister every summer.','Билеты бронируются моей сестрой каждое лето.'] ],

  [ ['The report was checked by the manager yesterday.','Отчёт был проверен менеджером вчера.'],
    ['Dinner was cooked by the chef last night.','Ужин был приготовлен шеф-поваром вчера вечером.'],
    ['The room was cleaned by the staff yesterday.','Комната была убрана персоналом вчера.'],
    ['The letter was sent by Anna in the morning.','Письмо было отправлено Анной утром.'],
    ['The bridge was built by the engineers in 1998.','Мост был построен инженерами в 1998 году.'],
    ['The keys were lost by my brother on Sunday.','Ключи были потеряны моим братом в воскресенье.'],
    ['The photos were taken by David last summer.','Фотографии были сделаны Дэвидом прошлым летом.'],
    ['The fence was painted by the neighbours last week.','Забор был покрашен соседями на прошлой неделе.'],
    ['The problem was solved by the students quickly.','Задача была решена студентами быстро.'],
    ['The table was booked by Kate an hour ago.','Столик был забронирован Катей час назад.'],
    ['The invoice was paid by the company on Friday.','Счёт был оплачен компанией в пятницу.'],
    ['The rule was explained by the teacher twice.','Правило было объяснено учительницей дважды.'] ],

  [ ['The report has already been checked by the manager.','Отчёт уже проверен менеджером.'],
    ['Dinner has already been cooked by the chef.','Ужин уже приготовлен шеф-поваром.'],
    ['The room has already been cleaned by the staff.','Комната уже убрана персоналом.'],
    ['The letter has already been sent by Anna.','Письмо уже отправлено Анной.'],
    ['The documents have already been signed by the director.','Документы уже подписаны директором.'],
    ['The table has already been booked by Kate.','Столик уже забронирован Катей.'],
    ['The homework has already been checked by the teacher.','Домашнее задание уже проверено учительницей.'],
    ['The fence has already been painted by my brother.','Забор уже покрашен моим братом.'],
    ['The invitations have already been written by us.','Приглашения уже написаны нами.'],
    ['The old sofa has already been sold by my mother.','Старый диван уже продан моей мамой.'],
    ['The windows have already been washed by the cleaner.','Окна уже вымыты уборщицей.'],
    ['The project has already been finished by the team.','Проект уже завершён командой.'] ],

  [ ['The report will be checked by the manager tomorrow.','Отчёт будет проверен менеджером завтра.'],
    ['Dinner will be cooked by the chef tonight.','Ужин будет приготовлен шеф-поваром сегодня вечером.'],
    ['The room will be cleaned by the staff tomorrow.','Комната будет убрана персоналом завтра.'],
    ['The letter will be sent by Anna next week.','Письмо будет отправлено Анной на следующей неделе.'],
    ['The bridge will be built by the engineers next year.','Мост будет построен инженерами в следующем году.'],
    ['The invoice will be paid by the company on Monday.','Счёт будет оплачен компанией в понедельник.'],
    ['The topic will be chosen by the students on Friday.','Тема будет выбрана студентами в пятницу.'],
    ['The tickets will be booked by my sister in May.','Билеты будут забронированы моей сестрой в мае.'],
    ['The rule will be explained by the teacher again.','Правило будет объяснено учительницей снова.'],
    ['The keys will be brought by my friend in an hour.','Ключи будут принесены моим другом через час.'],
    ['The windows will be washed by the cleaner on Friday.','Окна будут вымыты уборщицей в пятницу.'],
    ['The project will be finished by the team in June.','Проект будет завершён командой в июне.'] ]
];

const conditionalBank = [
  [ ['If water reaches 100 degrees, it boils.','Если вода достигает 100 градусов, она закипает.'],
    ['If people do not sleep, they feel tired.','Если люди не спят, они чувствуют усталость.'],
    ['If I drink coffee late, I do not sleep well.','Если я пью кофе поздно, я плохо сплю.'],
    ['If the sun sets, it gets dark.','Если солнце садится, становится темно.'],
    ['If you heat ice, it melts.','Если нагреть лёд, он тает.'],
    ['If children eat well, they grow quickly.','Если дети хорошо едят, они быстро растут.'],
    ['If it rains, the streets get wet.','Если идёт дождь, улицы становятся мокрыми.'],
    ['If you press this button, the light goes on.','Если нажать эту кнопку, свет включается.'],
    ['If plants get no water, they die.','Если растения не получают воду, они погибают.'],
    ['If the wind blows, the windows rattle.','Если дует ветер, окна дребезжат.'],
    ['If we work together, everything goes faster.','Если мы работаем вместе, всё идёт быстрее.'],
    ['If the shop closes early, we buy nothing.','Если магазин закрывается рано, мы ничего не покупаем.'] ],

  [ ['If it rains tomorrow, we will stay at home.','Если завтра пойдёт дождь, мы останемся дома.'],
    ['If she calls me, I will answer.','Если она позвонит мне, я отвечу.'],
    ['If they finish early, they will join us.','Если они закончат раньше, они присоединятся к нам.'],
    ['If you study tonight, you will pass the test.','Если ты позанимаешься вечером, ты сдашь тест.'],
    ['If the bus is late, we will take a taxi.','Если автобус опоздает, мы возьмём такси.'],
    ['If Anna books a table, we will have dinner there.','Если Анна забронирует столик, мы поужинаем там.'],
    ['If the weather is good, the children will play outside.','Если погода будет хорошей, дети будут играть на улице.'],
    ['If my brother fixes the bike, I will ride to work.','Если мой брат починит велосипед, я поеду на работу.'],
    ['If you help me, we will finish the project today.','Если ты поможешь мне, мы закончим проект сегодня.'],
    ['If the shop is open, I will buy fresh bread.','Если магазин будет открыт, я куплю свежий хлеб.'],
    ['If they invite us, we will bring a cake.','Если они пригласят нас, мы принесём торт.'],
    ['If the doctor is free, he will check the patient.','Если доктор будет свободен, он осмотрит пациента.'] ],

  [ ['If I had more time, I would learn Spanish.','Если бы у меня было больше времени, я бы учил испанский.'],
    ['If she lived closer, she would visit us more often.','Если бы она жила ближе, она бы навещала нас чаще.'],
    ['If we had a car, we would travel more.','Если бы у нас была машина, мы бы больше путешествовали.'],
    ['If he knew the answer, he would tell us.','Если бы он знал ответ, он бы сказал нам.'],
    ['If I were you, I would talk to the teacher.','На твоём месте я бы поговорил с учительницей.'],
    ['If they had a bigger flat, they would invite everyone.','Если бы у них была квартира побольше, они бы пригласили всех.'],
    ['If the weather were warmer, the children would swim.','Если бы погода была теплее, дети бы плавали.'],
    ['If my friend spoke English, he would work abroad.','Если бы мой друг говорил по-английски, он бы работал за границей.'],
    ['If I lived in Paris, I would draw every day.','Если бы я жил в Париже, я бы рисовал каждый день.'],
    ['If she had a piano, she would play in the evenings.','Если бы у неё было пианино, она бы играла по вечерам.'],
    ['If we knew the way, we would not use the map.','Если бы мы знали дорогу, мы бы не пользовались картой.'],
    ['If the tickets were cheaper, my parents would fly home.','Если бы билеты были дешевле, мои родители полетели бы домой.'] ],

  [ ['If she had left earlier, she would have caught the train.','Если бы она вышла раньше, она бы успела на поезд.'],
    ['If I had known about the meeting, I would have come.','Если бы я знал о встрече, я бы пришёл.'],
    ['If they had studied more, they would have passed the exam.','Если бы они больше занимались, они бы сдали экзамен.'],
    ['If we had booked a table, we would have eaten there.','Если бы мы забронировали столик, мы бы поужинали там.'],
    ['If he had asked me, I would have helped him.','Если бы он попросил меня, я бы помог ему.'],
    ['If the shop had been open, I would have bought bread.','Если бы магазин был открыт, я бы купил хлеб.'],
    ['If you had called me, I would have answered.','Если бы ты позвонил мне, я бы ответил.'],
    ['If it had not rained, the children would have played outside.','Если бы не было дождя, дети играли бы на улице.'],
    ['If my brother had fixed the bike, I would have ridden to work.','Если бы мой брат починил велосипед, я бы поехал на работу.'],
    ['If they had invited us, we would have brought a cake.','Если бы они пригласили нас, мы бы принесли торт.'],
    ['If the team had worked faster, they would have finished the project.','Если бы команда работала быстрее, они бы закончили проект.'],
    ['If she had taken the map, she would have found the house.','Если бы она взяла карту, она бы нашла дом.'] ]
];
let selected = 0, current = 0, built = [], ordered = [], attempts = 0, right = 0, wrong = 0, hintStep = 0, activeExercise = null;
const allTenses = tenseGroups.flatMap(([,t])=>t);
const stored = JSON.parse(localStorage.getItem('tenselab-progress') || '{}');
const defaultProfile = {name:'Мой прогресс', dailyGoal:10, completions:{}, totalXP:0};
const profile = {...defaultProfile, ...JSON.parse(localStorage.getItem('tenselab-profile') || '{}')};
profile.completions ||= {};
function dayKey(offset=0){const d=new Date();d.setHours(12,0,0,0);d.setDate(d.getDate()+offset);return d.toISOString().slice(0,10)}
function todayCorrect(){return profile.completions[dayKey()] || 0}
function currentStreak(){let days=0;while(profile.completions[dayKey(-days)]>0) days++;return days}
function saveProfile(){localStorage.setItem('tenselab-profile',JSON.stringify(profile))}
function recordCorrect(){const key=dayKey();profile.completions[key]=(profile.completions[key]||0)+1;profile.totalXP+=10;saveProfile()}
function titleCase(text) { return text.charAt(0).toUpperCase() + text.slice(1) }

function thirdPerson(verb) {
  if (/[^aeiou]y$/.test(verb)) return verb.slice(0, -1) + 'ies';
  if (/(s|x|z|ch|sh|o)$/.test(verb)) return verb + 'es';
  return verb + 's';
}

/* English agreement: only the "s" pattern takes the third-person -s, and only
   "I" pairs am/was with a bare verb. */
function englishForms(who) {
  const third = who.agr === 's';
  return {
    third,
    be: who.agr === 'i' ? 'am' : third ? 'is' : 'are',
    bePast: who.agr === 'i' || third ? 'was' : 'were',
    have: third ? 'has' : 'have'
  };
}

const pastSlot = { m: 0, f: 1, n: 2, pl: 3, x: 4 };
function ruPast(table, who) { return table[pastSlot[who.gender]] }
function ruConjugate(table, who) { return table[who.slot] }

function distractorsFor(tense, who, key, correct) {
  const verb = verbs[key], en = englishForms(who);
  const third = en.third ? thirdPerson(key) : key;
  const pool = {
    'Present Simple': [en.be, verb.ing, en.have, verb.pp],
    'Present Continuous': [third, en.have, verb.pp],
    'Present Perfect': [third, en.be, verb.ing],
    'Present Perfect Continuous': [third, en.be, verb.pp],
    'Past Simple': [en.bePast, verb.ing, 'had', verb.pp],
    'Past Continuous': [verb.past, 'had', verb.pp],
    'Past Perfect': [verb.past, en.bePast, verb.ing],
    'Past Perfect Continuous': [verb.past, en.bePast, verb.ing],
    'Future Simple': ['would', 'be', verb.ing],
    'Future Continuous': ['have', verb.pp, key],
    'Future Perfect': ['be', verb.ing, key],
    'Future Perfect Continuous': ['be', verb.ing, key],
    'Future in the Past Simple': ['will', key, 'has', verb.pp],
    'Future in the Past Continuous': ['will', 'be', verb.ing],
    'Future in the Past Perfect': ['will', 'have', verb.pp],
    'Future in the Past Perfect Continuous': ['will', 'be', verb.ing]
  }[tense] || ['is', 'was', 'will', 'have'];
  return [...new Set(pool.filter(word => !correct.includes(word)))].slice(0, 4);
}

function sentenceFor(index, n) {
  const tense = allTenses[index][0];
  const scenario = bank[n % bank.length];
  const who = people[scenario[0]], key = scenario[1], obj = scenario[2], objRu = scenario[3];
  const verb = verbs[key], en = englishForms(who);
  let answer, translation;

  if (index >= 16 && index < 20) {
    const list = passiveBank[index - 16];
    [answer, translation] = list[n % list.length];
  } else if (index >= 20) {
    const list = conditionalBank[index - 20];
    [answer, translation] = list[n % list.length];
  } else {
    const s = who.en, low = who.low, pron = who.pron;
    const v = en.third ? thirdPerson(key) : key;
    /* Russian: `now` is the imperfective present, `was` the imperfective past
       (continuous), `did` the perfective past (completed), `will` the
       perfective future. `willBe + infinitive` builds the imperfective future. */
    const ru = who.ru, Ru = titleCase(who.ru);
    const now = ruConjugate(verb.pres, who);
    const was = ruPast(verb.impf, who);
    const did = ruPast(verb.perf, who);
    const will = ruConjugate(verb.fut, who);
    const shall = willBe[who.slot] + ' ' + verb.inf;
    const said = ruPast(reporting.say, who);
    const knew = ruPast(reporting.know, who);
    const thought = ruPast(reporting.think, who);
    const expected = ruPast(reporting.expect, who);

    [answer, translation] = {
      'Present Simple': [
        `${s} ${v} ${obj} every morning.`,
        `Каждое утро ${ru} ${now} ${objRu}.`],
      'Present Continuous': [
        `${s} ${en.be} ${verb.ing} ${obj} right now.`,
        `Сейчас ${ru} ${now} ${objRu}.`],
      'Present Perfect': [
        `${s} ${en.have} ${verb.pp} ${obj} already.`,
        `${Ru} уже ${did} ${objRu}.`],
      'Present Perfect Continuous': [
        `${s} ${en.have} been ${verb.ing} ${obj} for two hours.`,
        `${Ru} ${now} ${objRu} уже два часа.`],
      'Past Simple': [
        `${s} ${verb.past} ${obj} yesterday.`,
        `Вчера ${ru} ${did} ${objRu}.`],
      'Past Continuous': [
        `${s} ${en.bePast} ${verb.ing} ${obj} at 6 pm.`,
        `В шесть вечера ${ru} ${was} ${objRu}.`],
      'Past Perfect': [
        `${s} had ${verb.pp} ${obj} before the meeting.`,
        `${Ru} ${did} ${objRu} до встречи.`],
      'Past Perfect Continuous': [
        `${s} had been ${verb.ing} ${obj} for two hours before the meeting.`,
        `${Ru} ${was} ${objRu} два часа до встречи.`],
      'Future Simple': [
        `${s} will ${key} ${obj} tomorrow.`,
        `Завтра ${ru} ${will} ${objRu}.`],
      'Future Continuous': [
        `${s} will be ${verb.ing} ${obj} at this time tomorrow.`,
        `Завтра в это время ${ru} ${shall} ${objRu}.`],
      'Future Perfect': [
        `${s} will have ${verb.pp} ${obj} by Friday.`,
        `К пятнице ${ru} уже ${will} ${objRu}.`],
      'Future Perfect Continuous': [
        `${s} will have been ${verb.ing} ${obj} for two hours by Friday.`,
        `К пятнице ${ru} ${shall} ${objRu} уже два часа.`],
      'Future in the Past Simple': [
        `Yesterday, ${low} said that ${pron} would ${key} ${obj} the next day.`,
        `Вчера ${ru} ${said}, что на следующий день ${will} ${objRu}.`],
      'Future in the Past Continuous': [
        `Yesterday, ${low} knew that ${pron} would be ${verb.ing} ${obj} at that time the next day.`,
        `Вчера ${ru} ${knew}, что на следующий день ${shall} ${objRu}.`],
      'Future in the Past Perfect': [
        `Yesterday, ${low} thought that ${pron} would have ${verb.pp} ${obj} by Friday.`,
        `Вчера ${ru} ${thought}, что к пятнице уже ${will} ${objRu}.`],
      'Future in the Past Perfect Continuous': [
        `Yesterday, ${low} expected that ${pron} would have been ${verb.ing} ${obj} for two hours by then.`,
        `Вчера ${ru} ${expected}, что к тому времени ${shall} ${objRu} уже два часа.`]
    }[tense];
  }

  const tokens = answer.replace(/[.,]/g, '').split(' ');
  return { answer, translation, tokens, distractors: distractorsFor(tense, who, key, tokens) };
}
function renderNav(){let out='';tenseGroups.forEach(([group, items])=>{out+=`<div class="nav-section"><div class="nav-section-title">${group}</div>`;items.forEach(item=>{const i=allTenses.indexOf(item),done=stored[i]?.done;out+=`<button class="tense-link ${i===selected?'active':''} ${done?'done':''}" data-index="${i}"><i class="tense-dot"></i>${item[0].replace('Future in the Past ','F. in Past ')}</button>`});out+='</div>'});$('#tenseList').innerHTML=out;document.querySelectorAll('.tense-link').forEach(b=>b.onclick=()=>switchTense(+b.dataset.index));$('#courseProgress').textContent=`${Object.values(stored).filter(x=>x.done).length} / 24`}
function switchTense(i){selected=i;current=stored[i]?.position||0;built=[];hintStep=0;activeExercise=null;renderNav();renderLesson();closeDrawer()}
function shuffle(a){return [...a].sort(()=>Math.random()-.5)}
function currentExercise(){if(!activeExercise)activeExercise=sentenceFor(selected,Math.floor(Math.random()*bank.length));return activeExercise}
function renderLesson(){const t=allTenses[selected], ex=currentExercise();ordered=shuffle([...ex.tokens,...ex.distractors]);built=[];hintStep=0;$('#tenseTitle').textContent=t[0];$('#crumbTense').textContent=t[0];$('#tenseDescription').textContent=t[1];$('#difficultyBadge').textContent=t[2];$('#translation').textContent=ex.translation;$('#taskNumber').textContent=String(current+1).padStart(2,'0');const pct=Math.round(current/20*100);$('#progressFill').style.width=pct+'%';$('#percentProgress').textContent=pct+'%';$('#progressBar').setAttribute('aria-valuenow',pct);$('#trainerCard').classList.remove('success-card');$('#answerZone').classList.remove('shake');clearFeedback();renderWords();renderAnswer();updateStats()}
function renderWords(){const ex=currentExercise();$('#wordBank').innerHTML=ordered.map((word,i)=>`<button class="word ${built.includes(i)?'used':''}" data-i="${i}">${word}</button>`).join('');document.querySelectorAll('.word').forEach(b=>b.onclick=()=>{built.push(+b.dataset.i);renderWords();renderAnswer();clearFeedback()})}
function renderAnswer(){const z=$('#answerZone');if(!built.length){z.innerHTML='<span class="answer-placeholder">Нажимайте на слова ниже</span>';z.classList.remove('has-answer');return}z.classList.add('has-answer');z.innerHTML=built.map((i,k)=>`<button class="answer-token" data-k="${k}">${ordered[i]}</button>`).join('');document.querySelectorAll('.answer-token').forEach(b=>b.onclick=()=>{built.splice(+b.dataset.k,1);renderWords();renderAnswer()})}
function clearFeedback(){const f=$('#feedback');f.className='feedback';f.textContent=''}
function check(){const ex=currentExercise();if(!built.length){showToast('Сначала соберите предложение');return}const given=built.map(i=>ordered[i]).join(' ');if(given===ex.tokens.join(' ')){right++;recordCorrect();current++;activeExercise=null;stored[selected]={position:current,done:current>=20};localStorage.setItem('tenselab-progress',JSON.stringify(stored));const f=$('#feedback');f.className='feedback show success';f.textContent='Верно! Отличная структура предложения.';updateStats();haptic([12,40,18]);$('#trainerCard').classList.add('success-card');setTimeout(()=>{if(current>=20){showToast('Время освоено! Выберите следующее.');current=0;stored[selected]={position:0,done:true};localStorage.setItem('tenselab-progress',JSON.stringify(stored));renderNav()}renderLesson()},850)}else{wrong++;attempts++;const f=$('#feedback');f.className='feedback show error';f.textContent='Почти. Проверьте порядок слов, маркер времени и форму глагола — попробуйте ещё раз.';haptic(60);const z=$('#answerZone');z.classList.remove('shake');void z.offsetWidth;z.classList.add('shake');setTimeout(()=>z.classList.remove('shake'),600);updateStats()}}
function updateStats(){const done=right+wrong,daily=todayCorrect(),goal=profile.dailyGoal,streak=currentStreak();$('#xpCount').textContent=profile.totalXP;$('#streakCount').textContent=streak;$('#accuracyValue').textContent=done?Math.round(right/done*100)+'%':'—';$('#accuracySub').textContent=done?`${right} верно · ${wrong} ошибок`:'Начните практику';$('#dailyFill').style.width=Math.min(daily/goal*100,100)+'%';$('#dailyCount').textContent=`${daily} / ${goal}`;$('#dailyGoalText').textContent=`${goal} правильных предложений`;$('#profileName').textContent=profile.name;$('#profileStreak').textContent=streak?`Серия: ${streak} ${streak===1?'день':'дней'} 🔥`:'Серия начнётся сегодня';$('#avatarLetters').textContent=profile.name==='Мой прогресс'?'Я':profile.name.trim().slice(0,2).toUpperCase();$('#levelBadge').textContent=Math.floor(profile.totalXP/250)+1}
function hint(){const ex=currentExercise();if(hintStep>=ex.tokens.length){showToast('Все слова уже показаны');return}const needed=ex.tokens[hintStep];const idx=ordered.findIndex((w,i)=>w===needed&&!built.includes(i));if(idx>=0){built.push(idx);hintStep++;renderWords();renderAnswer();showToast(`Подсказка: «${needed}»`)} }
function listen(){const ex=currentExercise();if('speechSynthesis' in window){speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(ex.answer);u.lang='en-US';u.rate=.82;speechSynthesis.speak(u)}else showToast('Озвучка не поддерживается в этом браузере')}
let toastTimer;function showToast(s){const t=$('#toast');t.textContent=s;t.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('visible'),2400)}
async function shareResult(){const daily=todayCorrect(),streak=currentStreak(),text=`Мой результат в TenseLab: ${daily} из ${profile.dailyGoal} правильных предложений сегодня, серия — ${streak} дн. 🔥`;if(navigator.share){try{await navigator.share({title:'TenseLab',text});return}catch(error){if(error.name==='AbortError')return}}try{if(navigator.clipboard)await navigator.clipboard.writeText(text);else throw new Error('No clipboard');showToast('Результат скопирован') }catch(error){const area=document.createElement('textarea');area.value=text;document.body.append(area);area.select();document.execCommand('copy');area.remove();showToast('Результат скопирован')}}

/* ==========================================================================
   Fluid interaction layer
   Feedback lands on pointer-down, drags track the finger 1:1, releases animate
   to where the gesture was going, and every motion has a reduced-motion
   equivalent. See the notes in styles.css for the matching curves.
   ========================================================================== */

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
const wideLayout = matchMedia('(min-width: 900px)');
const sidebar = $('#sidebar'), scrim = $('#scrim'), menuButton = $('#menuButton'), topbar = $('#topbar');

function haptic(pattern) {
  if (navigator.vibrate && !reduceMotion.matches) navigator.vibrate(pattern);
}

/* Apple's momentum projection: where would this flick come to rest? */
function project(velocity, deceleration = 0.998) {
  return (velocity / 1000) * deceleration / (1 - deceleration);
}

/* Past a boundary the surface resists progressively instead of stopping dead. */
function rubberband(overshoot, dimension, constant = 0.55) {
  return (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot));
}

/* -- Drawer ---------------------------------------------------------------- */

let drawerOpen = false;
let drag = null;

function applyDrawerState() {
  sidebar.classList.toggle('open', drawerOpen);
  sidebar.style.translate = '';
  sidebar.inert = !drawerOpen;
  sidebar.setAttribute('aria-hidden', String(!drawerOpen));
  menuButton.setAttribute('aria-expanded', String(drawerOpen));
  scrim.style.opacity = '';
  scrim.classList.toggle('visible', drawerOpen);
  document.body.classList.toggle('no-scroll', drawerOpen);
}

function openDrawer() {
  if (wideLayout.matches || drawerOpen) return;
  drawerOpen = true;
  applyDrawerState();
  (sidebar.querySelector('.tense-link.active') || sidebar.querySelector('button, a'))?.focus({ preventScroll: true });
}

function closeDrawer({ restoreFocus = false } = {}) {
  if (!drawerOpen) return;
  drawerOpen = false;
  applyDrawerState();
  if (restoreFocus) menuButton.focus({ preventScroll: true });
}

function syncLayout() {
  if (wideLayout.matches) {
    drawerOpen = false;
    sidebar.classList.remove('open');
    sidebar.style.translate = '';
    sidebar.inert = false;
    sidebar.removeAttribute('aria-hidden');
    scrim.classList.remove('visible');
    document.body.classList.remove('no-scroll');
  } else {
    applyDrawerState();
  }
}

sidebar.addEventListener('pointerdown', event => {
  if (wideLayout.matches || !drawerOpen || !event.isPrimary) return;
  drag = { id: event.pointerId, x0: event.clientX, y0: event.clientY, dx: 0, axis: null, samples: [[event.clientX, event.timeStamp]] };
});

sidebar.addEventListener('pointermove', event => {
  if (!drag || event.pointerId !== drag.id) return;
  const dx = event.clientX - drag.x0, dy = event.clientY - drag.y0;
  if (!drag.axis) {
    /* Horizontal dismiss and vertical scroll are both live until intent is clear. */
    if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
    if (Math.abs(dy) >= Math.abs(dx)) { drag = null; return; }
    drag.axis = 'x';
    sidebar.setPointerCapture(drag.id);
    sidebar.classList.add('dragging');
  }
  drag.samples.push([event.clientX, event.timeStamp]);
  if (drag.samples.length > 5) drag.samples.shift();
  const width = sidebar.offsetWidth;
  drag.dx = dx <= 0 ? dx : rubberband(dx, width);
  sidebar.style.translate = drag.dx + 'px 0';
  scrim.style.opacity = String(Math.max(0, Math.min(1, 1 + drag.dx / width)));
});

function endDrag(event) {
  if (!drag || event.pointerId !== drag.id) return;
  const committed = drag.axis === 'x', dx = drag.dx, width = sidebar.offsetWidth;
  let velocity = 0;
  const [first, last] = [drag.samples[0], drag.samples[drag.samples.length - 1]];
  if (last[1] > first[1]) velocity = (last[0] - first[0]) / (last[1] - first[1]) * 1000;
  drag = null;
  sidebar.classList.remove('dragging');
  if (!committed) return;
  /* Land where the throw was headed, not where the finger happened to stop. */
  if (dx + project(velocity) < -width / 2) {
    haptic(8);
    closeDrawer();
  } else {
    applyDrawerState();
  }
}

sidebar.addEventListener('pointerup', endDrag);
sidebar.addEventListener('pointercancel', endDrag);
wideLayout.addEventListener('change', syncLayout);

menuButton.onclick = () => (drawerOpen ? closeDrawer({ restoreFocus: true }) : openDrawer());
scrim.onclick = () => closeDrawer({ restoreFocus: true });

/* -- ZoomLock ---------------------------------------------------------------
   Tapping words quickly reads as a double-tap, and a second finger resting on
   the word bank reads as a pinch. Either one leaves the viewport scaled with no
   obvious way back, in a layout that already fits the screen. So the app owns
   its scale. Text still scales: every dimension in the stylesheet is relative,
   so the OS and browser font-size settings work as before. */
function installZoomLock() {
  const block = event => event.preventDefault();

  /* WebKit pinch gestures never surface as touch events. */
  for (const type of ['gesturestart', 'gesturechange', 'gestureend']) {
    document.addEventListener(type, block, { passive: false });
  }
  document.addEventListener('dblclick', block, { passive: false });
  document.addEventListener('touchstart', event => {
    if (event.touches.length > 1) event.preventDefault();
  }, { passive: false });

  let lastTap = 0, lastX = 0, lastY = 0;
  document.addEventListener('touchend', event => {
    const touch = event.changedTouches[0];
    if (!touch) return;
    const nearby = Math.abs(touch.clientX - lastX) < 30 && Math.abs(touch.clientY - lastY) < 30;
    /* Two quick taps in one spot is the zoom gesture. Two quick taps on
       different words is just fast play, and has to keep its click. Controls
       are exempt outright — touch-action already covers them. */
    if (event.timeStamp - lastTap < 320 && nearby && !event.target.closest('button, a, input')) {
      event.preventDefault();
    }
    lastTap = event.timeStamp;
    lastX = touch.clientX;
    lastY = touch.clientY;
  }, { passive: false });

  document.documentElement.classList.add('zoom-locked');
}

/* -- Dialogs --------------------------------------------------------------- */

let lastFocused = null;

function openDialog(id) {
  const dialog = $('#' + id);
  lastFocused = document.activeElement;
  dialog.classList.remove('closing');
  dialog.showModal();
  return dialog;
}

function dismissDialog(dialog) {
  if (!dialog.open || dialog.classList.contains('closing')) return;
  if (reduceMotion.matches) { dialog.close(); return; }
  /* Leave along the path it arrived on. */
  dialog.classList.add('closing');
  dialog.addEventListener('animationend', () => {
    dialog.classList.remove('closing');
    dialog.close();
  }, { once: true });
}

document.querySelectorAll('dialog').forEach(dialog => {
  dialog.addEventListener('cancel', event => { event.preventDefault(); dismissDialog(dialog); });
  dialog.addEventListener('pointerdown', event => { if (event.target === dialog) dismissDialog(dialog); });
  dialog.addEventListener('close', () => { lastFocused?.focus?.({ preventScroll: true }); lastFocused = null; });
});

function syncGoalOptions() {
  document.querySelectorAll('.goal-options button')
    .forEach(button => button.setAttribute('aria-pressed', String(+button.dataset.goal === profile.dailyGoal)));
}

/* -- Bindings -------------------------------------------------------------- */

$('#checkButton').onclick = check;
$('#clearButton').onclick = () => { built = []; renderWords(); renderAnswer(); clearFeedback() };
$('#shuffleButton').onclick = () => { built = []; ordered = shuffle(ordered); renderWords(); renderAnswer(); clearFeedback() };
$('#hintButton').onclick = hint;
$('#listenButton').onclick = listen;
$('#shareButton').onclick = shareResult;

$('#formulaButton').onclick = () => {
  const tense = allTenses[selected];
  $('#dialogTitle').textContent = tense[0];
  $('#dialogUsage').textContent = tense[1];
  $('#dialogFormula').textContent = tense[3];
  const examples = $('#dialogExamples');
  examples.replaceChildren(Object.assign(document.createElement('b'), { textContent: 'ПРИМЕР' }), tense[4]);
  openDialog('formulaDialog');
};
$('#closeDialog').onclick = () => dismissDialog($('#formulaDialog'));

$('#dailyGoalButton').onclick = () => { syncGoalOptions(); openDialog('goalDialog') };
$('#profileButton').onclick = () => {
  $('#profileNameInput').value = profile.name === defaultProfile.name ? '' : profile.name;
  openDialog('profileDialog');
};

function saveProfileName() {
  const name = $('#profileNameInput').value.trim();
  if (name) profile.name = name;
  saveProfile();
  updateStats();
  dismissDialog($('#profileDialog'));
}
$('#saveProfileButton').onclick = saveProfileName;
$('#profileNameInput').addEventListener('keydown', event => { if (event.key === 'Enter') saveProfileName() });

document.querySelectorAll('.goal-options button').forEach(button => button.onclick = () => {
  profile.dailyGoal = +button.dataset.goal;
  saveProfile();
  updateStats();
  syncGoalOptions();
  dismissDialog($('#goalDialog'));
  showToast('Дневная цель обновлена');
});
document.querySelectorAll('[data-close]').forEach(button => button.onclick = () => dismissDialog($('#' + button.dataset.close)));

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && drawerOpen) { closeDrawer({ restoreFocus: true }); return }
  if (event.key !== 'Enter') return;
  if (document.querySelector('dialog[open]') || event.target.tagName === 'INPUT') return;
  check();
});

/* The divider under the toolbar only earns its keep once content slides beneath it. */
addEventListener('scroll', () => topbar.classList.toggle('scrolled', scrollY > 6), { passive: true });
/* iOS only applies :active styling to non-anchor elements once touch is observed. */
document.addEventListener('touchstart', () => {}, { passive: true });

/* An update never interrupts a sentence in progress: it swaps in the moment the
   app goes to the background, and is live on the next launch. */
function applyUpdateWhenBackgrounded(registration) {
  const apply = () => {
    if (document.visibilityState !== 'hidden') return;
    document.removeEventListener('visibilitychange', apply);
    registration.waiting?.postMessage('skip-waiting');
  };
  document.addEventListener('visibilitychange', apply);
}

if ('serviceWorker' in navigator) {
  addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').then(registration => {
      registration.addEventListener('updatefound', () => {
        const worker = registration.installing;
        worker?.addEventListener('statechange', () => {
          if (worker.state === 'installed' && navigator.serviceWorker.controller) {
            showToast('Обновление загружено — включится при следующем запуске');
            applyUpdateWhenBackgrounded(registration);
          }
        });
      });
    }).catch(() => {});
  });
}

scrim.hidden = false;
installZoomLock();
syncLayout();
syncGoalOptions();
renderNav();
renderLesson();
