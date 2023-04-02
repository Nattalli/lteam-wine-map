from apscheduler.schedulers.background import BackgroundScheduler
from wine_map.wine_scheduler.jobs import wine_of_the_day_generator


def start():
    scheduler = BackgroundScheduler()
    scheduler.add_job(wine_of_the_day_generator, 'interval', seconds=86400)
    scheduler.start()
