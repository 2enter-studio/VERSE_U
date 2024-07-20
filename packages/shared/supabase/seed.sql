insert into texture_types (value)
values ('baseColor'),
       ('metallic'),
       ('roughness'),
       ('specular'),
       ('normal'),
       ('emissive');


insert into body_parts (value)
values ('Head'),
    ('Neck'),
    ('Chest'),
    ('Spine'),
    ('ArmL'),
    ('ArmR'),
    ('ShoulderR'),
    ('ShoulderL'),
    ('ForArmL'),
    ('ForArmR'),
    ('HandR'),
    ('HandL'),
    ('Hip'),
    ('ThighL'),
    ('ThighR'),
    ('CalfL'),
    ('CalfR'),
    ('AnkleL'),
    ('AnkleR'),
    ('FootL'),
    ('FootR');


insert into meshes default values;

insert into  wearing_types (value)
values ('wearing_type_0');

insert into regions (x, y) values 
    (0.5, 0.32),
    (0.6, 0.43),
    (0.35, 0.7),
    (0.68, 0.73),
    (0.28, 0.55);
    
insert into sponsors (value) values ('the_place');

insert into storage.buckets (id, name, public)
values 
    ('regions', 'regions', true),
    ('wearings', 'wearings', true),
    ('meshes', 'meshes', true),
    ('user_data', 'user_data', false);
