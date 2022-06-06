CREATE TABLE blogs (
  id SERIAL PRIMARY KEY,
  author text,
  url text NOT NULL,
  title text NOT NULL,
  likes int DEFAULT 0
);

insert into blogs (author, url, title) values ('Martin Fowler', 'https://martinfowler.com/bliki/ApplicationDatabase.html', 'Application Database');
insert into blogs (author, url, title) values ('Martin Fowler', 'https://martinfowler.com/bliki/RelationalDataModel.html', 'Relational Data Model');