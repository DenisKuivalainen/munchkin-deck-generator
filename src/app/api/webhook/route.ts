"use server";

import axios from "axios";

type TelegramUpdate = {
  update_id: number;
  message: {
    message_id: number;
    from: {
      id: number;
      is_bot: boolean;
      first_name: string;
      last_name?: string;
      username?: string;
      language_code?: string;
    };
    chat: {
      id: number;
      title?: string;
      type: "private" | "group" | "supergroup" | "channel";
    };
    date: number;
    text?: string;
    entities?: {
      offset: number;
      length: number;
      type:
        | "mention"
        | "hashtag"
        | "bot_command"
        | "url"
        | "email"
        | "bold"
        | "italic"
        | "underline"
        | "strikethrough"
        | "spoiler"
        | "code"
        | "pre"
        | "text_link"
        | "text_mention";
    }[];
  };
};

const sendMessage = (chat_id: number, message: string) =>
  axios.post(
    `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      chat_id,
      text: message,
    }
  );

const sendPoll = (chat_id: number, question: string, options: string[]) =>
  axios.post(
    `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendPoll`,
    {
      chat_id,
      question,
      options: JSON.stringify(options),
      is_anonymous: false,
      allows_multiple_answers: true,
      type: "regular",
      disable_notification: true,
    }
  );

export async function POST(req: Request) {
  try {
    const payload: TelegramUpdate | undefined = await req
      .json()
      .catch(() => undefined);
    if (!payload)
      return Response.json({ error: "Missing payload" }, { status: 400 });

    const chatId = payload.message.chat.id;

    if (payload.message.text?.startsWith("/poll")) {
      await sendMessage(chatId, "Колодогенерируйте!");

      await sendPoll(chatId, "Модификации игры (выберите 2)", [
        "Подземелья",
        "Скакуны",
        "Наемнички",
        "Усилители расы и класса",
        "Усилители брони и оружия",
      ]);

      await sendPoll(chatId, "Расы (выберите 4)", [
        "Эльфы",
        "Хафлинги",
        "Дварфы",
        "Гномы",
        "Орки",
        "Ящерки",
        "Кентавры (только если в предыдущем опросе вы выбрали скакунов)",
      ]);

      await sendPoll(chatId, "Классы (снова 4)", [
        "Воин",
        "Волшебник",
        "Клирик",
        "Вор",
        "Следопыт",
        "Бард",
      ]);
    }

    return Response.json({ message: "Data received" }, { status: 200 });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
