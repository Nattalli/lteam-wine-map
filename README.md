# Lteam project - Wine map site

## Installing using Github

Python 3.10+ is a must


1. Clone the repository in the terminal:
`git clone https://github.com/Nattalli/lteam-wine-map.git`
2. Make the following command and populate it with required data:
`cp .env.sample .env`
3. Create virtual env:
`python3.9 -m venv venv`
4. Setup virtual env:
    * On Windows: `venv\Scripts\activate`
    * On Linux or MacOS: `source venv/bin/activate`
5. Go to the `backend` folder `cd backend`
6. And mark it as the source root 
![mark-as-source-root](Знімок%20екрана%202023-02-26%20о%2013.56.50.png)
7. Install requirements: `pip install -r requirements.txt`
8. Make migrations: `python manage.py migrate`  
9. Now you can run it: `python manage.py runserver`
