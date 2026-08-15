CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  assigned_role public.app_role;
BEGIN
  INSERT INTO public.profiles (id, full_name, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), ' ', 1)))
  ON CONFLICT (id) DO NOTHING;

  -- Check if the frontend sent a requested role
  IF NEW.raw_user_meta_data->>'requested_role' = 'professional' THEN
    assigned_role := 'professional';
  ELSE
    assigned_role := 'client';
  END IF;

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, assigned_role) ON CONFLICT DO NOTHING;

  -- Only create default meal schedules for clients
  IF assigned_role = 'client' THEN
    INSERT INTO public.meal_schedules (user_id, name, scheduled_time, sort_order) VALUES
      (NEW.id, 'Café da manhã', '07:30', 1),
      (NEW.id, 'Lanche da manhã', '10:30', 2),
      (NEW.id, 'Almoço', '12:30', 3),
      (NEW.id, 'Lanche da tarde', '16:00', 4),
      (NEW.id, 'Jantar', '20:00', 5);
  END IF;

  RETURN NEW;
END; $$;
