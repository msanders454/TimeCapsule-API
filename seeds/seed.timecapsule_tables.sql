BEGIN;

TRUNCATE
    capsules,
    users
    RESTART IDENTITY CASCADE;

INSERT INTO users(full_name, user_name, password)
VALUES
    ('Dunder Mifflin', 'dundermifflin', 'PaperCompany@2500'),
    ('Carson Wentz', 'footballguy101', 'Password123@'),
    ('Mike Sanders', 'msanders454', 'Yogurt123@');

INSERT INTO capsules(title, note, usernumber, imageurl )
VALUES
    ('First Kiss', 'amazing', 1, ''),
    ('Beat the Cowboys', 'They Suck', 2, 'https://media.makeameme.org/created/cowboys-suck-dd39051623.jpg'),
    ('Animal Crossing', 'The game is fun', 3, 'https://www.nme.com/wp-content/uploads/2020/03/Switch_ACNH_0220-Direct_Advanced_SCRN_08.jpg');
COMMIT;
