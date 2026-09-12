import type { Tag } from './types'

export type TagCategory = 'trait' | 'status' | 'asset' | 'rel'

// Человекочитаемые подписи для тегов. Неизвестные теги форматируются автоматически.
const TAG_LABELS: Record<string, string> = {
  'trait:shram': 'Шрам',
  'trait:ostorozhnyy': 'Осторожный',
  'trait:boevoy': 'Боевой',
  'trait:travma_detstva': 'Травма детства',
  'trait:umnik': 'Умник',
  'trait:vernyy': 'Верный',
  'trait:komputerschik': 'Компьютерщик',
  'trait:berezhlivyy': 'Бережливый',
  'trait:rabotyaga': 'Работяга',
  'trait:introvert': 'Интроверт',
  'trait:avantyurist': 'Авантюрист',
  'trait:otmorozok': 'Отморозок',
  'trait:uporstvo': 'Упорство',
  'trait:sluzhil': 'Отслужил',
  'trait:predprinimatel': 'Предприниматель',
  'trait:tsinik': 'Циник',
  'trait:prorabotal': 'Проработал травму',
  'trait:invalidnost': 'Инвалидность',
  'trait:faker': 'Фальшивый фасад',
  'trait:belated_grief': 'Запоздалое горе',
  'trait:emo': 'Эмо',
  'asset:tv_stash': 'Запас техники',
  'status:kurit': 'Курит',
  'status:student_budget': 'Студент-бюджетник',
  'status:uklonist': 'Уклонист',
  'status:job_office': 'Офис',
  'status:freelance': 'Фриланс',
  'status:job_business': 'Свой бизнес',
  'status:ipoteka': 'Ипотека',
  'status:debt_hole': 'Долговая яма',
  'status:family_poor': 'Семья живёт трудно',
  'status:family_commercial': 'Семья в торговле',
  'status:ptu': 'ПТУ',
  'status:school_track': 'Старшие классы',
  'status:market_runner': 'Помощник на рынке',
  'status:student_paid': 'Платное обучение',
  'status:gap_year': 'Академический год',
  'status:high_school': 'Старшие классы',
  'status:student': 'Студент',
  'status:dorm': 'Общежитие',
  'status:graduate': 'Высшее образование',
  'status:rented_home': 'Съёмное жильё',
  'status:job_factory': 'Заводская работа',
  'status:remote_work': 'Удалённая работа',
  'status:it_worker': 'IT-специалист',
  'status:empty_nest': 'Пустое гнездо',
  'status:mentor': 'Наставник',
  'status:retired': 'Пенсия',
  'status:pyet': 'Пьёт',
  'asset:kvartira': 'Квартира',
  'asset:dolya_v_biznese': 'Доля в бизнесе',
  'rel:vitёk_dolzhnik': 'Витёк должник',
  'rel:vitёk_obida': 'Витёк в обиде',
  'rel:pervaya_lyubov': 'Первая любовь',
  'status:midlife_crisis': 'Кризис среднего возраста',
  'status:burned_out': 'Выгорание',
  'status:divorced': 'Разведён',
  'status:chronic_illness': 'Хроническое заболевание',
  'status:ulcer': 'Язва',
  'status:aging_body': 'Возрастной износ',
  'asset:dacha': 'Дача',
  'asset:books': 'Книги',
  'asset:piano': 'Пианино',
  'asset:pc': 'Системный блок',
  'asset:car_domestic': 'Подержанная «восьмёрка»',
  'asset:old_car': 'Старый автомобиль',
  'asset:lada_vaz': 'Старая «Лада»',
  'asset:stall': 'Рыночный ларёк',
  'asset:car_foreign': 'Иномарка',
  'asset:foreign_car': 'Современная иномарка',
  'asset:modern_car': 'Современный автомобиль',
  'asset:garage': 'Гаражный бокс',
  'asset:garage_repaired': 'Сухой гараж',
  'trait:boss': 'Начальник',
  'trait:intellectual_home': 'Интеллигентный дом',
  'trait:hyper_care': 'Гиперопека',
  'rel:child_born': 'Ребёнок',
  'rel:parents_ill': 'Родители болеют',
}

export const CATEGORY_COLORS: Record<TagCategory, string> = {
  trait: 'border-chart-3/40 text-chart-3',
  status: 'border-primary/50 text-primary',
  asset: 'border-chart-4/40 text-chart-4',
  rel: 'border-chart-5/40 text-chart-5',
}

export function tagLabel(tag: Tag): string {
  if (TAG_LABELS[tag]) return TAG_LABELS[tag]
  const raw = tag.split(':')[1] ?? tag
  return raw.replace(/_/g, ' ')
}

export function tagCategory(tag: Tag): TagCategory {
  return tag.split(':')[0] as TagCategory
}
