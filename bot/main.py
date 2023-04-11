import os
import random
import psycopg2
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import (
    Updater,
    CommandHandler,
    CallbackQueryHandler,
    ConversationHandler,
    Filters,
    MessageHandler,
    CallbackContext,
)

from dotenv import load_dotenv

load_dotenv()

QUESTION, ANSWERING = range(2)
SITE = os.getenv("SITE_LINK")


def start(update: Update, context: CallbackContext) -> None:
    update.message.reply_text(
        "Привіт!\U0001F44B \nТебе вітає Lwine bot. "
        "Це бот-гра, якщо написати команду /game "
        "можна зіграти у гру 'вгадай параметри вина по назві'. "
        "Ви завжди можете переглянути правила за допомогою команди /help"
    )


def site(update: Update, context: CallbackContext) -> None:
    update.message.reply_text(
        f"Ви можете побачити наш сайт натиснувши на посилання: {SITE}"
    )


def help(update: Update, context: CallbackContext) -> None:
    update.message.reply_text(
        "Lwine - це бот-гра. "
        "Вам треба відповісти на питання, які задає бот. \U0001F4DD\n"
        "Sуть цієї гри — по назві вина вгадати його характеристики "
        "(тип вина, солодкість, країна походження та відсоток алкоголю). \U0001F377\n"
        "Також ви маєте підказку у вигляді фотографії вина.\U0001F607 "
        "\nВаріанти відповіді:\n"
        "1) Солодкість: сухе, напівсухе, напівсолодке, солодке, брют\n"
        "2) Тип вина: червоне, біле, рожеве\n"
        "3) Країна: Треба написати назву країни з якої вино, на вашу думку\n"
        "4) Відсоток алкоголю: Треба написати відсоток алкоголю вина з похибкою 0.4\n\n"
        "Успіхів! \U0001F64C \U0001F60A"
    )


def game(update: Update, context: CallbackContext, user_id: int = None) -> None:
    if user_id is None:
        user_id = update.effective_user.id
    conn = psycopg2.connect(
        host=os.getenv("DB_HOST"),
        database=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
    )
    cur = conn.cursor()
    cur.execute(
        """
        SELECT name, country_id, sweetness, percent_of_alcohol, wine_type, image_url
        FROM wine_map_wine
        ORDER BY RANDOM()
        LIMIT 1
    """
    )
    wine_data = cur.fetchone()

    cur.execute(
        """
        SELECT id, name
        FROM wine_map_country
        WHERE id = %s
    """,
        (wine_data[1],),
    )
    country_data = cur.fetchone()
    questions = []
    if wine_data[1] is not None:
        questions.append(
            {
                "question": "Вгадайте країну виробника вина? (Наприклад: Італія)",
                "answer": country_data[1],
            }
        )
    if wine_data[2] is not None:
        questions.append(
            {
                "question": "Вгадайте солодкість вина? (Наприклад: напівсухе)",
                "answer": wine_data[2],
            }
        )
    if wine_data[3] is not None:
        questions.append(
            {
                "question": "Вгадайте відсоток алкоголю у вині? (Наприклад: 12.0)",
                "answer": wine_data[3],
            }
        )
    if wine_data[4] is not None:
        questions.append(
            {
                "question": "Вгадайте тип вина? (Наприклад: червоне)",
                "answer": wine_data[4],
            }
        )

    random.shuffle(questions)
    context.user_data[user_id] = {
        "answers": [],
        "questions": questions,
        "total_questions": len(questions),
        "points": 0,
        "wine_data": wine_data,
        "help_used": False,
    }

    return ask_question(update, context, user_id)


def ask_question(update: Update, context: CallbackContext, user_id: int) -> None:
    if not context.user_data[user_id]["questions"]:
        return game_over(update, context, user_id)

    question = context.user_data[user_id]["questions"].pop(0)

    context.user_data[user_id]["current_question"] = question
    context.user_data[user_id]["answers"].append(str(question["answer"]))
    wine_name = context.user_data[user_id]["wine_data"][0]
    question_text = question["question"]

    message = f"Назва вина: {wine_name}\n\n{question_text}"

    buttons = [
        InlineKeyboardButton("Пропустити питання", callback_data="skip"),
    ]

    if not context.user_data[user_id]["help_used"]:
        buttons.append(InlineKeyboardButton("Взяти підказку", callback_data="help"))

    if update.callback_query:
        query = update.callback_query
        query.answer()
        query.edit_message_text(
            text=message, reply_markup=InlineKeyboardMarkup.from_column(buttons)
        )
    else:
        update.message.reply_text(
            message, reply_markup=InlineKeyboardMarkup.from_column(buttons)
        )

    return ANSWERING


def answer_question(update: Update, context: CallbackContext) -> None:
    user_id = update.effective_user.id
    if update.callback_query:
        query = update.callback_query
        query.answer()
        response = query.data.lower()
    else:
        response = update.message.text.lower()

    question = context.user_data[user_id]["current_question"]

    if question == "Вгадайте відсоток алкоголю у вині? (Наприклад: 12.0)":
        try:
            response_float = float(response)
            if abs(response_float - question["answer"]) < 0.4:
                context.user_data[user_id]["points"] += 1
        except ValueError:
            pass
    elif response == str(question["answer"]).lower():
        context.user_data[user_id]["points"] += 1

    return ask_question(update, context, user_id)


def help_question(update: Update, context: CallbackContext):
    user_id = update.effective_user.id
    query = update.callback_query
    query.answer()

    image_url = context.user_data[user_id]["wine_data"][5]
    context.bot.send_photo(
        chat_id=query.message.chat_id,
        photo=image_url,
        caption="Ось вам фото вина!"
    )
    context.user_data[user_id]["help_used"] = True
    message = query.message.text
    buttons = [
        InlineKeyboardButton("Пропустити питання", callback_data="skip")
    ]
    if context.user_data[user_id]["help_used"] is False:
        buttons.append(InlineKeyboardButton("Взяти підказку", callback_data="help"))
    query.edit_message_text(
        text=message,
        reply_markup=InlineKeyboardMarkup.from_column(buttons)
    )

    return ANSWERING


def skip_question(update: Update, context: CallbackContext):
    user_id = update.effective_user.id
    query = update.callback_query
    query.answer()

    return ask_question(update, context, user_id)


def game_over(update: Update, context: CallbackContext, user_id: int):
    points = context.user_data[user_id]["points"]
    total_questions = context.user_data[user_id]["total_questions"]
    answers = ", ".join(context.user_data[user_id]["answers"])
    if points == 0:
        result_text = (
            "Хм, мабуть Ви зовсім не знаєте це вино. "
            "Пропоную ознайомитись з ним, а можливо, навіть i спробувати його 😏🍷 "
            "Можете перейти за посиланням та подивитись у кого з наших партнерів "
            f"його можна придбати: {SITE}"
        )
    elif 1 <= points <= 2:
        result_text = (
            "Видно, щось-таки про це вино Ви знаєте, а можливо просто вгадали 🙈 "
            "Можливо Вам захочеться ознайомитись з цим вином краще 😏 "
            "Можете перейти за посиланням та подивитись у кого з наших партнерів "
            f"його можна придбати: {SITE}"
        )
    elif points == 3:
        result_text = (
            "Непогано, ще трішки, і станете знавцем цієї галузі. За такий гарний  "
            "результат пропонуємо Вам ознайомитись з наявністю даного вина у наших "
            f"партнерів за посиланням: {SITE}😉 А ще, даємо "
            "Вам особисту знижку 10% на це вино. Ось Ваш промокод: 10LWINE2023 🤫"
        )

    elif points == 4:
        result_text = (
            "А Ви майстер своєї справи😱 За такі приголомшливі результати "
            "хочемо подарувати Вам знижку на це вино у розмірі 20% від "
            "стандартної ціни. Використати знижку Ви можете за допомогою "
            "промокоду: 20LWINE2023, який діє у всіх магазинах-партнерах. Щоб "
            "дізнатись, в яких магазинах є це вино, перейдіть за посиланням: "
            f"{SITE}🍷🔥"
        )

    message = (
        f"Ви заробили {points}/{total_questions} балів.\U0001F44C \n\n{result_text}\n\n"
        f"Правильні відповіді: {answers}\n\n"
        f"Бажаєте зіграти ще раз?\U0001F60E"
    )
    image_url = context.user_data[user_id]["wine_data"][5]

    if update.callback_query:
        chat_id = update.callback_query.message.chat_id
    else:
        chat_id = update.message.chat_id
    chat_id = update.message.chat_id
    buttons = [
        InlineKeyboardButton("Так", callback_data="play_again"),
        InlineKeyboardButton("Ні", callback_data="quit")
    ]

    if update.callback_query:
        query = update.callback_query
        query.answer()
        context.bot.send_photo(chat_id=chat_id, photo=image_url)
        query.edit_message_text(
            text=message,
            reply_markup=InlineKeyboardMarkup.from_column(buttons)
        )
    else:
        context.bot.send_photo(chat_id=chat_id, photo=image_url)
        update.message.reply_text(
            message,
            reply_markup=InlineKeyboardMarkup.from_column(buttons)
        )

    return QUESTION


def play_again(update: Update, context: CallbackContext):
    user_id = update.effective_user.id
    query = update.callback_query
    query.answer()

    return game(update, context, user_id)


def quit_game(update: Update, context: CallbackContext):
    query = update.callback_query
    query.answer()

    query.edit_message_text(text="Дякуємо за гру! На все добре!")

    return ConversationHandler.END


def main():
    updater = Updater(os.getenv("BOT_TOKEN"))

    dp = updater.dispatcher

    conv_handler = ConversationHandler(
        entry_points=[
            CommandHandler(
                "game",
                lambda update, context: game(update, context, update.effective_user.id)
            )
        ],
        states={
            QUESTION: [
                CallbackQueryHandler(play_again, pattern="^play_again$"),
                CallbackQueryHandler(quit_game, pattern="^quit$"),
            ],
            ANSWERING: [
                MessageHandler(Filters.text, answer_question),
                CallbackQueryHandler(help_question, pattern="^help$"),
                CallbackQueryHandler(skip_question, pattern="^skip$"),
            ],
        },
        fallbacks=[
            CommandHandler(
                "game",
                lambda update, context: game(update, context, update.effective_user.id)
            )
        ]
    )

    dp.add_handler(CommandHandler("start", start))
    dp.add_handler(CommandHandler("site", site))
    dp.add_handler(CommandHandler("help", help))
    dp.add_handler(conv_handler)

    updater.start_polling()

    updater.idle()


if __name__ == "__main__":
    main()
