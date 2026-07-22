-- Create transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    type TEXT NOT NULL,
    category TEXT NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create goals table
CREATE TABLE IF NOT EXISTS public.goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    target DECIMAL(12, 2) NOT NULL,
    saved DECIMAL(12, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (for testing purposes, since authentication is not set up)
CREATE POLICY "Allow anonymous select on transactions" ON public.transactions FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert on transactions" ON public.transactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous update on transactions" ON public.transactions FOR UPDATE USING (true);
CREATE POLICY "Allow anonymous delete on transactions" ON public.transactions FOR DELETE USING (true);

CREATE POLICY "Allow anonymous select on goals" ON public.goals FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert on goals" ON public.goals FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous update on goals" ON public.goals FOR UPDATE USING (true);
CREATE POLICY "Allow anonymous delete on goals" ON public.goals FOR DELETE USING (true);

-- Insert initial default goals
INSERT INTO public.goals (id, title, target, saved) VALUES
    ('00000000-0000-0000-0000-000000000001', 'Emergency Fund', 20000, 12500),
    ('00000000-0000-0000-0000-000000000002', 'Retirement (2026)', 100000, 63400),
    ('00000000-0000-0000-0000-000000000003', 'Down Payment', 50000, 18250)
ON CONFLICT DO NOTHING;
