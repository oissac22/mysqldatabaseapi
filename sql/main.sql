create database if not exists meubancodedados CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

use meubancodedados;

create table if not exists users(
    id int primary key auto_increment,
    name char(50) not null,
    user char(30) not null,
    pass char(55) not null
)engine=myisam;

create table if not exists users_photo(
    id_users int primary key,
    photo longblob null
)engine=myisam;


insert into users (name, user, pass)
    values
        ('Cássio','cassio',password('123456')),
        ('Marcos','marcos',password('12345')),
        ('Ana','ana',password('1234567'));