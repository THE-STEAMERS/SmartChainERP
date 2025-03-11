# Django Backend Setup Guide

This guide will help you set up the Django backend for your project.

## Prerequisites
Ensure you have the following installed on your system:
- [Python](https://www.python.org/downloads/)
- [pip](https://pip.pypa.io/en/stable/)
- [PostgreSQL](https://www.postgresql.org/download/)

## Setup Steps

### 1. Install Python and pip
Ensure Python and pip are installed on your system. Verify their installation using:
```sh
python --version
pip --version
```
### 2. Create a Virtual Environment
Navigate to the `backend` directory and create a virtual environment:

```sh
python -m venv env
```
### 3. Activate the Virtual Environment
Windows:
```sh
env\Scripts\activate
```
macOS/Linux:
```sh
source env/bin/activate
```
### 4. Install Required Packages
Install the dependencies using:
```sh
pip install -r requirements.txt
```
### 5. Setup PostgreSQL Database
Ensure you have a PostgreSQL instance running locally and create a user with the following SQL commands:
```
CREATE USER username WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE postgres TO username;
ALTER USER username WITH SUPERUSER;
```
Alternatively, you can use the default postgres username with a password.
### 6. Configure Django Settings
Update the DATABASES section in settings.py:
```
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'database_name',
        'USER': 'username',
        'PASSWORD': 'password',
        'HOST': 'localhost',  # If running PostgreSQL locally
        'PORT': '5432',       # Default PostgreSQL port
    }
}
```
### 7. Create a Superuser
Run the following command to create a Django superuser:

```sh
python manage.py createsuperuser
```
### 8. Apply Migrations
Run the migrations for your app:

```sh
python manage.py makemigrations sonyapp
python manage.py migrate
```
### 9. Start the Django Server
Run the development server using:

```sh
python manage.py runserver
```
### 10. Admin Login
Go to the Django admin login page and use the credentials created during the createsuperuser step.

Your Django backend should now be up and running!
