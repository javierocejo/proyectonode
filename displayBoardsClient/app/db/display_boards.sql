create table report_days
(display_board_id nvarchar(50) primary key,
hostname nvarchar(50) not null,
name nvarchar(50) not null,
last_seen_at datetime not null,
url nvarchar(50) not null,
display_board_status_id int not null references display_board_statuses(display_board_status_id)
)