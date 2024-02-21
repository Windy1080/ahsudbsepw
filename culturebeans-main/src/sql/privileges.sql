CREATE USER admin WITH PASSWORD 'root';

-- Gewähren von Privilegien auf die Datenbank
GRANT ALL PRIVILEGES ON DATABASE culturebeans TO admin;

-- Gewähren von Privilegien auf alle Tabellen im Schema public
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO admin;

-- Gewähren von Privilegien auf alle Sequenzen im Schema public
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO admin;

-- Festlegen der Standardprivilegien für neue Tabellen im Schema public
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON TABLES TO admin;

-- Festlegen der Standardprivilegien für neue Sequenzen im Schema public
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON SEQUENCES TO admin;
