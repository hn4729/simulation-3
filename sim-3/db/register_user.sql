insert into helo_users (username, password)
values ($1, $2)
returning *;