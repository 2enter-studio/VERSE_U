set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.agree_friendship(chat_id uuid)
 RETURNS void
 LANGUAGE plpgsql
AS $function$BEGIN
  -- Update the 'agree' column in the 'public.chat_members' table
  UPDATE public.chat_members 
  SET agree = true 
  WHERE user = auth.uid() AND chat = chat_id;
  
  RAISE NOTICE 'Chat member % has successfully agreed to chat %', user_id, chat_id;
END;$function$
;

CREATE OR REPLACE FUNCTION public.start_new_chat(target_user_id uuid, first_message text)
 RETURNS uuid
 LANGUAGE plpgsql
AS $function$ 
DECLARE 
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
END; 
  $function$
;


