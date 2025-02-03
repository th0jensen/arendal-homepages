# Arendal Companies Directory

A web application that displays information about companies in Arendal, including their websites, establishment dates, and business types.

## Database Setup

This project uses a MySQL-compatible database. You can use any MySQL-compatible database service (like PlanetScale) or a local MySQL instance.

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
DATABASE_HOST=your_database_host
DATABASE_USERNAME=your_database_username
DATABASE_PASSWORD=your_database_password
DATABASE_NAME=your_database_name
```

For local development:
- DATABASE_HOST defaults to "localhost"
- DATABASE_USERNAME defaults to "root"
- DATABASE_PASSWORD defaults to ""
- DATABASE_NAME defaults to "arendal-homepages"

## Development

```bash
# Start the project
deno task start
```

## Deployment

This project is configured for deployment on Deno Deploy.

1. Create a new project on Deno Deploy
2. Link your GitHub repository
3. Add the required environment variables in the Deno Deploy dashboard
4. Deploy!

The application will automatically connect to your configured database using SSL in production.
