set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.agree_friendship(chat_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
  UPDATE public.chat_members 
  SET agree = true 
  WHERE "user" = auth.uid() AND chat = chat_id;
END;$function$
;


