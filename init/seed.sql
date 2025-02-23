-- CREATE TABLE IF NOT EXISTS users (
--     id SERIAL PRIMARY KEY,
--     name VARCHAR(50),
--     email VARCHAR(100) UNIQUE
-- );

-- CREATE TABLE IF NOT EXISTS character_classes (
--     id SERIAL PRIMARY KEY,
--     name VARCHAR(50) UNIQUE NOT NULL,
--     base_hp INT NOT NULL,
--     base_mp INT NOT NULL,
--     base_attack INT NOT NULL,
--     base_defense INT NOT NULL
-- );

-- INSERT INTO users (name, email) VALUES
--     ('Alpha', 'alpha@example.com'),
--     ('Beta', 'beta@example.com'),
--     ('Gamma', 'gamma@example.com'),
--     ('Bryan', 'bryprinc@gmail.com')
-- ON CONFLICT (email) DO NOTHING;

-- INSERT INTO character_classes (name, base_hp, base_mp, base_attack, base_defense) VALUES
--     ('Warrior', 15, 3, 3, 3),
--     ('Ranger', 10, 6, 2, 2),
--     ('Wizard', 7, 9, 1, 1)
-- ON CONFLICT (name) DO NOTHING;