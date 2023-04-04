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
)
from dotenv import load_dotenv

load_dotenv()

QUESTION, ANSWERING = range(2)


def start(update: Update, context):
    update.message.reply_text(
        "Привіт! Тебе вітає Lwine bot. "
        "Це бот-гра, якщо написати команду /game "
        "можна зіграти у гру вгадай параметри вина по назві. "
        "Ви завжди можете переглянути правила за допомогою команди /help"
    )


def site(update: Update, context):
    site_url = "http://127.0.0.1:8000/"
    update.message.reply_text(
        f"Ви можете побачити наш сайт натиснувши на посилання: {site_url}"
    )


def help(update: Update, context):
    update.message.reply_text(
        "Lwine - це бот-гра. Вам треба відповісти на питання, які задає бот. "
        "Також ви маєте підказку у вигляді фотографії вина. \nФормати відповіді: "
        "\n1)Солодкість: сухе, напівсухе, напівсолодке, солодке, брют "
        "\n2)Тип вина: червоне, біле, рожеве "
        "\n3)Країна: Треба написати назву країни з якої вино, на вашу думку "
        "\n4)Відсоток алкоголю: Треба написати відсоток алкоголю вина з похибкою 0.4 "
    )


def game(update: Update, context):
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
    context.user_data["answers"] = []
    context.user_data["questions"] = questions
    context.user_data["total_questions"] = len(context.user_data["questions"])
    context.user_data["points"] = 0
    context.user_data["wine_data"] = wine_data
    context.user_data["help_used"] = False

    return ask_question(update, context)


def ask_question(update, context):
    if not context.user_data["questions"]:
        return game_over(update, context)

    question = context.user_data["questions"].pop(0)

    context.user_data["current_question"] = question
    context.user_data["answers"].append(str(question["answer"]))
    wine_name = context.user_data["wine_data"][0]
    question_text = question["question"]

    message = f"Назва вина: {wine_name}\n\n{question_text}"

    buttons = [
        InlineKeyboardButton("Пропустити питання", callback_data="skip"),
    ]

    if context.user_data["help_used"] is False:
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


def answer_question(update: Update, context):
    if update.callback_query:
        query = update.callback_query
        query.answer()
        response = query.data.lower()
    else:
        response = update.message.text.lower()

    question = context.user_data["current_question"]

    if question == "Вгадайте відсоток алкоголю у вині? (Наприклад: 12.0)":
        try:
            response_float = float(response)
            if abs(response_float - question["answer"]) < 0.4:
                context.user_data["points"] += 1
        except ValueError:
            pass
    elif response == str(question["answer"]).lower():
        context.user_data["points"] += 1

    return ask_question(update, context)


def help_question(update: Update, context):
    query = update.callback_query
    query.answer()

    if context.user_data["help_used"]:
        message = (
            "Ви вже скористалися підказкою! "
            "Будь ласка, продовжуйте відповідати на питання."
        )
        query.edit_message_text(text=message)
    else:
        image_url = context.user_data["wine_data"][5]
        context.bot.send_photo(
            chat_id=query.message.chat_id,
            photo=image_url,
            caption="Ось вам фото вина!"
        )
        context.user_data["help_used"] = True
        message = query.message.text
        buttons = [
            InlineKeyboardButton("Пропустити питання", callback_data="skip")
        ]
        if context.user_data["help_used"] is False:
            buttons.append(InlineKeyboardButton("Взяти підказку", callback_data="help"))
        query.edit_message_text(
            text=message,
            reply_markup=InlineKeyboardMarkup.from_column(buttons)
        )

    return ANSWERING


def skip_question(update: Update, context):
    query = update.callback_query
    query.answer()

    return ask_question(update, context)


def game_over(update: Update, context):
    points = context.user_data["points"]
    total_questions = context.user_data["total_questions"]
    answers = ", ".join(context.user_data["answers"])
    message = f"Ви заробили {points}/{total_questions} балів. Бажаєте зіграти ще раз?" \
        f"\nПравильні відповіді: {answers}"
    image_url = context.user_data["wine_data"][5]

    if update.callback_query:
        chat_id = update.callback_query.message.chat_id
    else:
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


def play_again(update: Update, context):
    query = update.callback_query
    query.answer()

    return game(update, context)


def quit_game(update: Update, context):
    query = update.callback_query
    query.answer()

    query.edit_message_text(text="Дякуємо за гру! На все добре!")

    return ConversationHandler.END


def main():
    updater = Updater(os.getenv("BOT_TOKEN"))

    dp = updater.dispatcher

    conv_handler = ConversationHandler(
        entry_points=[CommandHandler("game", game)],
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
        fallbacks=[CommandHandler("game", game)],
    )

    dp.add_handler(CommandHandler("start", start))
    dp.add_handler(CommandHandler("site", site))
    dp.add_handler(CommandHandler("help", help))
    dp.add_handler(conv_handler)

    updater.start_polling()

    updater.idle()


if __name__ == "__main__":
    main()
