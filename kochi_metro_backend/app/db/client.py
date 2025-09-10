# app/db/client.py
from prisma import Prisma, register

# Instantiate the Prisma client
db = Prisma()
register(db)