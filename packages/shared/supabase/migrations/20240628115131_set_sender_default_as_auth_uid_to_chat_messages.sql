alter table "public"."chat_messages" alter column "sender" set default auth.uid();

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.start_new_chat(target_user_id uuid, first_message text)
 RETURNS uuid
 LANGUAGE plpgsql
AS $function$DECLARE 
  chat_id uuid; 
BEGIN 
  SELECT gen_random_uuid() into chat_id;

  INSERT INTO chats (id) VALUES (chat_id); 
  
  INSERT INTO chat_members (chat, "user", agree) VALUES 
    (chat_id, auth.uid(), false), 
    (chat_id, target_user_id, false); 
  
  INSERT INTO chat_messages (chat, sender, content) VALUES 
    (chat_id, auth.uid(), first_message); 
  
  RETURN chat_id; 
END;$function$
;


