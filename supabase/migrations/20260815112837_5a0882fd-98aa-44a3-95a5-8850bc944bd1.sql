-- helpers
CREATE OR REPLACE FUNCTION public.update_updated_at_column() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    EXECUTE 'CREATE TYPE public.app_role AS ENUM (''client'',''professional'',''admin'')';
  END IF;
END
$$;

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT,
  display_name TEXT,
  birth_date DATE,
  height_cm NUMERIC(5,1),
  start_weight_kg NUMERIC(5,1),
  goal_weight_kg NUMERIC(5,1),
  water_goal_ml INTEGER NOT NULL DEFAULT 2000,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  role public.app_role NOT NULL DEFAULT 'client',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE TABLE public.professional_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (professional_id, client_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.professional_clients TO authenticated;
GRANT ALL ON public.professional_clients TO service_role;
ALTER TABLE public.professional_clients ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.can_view_client(_client_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT auth.uid() = _client_id OR EXISTS (
    SELECT 1 FROM public.professional_clients pc
    WHERE pc.client_id = _client_id AND pc.professional_id = auth.uid() AND pc.status = 'active'
  );
$$;

CREATE POLICY "own profile write" ON public.profiles FOR ALL TO authenticated
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "linked professional reads profile" ON public.profiles FOR SELECT TO authenticated
  USING (public.can_view_client(id));

CREATE POLICY "read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "professional manages links" ON public.professional_clients FOR ALL TO authenticated
  USING (auth.uid() = professional_id) WITH CHECK (auth.uid() = professional_id);
CREATE POLICY "client reads own links" ON public.professional_clients FOR SELECT TO authenticated
  USING (auth.uid() = client_id);
CREATE POLICY "client updates own link" ON public.professional_clients FOR UPDATE TO authenticated
  USING (auth.uid() = client_id) WITH CHECK (auth.uid() = client_id);

-- meal schedules
CREATE TABLE public.meal_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  scheduled_time TIME NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.meal_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  schedule_id UUID REFERENCES public.meal_schedules ON DELETE SET NULL,
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  logged_time TIME NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::time,
  meal_name TEXT NOT NULL,
  description TEXT,
  portion TEXT,
  hunger_before SMALLINT,
  fullness_after SMALLINT,
  comment TEXT,
  difficulties TEXT[] NOT NULL DEFAULT '{}',
  difficulty_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.meal_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  meal_log_id UUID NOT NULL REFERENCES public.meal_logs ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.weight_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  weight_kg NUMERIC(5,1) NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.body_measurements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  abdomen_cm NUMERIC(5,1),
  waist_cm NUMERIC(5,1),
  hip_cm NUMERIC(5,1),
  arm_cm NUMERIC(5,1),
  thigh_cm NUMERIC(5,1),
  chest_cm NUMERIC(5,1),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.water_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  amount_ml INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.mood_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  mood SMALLINT,
  energy SMALLINT,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, log_date)
);

CREATE TABLE public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  activity_type TEXT NOT NULL,
  duration_min INTEGER,
  intensity TEXT,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.progress_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  category TEXT NOT NULL DEFAULT 'front',
  storage_path TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.professional_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.professional_notes TO authenticated;
GRANT ALL ON public.professional_notes TO service_role;
ALTER TABLE public.professional_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "professional manages notes" ON public.professional_notes FOR ALL TO authenticated
  USING (auth.uid() = professional_id AND public.can_view_client(client_id))
  WITH CHECK (auth.uid() = professional_id AND public.can_view_client(client_id));
CREATE POLICY "client reads notes" ON public.professional_notes FOR SELECT TO authenticated
  USING (auth.uid() = client_id);

CREATE TABLE public.tips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  content TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.tips TO authenticated, anon;
GRANT ALL ON public.tips TO service_role;
ALTER TABLE public.tips ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone reads published tips" ON public.tips FOR SELECT USING (is_published);
CREATE POLICY "admins manage tips" ON public.tips FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER tips_updated_at BEFORE UPDATE ON public.tips FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- generic per-user tables: grants, RLS, policies, triggers
DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['meal_schedules','meal_logs','meal_photos','weight_logs','body_measurements','water_logs','mood_logs','activity_logs','progress_photos']
  LOOP
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('CREATE POLICY "own rows" ON public.%I FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id)', t);
    EXECUTE format('CREATE POLICY "linked professional reads" ON public.%I FOR SELECT TO authenticated USING (public.can_view_client(user_id))', t);
    EXECUTE format('CREATE INDEX %I ON public.%I (user_id)', 'idx_' || t || '_user', t);
  END LOOP;
END $$;

CREATE TRIGGER meal_schedules_updated_at BEFORE UPDATE ON public.meal_schedules FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER meal_logs_updated_at BEFORE UPDATE ON public.meal_logs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER weight_logs_updated_at BEFORE UPDATE ON public.weight_logs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER body_measurements_updated_at BEFORE UPDATE ON public.body_measurements FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER mood_logs_updated_at BEFORE UPDATE ON public.mood_logs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER activity_logs_updated_at BEFORE UPDATE ON public.activity_logs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER professional_clients_updated_at BEFORE UPDATE ON public.professional_clients FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER professional_notes_updated_at BEFORE UPDATE ON public.professional_notes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- new user bootstrap: profile, role, default meal schedule
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), ' ', 1)))
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'client') ON CONFLICT DO NOTHING;

  INSERT INTO public.meal_schedules (user_id, name, scheduled_time, sort_order) VALUES
    (NEW.id, 'Café da manhã', '07:30', 1),
    (NEW.id, 'Lanche da manhã', '10:30', 2),
    (NEW.id, 'Almoço', '12:30', 3),
    (NEW.id, 'Lanche da tarde', '16:00', 4),
    (NEW.id, 'Jantar', '20:00', 5);
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

INSERT INTO public.tips (category, title, summary, content) VALUES
('Alimentação','Monte um prato colorido','Variedade de cores costuma indicar variedade de nutrientes.','Ao montar seu prato, tente incluir pelo menos três cores diferentes de vegetais. É uma forma simples de variar nutrientes sem precisar contar nada.'),
('Organização','Prepare a próxima refeição na noite anterior','Reduzir decisões diminui o esforço do dia.','Deixe a fruta lavada, a marmita montada ou o lanche separado. Quando a refeição já está pronta, seguir a rotina fica muito mais leve.'),
('Água','Deixe a garrafa sempre visível','O gatilho visual é seu melhor aliado.','Mantenha uma garrafa no campo de visão: mesa de trabalho, carro, cabeceira. Beber água costuma ser mais sobre lembrar do que sobre querer.'),
('Hábitos','Consistência vale mais que perfeição','Registrar sempre é melhor que registrar perfeitamente.','Um registro simples, mesmo em um dia fora do planejado, ensina muito mais sobre sua rotina do que uma semana sem registros.'),
('Sono','Rotina de sono influencia a fome','Noites curtas costumam aumentar a vontade de doce.','Tente manter horários parecidos para dormir e acordar. Quando o sono melhora, a percepção de fome e saciedade tende a ficar mais estável.'),
('Motivação','Comemore os pequenos avanços','Progresso é feito de dias comuns.','Beber mais água, registrar uma refeição a mais, caminhar dez minutos. São esses movimentos pequenos que sustentam mudanças duradouras.'),
('Receitas','Panqueca de banana e aveia','Três ingredientes, cinco minutos.','Amasse 1 banana, misture 2 colheres de aveia e 1 ovo. Doure na frigideira antiaderente. Rende um café da manhã rápido e nutritivo.');