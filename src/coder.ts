const key = "MUNCHKIN";
const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export const cesarEncode = (input: string): string => {
  let output: string[] = [];

  for (let i = 0; i < input.length; i++) {
    output.push(
      chars[
        (chars.indexOf(input[i]) + chars.indexOf(key[i % key.length])) %
          chars.length
      ]
    );
  }

  return output.join("");
};

export const cesarDecode = (input: string): string => {
  let output: string[] = [];

  for (let i = 0; i < input.length; i++) {
    output.push(
      chars[
        (chars.length +
          chars.indexOf(input[i]) -
          chars.indexOf(key[i % key.length])) %
          chars.length
      ]
    );
  }

  return output.join("");
};
