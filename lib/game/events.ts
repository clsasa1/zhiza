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
  // ─────────────────────────────── 28–45: взрослая жизнь
  {
    id: 'back_pain',
    minAge: 30,
    maxAge: 45,
    metricConditions: { health: { max: 70 } },
    title: 'Спина',
    text: 'Экономил на кресле, спорте и времени. Теперь поясница напоминает о себе при каждом подъёме с дивана.',
    choices: [
      {
        text: 'Оплатить МРТ и курс массажа',
        effects: { money: -45000, health: 12, stress: -8 },
        logText: 'МРТ показало то, что спина знала давно. Лечение дорогое, но ходить стало легче.',
        logKind: 'good',
      },
      {
        text: 'Уколы диклофенака и потерпеть',
        effects: { money: -5000, health: -8, stress: 8 },
        logText: 'Боль отступила на пару недель. Экономия записала себя в долгосрочные планы.',
        logKind: 'bad',
      },
    ],
  },
  {
    id: 'dental_bill',
    minAge: 33,
    maxAge: 45,
    metricConditions: { money: { max: 100000 } },
    title: 'Зубы',
    text: 'Плановый осмотр превратился в смету: два импланта, костная пластика и сумма, за которую раньше покупали машину.',
    choices: [
      {
        text: 'Лечить сейчас',
        effects: { money: -120000, health: 8, stress: -6 },
        logText: 'Счёт на 120 000 ₽ больнее укола, но жевать снова можно без переговоров.',
        logKind: 'good',
      },
      {
        text: 'Отложить до лучших времён',
        effects: { health: -12, stress: 10 },
        logText: 'Врач сказал «не тяните». Ты услышал «после премии».',
        logKind: 'bad',
      },
    ],
  },
  {
    id: 'office_promotion',
    minAge: 28,
    maxAge: 45,
    requiredTags: ['status:job_office'],
    title: 'Повышение до начальника',
    text: 'Начальник уходит, а его задачи почему-то уже лежат у тебя. Вместе с должностью обещают зарплату почти вдвое выше.',
    choices: [
      {
        text: 'Согласиться',
        effects: { money: 70000, stress: 25, social: 8, addTags: ['trait:boss'] },
        logText: 'Теперь ты начальник. Люди стали приходить к тебе с проблемами, которые раньше приносили начальнику.',
        logKind: 'milestone',
      },
      {
        text: 'Остаться специалистом',
        effects: { stress: -8, intellect: 4 },
        logText: 'Чужие KPI остались чужими. Вечер снова принадлежит тебе.',
        logKind: 'good',
      },
    ],
  },
  {
    id: 'tax_inspection',
    minAge: 28,
    maxAge: 45,
    requiredTags: ['status:job_business'],
    title: 'Проверка',
    text: 'В почте письмо из налоговой. Формально всё в порядке, но папка с первичкой внезапно стала самым ценным активом.',
    choices: [
      {
        text: 'Нанять бухгалтера и пройти официально',
        effects: { money: -60000, stress: -12, addTags: ['trait:berezhlivyy'] },
        logText: 'Бухгалтер нашёл три ошибки до инспектора. Услуги стоили дешевле паники.',
        logKind: 'good',
      },
      {
        text: 'Разобраться самому ночью',
        effects: { stress: 24, health: -6, money: -15000 },
        logText: 'Документы собраны к четырём утра. Теперь ты знаешь цену каждой печати.',
        logKind: 'bad',
      },
    ],
  },
  {
    id: 'factory_redundancy',
    minAge: 30,
    maxAge: 42,
    cityTypes: ['industrial'],
    title: 'Сокращение на заводе',
    text: 'Цех переводят на новый график, а половину смены «оптимизируют». Твоё имя пока не прозвучало.',
    choices: [
      {
        text: 'Пойти в такси',
        effects: { money: 25000, health: -10, stress: 12, addTags: ['status:freelance'] },
        logText: 'Город стал рабочим местом. Спина устает, зато деньги приходят быстрее обещаний.',
        logKind: 'neutral',
      },
      {
        text: 'Искать работу в мегаполисе',
        effects: { money: -40000, stress: 16, social: -4 },
        logText: 'Резюме отправлено в другой город. Переезд оказался отдельным проектом.',
        logKind: 'bad',
      },
    ],
  },
  {
    id: 'remote_it_offer',
    minAge: 32,
    maxAge: 40,
    requiredTags: ['trait:komputerschik'],
    title: 'Работа без переезда',
    text: 'Столичная IT-компания ищет человека, который понимает и компьютеры, и жизнь вне Садового кольца.',
    choices: [
      {
        text: 'Пройти собеседование',
        effects: { money: 60000, intellect: 8, stress: 10, addTags: ['status:freelance'] },
        logText: 'Работа удалённая, зарплата столичная, а чайник всё ещё провинциальный.',
        logKind: 'good',
      },
      {
        text: 'Остаться на привычном месте',
        effects: { stress: -6, social: 4 },
        logText: 'Новая возможность закрыта. Зато никто не пишет в рабочий чат ночью.',
        logKind: 'neutral',
      },
    ],
  },
  {
    id: 'child_born',
    minAge: 28,
    maxAge: 42,
    forbiddenTags: ['rel:child_born'],
    title: 'Рождение ребёнка',
    text: 'В доме появляется человек размером с пакет молока, который не признаёт выходных, тишины и прежнего бюджета.',
    choices: [
      {
        text: 'Взять отпуск и быть рядом',
        effects: { money: -50000, stress: 18, social: 12, addTags: ['rel:child_born'] },
        logText: 'Сна мало, расходов много. Но в квартире стало на один голос больше.',
        logKind: 'milestone',
      },
      {
        text: 'Сразу вернуться к работе',
        effects: { money: 30000, stress: 28, social: -8, addTags: ['rel:child_born'] },
        logText: 'Карьера не остановилась. Семья заметила, что тебя тоже иногда нет.',
        logKind: 'bad',
      },
    ],
  },
  {
    id: 'parents_ill',
    minAge: 30,
    maxAge: 45,
    forbiddenTags: ['rel:parents_ill'],
    title: 'Стареющие родители',
    text: 'Мать всё чаще говорит «ничего страшного», а потом кладёт трубку после очередного визита в поликлинику.',
    choices: [
      {
        text: 'Забрать мать к себе',
        effects: { money: -20000, stress: 20, social: 6, addTags: ['rel:parents_ill'] },
        logText: 'В квартире стало теснее. Зато теперь ты знаешь, как прошёл её день.',
        logKind: 'milestone',
      },
      {
        text: 'Оплачивать сиделку',
        effects: { money: -45000, stress: 8, addTags: ['rel:parents_ill'] },
        logText: 'Сиделка приезжает по расписанию. Вина — без расписания.',
        logKind: 'bad',
      },
    ],
  },
  {
    id: 'dacha_purchase',
    minAge: 30,
    maxAge: 45,
    forbiddenTags: ['asset:dacha'],
    title: 'Дача',
    text: 'Участок с полуразрушенным домом продают «почти за городом». Каждые майские теперь потенциально заняты.',
    choices: [
      {
        text: 'Купить и восстанавливать',
        effects: { money: -90000, stress: 12, health: 4, addTags: ['asset:dacha'] },
        logText: 'Появилась дача. Вместе с ней — список работ до следующей пятилетки.',
        logKind: 'milestone',
      },
      {
        text: 'Отказаться от хозяйства',
        effects: { stress: -5, money: 10000 },
        logText: 'Чужие шашлыки пахнут так же, но копать картошку не нужно.',
        logKind: 'good',
      },
    ],
  },
  {
    id: 'foreign_car',
    minAge: 30,
    maxAge: 45,
    metricConditions: { money: { min: 50000 } },
    forbiddenTags: ['asset:car_foreign'],
    title: 'Иномарка',
    text: 'Старая машина начинает требовать уважения к возрасту. На рынке есть подержанная иномарка — блестит подозрительно убедительно.',
    choices: [
      {
        text: 'Купить',
        effects: { money: -180000, stress: 8, addTags: ['asset:car_foreign'] },
        logText: 'Иномарка куплена. Теперь ты знаешь слово «контрактный» в нескольких значениях.',
        logKind: 'milestone',
      },
      {
        text: 'Ездить на старой',
        effects: { money: -15000, stress: 6, health: -2 },
        logText: 'Старая машина снова прошла техосмотр. Вы оба сделали вид, что это надолго.',
        logKind: 'neutral',
      },
    ],
  },
  {
    id: 'midlife_crisis',
    minAge: 35,
    maxAge: 45,
    metricConditions: { stress: { min: 65 }, social: { max: 55 } },
    forbiddenTags: ['status:midlife_crisis'],
    title: 'Кризис среднего возраста',
    text: 'Вроде всё на месте, но ощущение такое, будто жизнь открыта в соседней вкладке и давно просит внимания.',
    choices: [
      {
        text: 'Пойти к психологу и пересобрать планы',
        effects: { money: -40000, stress: -20, social: 8, addTags: ['status:midlife_crisis'] },
        logText: 'Планы не стали проще, зато впервые стали твоими.',
        logKind: 'good',
      },
      {
        text: 'Купить дорогую игрушку',
        effects: { money: -150000, stress: -8, addTags: ['status:midlife_crisis'] },
        logText: 'Новая игрушка блестит. Внутри ненадолго тоже стало светлее.',
        logKind: 'neutral',
      },
    ],
  },
  {
    id: 'divorce',
    minAge: 32,
    maxAge: 45,
    requiredTags: ['rel:child_born'],
    metricConditions: { stress: { min: 75 } },
    forbiddenTags: ['status:divorced'],
    title: 'Развод',
    text: 'Разговоры о ремонте, деньгах и том, кто опять забыл оплатить кружок, закончились разговором о том, как жить дальше.',
    choices: [
      {
        text: 'Пойти к семейному психологу',
        effects: { money: -50000, stress: -15, social: 6 },
        logText: 'Разговор был тяжёлым, но дверь ещё не закрылась.',
        logKind: 'good',
      },
      {
        text: 'Разойтись спокойно',
        effects: { money: -100000, stress: -10, social: -12, addTags: ['status:divorced'] },
        logText: 'Общая жизнь закончилась без красивой сцены. Остались графики, платежи и ребёнок.',
        logKind: 'bad',
      },
    ],
  },
  {
    id: 'smokers_cough',
    minAge: 38,
    maxAge: 42,
    requiredTags: ['status:kurit'],
    metricConditions: { health: { max: 65 } },
    title: 'Кашель',
    text: 'На салфетке остаётся кровь. Врач говорит спокойно, но слово «операция» звучит громче всего кабинета.',
    choices: [
      {
        text: 'Срочно обследоваться и бросить',
        effects: { money: -70000, health: 10, stress: 14, removeTags: ['status:kurit'], addTags: ['status:chronic_illness'] },
        logText: 'Операцию удалось отложить. Сигареты закончились раньше терпения.',
        logKind: 'bad',
      },
      {
        text: 'Сделать вид, что само пройдёт',
        effects: { health: -25, stress: 20, addTags: ['status:chronic_illness'] },
        logText: 'Кашель стал частью распорядка. Врач повторил рекомендацию уже без мягких слов.',
        logKind: 'bad',
      },
    ],
  },
  {
    id: 'burnout_leave',
    minAge: 32,
    maxAge: 45,
    metricConditions: { stress: { min: 85 } },
    forbiddenTags: ['status:burned_out'],
    title: 'Выгорание',
    text: 'Открываешь рабочий ноутбук и не можешь вспомнить пароль. Не потому что забыл — потому что больше не хочешь.',
    choices: [
      {
        text: 'Взять длинный отпуск',
        effects: { money: -60000, stress: -25, health: 8, addTags: ['status:burned_out'] },
        logText: 'Две недели без рабочих чатов вернули способность отличать понедельник от среды.',
        logKind: 'good',
      },
      {
        text: 'Продолжать на силе воли',
        effects: { health: -20, stress: 8, addTags: ['status:burned_out'] },
        logText: 'Сила воли закончилась первой. Организм оформил больничный сам.',
        logKind: 'bad',
      },
    ],
  },
  {
    id: 'apartment_renovation',
    minAge: 30,
    maxAge: 45,
    metricConditions: { money: { max: 180000 } },
    title: 'Ремонт',
    text: 'Сосед сверху снова сверлит в семь утра. Пора решить: обновить квартиру сейчас или научиться жить рядом с перфоратором.',
    choices: [
      {
        text: 'Делать поэтапно и надёжно',
        effects: { money: -120000, stress: 12, health: 4, addTags: ['asset:kvartira'] },
        logText: 'Ремонт растянулся на год, зато розетки теперь не искрят при включении чайника.',
        logKind: 'milestone',
      },
      {
        text: 'Косметика своими руками',
        effects: { money: -30000, stress: 20, health: -4 },
        logText: 'Сэкономил на мастерах. Потратил выходные, сон и уважение к малярному скотчу.',
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
  // ─────────────────────────────── Повседневные события: повторяются
  {
    id: 'daily_childhood',
    minAge: 0,
    maxAge: 6,
    repeatable: true,
    title: 'Обычный день',
    text: 'Игрушки разбросаны по комнате, взрослые заняты своими делами. День просит маленького решения.',
    choices: [
      {
        text: 'Пойти играть во двор',
        effects: { health: 2, stress: -5 },
        logText: 'Набегался во дворе и вернулся домой только к ужину.',
        logKind: 'good',
      },
      {
        text: 'Остаться дома и заняться своим делом',
        effects: { stress: -3, intellect: 2 },
        logText: 'Тихий день дома. Нашёл занятие и никому не мешал.',
        logKind: 'neutral',
      },
    ],
  },
  {
    id: 'daily_school',
    minAge: 7,
    maxAge: 13,
    repeatable: true,
    title: 'Школьный день',
    text: 'Уроки закончились, но до дома ещё далеко. Есть время выбрать, чем заняться после звонка.',
    choices: [
      {
        text: 'Засесть за домашку',
        effects: { intellect: 3, stress: 3 },
        logText: 'Разобрался с уроками раньше остальных и освободил вечер.',
        logKind: 'good',
      },
      {
        text: 'Сбежать к друзьям',
        effects: { social: 3, stress: -5, intellect: -1 },
        logText: 'Домашка подождёт. Вечер прошёл в разговорах и смехе.',
        logKind: 'neutral',
      },
    ],
  },
  {
    id: 'daily_teen',
    minAge: 14,
    maxAge: 17,
    repeatable: true,
    title: 'После школы',
    text: 'До дома ехать несколько остановок. В телефоне новые сообщения, а в голове — планы на вечер.',
    choices: [
      {
        text: 'Встретиться с друзьями',
        effects: { social: 4, stress: -4 },
        logText: 'Погулял с друзьями и узнал последние новости района.',
        logKind: 'good',
      },
      {
        text: 'Подработать или заняться делами',
        effects: { money: 5000, stress: 5, intellect: 1 },
        logText: 'Вечер ушёл на дела. Небольшие деньги, зато полезный опыт.',
        logKind: 'neutral',
      },
    ],
  },
  {
    id: 'daily_adult',
    minAge: 18,
    maxAge: 45,
    repeatable: true,
    title: 'Обычный взрослый день',
    text: 'Работа закончилась, но город ещё не спит. Можно потратить вечер на себя или на то, что давно откладывал.',
    choices: [
      {
        text: 'Выйти прогуляться',
        effects: { health: 2, stress: -5, social: 1 },
        logText: 'Прошёл несколько кварталов пешком. Голова проветрилась.',
        logKind: 'good',
      },
      {
        text: 'Остаться дома и восстановиться',
        effects: { health: 1, stress: -3 },
        logText: 'Отложил дела и дал себе нормально отдохнуть.',
        logKind: 'neutral',
      },
    ],
  },
]

export const EVENTS_BY_ID: Record<string, GameEvent> = Object.fromEntries(
  EVENTS.map((e) => [e.id, e]),
)
