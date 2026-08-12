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
const subjects = [
  ['I','я','write','wrote','written','writing','a short email','короткое письмо','my sister'],
  ['You','ты','read','read','read','reading','this article','эту статью','the teacher'],
  ['He','он','cook','cooked','cooked','cooking','dinner','ужин','his friends'],
  ['She','она','drink','drank','drunk','drinking','tea','чай','her parents'],
  ['We','мы','watch','watched','watched','watching','a new film','новый фильм','our neighbours'],
  ['They','они','play','played','played','playing','tennis','теннис','the coach'],
  ['My brother','мой брат','fix','fixed','fixed','fixing','his bike','свой велосипед','his father'],
  ['Anna','Анна','learn','learned','learned','learning','English','английский','her tutor'],
  ['The children','дети','build','built','built','building','a tower','башню','their mother'],
  ['Our team','наша команда','plan','planned','planned','planning','the trip','поездку','the manager'],
  ['My friend','мой друг','buy','bought','bought','buying','fresh bread','свежий хлеб','his wife'],
  ['The students','студенты','solve','solved','solved','solving','the problem','задачу','their professor'],
  ['Kate','Катя','call','called','called','calling','her grandmother','своей бабушке','her brother'],
  ['The cat','кот','sleep','slept','slept','sleeping','on the sofa','на диване','the dog'],
  ['David','Дэвид','send','sent','sent','sending','the document','документ','his client'],
  ['My parents','мои родители','visit','visited','visited','visiting','the museum','музей','our family'],
  ['The doctor','доктор','check','checked','checked','checking','the patient','пациента','the nurse'],
  ['I','я','prepare','prepared','prepared','preparing','breakfast','завтрак','my family'],
  ['She','она','draw','drew','drawn','drawing','a beautiful picture','красивую картину','her teacher'],
  ['We','мы','meet','met','met','meeting','at the station','на станции','our colleagues']
];
const timeMarkers = ['every morning','right now','already','for two hours','yesterday','at 6 pm','before the meeting','since Monday','tomorrow','at this time tomorrow','by Friday','for three years','the next day','at that time','by the following week','for two hours by then','every day','last night','recently','next month'];
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
function isThird(s){return !['I','You','We','They','The children','The students','My parents'].includes(s)}
function simpleVerb(x){return isThird(x[0]) ? (x[2].endsWith('y') ? x[2].slice(0,-1)+'ies' : x[2]+(x[2].endsWith('s')||x[2].endsWith('x')?'es':'s')) : x[2]}
function sentenceFor(index, n){
  const t = allTenses[index][0], x=subjects[n], marker=timeMarkers[n]; const s=x[0], v=x[2], p=x[3], pp=x[4], ing=x[5], o=x[6];
  const beNow=isThird(s)?'is':(['I'].includes(s)?'am':'are'), bePast=isThird(s)?'was':'were', have=isThird(s)?'has':'have';
  let words=[], ru='';
  const core = {
    'Present Simple':()=>[`${s} ${simpleVerb(x)} ${o} ${marker}.`,`[${x[1]}] ${ruVerb(x)} ${x[7]} ${markerRu(marker)}.`],
    'Present Continuous':()=>[`${s} ${beNow} ${ing} ${o} ${marker}.`,`[${x[1]}] сейчас ${ruVerb(x)} ${x[7]}.`],
    'Present Perfect':()=>[`${s} ${have} ${pp} ${o} ${marker}.`,`[${x[1]}] уже ${ruVerbPast(x)} ${x[7]}.`],
    'Present Perfect Continuous':()=>[`${s} ${have} been ${ing} ${o} ${marker}.`,`[${x[1]}] ${ruVerb(x)} ${x[7]} уже два часа.`],
    'Past Simple':()=>[`${s} ${p} ${o} ${marker}.`,`Вчера [${x[1]}] ${ruVerbPast(x)} ${x[7]}.`],
    'Past Continuous':()=>[`${s} ${bePast} ${ing} ${o} ${marker}.`,`В шесть вечера [${x[1]}] ${ruVerb(x)} ${x[7]}.`],
    'Past Perfect':()=>[`${s} had ${pp} ${o} ${marker}.`,`[${x[1]}] уже ${ruVerbPast(x)} ${x[7]} до встречи.`],
    'Past Perfect Continuous':()=>[`${s} had been ${ing} ${o} ${marker}.`,`[${x[1]}] ${ruVerb(x)} ${x[7]} уже два часа до встречи.`],
    'Future Simple':()=>[`${s} will ${v} ${o} ${marker}.`,`Завтра [${x[1]}] ${ruVerbFuture(x)} ${x[7]}.`],
    'Future Continuous':()=>[`${s} will be ${ing} ${o} ${marker}.`,`В это время завтра [${x[1]}] будет ${ruVerb(x)} ${x[7]}.`],
    'Future Perfect':()=>[`${s} will have ${pp} ${o} ${marker}.`,`К пятнице [${x[1]}] уже ${ruVerbFuturePast(x)} ${x[7]}.`],
    'Future Perfect Continuous':()=>[`${s} will have been ${ing} ${o} ${marker}.`,`К тому времени [${x[1]}] будет ${ruVerb(x)} ${x[7]} уже три года.`],
    'Future in the Past Simple':()=>[`${s} would ${v} ${o} ${marker}.`,`[${x[1]}] сказал(а), что ${ruVerbFuture(x)} ${x[7]}.`],
    'Future in the Past Continuous':()=>[`${s} would be ${ing} ${o} ${marker}.`,`[${x[1]}] знал(а), что будет ${ruVerb(x)} ${x[7]}.`],
    'Future in the Past Perfect':()=>[`${s} would have ${pp} ${o} ${marker}.`,`[${x[1]}] думал(а), что уже ${ruVerbFuturePast(x)} ${x[7]}.`],
    'Future in the Past Perfect Continuous':()=>[`${s} would have been ${ing} ${o} ${marker}.`,`[${x[1]}] ожидал(а), что будет ${ruVerb(x)} ${x[7]} два часа.`],
  };
  if(core[t]) [words,ru]=core[t](); else { const passive = index===16?`${x[6]} ${beNow} ${pp} by ${x[8]} ${marker}.`:index===17?`${x[6]} ${bePast} ${pp} by ${x[8]} ${marker}.`:index===18?`${x[6]} ${have} been ${pp} by ${x[8]} ${marker}.`:`${x[6]} will be ${pp} by ${x[8]} ${marker}.`; words=passive;ru=`${x[7]} ${index===17?'был':'будет'} ${ruVerbPast(x)} ${x[8]}.`; }
  if(index>=20){const cond=[`If ${s} ${simpleVerb(x)}, ${s} ${simpleVerb(x)} ${o}.`,`If ${s} ${simpleVerb(x)}, ${s} will ${v} ${o}.`,`If ${s} ${p} ${o}, ${s} would ${v} ${o}.`,`If ${s} had ${pp} ${o}, ${s} would have ${pp} ${o}.`][index-20];words=cond;ru=['Если '+x[1]+' '+ruVerb(x)+', '+x[1]+' '+ruVerb(x)+'.','Если '+x[1]+' '+ruVerb(x)+', '+x[1]+' '+ruVerbFuture(x)+'.','Если бы '+x[1]+' '+ruVerbPast(x)+', '+x[1]+' '+ruVerbFuture(x)+'.','Если бы '+x[1]+' '+ruVerbPast(x)+', '+x[1]+' '+ruVerbFuturePast(x)+'.'][index-20]}
  return {answer:words, translation:ru.replace(/\[(.*?)\]/g,'$1'), tokens:words.replace(/[.]/g,'').split(' ')};
}
function pronounFor(subject){return ({I:'I',You:'you',He:'he',She:'she',We:'we',They:'they','My brother':'he',Anna:'she','The children':'they','Our team':'it','My friend':'he','The students':'they',Kate:'she','The cat':'it',David:'he','My parents':'they','The doctor':'he'})[subject]||'they'}
function titleCase(text){return text.charAt(0).toUpperCase()+text.slice(1)}
function addDistractors(tense,x,correct){const s=x[0],v=x[2],p=x[3],pp=x[4],ing=x[5],beNow=isThird(s)?'is':s==='I'?'am':'are',bePast=isThird(s)?'was':'were',have=isThird(s)?'has':'have';const choices={
  'Present Simple':[beNow,ing,have,pp], 'Present Continuous':[simpleVerb(x),have,pp], 'Present Perfect':[simpleVerb(x),beNow,ing], 'Present Perfect Continuous':[simpleVerb(x),beNow,pp],
  'Past Simple':[bePast,ing,'had',pp], 'Past Continuous':[p,'had',pp], 'Past Perfect':[p,bePast,ing], 'Past Perfect Continuous':[p,bePast,ing],
  'Future Simple':['would','be',ing], 'Future Continuous':['have',pp,v], 'Future Perfect':['be',ing,v], 'Future Perfect Continuous':['be',ing,v],
  'Future in the Past Simple':['will',v,'has',pp], 'Future in the Past Continuous':['will','be',ing], 'Future in the Past Perfect':['will','have',pp], 'Future in the Past Perfect Continuous':['will','be',ing]
}[tense]||['is','was','will','have'];return [...new Set(choices.filter(word=>!correct.includes(word)))].slice(0,4)}
function sentenceFor(index,n){
  const tense=allTenses[index][0],x=subjects[n],s=x[0],v=x[2],p=x[3],pp=x[4],ing=x[5],o=x[6],ruO=x[7],beNow=isThird(s)?'is':s==='I'?'am':'are',bePast=isThird(s)?'was':'were',have=isThird(s)?'has':'have',ruS=titleCase(x[1]),pronoun=pronounFor(s);
  let answer,translation;
  const core={
    'Present Simple':()=>[`${s} ${simpleVerb(x)} ${o} every morning.`,`Каждое утро ${x[1]} ${ruVerb(x)} ${ruO}.`],
    'Present Continuous':()=>[`${s} ${beNow} ${ing} ${o} right now.`,`Сейчас ${x[1]} ${ruVerb(x)} ${ruO}.`],
    'Present Perfect':()=>[`${s} ${have} ${pp} ${o} already.`,`${ruS} уже ${ruVerbPast(x)} ${ruO}.`],
    'Present Perfect Continuous':()=>[`${s} ${have} been ${ing} ${o} for two hours.`,`${ruS} ${ruVerb(x)} ${ruO} уже два часа.`],
    'Past Simple':()=>[`${s} ${p} ${o} yesterday.`,`Вчера ${x[1]} ${ruVerbPast(x)} ${ruO}.`],
    'Past Continuous':()=>[`${s} ${bePast} ${ing} ${o} at 6 pm.`,`В шесть вечера ${x[1]} ${ruVerb(x)} ${ruO}.`],
    'Past Perfect':()=>[`${s} had ${pp} ${o} before the meeting.`,`${ruS} уже ${ruVerbPast(x)} ${ruO} до встречи.`],
    'Past Perfect Continuous':()=>[`${s} had been ${ing} ${o} for two hours before the meeting.`,`${ruS} ${ruVerb(x)} ${ruO} два часа до встречи.`],
    'Future Simple':()=>[`${s} will ${v} ${o} tomorrow.`,`Завтра ${x[1]} ${ruVerbFuture(x)} ${ruO}.`],
    'Future Continuous':()=>[`${s} will be ${ing} ${o} at this time tomorrow.`,`Завтра в это время ${x[1]} будет ${ruVerb(x)} ${ruO}.`],
    'Future Perfect':()=>[`${s} will have ${pp} ${o} by Friday.`,`К пятнице ${x[1]} уже ${ruVerbFuture(x)} ${ruO}.`],
    'Future Perfect Continuous':()=>[`${s} will have been ${ing} ${o} for two hours by Friday.`,`К пятнице ${x[1]} будет ${ruVerb(x)} ${ruO} уже два часа.`],
    'Future in the Past Simple':()=>[`Yesterday, ${s} said that ${pronoun} would ${v} ${o} the next day.`,`Вчера ${x[1]} сказал(а), что на следующий день ${ruVerbFuture(x)} ${ruO}.`],
    'Future in the Past Continuous':()=>[`Yesterday, ${s} knew that ${pronoun} would be ${ing} ${o} at that time the next day.`,`Вчера ${x[1]} знал(а), что на следующий день будет ${ruVerb(x)} ${ruO}.`],
    'Future in the Past Perfect':()=>[`Yesterday, ${s} thought that ${pronoun} would have ${pp} ${o} by Friday.`,`Вчера ${x[1]} думал(а), что к пятнице уже ${ruVerbFuture(x)} ${ruO}.`],
    'Future in the Past Perfect Continuous':()=>[`Yesterday, ${s} expected that ${pronoun} would have been ${ing} ${o} for two hours by then.`,`Вчера ${x[1]} ожидал(а), что к тому времени будет ${ruVerb(x)} ${ruO} два часа.`]
  };
  const passive=[
    [['The report is checked by the manager every morning.','Отчёт проверяют каждое утро.'],['Dinner is cooked by the chef every evening.','Ужин готовят каждый вечер.'],['The room is cleaned by the staff every day.','Комнату убирают каждый день.'],['English is taught by our teacher on Mondays.','Английский преподаёт наш учитель по понедельникам.']],
    [['The report was checked by the manager yesterday.','Отчёт проверили вчера.'],['Dinner was cooked by the chef last night.','Ужин приготовили прошлой ночью.'],['The room was cleaned by the staff yesterday.','Комнату убрали вчера.'],['The letter was sent by Anna in the morning.','Анна отправила письмо утром.']],
    [['The report has already been checked by the manager.','Менеджер уже проверил отчёт.'],['Dinner has already been cooked by the chef.','Повар уже приготовил ужин.'],['The room has already been cleaned by the staff.','Сотрудники уже убрали комнату.'],['The letter has already been sent by Anna.','Анна уже отправила письмо.']],
    [['The report will be checked by the manager tomorrow.','Менеджер проверит отчёт завтра.'],['Dinner will be cooked by the chef tonight.','Повар приготовит ужин сегодня вечером.'],['The room will be cleaned by the staff tomorrow.','Сотрудники уберут комнату завтра.'],['The letter will be sent by Anna next week.','Анна отправит письмо на следующей неделе.']]
  ];
  const conditionals=[
    [['If water reaches 100 degrees, it boils.','Если вода достигает 100 градусов, она закипает.'],['If people do not sleep, they feel tired.','Если люди не спят, они чувствуют усталость.'],['If I drink coffee late, I cannot sleep.','Если я пью кофе поздно, я не могу уснуть.'],['If the sun sets, it gets dark.','Если солнце садится, темнеет.']],
    [['If it rains tomorrow, we will stay at home.','Если завтра пойдёт дождь, мы останемся дома.'],['If she calls me, I will answer.','Если она позвонит мне, я отвечу.'],['If they finish early, they will join us.','Если они закончат раньше, они присоединятся к нам.'],['If you study tonight, you will pass the test.','Если ты позанимаешься вечером, ты сдашь тест.']],
    [['If I had more time, I would learn Spanish.','Если бы у меня было больше времени, я бы учил испанский.'],['If she lived closer, she would visit us more often.','Если бы она жила ближе, она бы чаще нас навещала.'],['If we had a car, we would travel more.','Если бы у нас была машина, мы бы больше путешествовали.'],['If he knew the answer, he would tell us.','Если бы он знал ответ, он бы нам сказал.']],
    [['If she had left earlier, she would have caught the train.','Если бы она вышла раньше, она бы успела на поезд.'],['If I had known about the meeting, I would have come.','Если бы я знал о встрече, я бы пришёл.'],['If they had studied more, they would have passed the exam.','Если бы они больше учились, они бы сдали экзамен.'],['If we had booked a table, we would have eaten there.','Если бы мы забронировали столик, мы бы поели там.']]
  ];
  if(core[tense])[answer,translation]=core[tense]();else if(index>=16&&index<20)[answer,translation]=passive[index-16][n%4];else [answer,translation]=conditionals[index-20][n%4];
  const tokens=answer.replace(/[.,]/g,'').split(' ');return {answer,translation,tokens,distractors:addDistractors(tense,x,tokens)};
}
function ruVerb(x){const third={write:'пишет',read:'читает',cook:'готовит',drink:'пьёт',watch:'смотрит',play:'играет',fix:'чинит',learn:'изучает',build:'строит',plan:'планирует',buy:'покупает',solve:'решает',call:'звонит',sleep:'спит',send:'отправляет',visit:'посещает',check:'осматривает',prepare:'готовит',draw:'рисует',meet:'встречает'};const first={write:'пишу',read:'читаю',cook:'готовлю',drink:'пью',watch:'смотрю',play:'играю',fix:'чиню',learn:'изучаю',build:'строю',plan:'планирую',buy:'покупаю',solve:'решаю',call:'звоню',sleep:'сплю',send:'отправляю',visit:'посещаю',check:'осматриваю',prepare:'готовлю',draw:'рисую',meet:'встречаю'};const second={write:'пишешь',read:'читаешь',cook:'готовишь',drink:'пьёшь',watch:'смотришь',play:'играешь',fix:'чинишь',learn:'изучаешь',build:'строишь',plan:'планируешь',buy:'покупаешь',solve:'решаешь',call:'звонишь',sleep:'спишь',send:'отправляешь',visit:'посещаешь',check:'осматриваешь',prepare:'готовишь',draw:'рисуешь',meet:'встречаешь'};const plural={write:'пишем',read:'читаем',cook:'готовим',drink:'пьём',watch:'смотрим',play:'играем',fix:'чиним',learn:'изучаем',build:'строим',plan:'планируем',buy:'покупаем',solve:'решаем',call:'звоним',sleep:'спим',send:'отправляем',visit:'посещаем',check:'осматриваем',prepare:'готовим',draw:'рисуем',meet:'встречаем'};return (x[1]==='я'?first:x[1]==='ты'?second:['мы','они','дети','мои родители','студенты'].includes(x[1])?plural:third)[x[2]]}
function ruVerbPast(x){return ({write:'написал(а)',read:'прочитал(а)',cook:'приготовил(а)',drink:'выпил(а)',watch:'посмотрел(а)',play:'сыграл(а)',fix:'починил(а)',learn:'выучил(а)',build:'построил(а)',plan:'спланировал(а)',buy:'купил(а)',solve:'решил(а)',call:'позвонил(а)',sleep:'спал(а)',send:'отправил(а)',visit:'посетил(а)',check:'осмотрел(а)',prepare:'приготовил(а)',draw:'нарисовал(а)',meet:'встретил(а)'})[x[2]]}
function ruVerbFuture(x){const forms={write:['напишу','напишешь','напишет','напишем','напишут'],read:['прочитаю','прочитаешь','прочитает','прочитаем','прочитают'],cook:['приготовлю','приготовишь','приготовит','приготовим','приготовят'],drink:['выпью','выпьешь','выпьет','выпьем','выпьют'],watch:['посмотрю','посмотришь','посмотрит','посмотрим','посмотрят'],play:['сыграю','сыграешь','сыграет','сыграем','сыграют'],fix:['починю','починишь','починит','починим','починят'],learn:['изучу','изучишь','изучит','изучим','изучат'],build:['построю','построишь','построит','построим','построят'],plan:['спланирую','спланируешь','спланирует','спланируем','спланируют'],buy:['куплю','купишь','купит','купим','купят'],solve:['решу','решишь','решит','решим','решат'],call:['позвоню','позвонишь','позвонит','позвоним','позвонят'],sleep:['посплю','поспишь','поспит','поспим','поспят'],send:['отправлю','отправишь','отправит','отправим','отправят'],visit:['посещу','посетишь','посетит','посетим','посетят'],check:['осмотрю','осмотришь','осмотрит','осмотрим','осмотрят'],prepare:['приготовлю','приготовишь','приготовит','приготовим','приготовят'],draw:['нарисую','нарисуешь','нарисует','нарисуем','нарисуют'],meet:['встречу','встретишь','встретит','встретим','встретят']};const person=x[1]==='я'?0:x[1]==='ты'?1:['мы'].includes(x[1])?3:['они','дети','мои родители','студенты'].includes(x[1])?4:2;return forms[x[2]][person]} function ruVerbFuturePast(x){return ruVerbFuture(x)} function markerRu(m){return m==='every morning'?'каждое утро':''}
function renderNav(){let out='';tenseGroups.forEach(([group, items])=>{out+=`<div class="nav-section"><div class="nav-section-title">${group}</div>`;items.forEach(item=>{const i=allTenses.indexOf(item),done=stored[i]?.done;out+=`<button class="tense-link ${i===selected?'active':''} ${done?'done':''}" data-index="${i}"><i class="tense-dot"></i>${item[0].replace('Future in the Past ','F. in Past ')}</button>`});out+='</div>'});$('#tenseList').innerHTML=out;document.querySelectorAll('.tense-link').forEach(b=>b.onclick=()=>switchTense(+b.dataset.index));$('#courseProgress').textContent=`${Object.values(stored).filter(x=>x.done).length} / 24`}
function switchTense(i){selected=i;current=stored[i]?.position||0;built=[];hintStep=0;activeExercise=null;renderNav();renderLesson();$('#sidebar').classList.remove('open')}
function shuffle(a){return [...a].sort(()=>Math.random()-.5)}
function currentExercise(){if(!activeExercise)activeExercise=sentenceFor(selected,Math.floor(Math.random()*subjects.length));return activeExercise}
function renderLesson(){const t=allTenses[selected], ex=currentExercise();ordered=shuffle([...ex.tokens,...ex.distractors]);built=[];hintStep=0;$('#tenseTitle').textContent=t[0];$('#crumbTense').textContent=t[0];$('#tenseDescription').textContent=t[1];$('#difficultyBadge').textContent=t[2];$('#translation').textContent=ex.translation;$('#taskNumber').textContent=String(current+1).padStart(2,'0');const pct=Math.round(current/20*100);$('#progressFill').style.width=pct+'%';$('#percentProgress').textContent=pct+'%';clearFeedback();renderWords();renderAnswer();updateStats()}
function renderWords(){const ex=currentExercise();$('#wordBank').innerHTML=ordered.map((word,i)=>`<button class="word ${built.includes(i)?'used':''}" data-i="${i}">${word}</button>`).join('');document.querySelectorAll('.word').forEach(b=>b.onclick=()=>{built.push(+b.dataset.i);renderWords();renderAnswer();clearFeedback()})}
function renderAnswer(){const z=$('#answerZone');if(!built.length){z.innerHTML='<span class="answer-placeholder">Нажимайте на слова ниже</span>';z.classList.remove('has-answer');return}z.classList.add('has-answer');z.innerHTML=built.map((i,k)=>`<button class="answer-token" data-k="${k}">${ordered[i]}</button>`).join('');document.querySelectorAll('.answer-token').forEach(b=>b.onclick=()=>{built.splice(+b.dataset.k,1);renderWords();renderAnswer()})}
function clearFeedback(){const f=$('#feedback');f.className='feedback';f.textContent=''}
function check(){const ex=currentExercise();if(!built.length){showToast('Сначала соберите предложение');return}const given=built.map(i=>ordered[i]).join(' ');if(given===ex.tokens.join(' ')){right++;recordCorrect();current++;activeExercise=null;stored[selected]={position:current,done:current>=20};localStorage.setItem('tenselab-progress',JSON.stringify(stored));const f=$('#feedback');f.className='feedback show success';f.textContent='Верно! Отличная структура предложения.';updateStats();$('#trainerCard').classList.add('success-card');setTimeout(()=>{if(current>=20){showToast('Время освоено! Выберите следующее.');current=0;stored[selected]={position:0,done:true};localStorage.setItem('tenselab-progress',JSON.stringify(stored));renderNav()}renderLesson()},850)}else{wrong++;attempts++;const f=$('#feedback');f.className='feedback show error';f.textContent='Почти. Проверьте порядок слов, маркер времени и форму глагола — попробуйте ещё раз.';$('#answerZone').style.borderColor='#ef9999';setTimeout(()=>$('#answerZone').style.borderColor='',500);updateStats()}}
function updateStats(){const done=right+wrong,daily=todayCorrect(),goal=profile.dailyGoal,streak=currentStreak();$('#xpCount').textContent=profile.totalXP;$('#streakCount').textContent=streak;$('#accuracyValue').textContent=done?Math.round(right/done*100)+'%':'—';$('#accuracySub').textContent=done?`${right} верно · ${wrong} ошибок`:'Начните практику';$('#dailyFill').style.width=Math.min(daily/goal*100,100)+'%';$('#dailyCount').textContent=`${daily} / ${goal}`;$('#dailyGoalText').textContent=`${goal} правильных предложений`;$('#profileName').textContent=profile.name;$('#profileStreak').textContent=streak?`Серия: ${streak} ${streak===1?'день':'дней'} 🔥`:'Серия начнётся сегодня';$('#avatarLetters').textContent=profile.name==='Мой прогресс'?'Я':profile.name.trim().slice(0,2).toUpperCase();$('#levelBadge').textContent=Math.floor(profile.totalXP/250)+1}
function hint(){const ex=currentExercise();if(hintStep>=ex.tokens.length){showToast('Все слова уже показаны');return}const needed=ex.tokens[hintStep];const idx=ordered.findIndex((w,i)=>w===needed&&!built.includes(i));if(idx>=0){built.push(idx);hintStep++;renderWords();renderAnswer();showToast(`Подсказка: «${needed}»`)} }
function listen(){const ex=currentExercise();if('speechSynthesis' in window){speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(ex.answer);u.lang='en-US';u.rate=.82;speechSynthesis.speak(u)}else showToast('Озвучка не поддерживается в этом браузере')}
function showToast(s){const t=$('#toast');t.textContent=s;t.classList.add('visible');setTimeout(()=>t.classList.remove('visible'),2200)}
async function shareResult(){const daily=todayCorrect(),streak=currentStreak(),text=`Мой результат в TenseLab: ${daily} из ${profile.dailyGoal} правильных предложений сегодня, серия — ${streak} дн. 🔥`;if(navigator.share){try{await navigator.share({title:'TenseLab',text});return}catch(error){if(error.name==='AbortError')return}}try{if(navigator.clipboard)await navigator.clipboard.writeText(text);else throw new Error('No clipboard');showToast('Результат скопирован') }catch(error){const area=document.createElement('textarea');area.value=text;document.body.append(area);area.select();document.execCommand('copy');area.remove();showToast('Результат скопирован')}}
$('#checkButton').onclick=check;$('#clearButton').onclick=()=>{built=[];renderWords();renderAnswer();clearFeedback()};$('#shuffleButton').onclick=()=>{built=[];ordered=shuffle(ordered);renderWords();renderAnswer();clearFeedback()};$('#hintButton').onclick=hint;$('#listenButton').onclick=listen;$('#menuButton').onclick=()=>$('#sidebar').classList.toggle('open');$('#formulaButton').onclick=()=>{const t=allTenses[selected],d=$('#formulaDialog');$('#dialogTitle').textContent=t[0];$('#dialogUsage').textContent=t[1];$('#dialogFormula').innerHTML='<b>Пример</b><br>'+t[4];d.showModal()};$('#closeDialog').onclick=()=>$('#formulaDialog').close();$('#dailyGoalButton').onclick=()=>$('#goalDialog').showModal();$('#profileButton').onclick=()=>{$('#profileNameInput').value=profile.name==='Мой прогресс'?'':profile.name;$('#profileDialog').showModal()};$('#saveProfileButton').onclick=()=>{const name=$('#profileNameInput').value.trim();if(name)profile.name=name;saveProfile();updateStats();$('#profileDialog').close()};document.querySelectorAll('.goal-options button').forEach(button=>button.onclick=()=>{profile.dailyGoal=+button.dataset.goal;saveProfile();updateStats();$('#goalDialog').close();showToast('Дневная цель обновлена')});document.querySelectorAll('[data-close]').forEach(button=>button.onclick=()=>$('#'+button.dataset.close).close());$('#shareButton').onclick=shareResult;document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.tagName!=='INPUT')check()});if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js'));renderNav();renderLesson();
