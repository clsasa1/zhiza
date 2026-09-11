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
  'status:kurit': 'Курит',
  'status:student_budget': 'Студент-бюджетник',
  'status:uklonist': 'Уклонист',
  'status:job_office': 'Офис',
  'status:freelance': 'Фриланс',
  'status:job_business': 'Свой бизнес',
  'status:ipoteka': 'Ипотека',
  'status:debt_hole': 'Долговая яма',
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
  'asset:dacha': 'Дача',
  'asset:car_foreign': 'Иномарка',
  'trait:boss': 'Начальник',
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
