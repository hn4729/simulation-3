select * from helo_posts hp
join helo_users hu on hp.user_id = hu.user_id
where hu.username = $1;