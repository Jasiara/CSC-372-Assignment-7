-- create tables
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS jokes (
  id SERIAL PRIMARY KEY,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  setup TEXT NOT NULL,
  delivery TEXT NOT NULL
);

INSERT INTO categories (name) VALUES ('funnyJoke') ON CONFLICT DO NOTHING;
INSERT INTO categories (name) VALUES ('lameJoke') ON CONFLICT DO NOTHING;

INSERT INTO jokes (category_id, setup, delivery)
SELECT c.id, s.setup, s.delivery FROM (VALUES
  ('Why did the student eat his homework?', 'Because the teacher told him it was a piece of cake!'),
  ('What kind of tree fits in your hand?', 'A palm tree'),
  ('What is worse than raining cats and dogs?', 'Hailing taxis')
) AS s(setup, delivery), categories c WHERE c.name='funnyJoke'
ON CONFLICT DO NOTHING;

INSERT INTO jokes (category_id, setup, delivery)
SELECT c.id, s.setup, s.delivery FROM (VALUES
  ('Which bear is the most condescending?', 'Pan-DUH'),
  ('What would the Terminator be called in his retirement?', 'The Exterminator')
) AS s(setup, delivery), categories c WHERE c.name='lameJoke'
ON CONFLICT DO NOTHING;

ALTER TABLE jokes
ADD CONSTRAINT fk_category
FOREIGN KEY (category_id)
REFERENCES categories(id)
ON DELETE CASCADE;
