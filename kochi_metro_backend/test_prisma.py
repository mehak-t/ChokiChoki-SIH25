# test_prisma.py
import asyncio
from app.db.client import db

async def main() -> None:
    """
    A simple script to test the Prisma Client connection independently.
    """
    print("--- Running Prisma Client Standalone Test ---")
    try:
        # This is the line that gets called when your FastAPI app starts
        await db.connect()
        print("✅ SUCCESS: Prisma client connected to the database successfully!")

        # Let's try a simple query to be 100% sure
        asset_count = await db.assets.count()
        print(f"✅ QUERY OK: Found {asset_count} assets in your database.")

    except RuntimeError as e:
        print("\n❌ FAILURE: The same RuntimeError occurred. This means the issue is fundamental to Prisma's setup or environment.")
        print(f"Error details: {e}")
        print("\nSUGGESTION: Try deleting the 'venv' folder and re-running all setup steps from scratch, including `pip install` and `prisma generate`.")

    except Exception as e:
        print(f"\n❌ FAILURE: An unexpected error occurred: {e}")
        print("This could be a database connection issue (check your .env file) or another problem.")

    finally:
        if db.is_connected():
            await db.disconnect()
            print("--- Test complete. Disconnected. ---")


if __name__ == "__main__":
    # We need to ensure the `register` fix is in place for this test
    # This is normally handled by the main app, but we add it here for safety.
    from prisma import register
    register(db)
    
    asyncio.run(main())
