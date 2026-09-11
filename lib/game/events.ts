import type { GameEvent } from './types'

// Connected event database for ages 0–30.
// Several chains demonstrate the echo mechanic:
//   - Детская травма (4–6)  -> echo_trauma_adult (~25)
//   - Драка за друга (11–13) -> echo_friend_repay | echo_friend_revenge
//   - Глупый риск на машине (18–20) -> echo_car_crash (фатально)

export const EVENTS: GameEvent[] = [
  // ─────────────────────────────── 0–6: health, stress
  {
    id: 'toddler_stove',
    minAge: 3,
    maxAge: 5,
    title: 'Горячая плита',
    text: 'Тебе три года. На кухне бабушка отвернулась к телевизору, а на плите шкварчит сковорода. Блестящая ручка так и манит.',
    choices: [
      {
        text: 'Потянуться к ручке',
        effects: { health: -18, stress: 12, addTags: ['trait:shram'] },
        logText: 'Ожог от сковороды. Первый шрам и первый страх огня.',
        logKind: 'bad',
      },
      {
        text: 'Заплакать и позвать бабушку',
        effects: { stress: 4, addTags: ['trait:ostorozhnyy'] },
        logText: 'Бабушка успела вовремя. Обошлось испугом.',
        logKind: 'neutral',
      },
    ],
  },
  {
    id: 'kinder_bully',
    minAge: 4,
    maxAge: 6,
    title: 'Отобрали игрушку',
    text: 'В детском саду мальчик постарше вырвал у тебя из рук единственную машинку и толкнул в песок.',
    choices: [
      {
        text: 'Дать сдачи',
        effects: { health: -6, stress: 6, social: 4, addTags: ['trait:boevoy'] },
        logText: 'Разбитая губа, но машинку вернул. Тебя запомнили.',
        logKind: 'neutral',
      },
      {
        text: 'Пожаловаться воспитателю',
        effects: { stress: 8, addTags: ['trait:travma_detstva'] },
        echo: { eventId: 'echo_trauma_adult', minDelay: 20, maxDelay: 22 },
        logText: 'Воспитатель отмахнулась. Ты понял, что защищать себя придётся самому.',
        logKind: 'bad',
      },
    ],
  },
  {
    id: 'first_snow',
    minAge: 2,
    maxAge: 6,
    title: 'Первый снег',
    text: 'За окном сыплет крупный снег. Двор превратился в белое поле, и родители зовут гулять.',
    choices: [
      {
        text: 'Валяться в сугробах до посинения',
        effects: { health: -8, stress: -12 },
        logText: 'Промок насквозь и потом кашлял, но это было счастье.',
        logKind: 'good',
      },
      {
        text: 'Лепить снеговика аккуратно',
        effects: { stress: -8, health: 2 },
        logText: 'Идеальный снеговик простоял до марта.',
        logKind: 'good',
      },
    ],
  },

  // ─────────────────────────────── 7–13: + intellect
  {
    id: 'school_olympiad',
    minAge: 8,
    maxAge: 12,
    title: 'Школьная олимпиада',
    text: 'Учительница математики предлагает поехать на районную олимпиаду. Придётся сидеть над задачами вместо двора.',
    choices: [
      {
        text: 'Готовиться и поехать',
        effects: { intellect: 14, stress: 8, social: -4, addTags: ['trait:umnik'] },
        logText: 'Второе место по району. Диплом висит над кроватью.',
        logKind: 'good',
      },
      {
        text: 'Забить и гонять мяч',
        effects: { intellect: -4, stress: -8, social: 6 },
        logText: 'Двор важнее уравнений. Пока что.',
        logKind: 'neutral',
      },
    ],
  },
  {
    id: 'friend_fight',
    minAge: 11,
    maxAge: 13,
    title: 'Драка за друга',
    text: 'Твоего лучшего друга Витька зажали у гаражей трое из параллели. Он смотрит на тебя, ты — на них.',
    choices: [
      {
        text: 'Влезть в драку за друга',
        effects: { health: -14, stress: 10, social: 10, addTags: ['trait:vernyy', 'rel:vitёk_dolzhnik'] },
        echo: { eventId: 'echo_friend_repay', minDelay: 12, maxDelay: 16 },
        logText: 'Получил, но Витёк этого не забудет. Кровное братство у гаражей.',
        logKind: 'milestone',
      },
      {
        text: 'Сделать вид, что не заметил',
        effects: { stress: 16, social: -12, addTags: ['rel:vitёk_obida'] },
        echo: { eventId: 'echo_friend_revenge', minDelay: 13, maxDelay: 17 },
        logText: 'Ты ушёл. Витёк тоже ушёл — и больше не звонил.',
        logKind: 'bad',
      },
    ],
  },
  {
    id: 'computer_club',
    minAge: 10,
    maxAge: 13,
    title: 'Компьютерный клуб',
    text: 'На углу открылся клуб с пахнущими пылью системниками. Час — 30 рублей, а у тебя есть только на дорогу.',
    choices: [
      {
        text: 'Пропадать там сутками',
        effects: { intellect: 10, health: -6, social: 6, addTags: ['trait:komputerschik'] },
        logText: 'Counter-Strike, энергетики и первые друзья по сети.',
        logKind: 'neutral',
      },
      {
        text: 'Копить деньги, а не тратить',
        effects: { intellect: 4, stress: 4, addTags: ['trait:berezhlivyy'] },
        logText: 'Первая копилка. Дисциплина важнее фрагов.',
        logKind: 'neutral',
      },
    ],
  },
  {
    id: 'garage_smoke',
    minAge: 12,
    maxAge: 14,
    title: 'За гаражами',
    text: 'Пацаны достали пачку сигарет и протягивают тебе. «Ну ты чё, не мужик?»',
    choices: [
      {
        text: 'Закурить со всеми',
        effects: { health: -8, social: 6, addTags: ['status:kurit'] },
        logText: 'Закашлялся, но кивнул. Теперь ты «свой».',
        logKind: 'bad',
      },
      {
        text: 'Отказаться',
        effects: { social: -4, stress: 4, health: 4 },
        logText: 'Посмеялись, но лёгкие целы.',
        logKind: 'neutral',
      },
    ],
  },

  // ─────────────────────────────── 14+: + social, money
  {
    id: 'first_job_market',
    minAge: 14,
    maxAge: 16,
    title: 'Подработка на рынке',
    text: 'Дядя Гена зовёт таскать ящики на рынке по выходным. Платит наличкой, но спина к вечеру не разгибается.',
    choices: [
      {
        text: 'Согласиться',
        effects: { money: 15000, health: -6, social: 4, addTags: ['trait:rabotyaga'] },
        logText: 'Первые собственные деньги. Пахнут мандаринами и потом.',
        logKind: 'good',
      },
      {
        text: 'Лучше учиться',
        effects: { intellect: 8, stress: 4 },
        logText: 'Учебники вместо ящиков. Мать одобрила.',
        logKind: 'neutral',
      },
    ],
  },
  {
    id: 'first_love',
    minAge: 15,
    maxAge: 17,
    title: 'Первая любовь',
    text: 'Она сидит на два ряда впереди и однажды обернулась. Сердце делает то, чему в школе не учат.',
    choices: [
      {
        text: 'Признаться',
        effects: { social: 12, stress: -6, addTags: ['rel:pervaya_lyubov'] },
        logText: 'Записка сработала. Гуляли до самого комендантского часа.',
        logKind: 'milestone',
      },
      {
        text: 'Молча страдать',
        effects: { stress: 12, social: -4, addTags: ['trait:introvert'] },
        logText: 'Ты так и не подошёл. Она уехала поступать в другой город.',
        logKind: 'bad',
      },
    ],
  },
  {
    id: 'ege_exam',
    minAge: 16,
    maxAge: 18,
    title: 'ЕГЭ',
    text: 'Год решает всё. Бланки, металлоискатели на входе и учительница, которая смотрит как надзиратель.',
    choices: [
      {
        text: 'Пахать по ночам',
        effects: { intellect: 16, stress: 16, health: -8, addTags: ['status:student_budget'] },
        logText: 'Высокие баллы. Бюджет в приличном вузе — твой.',
        logKind: 'good',
      },
      {
        text: 'Списать с телефона',
        effects: { intellect: -4, stress: 10, addTags: ['trait:avantyurist'] },
        logText: 'Пронесло. Баллов хватило впритык.',
        logKind: 'neutral',
      },
    ],
  },
  {
    id: 'car_dare',
    minAge: 18,
    maxAge: 20,
    title: 'Ночные гонки',
    text: 'Друг взял отцовскую «десятку» и зовёт «прохватить» по ночному объездному. Все уже сели, ждут только тебя.',
    choices: [
      {
        text: 'Погнать без ремня и на всю',
        effects: { stress: -6, social: 8, addTags: ['trait:otmorozok'] },
        echo: { eventId: 'echo_car_crash', minDelay: 1, maxDelay: 2 },
        logText: '180 по трассе, музыка, визг. Адреналин застилает глаза.',
        logKind: 'bad',
      },
      {
        text: 'Отказаться и уйти домой',
        effects: { social: -6, stress: 6, addTags: ['trait:ostorozhnyy'] },
        logText: 'Тебя обозвали трусом. Утром ты об этом не жалел.',
        logKind: 'neutral',
      },
    ],
  },
  {
    id: 'university_choice',
    minAge: 18,
    maxAge: 20,
    requiredTags: ['status:student_budget'],
    title: 'Первая сессия',
    text: 'Общага, дошираки и первый долг по вышмату. Одногруппники зовут «сдавать за деньги».',
    choices: [
      {
        text: 'Сдать самому',
        effects: { intellect: 12, stress: 12, addTags: ['trait:uporstvo'] },
        logText: 'Сессия закрыта честно. Стипендия капает.',
        logKind: 'good',
      },
      {
        text: 'Занести преподу',
        effects: { money: -20000, intellect: -6, stress: 8 },
        logText: 'Зачёт куплен. Совесть — тоже статья расходов.',
        logKind: 'bad',
      },
    ],
  },
  {
    id: 'army_summons',
    minAge: 18,
    maxAge: 21,
    forbiddenTags: ['status:student_budget'],
    title: 'Повестка',
    text: 'В почтовый ящик легла повестка. Военкомат ждёт тебя послезавтра к восьми утра.',
    choices: [
      {
        text: 'Пойти служить',
        effects: { health: -10, social: 8, stress: 8, addTags: ['trait:sluzhil'] },
        logText: 'Год сапог и плаца. Вернулся другим человеком.',
        logKind: 'milestone',
      },
      {
        text: 'Косить по здоровью',
        effects: { money: -40000, stress: 14, addTags: ['status:uklonist'] },
        logText: 'Справка обошлась дорого. Зато дома.',
        logKind: 'neutral',
      },
    ],
  },
  {
    id: 'first_office',
    minAge: 21,
    maxAge: 24,
    forbiddenTags: ['status:job_office', 'status:job_business'],
    title: 'Первое собеседование',
    text: 'Опенспейс, кофемашина и HR, которая спрашивает, кем ты видишь себя через пять лет. Оффер лежит на столе.',
    choices: [
      {
        text: 'Подписать оффер',
        effects: { money: 30000, stress: 8, social: 6, addTags: ['status:job_office'] },
        logText: 'Трудоустроен. Теперь у тебя есть корпоративная кружка.',
        logKind: 'good',
      },
      {
        text: 'Уйти во фриланс',
        effects: { money: 10000, stress: 12, addTags: ['status:freelance'] },
        logText: 'Свобода и нестабильность в одном флаконе.',
        logKind: 'neutral',
      },
    ],
  },
  {
    id: 'startup_idea',
    minAge: 22,
    maxAge: 27,
    forbiddenTags: ['status:job_business'],
    title: 'Идея бизнеса',
    text: 'Ночью пришла идея: доставка домашней еды по району. Нужен стартовый капитал и напарник, которому можно верить.',
    choices: [
      {
        text: 'Запустить своё дело',
        effects: { money: -50000, stress: 18, social: 6, addTags: ['status:job_business', 'trait:predprinimatel'] },
        logText: 'Взял кредит, снял кухню. Обратного пути нет.',
        logKind: 'milestone',
      },
      {
        text: 'Остаться в найме',
        effects: { stress: -6, money: 5000 },
        logText: 'Стабильность победила. Идея легла в стол.',
        logKind: 'neutral',
      },
    ],
  },
  {
    id: 'mortgage_trap',
    minAge: 24,
    maxAge: 29,
    title: 'Ипотека',
    text: 'Банк одобрил ипотеку на однушку у МКАД. 25 лет платежей или ещё десять лет со съёмом и родителями.',
    choices: [
      {
        text: 'Взять ипотеку',
        effects: { money: -60000, stress: 16, addTags: ['asset:kvartira', 'status:ipoteka'] },
        logText: 'Своя квартира. И своя долговая петля на четверть века.',
        logKind: 'milestone',
      },
      {
        text: 'Продолжать снимать',
        effects: { money: -15000, stress: 6 },
        logText: 'Свобода перемещения дороже квадратных метров.',
        logKind: 'neutral',
      },
    ],
  },

  // ─────────────────────────────── ECHO EVENTS (only via queue)
  {
    id: 'echo_trauma_adult',
    echoOnly: true,
    title: 'Эхо детства',
    text: 'Тебе снова снится тот двор и тот страх. Панические атаки в метро стали привычкой — детская травма догнала взрослого.',
    choices: [
      {
        text: 'Пойти к терапевту',
        effects: { money: -35000, stress: -22, intellect: 4, removeTags: ['trait:travma_detstva'], addTags: ['trait:prorabotal'] },
        logText: 'Полгода терапии. Впервые за годы дышится ровно.',
        logKind: 'good',
      },
      {
        text: 'Заливать тревогу',
        effects: { health: -14, stress: 6, addTags: ['status:pyet'] },
        logText: 'По пятницам стало легче. По утрам — хуже.',
        logKind: 'bad',
      },
    ],
  },
  {
    id: 'echo_friend_repay',
    echoOnly: true,
    title: 'Витёк возвращает долг',
    text: 'Тот самый Витёк с гаражей теперь при деньгах. Он помнит, кто влез за него в драку, и предлагает войти в его бизнес.',
    choices: [
      {
        text: 'Войти в долю',
        effects: { money: 120000, stress: 6, social: 10, addTags: ['asset:dolya_v_biznese'] },
        logText: 'Кровное братство у гаражей окупилось спустя годы.',
        logKind: 'good',
      },
      {
        text: 'Отказаться, но остаться друзьями',
        effects: { stress: -8, social: 8 },
        logText: 'Денег не взял, но плечо рядом — дороже.',
        logKind: 'good',
      },
    ],
  },
  {
    id: 'echo_friend_revenge',
    echoOnly: true,
    title: 'Тень предательства',
    text: 'Витёк, которого ты когда-то бросил у гаражей, теперь в совете директоров компании, куда ты пришёл на собеседование. Он тебя узнал.',
    choices: [
      {
        text: 'Попытаться извиниться',
        effects: { stress: 10, social: -6 },
        logText: 'Он выслушал холодно. В приёме отказано.',
        logKind: 'bad',
      },
      {
        text: 'Сделать вид, что не помнишь',
        effects: { stress: 16, money: -10000, addTags: ['trait:tsinik'] },
        logText: 'Он всё понял. Индустрия узкая — тебя занесли в чёрный список.',
        logKind: 'bad',
      },
    ],
  },
  {
    id: 'echo_car_crash',
    echoOnly: true,
    forbiddenTags: ['trait:sluzhil'],
    title: 'Тот самый поворот',
    text: 'Снова ночь, снова объездная, снова «десятка» на всю катушку. На повороте фары встречной вырастают слишком быстро.',
    choices: [
      {
        text: 'Выкрутить руль',
        effects: { fatal: true, deathReason: 'Погиб в ночной аварии на объездной. Ремень так и остался незастёгнутым.' },
        logText: 'Металл, стекло, тишина. Ремень так и остался незастёгнутым.',
        logKind: 'fatal',
      },
      {
        text: 'Ударить по тормозам',
        effects: { health: -45, stress: 30, addTags: ['trait:invalidnost'] },
        logText: 'Выжил чудом. Полгода по больницам и спицы в ноге.',
        logKind: 'bad',
      },
    ],
  },
]

export const EVENTS_BY_ID: Record<string, GameEvent> = Object.fromEntries(
  EVENTS.map((e) => [e.id, e]),
)
