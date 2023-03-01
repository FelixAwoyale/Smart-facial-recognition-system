from dotenv import load_dotenv
import os
load_dotenv()
database_name = os.environ.get("database_name")
database_user =os.environ.get("database_user")
database_password = os.environ.get("database_password")
database_test_name = os.environ.get("database_test_name")