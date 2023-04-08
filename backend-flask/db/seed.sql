-- this file was manually created
INSERT INTO public.users (display_name, email, handle, cognito_user_id)
VALUES
  ('Chinedu Obi','hobichinedu@gmail.com','Ulake','35a420f9-1124-4ba8-9497-d9771798b858'),
  ('Andrew Bayko', 'users@exmaple.com', 'bayko','f73f4b05-a59e-468b-8a29-a1c39e7a2222');
  


INSERT INTO public.activities (user_uuid, message, expires_at)
VALUES
  (
    (SELECT uuid from public.users WHERE users.handle = 'Ulake' LIMIT 1),
    'This was imported as seed data!',
    current_timestamp + interval '10 day'
  )