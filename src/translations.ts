const translations: Record<string, string> = {
  DOOR: "Карты дверей",
  TREASURE: "Карты сокровищ",
  "DOOR-WALKING": "Бродячие",
  "DOOR-CHEAT": "Читы",
  "DOOR-RACE": "Расы",
  "DOOR-CLASS": "Классы",
  "DOOR-MODIFIER": "Модификаторы расы и класса",
  "DOOR-MONSTER": "Монстры",
  "DOOR-COMMON": "Прочее",
  "DOOR-MONSTER_BOOST": "Усилители монстров",
  "DOOR-CURSE": "Проклятия",
  "DOOR-PORTAL": "Порталы",
  "DOOR-PET": "Скакуны и наемнички",
  "TREASURE-ONE_HAND": "1 рука",
  "TREASURE-TWO_HANDS": "2 руки",
  "TREASURE-BOOTS": "Обувки",
  "TREASURE-BODY": "Броники",
  "TREASURE-HAT": "Головняки",
  "TREASURE-OTHER": "Прочие шмотки",
  "TREASURE-RING": "Кольца",
  "TREASURE-DICE": "Кубики",
  "TREASURE-FREE": "Прочее",
  "TREASURE-ONE_TIME": "Одноразовые",
  "TREASURE-GAIN_LVL": "Получи уровень",
  "TREASURE-HIRELING_BOOST": "Усилители наемничков",
  "TREASURE-HIRELING": "Hаемнички",
  "TREASURE-MOUNT_BOOST": "Усилители скакунов",
  "TREASURE-GEAR_BOOST": "Усилители шмоток",
  mounts: "Скакуны",
  hirelings: "Hаемнички",
  ultramanchkins: "Ультраманчкины",
  dungeons: "Подземелья",
  undeads: "Андеды",
  stronger_monsters: "Опасные монстры",
  sharper_weapons: "Усиленные шмотки",
  extended_deck: "Большая колода",
  cler: "Клирики",
  mage: "Волшебники",
  warrior: "Воины",
  thief: "Воры",
  ranger: "Следопыты",
  bard: "Барды",
  dward: "Дварфы",
  hafling: "Хафлинги",
  gnome: "Гномы",
  elf: "Эльфы",
  ork: "Орки",
  lizard: "Ящерки",
  kent: "Кентавры",
  continue: "Продолжить",
  back: "Назад",
  redo: "Переделать",
  download: "Скачать .png",
  copyUrl: "Копировать URL",
};

export const T = (key: string) => translations[key] || key;
