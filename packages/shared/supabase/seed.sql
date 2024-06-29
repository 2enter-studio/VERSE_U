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

insert into storage.buckets (id, name, public)
values 
    ('regions', 'regions', true),
    ('wearings', 'wearings', true),
    ('meshes', 'meshes', true),
    ('user_data', 'user_data', false);

