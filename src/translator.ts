const ru =
  `йцукенгшщзхъфывапролджэячсмитьбю.ЙЦУКЕНГШЩЗХЪФЫВАПРОЛДЖЭ//ЯЧСМИТЬБЮ,`.split(
    ""
  );
const en =
  `qwertyuiop[]asdfghjkl;'zxcvbnm,./QWERTYUIOP{}ASDFGHJKL:"||ZXCVBNM<>?`.split(
    ""
  );

const enRu = Object.fromEntries(en.map((c, i) => [c, ru[i]]));

export const enToRu = (str: string) =>
  str
    .split("")
    .map((c) => enRu[c] || c)
    .join("");
